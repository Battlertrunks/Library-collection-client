import type { BookListing } from "../../types/bookListing";
import type { OwnedBookInfo } from "../../types/collectedBook";
import { DEFAULT_BOOK_COVER, formatDate } from "../../utils/bookFormat";
import { PlusIcon, TrashIcon } from "../icons/BookActionIcons";
import "./LibraryBookCard.css";

type LibraryBookCardProps = {
  book: BookListing;
  owned?: OwnedBookInfo;
  onOpen?: () => void;
};

function LibraryBookCard({ book, owned, onOpen }: LibraryBookCardProps) {
  return (
    <li className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-3 gap-3 shadow">
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="book-card__title-btn font-bold text-gray-900 dark:text-white truncate"
          >
            {book.title}
          </button>
          {owned?.completed && (
            <span className="book-card__badge book-card__badge--completed">
              Completed
            </span>
          )}
          {owned ? (
            <button
              type="button"
              className="book-card__action-btn book-card__action-btn--discard"
              aria-label={`Remove ${book.title} from Books Owned`}
            >
              <TrashIcon className="book-card__action-icon" />
            </button>
          ) : (
            <button
              type="button"
              className="book-card__action-btn book-card__action-btn--add"
              aria-label={`Add ${book.title} to Books Owned`}
            >
              <PlusIcon className="book-card__action-icon" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
          {book.authors}
        </p>
        <p className="mt-auto text-xs text-gray-500 dark:text-gray-400">
          {owned
            ? owned.datePurchased
              ? `Purchased ${formatDate(owned.datePurchased)}`
              : "Purchased"
            : formatDate(book.publishedDate)}
        </p>
      </div>
    </li>
  );
}

export default LibraryBookCard;
