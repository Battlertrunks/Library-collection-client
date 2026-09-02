import { useQuery } from "@apollo/client/react";
import { GET_BOOKS_COLLECTED } from "./queries";
import type { CollectedBook } from "../types/collectedBook";

type BooksCollectedQueryResult = {
  books_collected: Array<{
    id: string | null;
    book_listing_id: string | null;
    date_purchased: string | null;
    completed: boolean | null;
    title: string | null;
    authors: string | null;
    thumbnail_url: string | null;
    published_date: string | null;
  } | null> | null;
};

type NonNullRow = NonNullable<
  NonNullable<BooksCollectedQueryResult["books_collected"]>[number]
>;

/**
 * Converts a GraphQL books_collected row to a CollectedBook object.
 * @param row The GraphQL books_collected row to convert.
 * @returns The converted CollectedBook object.
 */
function toCollectedBook(row: NonNullRow): CollectedBook {
  return {
    id: row.id ?? "",
    listing: {
      id: row.book_listing_id ?? "",
      title: row.title ?? "",
      authors: row.authors ?? "",
      thumbnailUrl: row.thumbnail_url ?? "",
      publishedDate: row.published_date ?? "",
    },
    datePurchased: row.date_purchased ?? "",
    completed: row.completed ?? false,
  };
}

/**
 * Custom hook to fetch collected (owned) books from the GraphQL API.
 * Series-level purchases (rows without a book_listing_id) are excluded;
 * they belong to the series context, not the Books Owned section.
 * @returns An object containing the loading state, error, and collected books.
 */
function useBooksCollected() {
  const { loading, error, data } =
    useQuery<BooksCollectedQueryResult>(GET_BOOKS_COLLECTED);

  const collectedBooks: CollectedBook[] =
    data?.books_collected
      ?.filter(
        (row): row is NonNullRow =>
          row !== null && row.book_listing_id !== null,
      )
      .map(toCollectedBook) ?? [];

  return { loading, error, collectedBooks };
}

export default useBooksCollected;
