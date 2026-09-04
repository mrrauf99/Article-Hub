import { Loader2 } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { BTN_GHOST, BTN_PRIMARY } from "@/styles/panelClasses";

export default function ProfileActions() {
  const { isEditing, isSaving, handleCancel } = useProfile();

  if (!isEditing) return null;

  return (
    <div className="sticky bottom-0 z-10 border-t border-hairline bg-paper-raised px-5 py-4 shadow-[0_-8px_16px_-12px_rgba(20,20,15,0.18)] animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none sm:px-8">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">Changes apply once you save.</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button type="button" onClick={handleCancel} disabled={isSaving} className={BTN_GHOST}>
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className={`${BTN_PRIMARY} sm:min-w-[9rem]`}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
