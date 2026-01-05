import { ProfileContext } from "./ProfileContextData";

export default function ProfileProvider({ value, children }) {
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
