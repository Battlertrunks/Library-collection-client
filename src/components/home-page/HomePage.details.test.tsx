import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import HomePage from "./HomePage";
import type { BookListing } from "../../types/bookListing";
import type { CollectedBook, OwnedBookInfo } from "../../types/collectedBook";

const state = vi.hoisted(() => ({
  collectedBooks: [] as CollectedBook[],
  featuredBook: null as BookListing | null,
  featuredOwned: undefined as OwnedBookInfo | undefined,
}));

vi.mock("../../api/useBooksCollected", () => ({
  default: () => ({
    collectedBooks: state.collectedBooks,
    loading: false,
    loadingMore: false,
    error: null,
    hasNextPage: false,
    loadMore: vi.fn(),
  }),
}));

vi.mock("../../api/useBookOfTheDay", () => ({
  default: () => ({
    book: state.featuredBook,
    owned: state.featuredOwned,
    loading: false,
    error: null,
  }),
}));

function makeListing(id: string, title: string): BookListing {
  return {
    id,
    title,
    authors: `${title} Author`,
    thumbnailUrl: "",
    publishedDate: "2020-01-01",
    description: "A test description.",
    genres: "Science Fiction",
    createdAt: "2026-01-01",
  };
}

function makeCollected(
  id: string,
  title: string,
  progress: number,
): CollectedBook {
  return {
    id,
    listing: makeListing(`listing-${id}`, title),
    datePurchased: "2026-01-01",
    completed: false,
    progress,
  };
}

describe("HomePage book details", () => {
  let container: HTMLDivElement;
  let root: Root;

  function render() {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<HomePage />);
    });
  }

  function click(selector: string) {
    const element = container.querySelector(selector);
    expect(element).not.toBeNull();
    act(() => {
      (element as HTMLElement).click();
    });
  }

  beforeEach(() => {
    state.collectedBooks = [];
    state.featuredBook = null;
    state.featuredOwned = undefined;
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
  });

  it("opens the details modal when a progress card is clicked", () => {
    state.collectedBooks = [makeCollected("1", "Know No Fear", 87)];

    render();
    expect(container.querySelector(".book-details")).toBeNull();

    click(".books-widget");

    expect(container.querySelector(".book-details")).not.toBeNull();
    expect(container.textContent).toContain("Know No Fear");
    expect(container.textContent).toContain("A test description.");
    expect(container.textContent).toContain("Purchased");
  });

  it("closes the details modal again", () => {
    state.collectedBooks = [makeCollected("1", "Know No Fear", 87)];

    render();
    click(".books-widget");
    click(".book-details__close");

    expect(container.querySelector(".book-details")).toBeNull();
  });

  it("opens the details modal when the featured card is clicked", () => {
    state.featuredBook = makeListing("1", "The Horus Heresy: Know No Fear");
    state.featuredOwned = { datePurchased: "2026-01-01", completed: false };

    render();

    click(".featured-book__card");

    expect(container.querySelector(".book-details")).not.toBeNull();
    expect(container.textContent).toContain("The Horus Heresy: Know No Fear");
    expect(container.textContent).toContain("Purchased");
  });

  it("does not open a modal from the featured empty state", () => {
    render();

    expect(container.querySelector(".featured-book__card")).toBeNull();
    expect(container.querySelector(".book-details")).toBeNull();
  });
});
