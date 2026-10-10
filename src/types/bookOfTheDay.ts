import type { BookListing } from "./bookListing";

/** The subset of a Book Listing the Featured Book card needs. */
export type BookOfTheDay = Pick<
  BookListing,
  "id" | "title" | "authors" | "thumbnailUrl" | "publishedDate"
>;
