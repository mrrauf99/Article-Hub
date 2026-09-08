import { Link } from "react-router-dom";

import formatCount from "@/utils/formatCount";

const toInt = (value) => Number.parseInt(value, 10) || 0;

const ROW = "flex items-center justify-between py-2.5 text-sm";

function Row({ label, value, to, swatch }) {
  const content = (
    <>
      <span className="flex items-center gap-2 text-ink-muted">
        {swatch && <span className={`h-2 w-2 rounded-full ${swatch}`} aria-hidden="true" />}
        {label}
      </span>
      <span className="font-medium tabular-nums text-ink">{value}</span>
    </>
  );

  return (
    <li className="border-b border-hairline last:border-b-0">
      {to ? (
        <Link
          to={to}
          className={`${ROW} -mx-2 rounded-md px-2 transition-colors hover:bg-ink/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600`}
        >
          {content}
        </Link>
      ) : (
        <div className={ROW}>{content}</div>
      )}
    </li>
  );
}

export default function PlatformLedger({ stats }) {
  const published = toInt(stats.approved_articles);
  const pending = toInt(stats.pending_articles);
  const rejected = toInt(stats.rejected_articles);
  const total = toInt(stats.total_articles) || published + pending + rejected;

  const segments = [
    { key: "published", value: published, className: "bg-moss-600" },
    { key: "pending", value: pending, className: "bg-amber-500" },
    { key: "rejected", value: rejected, className: "bg-red-600" },
  ].filter((s) => s.value > 0);

  return (
    <section aria-labelledby="platform-heading">
      <h2 id="platform-heading" className="text-sm font-semibold text-ink">
        Platform
      </h2>

      <p className="mt-3 text-sm text-ink-muted">
        <span className="font-editorial text-2xl tabular-nums text-ink">{formatCount(total)}</span>{" "}
        articles
      </p>

      {total > 0 && (
        <div className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
          {segments.map((s) => (
            <span
              key={s.key}
              className={`${s.className} min-w-[4px]`}
              style={{ flexGrow: s.value }}
            />
          ))}
        </div>
      )}

      <ul className="mt-3" aria-label="Articles by status">
        <Row label="Published" value={formatCount(published)} to="/admin/articles?status=approved" swatch="bg-moss-600" />
        <Row label="In review" value={formatCount(pending)} to="/admin/articles?status=pending" swatch="bg-amber-500" />
        <Row label="Rejected" value={formatCount(rejected)} to="/admin/articles?status=rejected" swatch="bg-red-600" />
      </ul>

      <ul className="mt-5 border-t border-hairline" aria-label="Members and reads">
        <Row label="Writers" value={formatCount(toInt(stats.total_users))} to="/admin/users?role=user" />
        <Row label="Administrators" value={formatCount(toInt(stats.total_admins))} to="/admin/users?role=admin" />
        <Row label="Reads, all time" value={formatCount(toInt(stats.total_views))} />
      </ul>
    </section>
  );
}
