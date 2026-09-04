import { control, FIELD_LABEL } from "@/styles/panelClasses";

export const SECTION =
  "border-t border-hairline px-5 py-8 first:border-t-0 sm:px-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10";
export const SECTION_TITLE = "text-base font-semibold text-ink";
export const SECTION_DESCRIPTION = "mt-1 text-sm leading-relaxed text-ink-muted";
export const SECTION_BODY = "mt-6 min-w-0 lg:mt-0";

export const FIELD_GROUP = "min-w-0";
export { FIELD_LABEL };
export const READ_LABEL = "text-sm text-ink-muted";
export const READ_VALUE = "mt-1 break-words text-[0.9375rem] text-ink";
export const EMPTY_VALUE = "text-ink-faint";
export const FIELD_INPUT = `${control(false)} mt-2 px-4 py-2.5 text-[0.9375rem]`;
