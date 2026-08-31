export default function FounderCard({ founder }) {
  return (
    <div className="rounded-xl border border-hairline bg-paper-raised p-6 sm:p-7 flex flex-col sm:flex-row gap-6">
      <img
        src={founder.avatar}
        alt={founder.name}
        className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full object-cover border border-hairline"
      />

      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-editorial text-xl text-ink">{founder.name}</h3>
          {founder.featured && (
            <span className="text-xs font-semibold uppercase tracking-wide text-moss-700">
              Founder
            </span>
          )}
        </div>
        <p className="text-sm text-ink-muted mt-0.5">{founder.role}</p>

        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          {founder.bio}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {founder.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-paper text-ink-muted border border-hairline"
            >
              {tag}
            </span>
          ))}
        </div>

        {founder.socials && founder.socials.length > 0 && (
          <div className="flex items-center gap-2 mt-5 pt-5 border-t border-hairline">
            {founder.socials.map((social) => {
              const Icon = social.icon;
              const hasUrl = social.url && social.url.trim() !== "";

              return hasUrl ? (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-hairline text-ink-muted hover:border-moss-500 hover:text-moss-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ) : (
                <span
                  key={social.name}
                  aria-hidden="true"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-hairline text-hairline-strong cursor-not-allowed"
                >
                  <Icon className="w-4 h-4" />
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
