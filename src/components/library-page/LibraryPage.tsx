import { useState } from "react";
import type { Options } from "../../types/SelectOptions";
import type { BookListing } from "../../types/bookListing";
import type { OwnedBookInfo } from "../../types/collectedBook";
import useBooks from "../../api/useBooks";
import useBooksCollected from "../../api/useBooksCollected";
import CustomSelect from "../action-items/CustomSelect";
import BookDetails from "../book-details/BookDetails";
import LibraryBookCard from "./LibraryBookCard";
import { filterBooks } from "./filterBooks";
import { sortBooks, type SortValue } from "./sortBooks";
import "./LibraryPage.css";

type SelectedBook = {
  book: BookListing;
  owned?: OwnedBookInfo;
};

const options: Options = [
  { id: 1, label: "Recently Added", value: "recent" },
  { id: 2, label: "Name A to Z", value: "az" },
  { id: 3, label: "Name Z to A", value: "za" },
  { id: 4, label: "Date Published", value: "publish" },
  { id: 5, label: "Completion", value: "completion" },
];

function LibraryPage() {
  const [selectedBook, setSelectedBook] = useState<SelectedBook | null>(null);
  const [sortValue, setSortValue] = useState<SortValue>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const { books, loading: listingsLoading, error: listingsError } = useBooks();
  const {
    collectedBooks,
    loading: collectedLoading,
    error: collectedError,
  } = useBooksCollected();

  const ownedListingIds = new Set(
    collectedBooks.map((collected) => collected.listing.id),
  );
  const notOwnedBooks = books.filter((book) => !ownedListingIds.has(book.id));

  const sortedCollectedBooks = sortBooks(
    filterBooks(
      collectedBooks.map((collected) => ({
        book: collected.listing,
        owned: {
          datePurchased: collected.datePurchased,
          completed: collected.completed,
        } satisfies OwnedBookInfo,
      })),
      searchQuery,
    ),
    sortValue,
  );
  const sortedNotOwnedBooks = sortBooks(
    filterBooks(
      notOwnedBooks.map((book) => ({ book })),
      searchQuery,
    ),
    sortValue,
  );

  return (
    <div>
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
            onChange={(option) => setSortValue(option.value as SortValue)}
          />
        </div>
      </div>

      {/* Books Owned */}
      <section className="px-8 pt-10" aria-labelledby="books-owned-heading">
        <h3
          id="books-owned-heading"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
        >
          Books Owned
        </h3>

        {collectedLoading && (
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
              No books owned yet.
            </p>
          )}

        <ul className="flex flex-col gap-4">
          {sortedCollectedBooks.map(({ book, owned }) => (
            <LibraryBookCard
              key={book.id}
              book={book}
              owned={owned}
              onOpen={() => setSelectedBook({ book, owned })}
            />
          ))}
        </ul>
      </section>

      {/* Books Not Owned */}
      <section className="px-8 pt-10" aria-labelledby="books-not-owned-heading">
        <h3
          id="books-not-owned-heading"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
        >
          Books Not Owned
        </h3>

        {listingsLoading && (
          <p className="text-gray-500 dark:text-gray-400">Loading books...</p>
        )}
        {listingsError && (
          <p className="text-red-500">{listingsError.message}</p>
        )}

        <ul className="flex flex-col gap-4">
          {sortedNotOwnedBooks.map(({ book }) => (
            <LibraryBookCard
              key={book.id}
              book={book}
              onOpen={() => setSelectedBook({ book })}
            />
          ))}
        </ul>
      </section>

      {selectedBook && (
        <BookDetails
          book={selectedBook.book}
          owned={selectedBook.owned}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}

export default LibraryPage;
