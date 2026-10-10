import { gql } from "@apollo/client";

// Both mutations return the joined books_collected row, the same shape the
// books_collected query selects, so the client can rely on one contract.
export const ADD_BOOK_COLLECTED = gql(`
  mutation AddBookCollected($bookListingId: ID!) {
    add_book_collected(book_listing_id: $bookListingId) {
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
  }
`);

export const REMOVE_BOOK_COLLECTED = gql(`
  mutation RemoveBookCollected($bookListingId: ID!) {
    remove_book_collected(book_listing_id: $bookListingId) {
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
  }
`);
