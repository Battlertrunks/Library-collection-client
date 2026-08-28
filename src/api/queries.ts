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
