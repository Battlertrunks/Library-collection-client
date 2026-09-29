import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import BookDetails from "./BookDetails";
import type { BookListing } from "../../types/bookListing";

const book: BookListing = {
  id: "1",
  title: "Dropsite Massacre",
  authors: "Graham McNeill",
  thumbnailUrl: "https://example.com/cover.jpg",
  publishedDate: "2024-01-01T12:00:00",
  description: "A tale of the Isstvan V dropsite.",
  genres: "Fiction, Science Fiction",
};

describe("BookDetails", () => {
  describe("rendering", () => {
    it("renders title, author, description and published date", () => {
      const html = renderToString(
        <BookDetails book={book} onClose={vi.fn()} />,
      );
      expect(html).toContain("Dropsite Massacre");
      expect(html).toContain("Graham McNeill");
      expect(html).toContain("A tale of the Isstvan V dropsite.");
      expect(html).toContain("Published Jan 1, 2024");
    });

    it("renders genres as chips", () => {
      const html = renderToString(
        <BookDetails book={book} onClose={vi.fn()} />,
      );
      expect(html).toContain('class="book-details__genre"');
      expect(html).toContain("Fiction");
      expect(html).toContain("Science Fiction");
    });

    it("renders the thumbnail as the cover", () => {
      const html = renderToString(
        <BookDetails book={book} onClose={vi.fn()} />,
      );
      expect(html).toContain("https://example.com/cover.jpg");
      expect(html).toContain("Dropsite Massacre cover");
    });

    it("has the dialog accessibility attributes", () => {
      const html = renderToString(
        <BookDetails book={book} onClose={vi.fn()} />,
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('aria-labelledby="book-details-title"');
      expect(html).toContain('id="book-details-title"');
    });

    it("renders an add action and no owned info for unowned books", () => {
      const html = renderToString(
        <BookDetails book={book} onClose={vi.fn()} />,
      );
      expect(html).toContain(
        'aria-label="Add Dropsite Massacre to Books Owned"',
      );
      expect(html).not.toContain("Completed");
      expect(html).not.toContain("Purchased");
    });

    it("renders purchase date, completed badge and remove action for owned books", () => {
      const html = renderToString(
        <BookDetails
          book={book}
          owned={{ datePurchased: "2025-06-15T12:00:00", completed: true }}
          onClose={vi.fn()}
        />,
      );
      expect(html).toContain("Purchased Jun 15, 2025");
      expect(html).toContain("Completed");
      expect(html).toContain(
        'aria-label="Remove Dropsite Massacre from Books Owned"',
      );
      expect(html).not.toContain("Add Dropsite Massacre");
    });

    it("omits the completed badge when owned but not completed", () => {
      const html = renderToString(
        <BookDetails
          book={book}
          owned={{ datePurchased: "", completed: false }}
          onClose={vi.fn()}
        />,
      );
      expect(html).not.toContain("Completed");
      expect(html).not.toContain("Purchased");
    });

    it("renders the description fallback when missing", () => {
      const html = renderToString(
        <BookDetails book={{ ...book, description: "" }} onClose={vi.fn()} />,
      );
      expect(html).toContain("No description available for this book.");
      expect(html).toContain("book-details__description--empty");
    });

    it("omits the genres row when there are no genres", () => {
      const html = renderToString(
        <BookDetails book={{ ...book, genres: "" }} onClose={vi.fn()} />,
      );
      expect(html).not.toContain("book-details__genre");
    });

    it("uses the default cover when thumbnail is missing", () => {
      const html = renderToString(
        <BookDetails book={{ ...book, thumbnailUrl: "" }} onClose={vi.fn()} />,
      );
      expect(html).toContain("No+Cover");
    });
  });

  describe("interactions", () => {
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

    it("calls onClose when the close button is clicked", () => {
      const onClose = vi.fn();
      render(<BookDetails book={book} onClose={onClose} />);

      const closeBtn = container.querySelector(
        ".book-details__close",
      )! as HTMLElement;
      act(() => {
        closeBtn.click();
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("calls onClose when the backdrop is clicked", () => {
      const onClose = vi.fn();
      render(<BookDetails book={book} onClose={onClose} />);

      const backdrop = container.querySelector(
        ".book-details__backdrop",
      )! as HTMLElement;
      act(() => {
        backdrop.click();
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not call onClose when the dialog content is clicked", () => {
      const onClose = vi.fn();
      render(<BookDetails book={book} onClose={onClose} />);

      const dialog = container.querySelector(".book-details")! as HTMLElement;
      act(() => {
        dialog.click();
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onClose when Escape key is pressed", () => {
      const onClose = vi.fn();
      render(<BookDetails book={book} onClose={onClose} />);

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not call onClose for non-Escape keys", () => {
      const onClose = vi.fn();
      render(<BookDetails book={book} onClose={onClose} />);

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("focuses the close button when opened", () => {
      render(<BookDetails book={book} onClose={vi.fn()} />);

      expect(document.activeElement).toBe(
        container.querySelector(".book-details__close"),
      );
    });

    it("locks body scroll while open and restores it on unmount", () => {
      render(<BookDetails book={book} onClose={vi.fn()} />);
      expect(document.body.style.overflow).toBe("hidden");

      act(() => {
        root.unmount();
      });
      expect(document.body.style.overflow).toBe("");
    });

    it("returns focus to the previously focused element on unmount", () => {
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);
      trigger.focus();

      const localContainer = document.createElement("div");
      document.body.appendChild(localContainer);
      const localRoot = createRoot(localContainer);

      act(() => {
        localRoot.render(<BookDetails book={book} onClose={vi.fn()} />);
      });
      act(() => {
        localRoot.unmount();
      });

      expect(document.activeElement).toBe(trigger);

      localContainer.parentNode?.removeChild(localContainer);
      trigger.remove();
    });
  });

  describe("mobile description truncation", () => {
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

    function setMatchMedia(matches: boolean) {
      window.matchMedia = ((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      })) as unknown as typeof window.matchMedia;
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
      delete (window as { matchMedia?: unknown }).matchMedia;
    });

    const words = Array.from({ length: 47 }, (_, index) => `word${index + 1}`);
    const longDescription = words.join(" ");
    const truncatedDescription = `${words.slice(0, 40).join(" ")}…`;

    it("truncates a long description and toggles between Show more and Show less", () => {
      setMatchMedia(true);
      render(
        <BookDetails
          book={{ ...book, description: longDescription }}
          onClose={vi.fn()}
        />,
      );

      const description = container.querySelector("#book-details-description")!;
      const toggle = container.querySelector(
        ".book-details__description-toggle",
      )! as HTMLButtonElement;

      expect(description.textContent).toBe(truncatedDescription);
      expect(toggle.textContent).toBe("Show more");
      expect(toggle.getAttribute("aria-expanded")).toBe("false");

      act(() => {
        toggle.click();
      });

      expect(description.textContent).toBe(longDescription);
      expect(toggle.textContent).toBe("Show less");
      expect(toggle.getAttribute("aria-expanded")).toBe("true");

      act(() => {
        toggle.click();
      });

      expect(description.textContent).toBe(truncatedDescription);
      expect(toggle.textContent).toBe("Show more");
    });

    it("does not truncate on desktop", () => {
      render(
        <BookDetails
          book={{ ...book, description: longDescription }}
          onClose={vi.fn()}
        />,
      );

      expect(
        container.querySelector("#book-details-description")!.textContent,
      ).toBe(longDescription);
      expect(
        container.querySelector(".book-details__description-toggle"),
      ).toBeNull();
    });

    it("does not render a toggle when the description fits the limit", () => {
      setMatchMedia(true);
      render(<BookDetails book={book} onClose={vi.fn()} />);

      expect(
        container.querySelector(".book-details__description-toggle"),
      ).toBeNull();
    });
  });
});
