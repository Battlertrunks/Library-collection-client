import type { BookListing } from "../../types/bookListing";
import type { OwnedBookInfo } from "../../types/collectedBook";

/** Sort option values from the library page's Sort By select. */
export type SortValue = "recent" | "az" | "za" | "publish" | "completion";

export type SortableBook = {
  book: BookListing;
  owned?: OwnedBookInfo;
};

/**
 * Parses a date/timestamp string into a comparable number, treating empty or
 * unparsable values as the epoch so they sort last in newest-first orderings.
 * @param value The date or timestamp string to parse.
 * @returns The timestamp in milliseconds since the epoch, or 0 when invalid.
 */
function parseDate(value: string): number {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function byTitleAsc(a: SortableBook, b: SortableBook): number {
  return a.book.title.localeCompare(b.book.title);
}

/**
 * Compares books by completion first (completed on top), then alphabetically.
 * Books without owned info are treated as not completed.
 */
function byCompletion(a: SortableBook, b: SortableBook): number {
  const aCompleted = a.owned?.completed === true;
  const bCompleted = b.owned?.completed === true;
  if (aCompleted !== bCompleted) {
    return aCompleted ? -1 : 1;
  }
  return byTitleAsc(a, b);
}

const comparators: Record<
  SortValue,
  (a: SortableBook, b: SortableBook) => number
> = {
  // Newest listings first, ties broken alphabetically.
  recent: (a, b) =>
    parseDate(b.book.createdAt) - parseDate(a.book.createdAt) ||
    byTitleAsc(a, b),
  az: byTitleAsc,
  za: (a, b) => byTitleAsc(b, a),
  // Newest published first, ties broken alphabetically.
  publish: (a, b) =>
    parseDate(b.book.publishedDate) - parseDate(a.book.publishedDate) ||
    byTitleAsc(a, b),
  completion: byCompletion,
};

/**
 * Returns a new array of books sorted by the given sort option. The input
 * array is never mutated.
 * @param books The books to sort.
 * @param sortValue The selected sort option.
 * @returns A new array with the books in the sorted order.
 */
export function sortBooks<T extends SortableBook>(
  books: T[],
  sortValue: SortValue,
): T[] {
  return [...books].sort(comparators[sortValue]);
}
