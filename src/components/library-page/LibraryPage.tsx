import { useEffect, useRef, useState } from "react";
import type { Options } from "../../types/SelectOptions";
import type { BookListing } from "../../types/bookListing";
import type { BookSort } from "../../types/bookSort";
import useBooks from "../../api/useBooks";
import useBooksCollected from "../../api/useBooksCollected";
import useBookCollectionActions from "../../api/useBookCollectionActions";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useBookDetails } from "../../hooks/useBookDetails";
import CustomSelect from "../action-items/CustomSelect";
import ConfirmRemoveModal from "./ConfirmRemoveModal";
import LibraryBookCard from "./LibraryBookCard";
import EndOfListMessage from "./EndOfListMessage";
import { useInfiniteScroll } from "./useInfiniteScroll";
import "./LibraryPage.css";

/** Milliseconds to wait after the last keystroke before querying the server. */
const SEARCH_DEBOUNCE_MS = 300;

const options: Options = [
  { id: 1, label: "Recently Added", value: "RECENT" },
  { id: 2, label: "Name A to Z", value: "TITLE_ASC" },
  { id: 3, label: "Name Z to A", value: "TITLE_DESC" },
  { id: 4, label: "Date Published", value: "PUBLISHED" },
  { id: 5, label: "Completion", value: "COMPLETION" },
];

function LibraryPage() {
  const { openBook, bookDetailsModal } = useBookDetails();
  const [bookToRemove, setBookToRemove] = useState<BookListing | null>(null);
  const [sortValue, setSortValue] = useState<BookSort>("RECENT");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const {
    addToOwned,
    removeFromOwned,
    pendingId,
    error: collectionError,
  } = useBookCollectionActions();

  const {
    books,
    loading: listingsLoading,
    loadingMore: listingsLoadingMore,
    error: listingsError,
    hasNextPage: listingsHaveMore,
    loadMore: loadMoreListings,
  } = useBooks({ search: debouncedSearch, sort: sortValue });

  const {
    collectedBooks,
    loading: collectedLoading,
    loadingMore: collectedLoadingMore,
    error: collectedError,
    hasNextPage: collectedHaveMore,
    loadMore: loadMoreCollected,
  } = useBooksCollected({ search: debouncedSearch, sort: sortValue });

  const listingsSentinelRef = useInfiniteScroll(
    loadMoreListings,
    listingsHaveMore && !listingsLoading && !listingsLoadingMore,
    books.length,
  );
  const collectedSentinelRef = useInfiniteScroll(
    loadMoreCollected,
    collectedHaveMore && !collectedLoading && !collectedLoadingMore,
    collectedBooks.length,
  );

  // A new search or sort starts a fresh first page; take the user back to it.
  const previousQueryRef = useRef(`${sortValue}\u0000${debouncedSearch}`);
  useEffect(() => {
    const queryKey = `${sortValue}\u0000${debouncedSearch}`;
    if (previousQueryRef.current === queryKey) {
      return;
    }
    previousQueryRef.current = queryKey;
    window.scrollTo({ top: 0 });
  }, [debouncedSearch, sortValue]);

  const hasAnyBooks = books.length > 0 || collectedBooks.length > 0;
  const allListsLoaded =
    !listingsLoading &&
    !collectedLoading &&
    !listingsHaveMore &&
    !collectedHaveMore;

  function handleAdd(book: BookListing) {
    void addToOwned(book.id);
  }

  function handleConfirmRemove() {
    if (!bookToRemove) {
      return;
    }
    const bookListingId = bookToRemove.id;
    setBookToRemove(null);
    void removeFromOwned(bookListingId);
  }

  return (
    <div className="pb-24">
      <div className="mb-10 pt-7 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Your Collection
        </h2>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Thus Far
        </h2>
      </div>

      {/* Searrch and Sort By action items */}
      <div className="flex flex-row justify-center mx-8 pt-10">
        <div className="flex flex-col">
          <span className="text-gray-900 dark:text-white">Search:</span>
          <input
            type="text"
            placeholder="Looking for..."
            aria-label="Search books by title or author"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 search-inp py-2 pl-2 rounded-xl text-sm"
          />
        </div>
        <div>
          <span>Sort By:</span>
          <CustomSelect
            options={options}
            onChange={(option) => setSortValue(option.value as BookSort)}
          />
        </div>
      </div>

      {collectionError && (
        <p role="alert" className="mx-8 mt-6 text-red-500">
          {collectionError}
        </p>
      )}

      {/* Books Owned */}
      <section className="px-8 pt-10" aria-labelledby="books-owned-heading">
        <h3
          id="books-owned-heading"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
        >
          Books Owned
        </h3>

        {collectedLoading && collectedBooks.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Loading owned books...
          </p>
        )}
        {collectedError && (
          <p className="text-red-500">{collectedError.message}</p>
        )}
        {!collectedLoading &&
          !collectedError &&
          collectedBooks.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              {debouncedSearch
                ? "No owned books match your search."
                : "No books owned yet."}
            </p>
          )}

        <ul className="flex flex-col gap-4">
          {collectedBooks.map((collected) => (
            <LibraryBookCard
              key={collected.id}
              book={collected.listing}
              owned={{
                datePurchased: collected.datePurchased,
                completed: collected.completed,
              }}
              disabled={pendingId === collected.listing.id}
              onRemove={() => setBookToRemove(collected.listing)}
              onOpen={() =>
                openBook(collected.listing, {
                  datePurchased: collected.datePurchased,
                  completed: collected.completed,
                })
              }
            />
          ))}
        </ul>
        {collectedHaveMore && (
          <div
            ref={collectedSentinelRef}
            className="book-list__sentinel"
            aria-hidden="true"
          />
        )}
      </section>

      {/* Books Not Owned */}
      <section className="px-8 pt-10" aria-labelledby="books-not-owned-heading">
        <h3
          id="books-not-owned-heading"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
        >
          Books Not Owned
        </h3>

        {listingsLoading && books.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">Loading books...</p>
        )}
        {listingsError && (
          <p className="text-red-500">{listingsError.message}</p>
        )}
        {!listingsLoading && !listingsError && books.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            {debouncedSearch
              ? "No other books match your search."
              : "No other books in the library."}
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {books.map((book) => (
            <LibraryBookCard
              key={book.id}
              book={book}
              disabled={pendingId === book.id}
              onAdd={() => handleAdd(book)}
              onOpen={() => openBook(book)}
            />
          ))}
        </ul>
        {listingsHaveMore && (
          <div
            ref={listingsSentinelRef}
            className="book-list__sentinel"
            aria-hidden="true"
          />
        )}
      </section>

      {hasAnyBooks && allListsLoaded && <EndOfListMessage />}

      {bookDetailsModal}

      {bookToRemove && (
        <ConfirmRemoveModal
          bookTitle={bookToRemove.title}
          onConfirm={handleConfirmRemove}
          onClose={() => setBookToRemove(null)}
        />
      )}
    </div>
  );
}

export default LibraryPage;
