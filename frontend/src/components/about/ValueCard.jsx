export default function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="p-6 rounded-xl border border-hairline bg-paper-raised">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
    </div>
  );
}
