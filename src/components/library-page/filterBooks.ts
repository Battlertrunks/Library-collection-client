import type { BookListing } from "../../types/bookListing";

/**
 * Splits a search query into lowercase keywords, ignoring extra whitespace.
 * @param query The raw search input.
 * @returns The keywords to match books against.
 */
function parseKeywords(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * Checks whether a book matches every keyword. A keyword matches when it
 * appears anywhere in the book's title or authors, case-insensitively.
 * @param book The book listing to match against.
 * @param keywords The lowercase keywords to find.
 * @returns True when every keyword matches the title or authors.
 */
function matchesKeywords(book: BookListing, keywords: string[]): boolean {
  const haystack = `${book.title} ${book.authors}`.toLowerCase();
  return keywords.every((keyword) => haystack.includes(keyword));
}

/**
 * Filters books by a keyword-based search over their title and authors.
 * Multiple keywords must all match (in any order). An empty or whitespace-only
 * query leaves the list untouched.
 * @param books The books to filter.
 * @param query The raw search input.
 * @returns The books matching every keyword in the query.
 */
export function filterBooks<T extends { book: BookListing }>(
  books: T[],
  query: string,
): T[] {
  const keywords = parseKeywords(query);
  if (keywords.length === 0) {
    return books;
  }
  return books.filter((item) => matchesKeywords(item.book, keywords));
}
