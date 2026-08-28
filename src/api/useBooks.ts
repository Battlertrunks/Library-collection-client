import { useQuery } from "@apollo/client/react";
import { GET_BOOK_LISTINGS } from "./queries";
import type { BookListing } from "../types/bookListing";

type BookListingsQueryResult = {
  book_listings: Array<{
    id: string | null;
    title: string | null;
    authors: string | null;
    price: number | null;
    thumbnail_url: string | null;
    published_date: string | null;
  } | null> | null;
};

function toBookListing(
  listing: NonNullable<
    NonNullable<BookListingsQueryResult["book_listings"]>[number]
  >,
): BookListing {
  return {
    id: listing.id ?? "",
    title: listing.title ?? "",
    authors: listing.authors ?? "",
    price: listing.price ?? 0,
    thumbnailUrl: listing.thumbnail_url ?? "",
    publishedDate: listing.published_date ?? "",
  };
}

function useBooks() {
  const { loading, error, data } =
    useQuery<BookListingsQueryResult>(GET_BOOK_LISTINGS);

  const books =
    data?.book_listings
      ?.filter(
        (listing): listing is NonNullable<typeof listing> => listing !== null,
      )
      .map(toBookListing) ?? [];

  return { loading, error, books };
}

export default useBooks;
