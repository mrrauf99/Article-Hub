import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export default function PanelFooter() {
  return (
    <footer className="border-t border-hairline px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 text-center text-sm text-ink-muted sm:flex-row sm:justify-between sm:text-left">
        <span>© 2025-{new Date().getFullYear()} Article Hub</span>
        <nav aria-label="Site" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:text-ink transition-colors">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
