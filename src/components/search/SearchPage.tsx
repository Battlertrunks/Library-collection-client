import { useState } from "react";
import "./SearchPage.css";
import FilterModal from "./FilterModal";

function SearchPage() {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="mb-10 pt-7 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Search Books
        </h2>
      </div>

      {/* Search input with filter button */}
      <div className="flex flex-row justify-center pt-10">
        <div className="flex flex-col w-full mx-8">
          <span className="text-gray-900 dark:text-white">Search:</span>
          <div className="flex flex-row justify-between gap-2">
            <input
              type="text"
              placeholder="Looking for..."
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 py-2 pl-2 w-full rounded-xl text-sm"
            />
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open filters"
              aria-expanded={isFilterOpen}
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
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </button>
          </div>
          <span className="text-size-xxs text-gray-500 mt-1">
            * Results come from Google Books API
          </span>
        </div>
      </div>

      {isFilterOpen && (
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

export default SearchPage;
