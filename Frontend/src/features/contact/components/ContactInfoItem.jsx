export default function ContactInfoItem({ icon: Icon, title, content, link }) {
  const Wrapper = link ? "a" : "div";
  const props = link
    ? {
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "hover:text-blue-600 transition-colors",
      }
    : {};

  return (
    <div className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100">
      <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <Wrapper {...props}>
          <p className="text-slate-600">{content}</p>
        </Wrapper>
      </div>
    </div>
  );
}
