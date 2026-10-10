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
    $completed: Boolean
  ) {
    books_collected(
      first: $first
      after: $after
      search: $search
      sort: $sort
      completed: $completed
    ) {
      edges {
        node {
          id
          book_listing_id
          date_purchased
          completed
          progress
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

// Deterministic daily pick served by the API; null when no owned book is in
// progress. No variables: the server decides from the current date. Listing
// description/genres are not part of the books_collected contract yet, so the
// modal falls back gracefully.
export const GET_BOOK_OF_THE_DAY = gql(`
  query GetBookOfTheDay {
    book_of_the_day {
      id
      title
      authors
      thumbnail_url
      published_date
      created_at
      date_purchased
      completed
    }
  }
`);
