import { describe, it, expect } from "vitest";
import type { BookListing } from "../../types/bookListing";
import { filterBooks } from "./filterBooks";

/** Builds a BookListing with overridable fields, defaulting the rest. */
function makeBook(overrides: Partial<BookListing> = {}): BookListing {
  return {
    id: "1",
    title: "A Book",
    authors: "Author",
    thumbnailUrl: "",
    publishedDate: "2024-01-01",
    description: "",
    genres: "",
    createdAt: "2024-01-01",
    ...overrides,
  };
}

const items = [
  { book: makeBook({ title: "Dune", authors: "Frank Herbert" }) },
  {
    book: makeBook({ title: "Dropsite Massacre", authors: "Graham McNeill" }),
  },
  { book: makeBook({ title: "The Hobbit", authors: "J.R.R. Tolkien" }) },
];

const titles = (results: typeof items): string[] =>
  results.map((item) => item.book.title);

describe("filterBooks", () => {
  it("returns all books for an empty query", () => {
    expect(filterBooks(items, "")).toEqual(items);
  });

  it("returns all books for a whitespace-only query", () => {
    expect(filterBooks(items, "   ")).toEqual(items);
  });

  it("matches a partial title case-insensitively", () => {
    expect(titles(filterBooks(items, "dun"))).toEqual(["Dune"]);
    expect(titles(filterBooks(items, "MASSACRE"))).toEqual([
      "Dropsite Massacre",
    ]);
  });

  it("matches against the authors", () => {
    expect(titles(filterBooks(items, "tolkien"))).toEqual(["The Hobbit"]);
  });

  it("requires every keyword to match, across title and authors", () => {
    expect(titles(filterBooks(items, "dune herbert"))).toEqual(["Dune"]);
    expect(titles(filterBooks(items, "dune tolkien"))).toEqual([]);
  });

  it("ignores keyword order", () => {
    expect(titles(filterBooks(items, "herbert dune"))).toEqual(["Dune"]);
  });

  it("ignores extra whitespace between keywords", () => {
    expect(titles(filterBooks(items, "  dune   herbert  "))).toEqual(["Dune"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterBooks(items, "neuromancer")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const books = [...items];
    filterBooks(books, "dune");

    expect(books).toEqual(items);
  });
});
