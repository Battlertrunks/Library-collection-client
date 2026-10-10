import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { GET_BOOK_LISTINGS } from "./queries";
import type { BookListing } from "../types/bookListing";
import type { BookSort } from "../types/bookSort";
import { BOOK_PAGE_SIZE } from "../types/bookSort";

type BookListingsNode = {
  id: string | null;
  title: string | null;
  authors: string | null;
  thumbnail_url: string | null;
  published_date: string | null;
  description: string | null;
  genres: string | null;
  created_at: string | null;
};

type BookListingsQueryResult = {
  book_listings: {
    edges: Array<{ node: BookListingsNode; cursor: string }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

type UseBooksOptions = {
  search: string;
  sort: BookSort;
};

/**
 * Converts a GraphQL book listing node to a BookListing object.
 * @param listing The GraphQL book listing to convert.
 * @returns The converted BookListing object.
 */
function toBookListing(listing: BookListingsNode): BookListing {
  return {
    id: listing.id ?? "",
    title: listing.title ?? "",
    authors: listing.authors ?? "",
    thumbnailUrl: listing.thumbnail_url ?? "",
    publishedDate: listing.published_date ?? "",
    description: listing.description ?? "",
    genres: listing.genres ?? "",
    createdAt: listing.created_at ?? "",
  };
}

/**
 * Custom hook to fetch one cursor-paginated page of not-owned book listings
 * from the GraphQL API.
 * @param options The server-side search and sort to apply.
 * @returns The loaded books, loading/error state, and a loadMore function.
 */
function useBooks({ search, sort }: UseBooksOptions) {
  const { loading, error, data, fetchMore, networkStatus } =
    useQuery<BookListingsQueryResult>(GET_BOOK_LISTINGS, {
      variables: { first: BOOK_PAGE_SIZE, search, sort },
      notifyOnNetworkStatusChange: true,
    });

  const books: BookListing[] =
    data?.book_listings.edges.map((edge) => toBookListing(edge.node)) ?? [];
  const pageInfo = data?.book_listings.pageInfo;
  const hasNextPage: boolean = pageInfo?.hasNextPage ?? false;
  const loadingMore: boolean = networkStatus === NetworkStatus.fetchMore;

  function loadMore() {
    if (!hasNextPage || !pageInfo?.endCursor || loadingMore) {
      return;
    }
    void fetchMore({
      variables: {
        first: BOOK_PAGE_SIZE,
        search,
        sort,
        after: pageInfo.endCursor,
      },
    }).catch(() => {
      // Query-level failures surface through `error`; a failed loadMore just
      // leaves the current page on screen.
    });
  }

  return { books, loading, loadingMore, error, hasNextPage, loadMore };
}

export default useBooks;
