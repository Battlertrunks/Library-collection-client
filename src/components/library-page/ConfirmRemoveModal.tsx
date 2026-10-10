import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import "./ConfirmRemoveModal.css";

type ConfirmRemoveModalProps = {
  bookTitle: string;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Mobile confirmation sheet shown before removing a Collected Book from
 * Books Owned.
 */
function ConfirmRemoveModal({
  bookTitle,
  onConfirm,
  onClose,
}: ConfirmRemoveModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, []);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="confirm-remove-modal__backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="confirm-remove-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-remove-modal-title"
        aria-describedby="confirm-remove-modal-message"
      >
        <h3
          id="confirm-remove-modal-title"
          className="confirm-remove-modal__title"
        >
          Are you sure?
        </h3>
        <p
          id="confirm-remove-modal-message"
          className="confirm-remove-modal__message"
        >
          Remove <span className="confirm-remove-modal__book">{bookTitle}</span>{" "}
          from Books Owned? It will move back to Books Not Owned.
        </p>

        <div className="confirm-remove-modal__actions">
          <button
            type="button"
            onClick={onConfirm}
            className="confirm-remove-modal__btn confirm-remove-modal__btn--danger"
          >
            Remove
          </button>
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="confirm-remove-modal__btn confirm-remove-modal__btn--cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRemoveModal;
