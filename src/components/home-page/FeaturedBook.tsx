import type { BookOfTheDay } from "../../types/bookOfTheDay";
import { DEFAULT_BOOK_COVER } from "../../utils/bookFormat";
import "./FeaturedBook.css";

type Props = {
  book: BookOfTheDay | null;
  loading: boolean;
  error: Error | null;
};

/** Extracts the publish year from a listing's published date, if present. */
function publishYear(publishedDate: string): string {
  return publishedDate.match(/^\d{4}/)?.[0] ?? "";
}

function FeaturedBook({ book, loading, error }: Props) {
  const year: string = book ? publishYear(book.publishedDate) : "";

  // TODO: Make this a link to the book once the library route has been established
  return (
    <div className="mt-10">
      <h2 className="text-3xl text-left mb-2 font-bold text-gray-900 dark:text-white">
        Book of the Day
      </h2>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl mt-4 text-center py-4 shadow">
        {loading && (
          <p className="py-4 text-gray-500 dark:text-gray-400">
            Picking a book for today...
          </p>
        )}
        {error && <p className="py-4 text-red-500">{error.message}</p>}
        {!loading && !error && !book && (
          <p className="py-4 text-gray-500 dark:text-gray-400">
            Collect a book and start reading to see it featured here.
          </p>
        )}

        {book && (
          <>
            <div className="py-4">
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
            </div>

            <h4 className="font-bold text-lg">{book.title}</h4>
            <p className="font-extralight text-sm">by {book.authors}</p>
            {year && (
              <div className="flex justify-center mt-2 text-base">
                <p>{year}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FeaturedBook;
