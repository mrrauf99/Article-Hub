export default function OfferCard({ icon, title, text }) {
  return (
    <div className="p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
          {icon}
        </span>
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{text}</p>
    </div>
  );
}
