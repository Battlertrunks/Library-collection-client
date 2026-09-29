import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import LibraryBookCard from "./LibraryBookCard";
import type { BookListing } from "../../types/bookListing";

const book: BookListing = {
  id: "1",
  title: "Dropsite Massacre",
  authors: "Graham McNeill",
  thumbnailUrl: "",
  publishedDate: "2024-01-01T12:00:00",
  description: "",
  genres: "",
};

describe("LibraryBookCard", () => {
  it("renders title and authors", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain("Dropsite Massacre");
    expect(html).toContain("Graham McNeill");
  });

  it("renders the published date when not owned", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain("Jan 1, 2024");
    expect(html).not.toContain("Purchased");
  });

  it("does not render the completed badge by default", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).not.toContain("Completed");
  });

  it("renders the purchase date and completed badge when owned", () => {
    const html = renderToString(
      <LibraryBookCard
        book={book}
        owned={{ datePurchased: "2025-06-15T12:00:00", completed: true }}
      />,
    );
    expect(html).toContain("Purchased Jun 15, 2025");
    expect(html).toContain("Completed");
  });

  it("omits the completed badge when owned but not completed", () => {
    const html = renderToString(
      <LibraryBookCard
        book={book}
        owned={{ datePurchased: "2025-06-15T12:00:00", completed: false }}
      />,
    );
    expect(html).toContain("Purchased");
    expect(html).not.toContain("Completed");
  });

  it("renders an add button on not-owned cards", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain('aria-label="Add Dropsite Massacre to Books Owned"');
    expect(html).not.toContain("Remove Dropsite Massacre");
  });

  it("renders a discard button on owned cards", () => {
    const html = renderToString(
      <LibraryBookCard
        book={book}
        owned={{ datePurchased: "2025-06-15T12:00:00", completed: false }}
      />,
    );
    expect(html).toContain(
      'aria-label="Remove Dropsite Massacre from Books Owned"',
    );
    expect(html).not.toContain("Add Dropsite Massacre");
  });

  it("renders the title as a dialog trigger", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain("book-card__title-btn");
    expect(html).toContain('aria-haspopup="dialog"');
  });

  it("uses the default cover when thumbnail is missing", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain("No+Cover");
  });

  describe("title interactions", () => {
    let container: HTMLDivElement;
    let root: Root;

    function render(ui: ReactElement) {
      container = document.createElement("div");
      document.body.appendChild(container);
      root = createRoot(container);
      act(() => {
        root.render(ui);
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

    it("calls onOpen when the title is clicked", () => {
      const onOpen = vi.fn();
      render(<LibraryBookCard book={book} onOpen={onOpen} />);

      const titleBtn = container.querySelector(
        ".book-card__title-btn",
      )! as HTMLElement;
      act(() => {
        titleBtn.click();
      });

      expect(onOpen).toHaveBeenCalledOnce();
    });

    it("does not call onOpen when the add button is clicked", () => {
      const onOpen = vi.fn();
      render(<LibraryBookCard book={book} onOpen={onOpen} />);

      const addBtn = container.querySelector(
        ".book-card__action-btn--add",
      )! as HTMLElement;
      act(() => {
        addBtn.click();
      });

      expect(onOpen).not.toHaveBeenCalled();
    });

    it("does not call onOpen when the discard button is clicked", () => {
      const onOpen = vi.fn();
      render(
        <LibraryBookCard
          book={book}
          owned={{ datePurchased: "2025-06-15T12:00:00", completed: false }}
          onOpen={onOpen}
        />,
      );

      const discardBtn = container.querySelector(
        ".book-card__action-btn--discard",
      )! as HTMLElement;
      act(() => {
        discardBtn.click();
      });

      expect(onOpen).not.toHaveBeenCalled();
    });
  });
});
