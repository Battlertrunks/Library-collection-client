import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import type { DocumentNode } from "graphql";
import type { MockLink } from "@apollo/client/testing";
import LibraryPage from "./LibraryPage";
import { createCache } from "../../api/client";
import { GET_BOOK_LISTINGS, GET_BOOKS_COLLECTED } from "../../api/queries";
import { ADD_BOOK_COLLECTED, REMOVE_BOOK_COLLECTED } from "../../api/mutations";

/** Variables the page sends for the default search and sort. */
const BASE_VARIABLES = { first: 30, search: "", sort: "RECENT" };

function listingNode(id: string, title: string) {
  return {
    __typename: "BookListings",
    id,
    title,
    authors: `${title} Author`,
    thumbnail_url: "",
    published_date: "2024-01-01",
    description: "",
    genres: "",
    created_at: "2024-01-01",
  };
}

function collectedNode(id: string, listingId: string, title: string) {
  return {
    __typename: "BooksCollected",
    id,
    book_listing_id: listingId,
    date_purchased: "2025-01-01",
    completed: false,
    title,
    authors: `${title} Author`,
    thumbnail_url: "",
    published_date: "2024-01-01",
    created_at: "2024-01-01",
  };
}

function listingsPage(nodes: Array<ReturnType<typeof listingNode>>) {
  return {
    book_listings: {
      __typename: "BookListingsConnection",
      edges: nodes.map((node, index) => ({
        __typename: "BookListingsEdge",
        node,
        cursor: `listing-cursor-${index}`,
      })),
      pageInfo: {
        __typename: "PageInfo",
        hasNextPage: false,
        endCursor: null,
      },
    },
  };
}

function collectedPage(nodes: Array<ReturnType<typeof collectedNode>>) {
  return {
    books_collected: {
      __typename: "BooksCollectedConnection",
      edges: nodes.map((node, index) => ({
        __typename: "BooksCollectedEdge",
        node,
        cursor: `collected-cursor-${index}`,
      })),
      pageInfo: {
        __typename: "PageInfo",
        hasNextPage: false,
        endCursor: null,
      },
    },
  };
}

/** Builds a mock for one query or mutation response. */
function queryMock<TData extends Record<string, unknown>>(
  query: DocumentNode,
  data: TData,
  variables: Record<string, unknown> = BASE_VARIABLES,
): MockLink.MockedResponse {
  return { request: { query, variables }, result: { data } };
}

describe("LibraryPage collection actions", () => {
  let container: HTMLDivElement;
  let root: Root;

  function render(mocks: ReadonlyArray<MockLink.MockedResponse>) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    const ui: ReactElement = (
      <MockedProvider
        mocks={mocks}
        cache={createCache()}
        mockLinkDefaultOptions={{ delay: 0 }}
      >
        <LibraryPage />
      </MockedProvider>
    );
    act(() => {
      root.render(ui);
    });
  }

  /** Lets chained mock responses, refetches, and React updates settle. */
  async function flush() {
    await act(async () => {
      for (let i = 0; i < 8; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    });
  }

  function click(selector: string) {
    const element = container.querySelector(selector);
    expect(element).not.toBeNull();
    act(() => {
      (element as HTMLElement).click();
    });
  }

  function titlesIn(sectionId: string): string[] {
    return Array.from(
      container.querySelectorAll(
        `section[aria-labelledby="${sectionId}"] .book-card__title-btn`,
      ),
    ).map((button) => button.textContent ?? "");
  }

  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  it("moves a book into Books Owned and out of Books Not Owned when added", async () => {
    const alpha = listingNode("1", "Alpha");
    const bravo = listingNode("2", "Bravo");
    const charlie = collectedNode("10", "3", "Charlie");
    const alphaCollected = collectedNode("11", "1", "Alpha");

    render([
      queryMock(GET_BOOK_LISTINGS, listingsPage([alpha, bravo])),
      queryMock(GET_BOOKS_COLLECTED, collectedPage([charlie])),
      queryMock(
        ADD_BOOK_COLLECTED,
        { add_book_collected: alphaCollected },
        { bookListingId: "1" },
      ),
      queryMock(GET_BOOK_LISTINGS, listingsPage([bravo])),
      queryMock(GET_BOOKS_COLLECTED, collectedPage([alphaCollected, charlie])),
    ]);
    await flush();

    expect(titlesIn("books-owned-heading")).toEqual(["Charlie"]);
    expect(titlesIn("books-not-owned-heading")).toEqual(["Alpha", "Bravo"]);

    click('[aria-label="Add Alpha to Books Owned"]');
    await flush();

    expect(titlesIn("books-owned-heading")).toEqual(["Alpha", "Charlie"]);
    expect(titlesIn("books-not-owned-heading")).toEqual(["Bravo"]);
    expect(
      container.querySelector('[aria-label="Remove Alpha from Books Owned"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[aria-label="Add Alpha to Books Owned"]'),
    ).toBeNull();
  });

  it("removes a book from Books Owned after confirmation and returns it to Books Not Owned", async () => {
    const alpha = listingNode("1", "Alpha");
    const bravo = listingNode("2", "Bravo");
    const charlie = collectedNode("10", "3", "Charlie");
    const charlieListing = listingNode("3", "Charlie");

    render([
      queryMock(GET_BOOK_LISTINGS, listingsPage([alpha, bravo])),
      queryMock(GET_BOOKS_COLLECTED, collectedPage([charlie])),
      queryMock(
        REMOVE_BOOK_COLLECTED,
        { remove_book_collected: charlie },
        { bookListingId: "3" },
      ),
      queryMock(
        GET_BOOK_LISTINGS,
        listingsPage([alpha, bravo, charlieListing]),
      ),
      queryMock(GET_BOOKS_COLLECTED, collectedPage([])),
    ]);
    await flush();

    expect(titlesIn("books-owned-heading")).toEqual(["Charlie"]);
    expect(titlesIn("books-not-owned-heading")).toEqual(["Alpha", "Bravo"]);

    click('[aria-label="Remove Charlie from Books Owned"]');

    expect(container.textContent).toContain("Are you sure?");
    expect(container.textContent).toContain("Charlie");

    click(".confirm-remove-modal__btn--danger");
    await flush();

    expect(container.querySelector(".confirm-remove-modal")).toBeNull();
    expect(titlesIn("books-owned-heading")).toEqual([]);
    expect(titlesIn("books-not-owned-heading")).toEqual([
      "Alpha",
      "Bravo",
      "Charlie",
    ]);
    expect(
      container.querySelector('[aria-label="Add Charlie to Books Owned"]'),
    ).not.toBeNull();
  });

  it("keeps the book owned when the removal confirmation is cancelled", async () => {
    const alpha = listingNode("1", "Alpha");
    const bravo = listingNode("2", "Bravo");
    const charlie = collectedNode("10", "3", "Charlie");

    render([
      queryMock(GET_BOOK_LISTINGS, listingsPage([alpha, bravo])),
      queryMock(GET_BOOKS_COLLECTED, collectedPage([charlie])),
    ]);
    await flush();

    click('[aria-label="Remove Charlie from Books Owned"]');
    expect(container.querySelector(".confirm-remove-modal")).not.toBeNull();

    click(".confirm-remove-modal__btn--cancel");

    expect(container.querySelector(".confirm-remove-modal")).toBeNull();
    expect(titlesIn("books-owned-heading")).toEqual(["Charlie"]);
    expect(titlesIn("books-not-owned-heading")).toEqual(["Alpha", "Bravo"]);
  });
});
