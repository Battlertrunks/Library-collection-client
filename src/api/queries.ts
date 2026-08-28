import { gql } from "@apollo/client";

export const GET_BOOK_LISTINGS = gql(`
  query GetBookListings {
    book_listings {
      id
      title
      authors
      price
      thumbnail_url
      published_date
    }
  }
`);
