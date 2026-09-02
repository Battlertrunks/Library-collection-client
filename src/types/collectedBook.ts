import type { BookListing } from "./bookListing";

export type CollectedBook = {
  id: string;
  listing: BookListing;
  datePurchased: string;
  completed: boolean;
};
