import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

// Focuses the first focusable element (or one marked [data-autofocus]) when a
// modal opens, keeps Tab/Shift+Tab cycling inside it, and restores focus to
// whatever opened it on close.
export default function useModalFocusTrap(dialogRef, isOpen) {
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    const dialog = dialogRef.current;
    const focusables = () =>
      dialog ? Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)) : [];

    const initial = dialog?.querySelector("[data-autofocus]") || focusables()[0];
    initial?.focus();

    const trap = (e) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [isOpen, dialogRef]);
}
