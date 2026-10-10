import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

/**
 * Builds the app cache. Kept separate from the client so tests can exercise
 * the same pagination policies without an HTTP link.
 * @returns A configured InMemoryCache.
 */
export function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // One cache entry per search/sort combination keeps the pages of
          // different views from bleeding into each other.
          book_listings: relayStylePagination(["search", "sort"]),
          books_collected: relayStylePagination(["search", "sort"]),
        },
      },
    },
  });
}

export const client = new ApolloClient({
  // Relative so the browser stays same-origin: Vite proxies /graphql to the
  // API in dev, and production serves both behind one origin. Avoids the CORS
  // preflight (an extra OPTIONS request) on every query.
  link: new HttpLink({ uri: "/graphql" }),
  cache: createCache(),
});
