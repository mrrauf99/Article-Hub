import { useState } from "react";
import formStyles from "../../styles/ProfileForm.module.css";

export default function ProfileForm({ user, onSave, isSaving }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...form });
  };

  const handleReset = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
    });
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <h2 className={formStyles.sectionTitle}>Profile details</h2>

      <div className={formStyles.fieldGroup}>
        <label className={formStyles.label} htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={formStyles.input}
          placeholder="Your full name"
        />
      </div>

      <div className={formStyles.fieldGroup}>
        <label className={formStyles.label} htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={formStyles.input}
          placeholder="you@example.com"
        />
        <p className={formStyles.helper}>
          This email is used for notifications and account recovery.
        </p>
      </div>

      <div className={formStyles.fieldGroup}>
        <label className={formStyles.label} htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          className={formStyles.input}
          placeholder="City, Country"
        />
      </div>

      <div className={formStyles.fieldGroup}>
        <label className={formStyles.label} htmlFor="website">
          Website
        </label>
        <input
          id="website"
          name="website"
          value={form.website}
          onChange={handleChange}
          className={formStyles.input}
          placeholder="https://"
        />
      </div>

      <div className={formStyles.fieldGroup}>
        <label className={formStyles.label} htmlFor="bio">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={form.bio}
          onChange={handleChange}
          className={formStyles.textarea}
          placeholder="Tell others a bit about yourself..."
        />
      </div>

      <div className={formStyles.actions}>
        <button
          type="button"
          className={formStyles.secondaryBtn}
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="submit"
          className={formStyles.primaryBtn}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
