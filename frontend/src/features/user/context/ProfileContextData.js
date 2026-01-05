import { createContext } from "react";

export const ProfileContext = createContext({
  user: null,
  formData: {},
  isEditing: false,
  isSaving: false,
  handleChange: () => {},
  handleCancel: () => {},
});

