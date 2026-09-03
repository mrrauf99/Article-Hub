import { ARTICLE_STATUS } from "../constants/articleStatus";

export default function StatusPill({ status, className = "" }) {
  const meta = ARTICLE_STATUS[status];
  if (!meta) return null;
  const { Icon, label, pill } = meta;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${pill} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
