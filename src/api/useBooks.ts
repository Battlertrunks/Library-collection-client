import { useQuery } from "@apollo/client/react";
import { GET_BOOK_LISTINGS } from "./queries";
import type { BookListing } from "../types/bookListing";

type BookListingsQueryResult = {
  book_listings: Array<{
    id: string | null;
    title: string | null;
    authors: string | null;
    thumbnail_url: string | null;
    published_date: string | null;
  } | null> | null;
};

/**
 * Converts a GraphQL book listing to a BookListing object.
 * @param listing The GraphQL book listing to convert.
 * @returns The converted BookListing object.
 */
function toBookListing(
  listing: NonNullable<
    NonNullable<BookListingsQueryResult["book_listings"]>[number]
  >,
): BookListing {
  return {
    id: listing.id ?? "",
    title: listing.title ?? "",
    authors: listing.authors ?? "",
    thumbnailUrl: listing.thumbnail_url ?? "",
    publishedDate: listing.published_date ?? "",
  };
}

/**
 * Custom hook to fetch book listings from the GraphQL API.
 * @returns An object containing the loading state, error, and book listings.
 */
function useBooks() {
  const { loading, error, data } =
    useQuery<BookListingsQueryResult>(GET_BOOK_LISTINGS);

  const books: BookListing[] =
    data?.book_listings
      ?.filter(
        (listing): listing is NonNullable<typeof listing> => listing !== null,
      )
      .map(toBookListing) ?? [];

  return { loading, error, books };
}

export default useBooks;
