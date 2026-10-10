import { useQuery } from "@apollo/client/react";
import { GET_BOOK_OF_THE_DAY } from "./queries";
import type { BookListing } from "../types/bookListing";
import type { OwnedBookInfo } from "../types/collectedBook";

type BookOfTheDayNode = {
  id: string | null;
  title: string | null;
  authors: string | null;
  thumbnail_url: string | null;
  published_date: string | null;
  created_at: string | null;
  date_purchased: string | null;
  completed: boolean | null;
};

type BookOfTheDayQueryResult = {
  book_of_the_day: BookOfTheDayNode | null;
};

/**
 * Converts a GraphQL book_of_the_day node to a BookListing object.
 * @param node The picked collected book.
 * @returns The converted BookListing.
 */
function toBookListing(node: BookOfTheDayNode): BookListing {
  return {
    id: node.id ?? "",
    title: node.title ?? "",
    authors: node.authors ?? "",
    thumbnailUrl: node.thumbnail_url ?? "",
    publishedDate: node.published_date ?? "",
    // books_collected does not expose description/genres yet, so the server
    // cannot join them in. BookDetails falls back gracefully until it does.
    description: "",
    genres: "",
    createdAt: node.created_at ?? "",
  };
}

/**
 * Custom hook to fetch today's featured book from the GraphQL API. The server
 * picks deterministically for the current day, so this refetches only when the
 * cached query is missing.
 * @returns The featured book (null when nothing is in progress), its owned
 * details, and loading/error state.
 */
function useBookOfTheDay() {
  const { loading, error, data } =
    useQuery<BookOfTheDayQueryResult>(GET_BOOK_OF_THE_DAY);

  const node: BookOfTheDayNode | null = data?.book_of_the_day ?? null;
  const book: BookListing | null = node ? toBookListing(node) : null;
  const owned: OwnedBookInfo | undefined = node
    ? {
        datePurchased: node.date_purchased ?? "",
        completed: node.completed ?? false,
      }
    : undefined;

  return { book, owned, loading, error };
}

export default useBookOfTheDay;
