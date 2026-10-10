import { describe, it, expect, afterEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import useBookOfTheDay from "./useBookOfTheDay";
import { createCache } from "./client";
import { GET_BOOK_OF_THE_DAY } from "./queries";

const bookMock = {
  request: { query: GET_BOOK_OF_THE_DAY },
  result: {
    data: {
      book_of_the_day: {
        __typename: "BooksCollected",
        id: "1",
        title: "Know No Fear",
        authors: "Dan Abnett",
        thumbnail_url: "https://covers.example/know-no-fear.jpg",
        published_date: "2019-02-26",
      },
    },
  },
};

const emptyMock = {
  request: { query: GET_BOOK_OF_THE_DAY },
  result: { data: { book_of_the_day: null } },
};

function Harness() {
  const { book, loading, error } = useBookOfTheDay();

  return (
    <div>
      <span className="state">
        {loading ? "loading" : error ? "error" : "ready"}
      </span>
      <span className="title">{book?.title ?? "none"}</span>
      <span className="author">{book?.authors ?? "none"}</span>
      <span className="published">{book?.publishedDate ?? "none"}</span>
      <span className="thumbnail">{book?.thumbnailUrl ?? "none"}</span>
    </div>
  );
}

describe("useBookOfTheDay", () => {
  let container: HTMLDivElement;
  let root: Root;
  let cache: ReturnType<typeof createCache>;

  function render(
    ui: ReactElement,
    mocks: (typeof bookMock)[] | (typeof emptyMock)[],
  ) {
    cache = createCache();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(
        <MockedProvider
          mocks={mocks}
          cache={cache}
          mockLinkDefaultOptions={{ delay: 0 }}
        >
          {ui}
        </MockedProvider>,
      );
    });
  }

  async function flush() {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  function text(selector: string): string {
    return container.querySelector(selector)?.textContent ?? "";
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

  it("loads and maps the featured book", async () => {
    render(<Harness />, [bookMock]);
    await flush();

    expect(text(".state")).toBe("ready");
    expect(text(".title")).toBe("Know No Fear");
    expect(text(".author")).toBe("Dan Abnett");
    expect(text(".published")).toBe("2019-02-26");
    expect(text(".thumbnail")).toBe("https://covers.example/know-no-fear.jpg");
  });

  it("returns a null book when nothing is in progress", async () => {
    render(<Harness />, [emptyMock]);
    await flush();

    expect(text(".state")).toBe("ready");
    expect(text(".title")).toBe("none");
  });
});
