import { gql } from "@apollo/client";

export const GET_BOOK_LISTINGS = gql(`
  query GetBookListings {
    book_listings {
      id
      title
      authors
      thumbnail_url
      published_date
    }
  }
`);

// Contract-first: the deployed server does not expose `books_collected` yet
// (see docs/adr/0001-client-contract-first-books-collected.md). Listing
// fields are joined server-side so an owned card can render standalone.
export const GET_BOOKS_COLLECTED = gql(`
  query GetBooksCollected {
    books_collected {
      id
      book_listing_id
      date_purchased
      completed
      title
      authors
      thumbnail_url
      published_date
    }
  }
`);
