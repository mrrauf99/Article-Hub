import ProfileField from "./ProfileField";
import ProfileRadioField from "./ProfileRadioField";
import CountryDropdown from "@/features/auth/components/CountryDropdown";
import { useProfile } from "../hooks/useProfile";
import {
  EMPTY_VALUE,
  READ_LABEL,
  READ_VALUE,
  SECTION,
  SECTION_BODY,
  SECTION_DESCRIPTION,
  SECTION_TITLE,
} from "../styles/profileClasses";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function AuthorInfo() {
  const { formData, isEditing, handleChange, canEdit } = useProfile();
  const Group = isEditing ? "div" : "dl";

  return (
    <section className={SECTION} aria-labelledby="author-info-title">
      <div>
        <h2 id="author-info-title" className={SECTION_TITLE}>
          Author details
        </h2>
        <p className={SECTION_DESCRIPTION}>
          {canEdit
            ? "Who you are as a writer. Your username and email can't be changed here."
            : "Details this writer has added to their profile."}
        </p>
      </div>

      <div className={SECTION_BODY}>
        <Group className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <ProfileField
            label="Name"
            value={formData.name}
            name="name"
            isEditing={isEditing}
            onChange={handleChange}
          />
          <ProfileField
            label="Expertise"
            value={formData.expertise}
            name="expertise"
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="e.g. Web development"
          />

          <ProfileRadioField
            className="sm:col-span-2"
            label="Gender"
            value={formData.gender}
            name="gender"
            isEditing={isEditing}
            onChange={handleChange}
            options={GENDER_OPTIONS}
          />

          {isEditing ? (
            <div className="min-w-0">
              <CountryDropdown
                name="country"
                value={formData.country}
                onChange={handleChange}
                hasError={false}
              />
            </div>
          ) : (
            <div className="min-w-0">
              <dt className={READ_LABEL}>Country or region</dt>
              <dd className={READ_VALUE}>
                {formData.country || <span className={EMPTY_VALUE}>Not added</span>}
              </dd>
            </div>
          )}

          <ProfileField
            label="Website or portfolio"
            value={formData.portfolio_url}
            name="portfolio_url"
            isEditing={isEditing}
            onChange={handleChange}
            type="url"
            placeholder="https://"
          />

          <ProfileField
            className="sm:col-span-2"
            label="Bio"
            value={formData.bio}
            name="bio"
            isEditing={isEditing}
            onChange={handleChange}
            rows={5}
            placeholder="Your background, what you write about, and why."
          />
        </Group>
      </div>
    </section>
  );
}
