import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import LibraryPage from "./LibraryPage";
import type { BookListing } from "../../types/bookListing";
import type { CollectedBook } from "../../types/collectedBook";

const state = vi.hoisted(() => ({
  books: [] as BookListing[],
  collectedBooks: [] as CollectedBook[],
}));

vi.mock("../../api/useBooks", () => ({
  default: () => ({ books: state.books, loading: false, error: null }),
}));

vi.mock("../../api/useBooksCollected", () => ({
  default: () => ({
    collectedBooks: state.collectedBooks,
    loading: false,
    error: null,
  }),
}));

function makeListing(
  id: string,
  title: string,
  publishedDate: string,
  createdAt: string,
  authors: string = "Author",
): BookListing {
  return {
    id,
    title,
    authors,
    thumbnailUrl: "",
    publishedDate,
    description: "",
    genres: "",
    createdAt,
  };
}

const notOwnedBooks: BookListing[] = [
  makeListing("1", "Zenith War", "2020-05-01", "2024-03-01", "Atlas Kane"),
  makeListing("2", "Alpha Squad", "2022-06-01", "2025-01-01", "Rex Voss"),
  makeListing("3", "Beta Legion", "2019-01-01", "2023-12-01", "Mira Holt"),
];

const ownedBooks: CollectedBook[] = [
  {
    id: "c1",
    listing: makeListing(
      "10",
      "Owned Dune",
      "1965-08-01",
      "2024-01-01",
      "Frank Herbert",
    ),
    datePurchased: "2025-01-01",
    completed: false,
  },
  {
    id: "c2",
    listing: makeListing(
      "11",
      "Owned Caves",
      "2021-01-01",
      "2024-06-01",
      "Lin Carter",
    ),
    datePurchased: "2025-02-01",
    completed: true,
  },
  {
    id: "c3",
    listing: makeListing(
      "12",
      "Owned Alpha",
      "2010-01-01",
      "2023-06-01",
      "Ada Byron",
    ),
    datePurchased: "2025-03-01",
    completed: false,
  },
];

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

  function titlesOf(sectionId: string): string[] {
    const section = container.querySelector(
      `section[aria-labelledby="${sectionId}"]`,
    )!;
    return Array.from(section.querySelectorAll(".book-card__title-btn")).map(
      (button) => button.textContent ?? "",
    );
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

  beforeEach(() => {
    state.books = [...notOwnedBooks];
    state.collectedBooks = [...ownedBooks];
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

  it("renders both sections with their headings", () => {
    render(<LibraryPage />);

    expect(container.textContent).toContain("Books Owned");
    expect(container.textContent).toContain("Books Not Owned");
  });

  it("orders both sections by most recently added by default", () => {
    render(<LibraryPage />);

    expect(titlesOf("books-owned-heading")).toEqual([
      "Owned Caves",
      "Owned Dune",
      "Owned Alpha",
    ]);
    expect(titlesOf("books-not-owned-heading")).toEqual([
      "Alpha Squad",
      "Zenith War",
      "Beta Legion",
    ]);
  });

  it("orders both sections A to Z by title", () => {
    render(<LibraryPage />);
    chooseSort("Name A to Z");

    expect(titlesOf("books-owned-heading")).toEqual([
      "Owned Alpha",
      "Owned Caves",
      "Owned Dune",
    ]);
    expect(titlesOf("books-not-owned-heading")).toEqual([
      "Alpha Squad",
      "Beta Legion",
      "Zenith War",
    ]);
  });

  it("orders both sections Z to A by title", () => {
    render(<LibraryPage />);
    chooseSort("Name Z to A");

    expect(titlesOf("books-owned-heading")).toEqual([
      "Owned Dune",
      "Owned Caves",
      "Owned Alpha",
    ]);
    expect(titlesOf("books-not-owned-heading")).toEqual([
      "Zenith War",
      "Beta Legion",
      "Alpha Squad",
    ]);
  });

  it("orders both sections by newest published date", () => {
    render(<LibraryPage />);
    chooseSort("Date Published");

    expect(titlesOf("books-owned-heading")).toEqual([
      "Owned Caves",
      "Owned Alpha",
      "Owned Dune",
    ]);
    expect(titlesOf("books-not-owned-heading")).toEqual([
      "Alpha Squad",
      "Zenith War",
      "Beta Legion",
    ]);
  });

  it("orders completed books first, then alphabetically, for completion", () => {
    render(<LibraryPage />);
    chooseSort("Completion");

    expect(titlesOf("books-owned-heading")).toEqual([
      "Owned Caves",
      "Owned Alpha",
      "Owned Dune",
    ]);
    expect(titlesOf("books-not-owned-heading")).toEqual([
      "Alpha Squad",
      "Beta Legion",
      "Zenith War",
    ]);
  });

  it("filters both sections by title keyword, case-insensitively", () => {
    render(<LibraryPage />);
    typeSearch("ALPHA");

    expect(titlesOf("books-owned-heading")).toEqual(["Owned Alpha"]);
    expect(titlesOf("books-not-owned-heading")).toEqual(["Alpha Squad"]);
  });

  it("filters by author keyword", () => {
    render(<LibraryPage />);
    typeSearch("herbert");

    expect(titlesOf("books-owned-heading")).toEqual(["Owned Dune"]);
    expect(titlesOf("books-not-owned-heading")).toEqual([]);
  });

  it("matches multiple keywords in any order across title and author", () => {
    render(<LibraryPage />);
    typeSearch("voss squad");

    expect(titlesOf("books-not-owned-heading")).toEqual(["Alpha Squad"]);
    expect(titlesOf("books-owned-heading")).toEqual([]);
  });

  it("restores all books when the search is cleared", () => {
    render(<LibraryPage />);
    typeSearch("alpha");
    typeSearch("");

    expect(titlesOf("books-owned-heading")).toHaveLength(3);
    expect(titlesOf("books-not-owned-heading")).toHaveLength(3);
  });

  it("applies the selected sort to the filtered results", () => {
    render(<LibraryPage />);
    typeSearch("owned");
    chooseSort("Name Z to A");

    expect(titlesOf("books-owned-heading")).toEqual([
      "Owned Dune",
      "Owned Caves",
      "Owned Alpha",
    ]);
    expect(titlesOf("books-not-owned-heading")).toEqual([]);
  });
});
