import { useState } from "react";
import layoutStyles from "../../styles/profileLayout.module.css";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import ProfileSummary from "../components/profile/ProfileSummry.jsx";
import ProfileForm from "../components/profile/ProfileForm.jsx";

const mockUser = {
  name: "Tayyab",
  role: "user",
  email: "tayyab@example.com",
  avatarUrl:
    "https://ui-avatars.com/api/?name=Tayyab&background=0f172a&color=f9fafb",
  bio: "Frontend developer and content creator at Article Hub.",
  location: "Gujranwala, Pakistan",
  website: "https://example.com",
  joinedAt: "2024-01-15",
};

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (updated) => {
    setIsSaving(true);
    // here you would call your real API
    setTimeout(() => {
      setUser(updated);
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className={layoutStyles.profileRoot}>
        <ProfileHeader user={user} />

        <div className={layoutStyles.profileGrid}>
          <div className={layoutStyles.card}>
            <ProfileSummary user={user} />
          </div>

          <div className={layoutStyles.card}>
            <ProfileForm user={user} onSave={handleSave} isSaving={isSaving} />
          </div>
        </div>
      </div>
    </div>
  );
}
