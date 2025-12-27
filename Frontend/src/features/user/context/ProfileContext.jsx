import { createContext, useContext } from "react";

const ProfileContext = createContext({
  user: null,
  formData: {},
  isEditing: false,
  isSaving: false,
  handleChange: () => {},
  handleCancel: () => {},
});

export default function ProfileProvider({ value, children }) {
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return ctx;
}
