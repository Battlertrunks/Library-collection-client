import { gql } from "@apollo/client";

export const GET_BOOK_LISTINGS = gql(`
  query GetBookListings(
    $first: Int!
    $after: String
    $search: String
    $sort: BookSort
  ) {
    book_listings(
      first: $first
      after: $after
      search: $search
      sort: $sort
    ) {
      edges {
        node {
          id
          title
          authors
          thumbnail_url
          published_date
          description
          genres
          created_at
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

// Listing fields are joined server-side so an owned card can render
// standalone; description/genres are not part of the books_collected contract
// yet and BookDetails falls back gracefully until they are.
export const GET_BOOKS_COLLECTED = gql(`
  query GetBooksCollected(
    $first: Int!
    $after: String
    $search: String
    $sort: BookSort
  ) {
    books_collected(
      first: $first
      after: $after
      search: $search
      sort: $sort
    ) {
      edges {
        node {
          id
          book_listing_id
          date_purchased
          completed
          title
          authors
          thumbnail_url
          published_date
          created_at
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);
