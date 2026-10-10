import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import HomePage from "./HomePage";
import type { BookListing } from "../../types/bookListing";
import type { CollectedBook, OwnedBookInfo } from "../../types/collectedBook";

const state = vi.hoisted(() => ({
  collectedBooks: [] as CollectedBook[],
  progressLoading: false,
  progressError: null as Error | null,
  featuredBook: null as BookListing | null,
  featuredOwned: undefined as OwnedBookInfo | undefined,
  featuredLoading: false,
  featuredError: null as Error | null,
  lastOptions: null as null | Record<string, unknown>,
}));

vi.mock("../../api/useBooksCollected", () => ({
  default: (options: Record<string, unknown>) => {
    state.lastOptions = options;
    return {
      collectedBooks: state.collectedBooks,
      loading: state.progressLoading,
      loadingMore: false,
      error: state.progressError,
      hasNextPage: false,
      loadMore: vi.fn(),
    };
  },
}));

vi.mock("../../api/useBookOfTheDay", () => ({
  default: () => ({
    book: state.featuredBook,
    owned: state.featuredOwned,
    loading: state.featuredLoading,
    error: state.featuredError,
  }),
}));

function makeCollected(
  id: string,
  title: string,
  progress: number,
): CollectedBook {
  return {
    id,
    listing: {
      id: `listing-${id}`,
      title,
      authors: `${title} Author`,
      thumbnailUrl: "",
      publishedDate: "2020-01-01",
      description: "",
      genres: "",
      createdAt: "2026-01-01",
    },
    datePurchased: "2026-01-01",
    completed: false,
    progress,
  };
}

describe("HomePage", () => {
  beforeEach(() => {
    state.collectedBooks = [];
    state.progressLoading = false;
    state.progressError = null;
    state.featuredBook = null;
    state.featuredOwned = undefined;
    state.featuredLoading = false;
    state.featuredError = null;
    state.lastOptions = null;
  });

  it("renders the greeting with username", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("BattlerTrunks");
  });

  it("renders the text overlay percentages", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("52%");
    expect(html).toContain("You Own");
    expect(html).toContain("of the Series");
  });

  it("renders the ProgressChart component", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("arc-progress-wrapper");
  });

  it("requests the three closest-to-completion unfinished books", () => {
    renderToString(<HomePage />);

    expect(state.lastOptions).toEqual({
      search: "",
      sort: "COMPLETION",
      completed: false,
      first: 3,
    });
  });

  it("renders the 'Progress so far...' section heading", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("Progress so far");
  });

  it("renders the in-progress books with their completion", () => {
    state.collectedBooks = [
      makeCollected("1", "Know No Fear", 87),
      makeCollected("2", "Dune", 42),
    ];

    const html = renderToString(<HomePage />);

    expect(html).toContain("Know No Fear");
    expect(html).toContain("Know No Fear Author");
    expect(html).toContain("87% Complete");
    expect(html).toContain("Dune");
    expect(html).toContain("42% Complete");
  });

  it("shows at most three progress books", () => {
    state.collectedBooks = [
      makeCollected("1", "Book One", 90),
      makeCollected("2", "Book Two", 80),
      makeCollected("3", "Book Three", 70),
      makeCollected("4", "Book Four", 60),
    ];

    const html = renderToString(<HomePage />);

    expect(html).toContain("Book Three");
    expect(html).not.toContain("Book Four");
  });

  it("shows a loading message while progress loads", () => {
    state.progressLoading = true;

    const html = renderToString(<HomePage />);

    expect(html).toContain("Loading your progress...");
  });

  it("shows an empty message when nothing is in progress", () => {
    const html = renderToString(<HomePage />);

    expect(html).toContain("No books in progress yet.");
  });

  it("shows the progress error message", () => {
    state.progressError = new Error("Progress is unavailable");

    const html = renderToString(<HomePage />);

    expect(html).toContain("Progress is unavailable");
  });

  it("renders the featured book of the day", () => {
    state.featuredBook = {
      id: "1",
      title: "The Horus Heresy: Know No Fear",
      authors: "Dan Abnett",
      thumbnailUrl: "",
      publishedDate: "2019-02-26",
      description: "",
      genres: "",
      createdAt: "2026-01-01",
    };
    state.featuredOwned = {
      datePurchased: "2026-01-01",
      completed: false,
    };

    const html = renderToString(<HomePage />);

    expect(html).toContain("Book of the Day");
    expect(html).toContain("The Horus Heresy: Know No Fear");
    expect(html).toContain("Dan Abnett");
    expect(html).toContain("2019");
  });

  it("shows the featured empty state when nothing is in progress", () => {
    const html = renderToString(<HomePage />);

    expect(html).toContain(
      "Collect a book and start reading to see it featured here.",
    );
  });

  it("renders horizontal rule separators", () => {
    const html = renderToString(<HomePage />);
    const hrMatches = html.match(/<hr/g);
    expect(hrMatches).toHaveLength(2);
  });
});
