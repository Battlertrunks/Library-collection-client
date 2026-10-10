import { useQuery } from "@apollo/client/react";
import { GET_BOOK_OF_THE_DAY } from "./queries";
import type { BookOfTheDay } from "../types/bookOfTheDay";

type BookOfTheDayNode = {
  id: string | null;
  title: string | null;
  authors: string | null;
  thumbnail_url: string | null;
  published_date: string | null;
};

type BookOfTheDayQueryResult = {
  book_of_the_day: BookOfTheDayNode | null;
};

/**
 * Converts a GraphQL book_of_the_day node to a BookOfTheDay object.
 * @param node The picked collected book.
 * @returns The converted BookOfTheDay.
 */
function toBookOfTheDay(node: BookOfTheDayNode): BookOfTheDay {
  return {
    id: node.id ?? "",
    title: node.title ?? "",
    authors: node.authors ?? "",
    thumbnailUrl: node.thumbnail_url ?? "",
    publishedDate: node.published_date ?? "",
  };
}

/**
 * Custom hook to fetch today's featured book from the GraphQL API. The server
 * picks deterministically for the current day, so this refetches only when the
 * cached query is missing.
 * @returns The featured book (null when nothing is in progress) and its
 * loading/error state.
 */
function useBookOfTheDay() {
  const { loading, error, data } =
    useQuery<BookOfTheDayQueryResult>(GET_BOOK_OF_THE_DAY);

  const book: BookOfTheDay | null = data?.book_of_the_day
    ? toBookOfTheDay(data.book_of_the_day)
    : null;

  return { book, loading, error };
}

export default useBookOfTheDay;
