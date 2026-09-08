import { useId, useState } from "react";

import AdminDialog from "./AdminDialog";
import MemberAvatar from "./MemberAvatar";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/styles/panelClasses";

export const ROLE_LABEL = { user: "Writer", admin: "Administrator" };

// Role lives in the sign-in token (up to 7 days), so changes apply on next sign-in.
const CONSEQUENCE = {
  admin:
    "They'll be able to approve, reject and delete any article, and change or delete any member, including you. Access starts the next time they sign in.",
  user: "They stay signed in with administrator access until they log out or their sign-in expires, up to 7 days.",
};

const ROLES = [
  { value: "user", description: "Writes articles and submits them for review." },
  {
    value: "admin",
    description: "Reviews articles and manages members, including other administrators.",
  },
];

export default function RoleDialog({ member, busy, error, onSave, onClose }) {
  const [role, setRole] = useState(member.role);
  const name = member.name || member.username;
  const groupId = useId();

  const footer = (
    <>
      <button type="button" onClick={onClose} disabled={busy} className={BTN_SECONDARY}>
        Cancel
      </button>
      <button
        type="button"
        onClick={() => onSave(role)}
        disabled={busy || role === member.role}
        className={BTN_PRIMARY}
      >
        {busy ? "Saving" : role === member.role ? "No change" : `Make ${ROLE_LABEL[role].toLowerCase()}`}
      </button>
    </>
  );

  return (
    <AdminDialog title="Change role" onClose={onClose} busy={busy} footer={footer}>
      <div className="flex items-center gap-3">
        <MemberAvatar name={name} src={member.avatar_url} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{name}</p>
          <p className="truncate text-sm text-ink-muted">{member.email}</p>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend id={groupId} className="text-sm font-medium text-ink">
          Role
        </legend>
        <div className="mt-2 space-y-2">
          {ROLES.map((option) => {
            const checked = role === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-moss-600 ${
                  checked ? "border-moss-600 bg-moss-50" : "border-hairline-strong hover:border-ink-faint"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={checked}
                  onChange={() => setRole(option.value)}
                  disabled={busy}
                  className="mt-1 h-4 w-4 accent-moss-700 focus-visible:outline-none"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {ROLE_LABEL[option.value]}
                    {member.role === option.value && (
                      <span className="ml-2 font-normal text-ink-muted">Current</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{option.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {role !== member.role && (
        <p className="mt-4 rounded-lg bg-review-amber-bg px-3 py-2.5 text-sm leading-relaxed text-review-amber-text">
          {CONSEQUENCE[role]}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-rejected-red-text">
          {error}
        </p>
      )}
    </AdminDialog>
  );
}
