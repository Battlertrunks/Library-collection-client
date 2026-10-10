import { describe, it, expect, afterEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import useBooks from "./useBooks";
import { createCache } from "./client";
import { GET_BOOK_LISTINGS } from "./queries";

function makeNode(id: string, title: string) {
  return {
    __typename: "BookListings",
    id,
    title,
    authors: "Author",
    thumbnail_url: "",
    published_date: "2024-01-01",
    description: "",
    genres: "",
    created_at: "2024-01-01",
  };
}

function makeEdge(node: ReturnType<typeof makeNode>, cursor: string) {
  return { __typename: "BookListingsEdge", node, cursor };
}

const firstPage = {
  book_listings: {
    __typename: "BookListingsConnection",
    edges: [
      makeEdge(makeNode("1", "Alpha"), "cursor-1"),
      makeEdge(makeNode("2", "Bravo"), "cursor-2"),
    ],
    pageInfo: {
      __typename: "PageInfo",
      hasNextPage: true,
      endCursor: "cursor-2",
    },
  },
};

const secondPage = {
  book_listings: {
    __typename: "BookListingsConnection",
    edges: [makeEdge(makeNode("3", "Charlie"), "cursor-3")],
    pageInfo: {
      __typename: "PageInfo",
      hasNextPage: false,
      endCursor: "cursor-3",
    },
  },
};

const searchPage = {
  book_listings: {
    __typename: "BookListingsConnection",
    edges: [makeEdge(makeNode("4", "Dune"), "cursor-dune")],
    pageInfo: {
      __typename: "PageInfo",
      hasNextPage: false,
      endCursor: "cursor-dune",
    },
  },
};

const mocks = [
  {
    request: {
      query: GET_BOOK_LISTINGS,
      variables: { first: 30, search: "", sort: "RECENT" },
    },
    result: { data: firstPage },
  },
  {
    request: {
      query: GET_BOOK_LISTINGS,
      variables: {
        first: 30,
        search: "",
        sort: "RECENT",
        after: "cursor-2",
      },
    },
    result: { data: secondPage },
  },
  {
    request: {
      query: GET_BOOK_LISTINGS,
      variables: { first: 30, search: "dune", sort: "RECENT" },
    },
    result: { data: searchPage },
  },
];

function Harness({ search }: { search: string }) {
  const { books, hasNextPage, loadMore } = useBooks({
    search,
    sort: "RECENT",
  });

  return (
    <div>
      <ul className="titles">
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
      <button
        type="button"
        className="load-more"
        onClick={loadMore}
        disabled={!hasNextPage}
      >
        Load more
      </button>
    </div>
  );
}

describe("useBooks", () => {
  let container: HTMLDivElement;
  let root: Root;
  let cache: ReturnType<typeof createCache>;

  function provider(ui: ReactElement) {
    return (
      <MockedProvider
        mocks={mocks}
        cache={cache}
        mockLinkDefaultOptions={{ delay: 0 }}
      >
        {ui}
      </MockedProvider>
    );
  }

  function render(ui: ReactElement) {
    cache = createCache();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(provider(ui));
    });
  }

  async function flush() {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  function titles(): string[] {
    return Array.from(container.querySelectorAll(".titles li")).map(
      (item) => item.textContent ?? "",
    );
  }

  function loadMoreButton(): HTMLButtonElement {
    return container.querySelector(".load-more") as HTMLButtonElement;
  }

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("loads the first page and appends the next page through loadMore", async () => {
    render(<Harness search="" />);
    await flush();

    expect(titles()).toEqual(["Alpha", "Bravo"]);
    expect(loadMoreButton().disabled).toBe(false);

    await act(async () => {
      loadMoreButton().click();
    });
    await flush();

    expect(titles()).toEqual(["Alpha", "Bravo", "Charlie"]);
    expect(loadMoreButton().disabled).toBe(true);
  });

  it("starts from the first page when the search changes", async () => {
    render(<Harness search="" />);
    await flush();

    await act(async () => {
      loadMoreButton().click();
    });
    await flush();
    expect(titles()).toHaveLength(3);

    act(() => {
      root.render(provider(<Harness search="dune" />));
    });
    await flush();

    expect(titles()).toEqual(["Dune"]);
  });
});
