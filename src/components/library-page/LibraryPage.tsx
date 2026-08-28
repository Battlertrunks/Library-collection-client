import type { Options } from "../../types/SelectOptions";
import useBooks from "../../api/useBooks";
import CustomSelect from "../action-items/CustomSelect";
import "./LibraryPage.css";

const DEFAULT_BOOK_COVER =
  "https://placehold.co/128x192/gray/white?text=No+Cover";

const options: Options = [
  { id: 1, label: "Recently Added", value: "recent" },
  { id: 2, label: "Name A to Z", value: "az" },
  { id: 2, label: "Name Z to A", value: "za" },
  { id: 3, label: "Date Published", value: "publish" },
  { id: 4, label: "Completion", value: "completion" },
];

function formatPublicationDate(publishedDate: string): string {
  const date = new Date(publishedDate);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function LibraryPage() {
  const { books, loading, error } = useBooks();

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

      {/* Books Not Owned */}
      <section className="px-8 pt-10" aria-labelledby="books-not-owned-heading">
        <h3
          id="books-not-owned-heading"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
        >
          Books Not Owned
        </h3>

        {loading && (
          <p className="text-gray-500 dark:text-gray-400">Loading books...</p>
        )}
        {error && <p className="text-red-500">{error.message}</p>}

        <ul className="flex flex-col gap-4">
          {books.map((book) => (
            <li
              key={book.id}
              className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-3 gap-3 shadow"
            >
              <img
                src={book.thumbnailUrl || DEFAULT_BOOK_COVER}
                alt={`${book.title} cover`}
                className="book-card__thumbnail rounded-lg"
                onError={(e) => {
                  if (e.currentTarget.src !== DEFAULT_BOOK_COVER) {
                    e.currentTarget.src = DEFAULT_BOOK_COVER;
                  }
                }}
              />
              <div className="flex flex-col flex-1 min-w-0 py-1">
                <h4 className="font-bold text-gray-900 dark:text-white truncate">
                  {book.title}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {book.authors}
                </p>
                <p className="mt-auto text-xs text-gray-500 dark:text-gray-400">
                  {formatPublicationDate(book.publishedDate)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default LibraryPage;
