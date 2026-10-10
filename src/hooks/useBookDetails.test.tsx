import { describe, it, expect, afterEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { useBookDetails } from "./useBookDetails";
import type { BookListing } from "../types/bookListing";

const book: BookListing = {
  id: "1",
  title: "Know No Fear",
  authors: "Dan Abnett",
  thumbnailUrl: "",
  publishedDate: "2019-02-26",
  description: "A Horus Heresy novel.",
  genres: "Science Fiction",
  createdAt: "2026-01-01",
};

function Harness() {
  const { openBook, bookDetailsModal } = useBookDetails();

  return (
    <div>
      <button
        type="button"
        className="open-plain"
        onClick={() => openBook(book)}
      >
        Open plain
      </button>
      <button
        type="button"
        className="open-owned"
        onClick={() =>
          openBook(book, {
            datePurchased: "2026-01-01",
            completed: false,
          })
        }
      >
        Open owned
      </button>
      {bookDetailsModal}
    </div>
  );
}

describe("useBookDetails", () => {
  let container: HTMLDivElement;
  let root: Root;

  function render() {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<Harness />);
    });
  }

  function click(selector: string) {
    const element = container.querySelector(selector);
    expect(element).not.toBeNull();
    act(() => {
      (element as HTMLElement).click();
    });
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

  it("opens the modal with the selected book", () => {
    render();
    expect(container.querySelector(".book-details")).toBeNull();

    click(".open-plain");

    expect(container.querySelector(".book-details")).not.toBeNull();
    expect(container.textContent).toContain("Know No Fear");
    expect(container.textContent).toContain("Dan Abnett");
  });

  it("shows ownership details when the book is owned", () => {
    render();

    click(".open-owned");

    expect(container.textContent).toContain("Purchased");
  });

  it("closes the modal again", () => {
    render();
    click(".open-plain");

    click(".book-details__close");

    expect(container.querySelector(".book-details")).toBeNull();
  });

  it("closes on Escape", () => {
    render();
    click(".open-plain");

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(container.querySelector(".book-details")).toBeNull();
  });
});
