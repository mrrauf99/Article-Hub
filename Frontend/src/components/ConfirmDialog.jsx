import { useEffect } from "react";
import styles from "./styles/confirm-dialog.module.css";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
