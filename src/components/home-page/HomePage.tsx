import useBooksCollected from "../../api/useBooksCollected";
import useBookOfTheDay from "../../api/useBookOfTheDay";
import { useBookDetails } from "../../hooks/useBookDetails";
import ProgressChart from "./ProgressChart";
import BooksWidget from "./BooksWidget";
import FeaturedBook from "./FeaturedBook";
import "./HomePage.css";

/** Number of in-progress books shown in the Progress so far section. */
const HOME_PROGRESS_LIMIT: number = 3;

const HomePage = () => {
  const username: string = "BattlerTrunks"; // TODO: Get username from server...
  const { openBook, bookDetailsModal } = useBookDetails();

  // Closest to completion first, with finished books filtered out.
  const {
    collectedBooks,
    loading: progressLoading,
    error: progressError,
  } = useBooksCollected({
    search: "",
    sort: "COMPLETION",
    completed: false,
    first: HOME_PROGRESS_LIMIT,
  });

  const {
    book: featuredBook,
    owned: featuredOwned,
    loading: featuredLoading,
    error: featuredError,
  } = useBookOfTheDay();

  const progressItems = collectedBooks.slice(0, HOME_PROGRESS_LIMIT);

  function openFeaturedBook() {
    if (featuredBook) {
      openBook(featuredBook, featuredOwned);
    }
  }

  // TODO: Should there be animation effects in this project?

  return (
    <div className="text-center pb-26 px-10 pt-7 text-face scroll-auto overflow-scroll">
      <div className="flex flex-col justify-center items-center">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Hey there,
          </h2>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {username}...
          </h2>
        </div>

        {/* Wrapper to center the text over the SVG */}
        <div
          style={{
            position: "relative",
            width: 280,
            height: 280,
            margin: "0 auto",
          }}
        >
          <ProgressChart
            percentage={0.52}
            size={280}
            strokeWidth={8}
            startAngle={90}
          />

          {/* Text Overlay */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span className="text-sm font-normal text-gray-800 dark:text-gray-200 tracking-widest">
              You Own
            </span>
            <span className="text-6xl font-light text-black dark:text-white tracking-tight">
              52%
            </span>
            <span className="text-sm font-normal text-gray-800 dark:text-gray-200 tracking-wide">
              of the Series
            </span>
          </div>
        </div>
      </div>

      <hr className="mt-20 bg-gray-800" />

      {/* Progress so far section */}
      <section className="mt-10">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white text-left">
          Progress so far...
        </h2>

        {progressLoading && progressItems.length === 0 && (
          <p className="text-left text-gray-500 dark:text-gray-400">
            Loading your progress...
          </p>
        )}
        {progressError && (
          <p className="text-left text-red-500">{progressError.message}</p>
        )}
        {!progressLoading && !progressError && progressItems.length === 0 && (
          <p className="text-left text-gray-500 dark:text-gray-400">
            No books in progress yet.
          </p>
        )}

        <ul>
          {progressItems.map((item) => (
            <li
              key={item.id}
              className="text-left text-lg text-gray-700 dark:text-gray-300 mb-1"
            >
              <BooksWidget
                book={item.listing}
                progress={item.progress}
                onOpen={() =>
                  openBook(item.listing, {
                    datePurchased: item.datePurchased,
                    completed: item.completed,
                  })
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <hr className="mt-10 bg-gray-800" />

      {/* Book of the Day*/}
      <section>
        <FeaturedBook
          book={featuredBook}
          loading={featuredLoading}
          error={featuredError ?? null}
          onOpen={openFeaturedBook}
        />
      </section>

      {bookDetailsModal}
    </div>
  );
};

export default HomePage;
