export default function ContactInfoItem({ icon: Icon, title, content, link }) {
  const Wrapper = link ? "a" : "div";
  const props = link
    ? {
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "hover:text-moss-700 transition-colors",
      }
    : {};

  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <h3 className="font-semibold text-ink mb-1">{title}</h3>
        <Wrapper {...props}>
          <p className="text-ink-muted text-sm">{content}</p>
        </Wrapper>
      </div>
    </div>
  );
}
