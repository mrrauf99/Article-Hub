import { Link } from "react-router-dom";

import MemberAvatar from "./MemberAvatar";
import { LINK } from "@/styles/panelClasses";
import { formatAge } from "../utils/format";

export default function NewestMembers({ users }) {
  return (
    <section aria-labelledby="members-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="members-heading" className="text-sm font-semibold text-ink">
          Newest members
        </h2>
        <Link to="/admin/users" className={`${LINK} text-sm`}>
          All members
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">No members yet.</p>
      ) : (
        <ul className="mt-2">
          {users.map((user) => (
            <li key={user.id}>
              <Link
                to={`/admin/users/${user.id}`}
                className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-ink/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
              >
                <MemberAvatar name={user.name || user.username} src={user.avatar_url} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">
                    {user.name || user.username}
                  </span>
                  <span className="block truncate text-xs text-ink-muted">
                    Joined {formatAge(user.joined_at)}
                    {user.role === "admin" && " · Administrator"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
