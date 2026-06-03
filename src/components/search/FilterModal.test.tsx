import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import FilterModal from "./FilterModal";

describe("FilterModal", () => {
  describe("rendering", () => {
    it("renders the modal even when closed", () => {
      const html = renderToString(
        <FilterModal isOpen={false} onClose={vi.fn()} />,
      );
      expect(html).toContain("filter-modal__backdrop");
      expect(html).toContain("filter-modal");
    });

    it("renders the dialog and title when open", () => {
      const html = renderToString(
        <FilterModal isOpen={true} onClose={vi.fn()} />,
      );
      expect(html).toContain("filter-modal");
      expect(html).toContain("Filters");
    });

    it("renders all four filter fields", () => {
      const html = renderToString(
        <FilterModal isOpen={true} onClose={vi.fn()} />,
      );
      expect(html).toContain("Publish Date");
      expect(html).toContain("Author");
      expect(html).toContain("Genre");
      expect(html).toContain("Publisher");
    });

    it("renders Clear and Apply buttons", () => {
      const html = renderToString(
        <FilterModal isOpen={true} onClose={vi.fn()} />,
      );
      expect(html).toContain("Clear");
      expect(html).toContain("Apply");
    });

    it("renders a close button with aria-label", () => {
      const html = renderToString(
        <FilterModal isOpen={true} onClose={vi.fn()} />,
      );
      expect(html).toContain('aria-label="Close filters"');
    });

    it("renders all inputs with empty initial values", () => {
      const html = renderToString(
        <FilterModal isOpen={true} onClose={vi.fn()} />,
      );
      const valueMatches = html.match(/value=""/g);
      expect(valueMatches).toHaveLength(4);
    });

    it("has the correct accessibility attributes on the dialog", () => {
      const html = renderToString(
        <FilterModal isOpen={true} onClose={vi.fn()} />,
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
    });
  });

  describe("interactions", () => {
    let container: HTMLDivElement;
    let root: Root;

    function render(ui: React.ReactElement) {
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

    it("calls onClose when the backdrop is clicked", () => {
      const onClose = vi.fn();
      render(<FilterModal isOpen={true} onClose={onClose} />);

      const backdrop = container.querySelector(
        ".filter-modal__backdrop",
      )! as HTMLElement;
      act(() => {
        backdrop.click();
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not call onClose when the modal content is clicked", () => {
      const onClose = vi.fn();
      render(<FilterModal isOpen={true} onClose={onClose} />);

      const dialog = container.querySelector(".filter-modal")! as HTMLElement;
      act(() => {
        dialog.click();
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onClose when the close button is clicked", () => {
      const onClose = vi.fn();
      render(<FilterModal isOpen={true} onClose={onClose} />);

      const closeBtn = container.querySelector(
        ".filter-modal__close",
      )! as HTMLElement;
      act(() => {
        closeBtn.click();
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("calls onApply with the current filter values and onClose when Apply is clicked", () => {
      const onClose = vi.fn();
      const onApply = vi.fn();
      render(<FilterModal isOpen={true} onClose={onClose} onApply={onApply} />);

      const applyBtn = container.querySelector(
        ".filter-modal__btn--primary",
      )! as HTMLElement;
      act(() => {
        applyBtn.click();
      });

      expect(onApply).toHaveBeenCalledWith({
        publishDate: "",
        author: "",
        genre: "",
        publisher: "",
      });
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("resets all filters when Clear is clicked", () => {
      const onApply = vi.fn();
      render(<FilterModal isOpen={true} onClose={vi.fn()} onApply={onApply} />);

      const authorInput = container.querySelector(
        "#filter-author",
      ) as HTMLInputElement;
      act(() => {
        authorInput.value = "Test Author";
        authorInput.dispatchEvent(new Event("input", { bubbles: true }));
      });

      const clearBtn = container.querySelector(
        ".filter-modal__btn--secondary",
      )! as HTMLElement;
      act(() => {
        clearBtn.click();
      });

      const applyBtn = container.querySelector(
        ".filter-modal__btn--primary",
      )! as HTMLElement;
      act(() => {
        applyBtn.click();
      });

      expect(onApply).toHaveBeenCalledWith({
        publishDate: "",
        author: "",
        genre: "",
        publisher: "",
      });
    });

    it("calls onClose when Escape key is pressed", () => {
      const onClose = vi.fn();
      render(<FilterModal isOpen={true} onClose={onClose} />);

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not call onClose for non-Escape keys", () => {
      const onClose = vi.fn();
      render(<FilterModal isOpen={true} onClose={onClose} />);

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("does not listen for Escape when modal is closed", () => {
      const onClose = vi.fn();
      render(<FilterModal isOpen={false} onClose={onClose} />);

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("updates input value when typing in a field", () => {
      render(<FilterModal isOpen={true} onClose={vi.fn()} />);

      const input = container.querySelector(
        "#filter-author",
      ) as HTMLInputElement;
      act(() => {
        input.value = "Brandon Sanderson";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      expect(input.value).toBe("Brandon Sanderson");
    });

    it("focuses the first field when opened", () => {
      const onClose = vi.fn();
      const c = document.createElement("div");
      document.body.appendChild(c);
      const r = createRoot(c);

      act(() => {
        r.render(<FilterModal isOpen={false} onClose={onClose} />);
      });
      act(() => {
        r.render(<FilterModal isOpen={true} onClose={onClose} />);
      });

      expect(document.activeElement).toBe(
        c.querySelector("#filter-publish-date"),
      );

      act(() => {
        r.unmount();
      });
      c.parentNode?.removeChild(c);
    });
  });
});
