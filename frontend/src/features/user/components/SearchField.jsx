import { Search } from "lucide-react";

// Search input for the User Panel. The icon is positioned against the input's
// own box (not a padded wrapper) so it always sits on the text's centre line.
export default function SearchField({ id, label, className = "", ...inputProps }) {
  return (
    <div className={`group relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-ink-faint transition-colors duration-150 group-focus-within:text-moss-700">
        <Search className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <input
        id={id}
        type="search"
        autoComplete="off"
        spellCheck={false}
        className="h-10 w-full rounded-lg border border-hairline-strong bg-paper-raised pl-10 pr-3 text-sm leading-none text-ink shadow-[0_1px_2px_rgba(20,20,15,0.04)] caret-moss-700 transition-[border-color,box-shadow] duration-150 placeholder:text-ink-faint hover:border-ink-faint focus:border-moss-600 focus:outline-none focus:ring-2 focus:ring-moss-600/15"
        {...inputProps}
      />
    </div>
  );
}
