import { Linkedin, Facebook, Instagram } from "lucide-react";
import SocialLinkField from "./SocialLinkField";
import XIcon from "./XIcon";

import { useProfile } from "../hooks/useProfile";
import {
  SECTION,
  SECTION_BODY,
  SECTION_DESCRIPTION,
  SECTION_TITLE,
} from "../styles/profileClasses";

const LINKS = [
  { name: "x_url", label: "X (Twitter)", icon: XIcon, placeholder: "https://x.com/yourname" },
  { name: "linkedin_url", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/yourname" },
  { name: "facebook_url", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourname" },
  { name: "instagram_url", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourname" },
];

export default function SocialLinks() {
  const { formData, isEditing, handleChange } = useProfile();
  const Group = isEditing ? "div" : "dl";

  return (
    <section className={SECTION} aria-labelledby="social-links-title">
      <div>
        <h2 id="social-links-title" className={SECTION_TITLE}>
          Social links
        </h2>
        <p className={SECTION_DESCRIPTION}>Full profile URLs, starting with https://.</p>
      </div>

      <div className={SECTION_BODY}>
        <Group className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {LINKS.map((link) => (
            <SocialLinkField
              key={link.name}
              icon={link.icon}
              label={link.label}
              name={link.name}
              value={formData[link.name]}
              isEditing={isEditing}
              onChange={handleChange}
              placeholder={link.placeholder}
            />
          ))}
        </Group>
      </div>
    </section>
  );
}
