import { Save } from "lucide-react";
import { useProfile } from "../hooks/useProfile";

export default function ProfileActions() {
  const { isEditing, isSaving, handleCancel } = useProfile();
  
  if (!isEditing) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4 lg:p-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold
              hover:bg-gray-100 transition text-gray-700
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            disabled={isSaving}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold
              hover:bg-indigo-700 transition shadow-md
              flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              min-w-[160px]"
          >
            {isSaving ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
