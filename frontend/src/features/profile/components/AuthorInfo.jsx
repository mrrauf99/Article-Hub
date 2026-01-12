import { User, Mail, BookOpen, Globe, Calendar, FileText, Users, MapPin } from "lucide-react";
import ProfileField from "./ProfileField";
import ProfileRadioField from "./ProfileRadioField";
import CountryDropdown from "@/features/auth/components/CountryDropdown";
import { useProfile } from "../hooks/useProfile";

export default function AuthorInfo() {
  const { formData, isEditing, handleChange } = useProfile();
  const formattedDate = formatDate(formData.joined_at);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
          Author Information
        </h2>
        <p className="text-sm text-gray-600">
          Manage your public author profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <ProfileField
          icon={User}
          label="Username"
          value={formData.username}
          name="username"
          isEditing={isEditing}
          onChange={handleChange}
          disabled={true}
        />

        <ProfileField
          icon={Mail}
          label="Email Address"
          value={formData.email}
          name="email"
          isEditing={isEditing}
          onChange={handleChange}
          disabled={true}
          type="email"
        />

        <ProfileField
          icon={User}
          label="Name"
          value={formData.name}
          name="name"
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          icon={BookOpen}
          label="Expertise/Niche"
          value={formData.expertise}
          name="expertise"
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileRadioField
          icon={Users}
          label="Gender"
          value={formData.gender}
          name="gender"
          isEditing={isEditing}
          onChange={handleChange}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
            { value: "prefer_not_to_say", label: "Prefer not to say" },
          ]}
        />

        <div className="space-y-2">
          {isEditing ? (
            <CountryDropdown
              name="country"
              value={formData.country}
              onChange={handleChange}
              hasError={false}
            />
          ) : (
            <>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Country/Region
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm lg:text-base text-gray-900">
                {formData.country || "Not set"}
              </div>
            </>
          )}
        </div>

        <ProfileField
          icon={Globe}
          label="Website/Portfolio"
          value={formData.portfolio_url}
          name="portfolio_url"
          isEditing={isEditing}
          onChange={handleChange}
          type="url"
        />

        <ProfileField
          icon={Calendar}
          label="Member Since"
          value={formattedDate}
          name="joined_at"
          isEditing={false}
          onChange={handleChange}
          disabled={true}
        />
      </div>

      <ProfileField
        icon={FileText}
        label="Author Bio"
        value={formData.bio}
        name="bio"
        isEditing={isEditing}
        onChange={handleChange}
        rows={5}
      />

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm text-indigo-800">
          <strong>💡 Tip:</strong> A compelling bio helps readers connect with
          your content. Share your expertise, experience, and what drives your
          writing.
        </p>
      </div>
    </div>
  );
}

function formatDate(isoString) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(isoString));
}
