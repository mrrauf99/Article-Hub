import { Linkedin, Facebook, Instagram } from "lucide-react";
import SocialLinkField from "./SocialLinkField";
import XIcon from "./XIcon";

import { useProfile } from "../hooks/useProfile";
import { SECTION_DESCRIPTION } from "../styles/profileClasses";

export default function SocialLinks() {
  const { formData, isEditing, handleChange } = useProfile();
  return (
    <div className="p-4 lg:p-6 pt-0 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Social Links</h3>
        <p className={SECTION_DESCRIPTION}>
          Connect your social media profiles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <SocialLinkField
          icon={XIcon}
          label="Twitter"
          value={formData.x_url}
          name="x_url"
          isEditing={isEditing}
          onChange={handleChange}
          placeholder="https://x.com/yourusername"
        />

        <SocialLinkField
          icon={Linkedin}
          label="LinkedIn"
          value={formData.linkedin_url}
          name="linkedin_url"
          isEditing={isEditing}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourusername"
        />

        <SocialLinkField
          icon={Facebook}
          label="Facebook"
          value={formData.facebook_url}
          name="facebook_url"
          isEditing={isEditing}
          onChange={handleChange}
          placeholder="https://facebook.com/yourusername"
        />

        <SocialLinkField
          icon={Instagram}
          label="Instagram"
          value={formData.instagram_url}
          name="instagram_url"
          isEditing={isEditing}
          onChange={handleChange}
          placeholder="https://instagram.com/yourusername"
        />
      </div>
    </div>
  );
}
