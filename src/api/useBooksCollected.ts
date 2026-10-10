import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { GET_BOOKS_COLLECTED } from "./queries";
import type { CollectedBook } from "../types/collectedBook";
import type { BookSort } from "../types/bookSort";
import { BOOK_PAGE_SIZE } from "../types/bookSort";

type BooksCollectedNode = {
  id: string | null;
  book_listing_id: string | null;
  date_purchased: string | null;
  completed: boolean | null;
  progress: number | null;
  title: string | null;
  authors: string | null;
  thumbnail_url: string | null;
  published_date: string | null;
  created_at: string | null;
};

type BooksCollectedQueryResult = {
  books_collected: {
    edges: Array<{ node: BooksCollectedNode; cursor: string }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

type UseBooksCollectedOptions = {
  search: string;
  sort: BookSort;
  /** When set, only books with this finished state are returned. */
  completed?: boolean;
  /** Rows fetched per request; defaults to the shared page size. */
  first?: number;
};

/**
 * Converts a GraphQL books_collected node to a CollectedBook object.
 * @param node The GraphQL books_collected row to convert.
 * @returns The converted CollectedBook object.
 */
function toCollectedBook(node: BooksCollectedNode): CollectedBook {
  return {
    id: node.id ?? "",
    listing: {
      id: node.book_listing_id ?? "",
      title: node.title ?? "",
      authors: node.authors ?? "",
      thumbnailUrl: node.thumbnail_url ?? "",
      publishedDate: node.published_date ?? "",
      // books_collected does not expose description/genres yet, so the server
      // cannot join them in. BookDetails falls back gracefully until it does.
      description: "",
      genres: "",
      createdAt: node.created_at ?? "",
    },
    datePurchased: node.date_purchased ?? "",
    completed: node.completed ?? false,
    progress: node.progress ?? 0,
  };
}

/**
 * Custom hook to fetch one cursor-paginated page of collected (owned) books
 * from the GraphQL API. Series-level purchases are excluded server-side; they
 * belong to the series context, not the Books Owned section.
 * @param options The server-side search, sort, finished-state filter, and page size to apply.
 * @returns The loaded collected books, loading/error state, and loadMore.
 */
function useBooksCollected({
  search,
  sort,
  completed,
  first,
}: UseBooksCollectedOptions) {
  const pageSize: number = first ?? BOOK_PAGE_SIZE;

  // Omitted when unset so the query contract stays stable for callers that
  // do not filter by finished state (the server treats a missing arg as null).
  const baseVariables = {
    first: pageSize,
    search,
    sort,
    ...(completed === undefined ? {} : { completed }),
  };

  const { loading, error, data, fetchMore, networkStatus } =
    useQuery<BooksCollectedQueryResult>(GET_BOOKS_COLLECTED, {
      variables: baseVariables,
      notifyOnNetworkStatusChange: true,
    });

  const collectedBooks: CollectedBook[] =
    data?.books_collected.edges.map((edge) => toCollectedBook(edge.node)) ?? [];
  const pageInfo = data?.books_collected.pageInfo;
  const hasNextPage: boolean = pageInfo?.hasNextPage ?? false;
  const loadingMore: boolean = networkStatus === NetworkStatus.fetchMore;

  function loadMore() {
    if (!hasNextPage || !pageInfo?.endCursor || loadingMore) {
      return;
    }
    void fetchMore({
      variables: {
        ...baseVariables,
        after: pageInfo.endCursor,
      },
    }).catch(() => {
      // Query-level failures surface through `error`; a failed loadMore just
      // leaves the current page on screen.
    });
  }

  return { collectedBooks, loading, loadingMore, error, hasNextPage, loadMore };
}

export default useBooksCollected;
