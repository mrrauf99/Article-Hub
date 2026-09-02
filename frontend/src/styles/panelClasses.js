// Ink & Moss control vocabulary for the signed-in panels (User Panel, plus the
// profile and article-detail pages shared with Admin). Pills for actions,
// 8px inputs, 12px containers.

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

const BTN_BASE = `inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${FOCUS}`;

export const BTN_PRIMARY = `${BTN_BASE} h-10 px-5 bg-ink text-paper hover:bg-moss-700`;

export const BTN_SECONDARY = `${BTN_BASE} h-10 px-5 border border-hairline-strong bg-paper-raised text-ink hover:border-ink-faint`;

export const BTN_DANGER = `${BTN_BASE} h-10 px-5 bg-danger text-paper-raised hover:bg-danger-deep`;

export const BTN_GHOST = `${BTN_BASE} h-10 px-3 text-ink-muted hover:bg-ink/5 hover:text-ink`;

export const ICON_BTN = `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-ink/5 hover:text-ink ${FOCUS}`;

export const FIELD_LABEL = "block text-sm font-medium text-ink";

export const FIELD_HINT = "text-sm text-ink-muted";

export const FIELD_ERROR = "text-sm text-red-700";

const CONTROL_BASE =
  "w-full rounded-lg border bg-paper-raised text-ink placeholder:text-ink-faint caret-moss-700 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-paper";

export const control = (hasError) =>
  `${CONTROL_BASE} ${
    hasError
      ? "border-red-400 focus:border-red-600 focus:ring-red-600/15"
      : "border-hairline-strong hover:border-ink-faint focus:border-moss-600 focus:ring-moss-600/15"
  }`;

export const LINK = `rounded-sm font-medium text-moss-700 underline-offset-4 hover:underline ${FOCUS}`;

// Reading typography for article bodies; the editor preview uses the same
// classes so writers see what readers will.
export const ARTICLE_PROSE = `prose prose-neutral max-w-[65ch]
  prose-headings:font-editorial prose-headings:font-medium prose-headings:text-ink
  prose-p:leading-relaxed prose-p:text-ink-muted prose-li:text-ink-muted
  prose-a:text-moss-700 prose-a:no-underline hover:prose-a:underline
  prose-strong:text-ink prose-blockquote:border-moss-300 prose-blockquote:text-ink-muted
  prose-code:text-ink prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
  prose-code:rounded prose-code:bg-ink/[0.06] prose-code:px-1.5 prose-code:py-0.5
  prose-pre:border prose-pre:border-hairline prose-pre:bg-paper prose-pre:text-ink
  [&_pre_code]:bg-transparent [&_pre_code]:p-0
  prose-img:rounded-lg`;

export { FOCUS };
