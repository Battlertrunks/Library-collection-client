import { describe, it, expect } from "vitest";
import type { BookListing } from "../../types/bookListing";
import { sortBooks, type SortableBook, type SortValue } from "./sortBooks";

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

const titles = (items: SortableBook[]): string[] =>
  items.map((item) => item.book.title);

describe("sortBooks", () => {
  const alpha = [
    { book: makeBook({ title: "Zenith" }) },
    { book: makeBook({ title: "apple" }) },
    { book: makeBook({ title: "Banana" }) },
  ];

  it("sorts A to Z by title for 'az'", () => {
    expect(titles(sortBooks(alpha, "az"))).toEqual([
      "apple",
      "Banana",
      "Zenith",
    ]);
  });

  it("sorts Z to A by title for 'za'", () => {
    expect(titles(sortBooks(alpha, "za"))).toEqual([
      "Zenith",
      "Banana",
      "apple",
    ]);
  });

  it("sorts newest created first for 'recent'", () => {
    const books = [
      { book: makeBook({ title: "Old", createdAt: "2023-05-01T10:00:00" }) },
      { book: makeBook({ title: "New", createdAt: "2025-11-20T08:30:00" }) },
      { book: makeBook({ title: "Mid", createdAt: "2024-02-10T12:00:00" }) },
    ];

    expect(titles(sortBooks(books, "recent"))).toEqual(["New", "Mid", "Old"]);
  });

  it("breaks recent ties alphabetically", () => {
    const books = [
      { book: makeBook({ title: "Zulu", createdAt: "2024-01-01" }) },
      { book: makeBook({ title: "Alpha", createdAt: "2024-01-01" }) },
    ];

    expect(titles(sortBooks(books, "recent"))).toEqual(["Alpha", "Zulu"]);
  });

  it("sorts listings without a created timestamp last for 'recent'", () => {
    const books = [
      { book: makeBook({ title: "Missing", createdAt: "" }) },
      { book: makeBook({ title: "Stamped", createdAt: "2024-01-01" }) },
    ];

    expect(titles(sortBooks(books, "recent"))).toEqual(["Stamped", "Missing"]);
  });

  it("sorts newest published first for 'publish'", () => {
    const books = [
      {
        book: makeBook({ title: "Earlier", publishedDate: "2001-06-01" }),
      },
      { book: makeBook({ title: "Latest", publishedDate: "2023-03-15" }) },
    ];

    expect(titles(sortBooks(books, "publish"))).toEqual(["Latest", "Earlier"]);
  });

  it("breaks publish ties alphabetically", () => {
    const books = [
      {
        book: makeBook({ title: "Zulu", publishedDate: "2024-01-01" }),
      },
      {
        book: makeBook({ title: "Alpha", publishedDate: "2024-01-01" }),
      },
    ];

    expect(titles(sortBooks(books, "publish"))).toEqual(["Alpha", "Zulu"]);
  });

  it("sorts listings without a published date last for 'publish'", () => {
    const books = [
      { book: makeBook({ title: "Missing", publishedDate: "" }) },
      { book: makeBook({ title: "Dated", publishedDate: "2020-01-01" }) },
    ];

    expect(titles(sortBooks(books, "publish"))).toEqual(["Dated", "Missing"]);
  });

  it("puts completed books first for 'completion', alphabetical within groups", () => {
    const books = [
      {
        book: makeBook({ title: "Unread Zen" }),
        owned: { datePurchased: "2024-01-01", completed: false },
      },
      {
        book: makeBook({ title: "Finished Alpha" }),
        owned: { datePurchased: "2024-01-01", completed: true },
      },
      {
        book: makeBook({ title: "Unread Alpha" }),
        owned: { datePurchased: "2024-01-01", completed: false },
      },
      {
        book: makeBook({ title: "Finished Zen" }),
        owned: { datePurchased: "2024-01-01", completed: true },
      },
    ];

    expect(titles(sortBooks(books, "completion"))).toEqual([
      "Finished Alpha",
      "Finished Zen",
      "Unread Alpha",
      "Unread Zen",
    ]);
  });

  it("treats books without owned info as not completed for 'completion'", () => {
    const books = [
      { book: makeBook({ title: "Not Owned" }) },
      {
        book: makeBook({ title: "Completed" }),
        owned: { datePurchased: "2024-01-01", completed: true },
      },
    ];

    expect(titles(sortBooks(books, "completion"))).toEqual([
      "Completed",
      "Not Owned",
    ]);
  });

  it("does not mutate the input array", () => {
    const books = [...alpha];
    sortBooks(books, "za");

    expect(titles(books)).toEqual(["Zenith", "apple", "Banana"]);
  });

  it("handles every sort option", () => {
    const options: SortValue[] = [
      "recent",
      "az",
      "za",
      "publish",
      "completion",
    ];

    options.forEach((option) => {
      expect(sortBooks(alpha, option)).toHaveLength(alpha.length);
    });
  });
});
