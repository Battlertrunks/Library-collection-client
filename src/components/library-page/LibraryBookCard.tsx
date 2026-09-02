import type { BookListing } from "../../types/bookListing";
import "./LibraryBookCard.css";

const DEFAULT_BOOK_COVER =
  "https://placehold.co/128x192/gray/white?text=No+Cover";

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

type LibraryBookCardProps = {
  book: BookListing;
  owned?: {
    datePurchased: string;
    completed: boolean;
  };
};

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="book-card__action-icon"
      aria-hidden="true"
    >
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="book-card__action-icon"
      aria-hidden="true"
    >
      <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M8 7l1 13h6l1-13" />
    </svg>
  );
}

function LibraryBookCard({ book, owned }: LibraryBookCardProps) {
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
          <h4 className="font-bold text-gray-900 dark:text-white truncate">
            {book.title}
          </h4>
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
              <TrashIcon />
            </button>
          ) : (
            <button
              type="button"
              className="book-card__action-btn book-card__action-btn--add"
              aria-label={`Add ${book.title} to Books Owned`}
            >
              <PlusIcon />
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
