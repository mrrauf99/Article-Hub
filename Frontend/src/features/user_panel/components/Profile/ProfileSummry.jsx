import summaryStyles from "../../styles/profileSummary.module.css";

export default function ProfileSummary({ user }) {
  return (
    <>
      <div className={summaryStyles.avatarWrapper}>
        <img
          src={user.avatarUrl}
          alt={user.name}
          className={summaryStyles.avatar}
        />
      </div>
      <h2 className={summaryStyles.name}>{user.name}</h2>
      <p className={summaryStyles.role}>
        {user.role === "admin" ? "Administrator" : "Member"}
      </p>
      <p className={summaryStyles.meta}>
        Joined:{" "}
        {new Date(user.joinedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      {user.location && (
        <p className={summaryStyles.meta}>Location: {user.location}</p>
      )}
      {user.website && (
        <a
          href={user.website}
          target="_blank"
          rel="noreferrer"
          className={summaryStyles.website}
        >
          Visit website
        </a>
      )}
    </>
  );
}
