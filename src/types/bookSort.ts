/** Sort modes supported by the paginated book queries. */
export type BookSort =
  "RECENT" | "TITLE_ASC" | "TITLE_DESC" | "PUBLISHED" | "COMPLETION";

/** Number of books fetched per page and rendered per section initially. */
export const BOOK_PAGE_SIZE: number = 30;
