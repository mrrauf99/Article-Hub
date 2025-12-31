import { useRef } from "react";
import { Mail, Award, Edit2, Pencil } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";

export default function ProfileHeader({ user, isEditing, onEdit }) {
  const { formData, handleChange } = useProfile();
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      handleChange({ target: { name: "avatarPreview", value: previewUrl } });
      handleChange({ target: { name: "avatarFile", value: file } });
    }
  };

  // Use preview if available, otherwise use current avatar
  const displayAvatar = formData.avatarPreview || user.avatar;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
        <div className="flex items-center gap-4 lg:gap-6 w-full lg:w-auto">
          <div className="relative flex-shrink-0 group">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={user.username}
                className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover shadow-lg border-4 border-white ${
                  isEditing ? "cursor-pointer" : ""
                }`}
                onClick={handleAvatarClick}
              />
            ) : (
              <div
                className={`w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-2xl lg:text-3xl font-bold shadow-lg ${
                  isEditing ? "cursor-pointer" : ""
                }`}
                onClick={handleAvatarClick}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Edit pencil icon - only shows in edit mode */}
            {isEditing && (
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer border-3 border-white shadow-md hover:bg-indigo-600 transition-colors"
                onClick={handleAvatarClick}
              >
                <Pencil className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold mb-1 truncate">
              {user.username}
            </h1>
            <p className="text-blue-100 flex items-center gap-2 mb-2 text-sm lg:text-base truncate">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
            <div className="flex items-center gap-2 text-blue-200">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs lg:text-sm">
                {user.badge || "Contributing Writer"}
              </span>
            </div>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="w-full sm:w-auto bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-semibold
          hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </div>
  );
}
