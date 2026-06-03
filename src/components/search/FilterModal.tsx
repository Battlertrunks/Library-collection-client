import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import "./FilterModal.css";

export type FilterValues = {
  publishDate: string;
  author: string;
  genre: string;
  publisher: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FilterValues) => void;
};

const initialFilters: FilterValues = {
  publishDate: "",
  author: "",
  genre: "",
  publisher: "",
};

function FilterModal(props: Props) {
  const { isOpen, onClose, onApply } = props;

  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstFieldRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleChange(field: keyof FilterValues) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleClear() {
    setFilters(initialFilters);
  }

  function handleApply() {
    onApply?.(filters);
    onClose();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="filter-modal__backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="filter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
      >
        <div className="filter-modal__header">
          <h3 id="filter-modal-title" className="filter-modal__title">
            Filters
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="filter-modal__close"
            aria-label="Close filters"
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

        <div className="filter-modal__body">
          <div className="filter-modal__field">
            <label htmlFor="filter-publish-date" className="filter-modal__label">
              Publish Date
            </label>
            <input
              ref={firstFieldRef}
              id="filter-publish-date"
              type="date"
              value={filters.publishDate}
              onChange={handleChange("publishDate")}
              className="filter-modal__input"
            />
          </div>

          <div className="filter-modal__field">
            <label htmlFor="filter-author" className="filter-modal__label">
              Author
            </label>
            <input
              id="filter-author"
              type="text"
              value={filters.author}
              onChange={handleChange("author")}
              placeholder="e.g. Brandon Sanderson"
              className="filter-modal__input"
            />
          </div>

          <div className="filter-modal__field">
            <label htmlFor="filter-genre" className="filter-modal__label">
              Genre
            </label>
            <input
              id="filter-genre"
              type="text"
              value={filters.genre}
              onChange={handleChange("genre")}
              placeholder="e.g. Science Fiction"
              className="filter-modal__input"
            />
          </div>

          <div className="filter-modal__field">
            <label htmlFor="filter-publisher" className="filter-modal__label">
              Publisher
            </label>
            <input
              id="filter-publisher"
              type="text"
              value={filters.publisher}
              onChange={handleChange("publisher")}
              placeholder="e.g. Tor Books"
              className="filter-modal__input"
            />
          </div>
        </div>

        <div className="filter-modal__footer">
          <button
            type="button"
            onClick={handleClear}
            className="filter-modal__btn filter-modal__btn--secondary"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="filter-modal__btn filter-modal__btn--primary"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
