import type { Options } from "../../types/SelectOptions";
import useBooks from "../../api/useBooks";
import useBooksCollected from "../../api/useBooksCollected";
import CustomSelect from "../action-items/CustomSelect";
import LibraryBookCard from "./LibraryBookCard";
import "./LibraryPage.css";

const options: Options = [
  { id: 1, label: "Recently Added", value: "recent" },
  { id: 2, label: "Name A to Z", value: "az" },
  { id: 2, label: "Name Z to A", value: "za" },
  { id: 3, label: "Date Published", value: "publish" },
  { id: 4, label: "Completion", value: "completion" },
];

function LibraryPage() {
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
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 search-inp py-2 pl-2 rounded-xl text-sm"
          />
        </div>
        <div>
          <span>Sort By:</span>
          <CustomSelect options={options} />
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
          {collectedBooks.map((collected) => (
            <LibraryBookCard
              key={collected.id}
              book={collected.listing}
              owned={{
                datePurchased: collected.datePurchased,
                completed: collected.completed,
              }}
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
          {notOwnedBooks.map((book) => (
            <LibraryBookCard key={book.id} book={book} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default LibraryPage;
