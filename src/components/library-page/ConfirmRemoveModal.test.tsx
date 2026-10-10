import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import ConfirmRemoveModal from "./ConfirmRemoveModal";

describe("ConfirmRemoveModal", () => {
  describe("rendering", () => {
    it("asks for confirmation and names the book", () => {
      const html = renderToString(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      expect(html).toContain("Are you sure?");
      expect(html).toContain("Dune");
      expect(html).toContain("from Books Owned?");
      expect(html).toContain("Books Not Owned");
    });

    it("has the dialog accessibility attributes", () => {
      const html = renderToString(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('aria-labelledby="confirm-remove-modal-title"');
      expect(html).toContain('aria-describedby="confirm-remove-modal-message"');
    });

    it("renders Remove and Cancel buttons", () => {
      const html = renderToString(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      expect(html).toContain("confirm-remove-modal__btn--danger");
      expect(html).toContain("confirm-remove-modal__btn--cancel");
      expect(html).toContain("Remove");
      expect(html).toContain("Cancel");
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

    it("calls onConfirm when Remove is clicked", () => {
      const onConfirm = vi.fn();
      render(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={onConfirm}
          onClose={vi.fn()}
        />,
      );

      const removeBtn = container.querySelector(
        ".confirm-remove-modal__btn--danger",
      )! as HTMLElement;
      act(() => {
        removeBtn.click();
      });

      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it("calls onClose when Cancel is clicked", () => {
      const onClose = vi.fn();
      render(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={onClose}
        />,
      );

      const cancelBtn = container.querySelector(
        ".confirm-remove-modal__btn--cancel",
      )! as HTMLElement;
      act(() => {
        cancelBtn.click();
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("calls onClose when Escape is pressed", () => {
      const onClose = vi.fn();
      render(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={onClose}
        />,
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("calls onClose when the backdrop is clicked", () => {
      const onClose = vi.fn();
      render(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={onClose}
        />,
      );

      const backdrop = container.querySelector(
        ".confirm-remove-modal__backdrop",
      )! as HTMLElement;
      act(() => {
        backdrop.click();
      });

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not call onClose when the sheet content is clicked", () => {
      const onClose = vi.fn();
      render(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={onClose}
        />,
      );

      const sheet = container.querySelector(
        ".confirm-remove-modal",
      )! as HTMLElement;
      act(() => {
        sheet.click();
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("focuses Cancel when it opens", () => {
      render(
        <ConfirmRemoveModal
          bookTitle="Dune"
          onConfirm={vi.fn()}
          onClose={vi.fn()}
        />,
      );

      expect(document.activeElement).toBe(
        container.querySelector(".confirm-remove-modal__btn--cancel"),
      );
    });
  });
});
