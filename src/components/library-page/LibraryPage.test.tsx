import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import LibraryPage from "./LibraryPage";
import type { BookListing } from "../../types/bookListing";
import type { CollectedBook } from "../../types/collectedBook";
import type { BookSort } from "../../types/bookSort";

const state = vi.hoisted(() => ({
  books: [] as BookListing[],
  collectedBooks: [] as CollectedBook[],
  booksHasNextPage: false,
  collectedHasNextPage: false,
  booksLoadMore: vi.fn(),
  collectedLoadMore: vi.fn(),
  lastBooksOptions: null as null | { search: string; sort: BookSort },
  lastCollectedOptions: null as null | { search: string; sort: BookSort },
}));

vi.mock("../../api/useBooks", () => ({
  default: (options: { search: string; sort: BookSort }) => {
    state.lastBooksOptions = options;
    return {
      books: state.books,
      loading: false,
      loadingMore: false,
      error: null,
      hasNextPage: state.booksHasNextPage,
      loadMore: state.booksLoadMore,
    };
  },
}));

vi.mock("../../api/useBooksCollected", () => ({
  default: (options: { search: string; sort: BookSort }) => {
    state.lastCollectedOptions = options;
    return {
      collectedBooks: state.collectedBooks,
      loading: false,
      loadingMore: false,
      error: null,
      hasNextPage: state.collectedHasNextPage,
      loadMore: state.collectedLoadMore,
    };
  },
}));

vi.mock("../../api/useBookCollectionActions", () => ({
  default: () => ({
    addToOwned: vi.fn(),
    removeFromOwned: vi.fn(),
    pendingId: null,
    error: null,
  }),
}));

/**
 * jsdom has no IntersectionObserver, so tests capture the sentinel observers
 * and fire intersection callbacks by hand.
 */
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  readonly targets = new Set<Element>();
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.targets.add(target);
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(isIntersecting: boolean) {
    if (this.targets.size === 0) {
      return;
    }
    const entries = [...this.targets].map(
      (target) => ({ isIntersecting, target }) as IntersectionObserverEntry,
    );
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

function makeListing(id: string, title: string): BookListing {
  return {
    id,
    title,
    authors: "Author",
    thumbnailUrl: "",
    publishedDate: "2024-01-01",
    description: "",
    genres: "",
    createdAt: "2024-01-01",
  };
}

function makeCollected(id: string, title: string): CollectedBook {
  return {
    id,
    listing: makeListing(`listing-${id}`, title),
    datePurchased: "2025-01-01",
    completed: false,
    progress: 0,
  };
}

function pageOfListings(count: number, offset: number = 0): BookListing[] {
  return Array.from({ length: count }, (_, index) => {
    const number = offset + index + 1;
    return makeListing(`book-${number}`, `Book ${number}`);
  });
}

describe("LibraryPage", () => {
  let container: HTMLDivElement;
  let root: Root;

  function render(ui: ReactElement) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(ui);
    });
  }

  function cardCount(sectionId: string): number {
    return container.querySelectorAll(
      `section[aria-labelledby="${sectionId}"] .book-card__title-btn`,
    ).length;
  }

  function chooseSort(label: string) {
    const sortLabel = Array.from(container.querySelectorAll("span")).find(
      (span) => span.textContent === "Sort By:",
    );
    const sortButton = sortLabel?.parentElement?.querySelector("button");
    expect(sortButton).not.toBeNull();

    act(() => {
      (sortButton as HTMLButtonElement).click();
    });

    const option = Array.from(container.querySelectorAll("li")).find((li) =>
      li.textContent?.includes(label),
    );
    expect(option).not.toBeNull();

    act(() => {
      (option as HTMLElement).click();
    });
  }

  function typeSearch(value: string) {
    const input = container.querySelector(
      'input[aria-label="Search books by title or author"]',
    ) as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;

    act(() => {
      valueSetter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  function observerFor(sectionId: string): FakeIntersectionObserver {
    const section = container.querySelector(
      `section[aria-labelledby="${sectionId}"]`,
    );
    const observer = FakeIntersectionObserver.instances.find((instance) =>
      [...instance.targets].some((target) => section?.contains(target)),
    );
    expect(observer).toBeDefined();
    return observer as FakeIntersectionObserver;
  }

  beforeEach(() => {
    state.books = [];
    state.collectedBooks = [];
    state.booksHasNextPage = false;
    state.collectedHasNextPage = false;
    state.booksLoadMore.mockClear();
    state.collectedLoadMore.mockClear();
    state.lastBooksOptions = null;
    state.lastCollectedOptions = null;
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders both sections with their headings", () => {
    state.books = [makeListing("1", "Dune")];
    state.collectedBooks = [makeCollected("c1", "The Hobbit")];

    render(<LibraryPage />);

    expect(container.textContent).toContain("Books Owned");
    expect(container.textContent).toContain("Books Not Owned");
  });

  it("starts with the server-side recent sort and an empty search", () => {
    render(<LibraryPage />);

    expect(state.lastBooksOptions).toEqual({ search: "", sort: "RECENT" });
    expect(state.lastCollectedOptions).toEqual({
      search: "",
      sort: "RECENT",
    });
  });

  it("sends the chosen sort to the server and scrolls to the top", () => {
    render(<LibraryPage />);

    chooseSort("Name A to Z");

    expect(state.lastBooksOptions?.sort).toBe("TITLE_ASC");
    expect(state.lastCollectedOptions?.sort).toBe("TITLE_ASC");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it("debounces the search before querying and scrolls to the top", () => {
    vi.useFakeTimers();
    render(<LibraryPage />);

    typeSearch("dune");
    expect(state.lastBooksOptions?.search).toBe("");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(state.lastBooksOptions?.search).toBe("");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(state.lastBooksOptions?.search).toBe("dune");
    expect(state.lastCollectedOptions?.search).toBe("dune");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it("renders one page and loads more through the section sentinel", () => {
    state.books = pageOfListings(30);
    state.booksHasNextPage = true;
    render(<LibraryPage />);

    expect(cardCount("books-not-owned-heading")).toBe(30);

    act(() => {
      observerFor("books-not-owned-heading").trigger(true);
    });
    expect(state.booksLoadMore).toHaveBeenCalledOnce();

    state.books = pageOfListings(35);
    state.booksHasNextPage = false;
    act(() => {
      root.render(<LibraryPage />);
    });

    expect(cardCount("books-not-owned-heading")).toBe(35);
    expect(container.querySelector(".book-list__sentinel")).toBeNull();
  });

  it("shows the end message when every list is fully loaded", () => {
    state.books = [makeListing("1", "Alpha")];
    state.collectedBooks = [makeCollected("c1", "Bravo")];

    render(<LibraryPage />);

    expect(container.textContent).toContain("You have reached the end 🥳");
  });

  it("hides the end message while more pages remain", () => {
    state.books = pageOfListings(30);
    state.booksHasNextPage = true;

    render(<LibraryPage />);

    expect(container.textContent).not.toContain("You have reached the end");
  });

  it("shows no-match messages while searching", () => {
    vi.useFakeTimers();
    render(<LibraryPage />);

    typeSearch("zzz");
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(container.textContent).toContain(
      "No owned books match your search.",
    );
    expect(container.textContent).toContain(
      "No other books match your search.",
    );
  });
});
