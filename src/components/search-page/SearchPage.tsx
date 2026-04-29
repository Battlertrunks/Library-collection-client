import { useState } from "react";
import "./SearchPage.css";

function SearchPage() {
  // TODO: Make a type for the books on this page...
  const [results, setResults]: unknown = useState([]);

  return (
    <div>
      <div className="mb-10 pt-7 text-center">
        <h2>Your Collection</h2>
        <h2>Thus Far</h2>
      </div>

      {/* Searrch and Sort By action items */}
      <div className="mx-10 pt-10 ">
        <div className="flex flex-col">
          <span>Search:</span>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Looking for..."
              className="bg-gray-100 search-inp py-2 pl-2 mr-4 rounded-xl"
            />
            <button className="bg-gray-100 py-2 px-4 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs">* Results come from Google Books API</p>
        </div>

        {/* Results! TODO: This should be proper pagination using Cursor-based pagination */}
        <div className="mt-9">
          <div className="text-right text-sm font-bold">
            <p>{ results.length } Results Found</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
