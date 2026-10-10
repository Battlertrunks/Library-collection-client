import type { BookListing } from "../../types/bookListing";
import { DEFAULT_BOOK_COVER } from "../../utils/bookFormat";
import "./FeaturedBook.css";

type Props = {
  book: BookListing | null;
  loading: boolean;
  error: Error | null;
  /** Opens the shared Book Details modal. */
  onOpen?: () => void;
};

/** Card surface shared by the featured book and its loading/empty states. */
const CARD_CLASSES =
  "bg-gray-100 dark:bg-gray-800 rounded-xl mt-4 text-center py-4 shadow";

/** Extracts the publish year from a listing's published date, if present. */
function publishYear(publishedDate: string): string {
  return publishedDate.match(/^\d{4}/)?.[0] ?? "";
}

function FeaturedBook({ book, loading, error, onOpen }: Props) {
  const year: string = book ? publishYear(book.publishedDate) : "";

  return (
    <div className="mt-10">
      <h2 className="text-3xl text-left mb-2 font-bold text-gray-900 dark:text-white">
        Book of the Day
      </h2>

      {book && !loading && !error ? (
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          aria-label={`Open details for ${book.title}`}
          className={`featured-book__card block w-full cursor-pointer ${CARD_CLASSES}`}
        >
          <span className="block py-4">
            <img
              className="featured-book__cover ml-3 mx-auto inline-block rounded-2xl"
              src={book.thumbnailUrl || DEFAULT_BOOK_COVER}
              alt={`${book.title} cover`}
              onError={(event) => {
                if (event.currentTarget.src !== DEFAULT_BOOK_COVER) {
                  event.currentTarget.src = DEFAULT_BOOK_COVER;
                }
              }}
            />
          </span>

          <span className="block font-bold text-lg">{book.title}</span>
          <span className="block font-extralight text-sm">
            by {book.authors}
          </span>
          {year && (
            <span className="flex justify-center mt-2 text-base">
              <span>{year}</span>
            </span>
          )}
        </button>
      ) : (
        <div className={CARD_CLASSES}>
          {loading && (
            <p className="py-4 text-gray-500 dark:text-gray-400">
              Picking a book for today...
            </p>
          )}
          {error && <p className="py-4 text-red-500">{error.message}</p>}
          {!loading && !error && (
            <p className="py-4 text-gray-500 dark:text-gray-400">
              Collect a book and start reading to see it featured here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default FeaturedBook;
