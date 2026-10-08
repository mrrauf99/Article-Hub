import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import MemberAvatar from "./MemberAvatar";
import { ICON_BTN } from "@/styles/panelClasses";
import { formatDate, plural } from "../utils/format";

// Breakpoint matches the sidebar's lg switch; the Articles count track is
// trimmed so the flexible name column stays readable down to a 1024px viewport.
const COLUMNS =
  "lg:grid lg:grid-cols-[minmax(0,1fr)_3rem_6.5rem_10.5rem] lg:items-center lg:gap-4";

function RosterRow({ member, onAction }) {
  const name = member.name || member.username;
  const count = Number(member.article_count) || 0;

  const actions = (
    <div className="-ml-3 flex items-center gap-2 lg:ml-0 lg:justify-end">
      <button
        type="button"
        onClick={() => onAction("delete", member)}
        className={`${ICON_BTN} hover:bg-rejected-red-bg hover:text-rejected-red-text`}
        aria-label={`Delete ${name}`}
        title="Delete writer"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <li className={`py-3.5 ${COLUMNS}`}>
      <div className="flex min-w-0 items-center gap-3">
        <MemberAvatar name={name} src={member.avatar_url} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm">
            <Link
              to={`/admin/users/${member.id}`}
              className="truncate rounded-sm font-semibold text-ink underline-offset-4 hover:text-moss-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
            >
              {name}
            </Link>
          </p>
          <p className="truncate text-sm text-ink-muted">{member.email}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pl-[3.25rem] lg:hidden">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
          <span className="tabular-nums">{plural(count, "article")}</span>
          <time dateTime={member.joined_at}>Joined {formatDate(member.joined_at)}</time>
        </div>
        {actions}
      </div>

      <div className="hidden text-center text-sm tabular-nums text-ink lg:block">
        <span className="sr-only">{plural(count, "article")}</span>
        <span aria-hidden="true">{count}</span>
      </div>
      <time dateTime={member.joined_at} className="hidden text-sm tabular-nums text-ink-muted lg:block">
        <span className="sr-only">Joined {formatDate(member.joined_at)}</span>
        <span aria-hidden="true">{formatDate(member.joined_at)}</span>
      </time>
      <div className="hidden lg:block lg:text-right">{actions}</div>
    </li>
  );
}

export default function MemberRoster({ members, onAction }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`hidden border-b border-hairline pb-2.5 text-xs font-medium text-ink-muted ${COLUMNS}`}
      >
        <span>Writer</span>
        <span className="text-center">Articles</span>
        <span>Joined</span>
        <span className="text-right">Actions</span>
      </div>
      <ul className="divide-y divide-hairline border-b border-hairline">
        {members.map((member) => (
          <RosterRow
            key={member.id}
            member={member}
            onAction={onAction}
          />
        ))}
      </ul>
    </>
  );
}
