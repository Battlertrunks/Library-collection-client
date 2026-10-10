import type { BookListing } from "../../types/bookListing";
import { DEFAULT_BOOK_COVER } from "../../utils/bookFormat";
import "./BooksWidget.css";

type Props = {
  book: BookListing;
  /** Reading progress as a percentage between 0 and 100. */
  progress: number;
  /** Opens the shared Book Details modal. */
  onOpen?: () => void;
};

function BooksWidget({ book, progress, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Open details for ${book.title}`}
      className="mt-4 books-widget block w-full cursor-pointer text-left bg-gray-100 dark:bg-gray-800 shadow py-3 rounded-xl transition-colors"
    >
      <span className="flex flex-row justify-items-start">
        <img
          className="books-widget__cover ml-3 rounded-xl"
          src={book.thumbnailUrl || DEFAULT_BOOK_COVER}
          alt={`${book.title} cover`}
          onError={(event) => {
            if (event.currentTarget.src !== DEFAULT_BOOK_COVER) {
              event.currentTarget.src = DEFAULT_BOOK_COVER;
            }
          }}
        />
        <span className="flex flex-col justify-between pb-4 w-full">
          <span className="block">
            <span className="block text-lg font-semibold text-gray-900 dark:text-white ml-2">
              {book.title}
            </span>
            <span className="block text-sm text-gray-700 dark:text-gray-300 text-left ml-5 mr-2">
              {book.authors}
            </span>
          </span>
          <span className="block">
            {/* progress bar */}
            <span className="block books-widget__progress-bar bg-gray-300 dark:bg-gray-600 rounded-full h-2 mx-4 mt-5 mb-2">
              <span
                className="block books-widget__progress bg-gray-900 dark:bg-white h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <span className="block text-sm text-right text-gray-900 dark:text-white">
                {`${progress}% Complete`}
              </span>
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

export default BooksWidget;
