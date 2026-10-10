import type { BookListing } from "./bookListing";

export type CollectedBook = {
  id: string;
  listing: BookListing;
  datePurchased: string;
  completed: boolean;
  /** Reading progress as a percentage between 0 and 100. */
  progress: number;
};

export type OwnedBookInfo = Pick<CollectedBook, "datePurchased" | "completed">;
