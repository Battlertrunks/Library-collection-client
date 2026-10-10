import { useState } from "react";
import type { ReactElement } from "react";
import BookDetails from "../components/book-details/BookDetails";
import type { BookListing } from "../types/bookListing";
import type { OwnedBookInfo } from "../types/collectedBook";

type SelectedBook = {
  book: BookListing;
  owned?: OwnedBookInfo;
};

type UseBookDetailsResult = {
  openBook: (book: BookListing, owned?: OwnedBookInfo) => void;
  closeBook: () => void;
  bookDetailsModal: ReactElement | null;
};

/**
 * Shared Book Details wiring: pages call `openBook` from any book card and
 * render the returned `bookDetailsModal` once, instead of every page keeping
 * its own selected-book state and modal branch.
 * @returns The open/close actions and the modal element to render.
 */
export function useBookDetails(): UseBookDetailsResult {
  const [selectedBook, setSelectedBook] = useState<SelectedBook | null>(null);

  function openBook(book: BookListing, owned?: OwnedBookInfo) {
    setSelectedBook({ book, owned });
  }

  function closeBook() {
    setSelectedBook(null);
  }

  const bookDetailsModal = selectedBook ? (
    <BookDetails
      book={selectedBook.book}
      owned={selectedBook.owned}
      onClose={closeBook}
    />
  ) : null;

  return { openBook, closeBook, bookDetailsModal };
}
