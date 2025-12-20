import layoutStyles from "../../styles/profileLayout.module.css";

export default function ProfileHeader({ user }) {
  return (
    <header className={layoutStyles.header}>
      <div>
        <h1 className={layoutStyles.title}>Profile</h1>
        <p className={layoutStyles.subtitle}>
          View and update your personal information for Article Hub.
        </p>
      </div>
      <span className={layoutStyles.badge}>
        {user.role === "admin" ? "Admin account" : "User account"}
      </span>
    </header>
  );
}
