import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { MouseEvent } from "react";
import type { BookListing } from "../../types/bookListing";
import type { OwnedBookInfo } from "../../types/collectedBook";
import {
  DEFAULT_BOOK_COVER,
  formatDate,
  truncateWords,
} from "../../utils/bookFormat";
import { PlusIcon, TrashIcon } from "../icons/BookActionIcons";
import "./BookDetails.css";

type BookDetailsProps = {
  book: BookListing;
  owned?: OwnedBookInfo;
  onClose: () => void;
};

const NO_DESCRIPTION_TEXT = "No description available for this book.";
const DESCRIPTION_WORD_LIMIT = 40;
const MOBILE_VIEWPORT_QUERY = "(max-width: 639px)";

function subscribeToViewportChange(onChange: () => void) {
  if (typeof window.matchMedia !== "function") {
    return () => {};
  }
  const query = window.matchMedia(MOBILE_VIEWPORT_QUERY);
  query.addEventListener("change", onChange);
  return () => {
    query.removeEventListener("change", onChange);
  };
}

function getIsMobileViewport() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia(MOBILE_VIEWPORT_QUERY).matches
  );
}

function getIsMobileViewportServerSnapshot() {
  return false;
}

function BookDetails({ book, owned, onClose }: BookDetailsProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const isMobileViewport = useSyncExternalStore(
    subscribeToViewportChange,
    getIsMobileViewport,
    getIsMobileViewportServerSnapshot,
  );
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, []);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  const publishedDate = formatDate(book.publishedDate);
  const purchaseDate = owned ? formatDate(owned.datePurchased) : "";
  const genres = book.genres
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);
  const description = book.description || NO_DESCRIPTION_TEXT;
  const { text: truncatedDescription, truncated: descriptionTruncated } =
    truncateWords(description, DESCRIPTION_WORD_LIMIT);
  const showDescriptionToggle = isMobileViewport && descriptionTruncated;
  const displayedDescription =
    showDescriptionToggle && !descriptionExpanded
      ? truncatedDescription
      : description;

  return (
    <div
      className="book-details__backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="book-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-details-title"
      >
        <div className="book-details__header">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="book-details__close"
            aria-label="Close book details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="book-details__body">
          <img
            src={book.thumbnailUrl || DEFAULT_BOOK_COVER}
            alt={`${book.title} cover`}
            className="book-details__cover"
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_BOOK_COVER) {
                e.currentTarget.src = DEFAULT_BOOK_COVER;
              }
            }}
          />

          <div className="book-details__info">
            <div className="book-details__title-row">
              <h2 id="book-details-title" className="book-details__title">
                {book.title}
              </h2>
              {owned?.completed && (
                <span className="book-details__badge book-details__badge--completed">
                  Completed
                </span>
              )}
              {/* TODO: Wire these actions to the collection mutations once the
                  backend supports them (mirrors LibraryBookCard). */}
              {owned ? (
                <button
                  type="button"
                  className="book-details__action-btn book-details__action-btn--discard"
                  aria-label={`Remove ${book.title} from Books Owned`}
                >
                  <TrashIcon className="book-details__action-icon" />
                </button>
              ) : (
                <button
                  type="button"
                  className="book-details__action-btn book-details__action-btn--add"
                  aria-label={`Add ${book.title} to Books Owned`}
                >
                  <PlusIcon className="book-details__action-icon" />
                </button>
              )}
            </div>

            <p className="book-details__author">{book.authors}</p>

            {(publishedDate || purchaseDate) && (
              <div className="book-details__meta">
                {publishedDate && <span>{`Published ${publishedDate}`}</span>}
                {purchaseDate && <span>{`Purchased ${purchaseDate}`}</span>}
              </div>
            )}

            {genres.length > 0 && (
              <ul className="book-details__genres">
                {genres.map((genre, index) => (
                  <li key={index} className="book-details__genre">
                    {genre}
                  </li>
                ))}
              </ul>
            )}

            <p
              id="book-details-description"
              className={
                book.description
                  ? "book-details__description"
                  : "book-details__description book-details__description--empty"
              }
            >
              {displayedDescription}
            </p>

            {showDescriptionToggle && (
              <button
                type="button"
                onClick={() => setDescriptionExpanded((expanded) => !expanded)}
                className="book-details__description-toggle"
                aria-expanded={descriptionExpanded}
                aria-controls="book-details-description"
              >
                {descriptionExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
