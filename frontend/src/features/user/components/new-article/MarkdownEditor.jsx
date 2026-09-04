import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  SquareCode,
} from "lucide-react";

import { ARTICLE_PROSE, FOCUS } from "@/styles/panelClasses";
import FieldShell, { describedBy } from "./FieldShell";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? "⌘" : "Ctrl";

const LIST_LINE = /^(\s*)([-*]|(\d+)\.)\s(.*)$/;

// Replace the textarea's current selection. execCommand keeps the browser's
// native undo stack and fires a real input event; the fallback updates the
// value through onChange when execCommand is unavailable.
function replaceSelection(textarea, text, selectStart, selectEnd, fallback) {
  textarea.focus();
  const inserted = document.execCommand?.("insertText", false, text);
  if (!inserted) {
    const { selectionStart: start, selectionEnd: end, value } = textarea;
    fallback(value.slice(0, start) + text + value.slice(end));
  }
  requestAnimationFrame(() => textarea.setSelectionRange(selectStart, selectEnd));
}

function lineBounds(value, start, end) {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  return [lineStart, nextBreak === -1 ? value.length : nextBreak];
}

export default function MarkdownEditor({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
  rows = 16,
  maxLength,
  charCount,
}) {
  const textareaRef = useRef(null);
  const [mode, setMode] = useState("write");

  const emit = (next) => onChange({ target: { name, value: next } });

  const wrapInline = (marker, placeholderText) => {
    const ta = textareaRef.current;
    const { selectionStart: start, selectionEnd: end, value: text } = ta;
    const selected = text.slice(start, end);
    const m = marker.length;

    if (text.slice(start - m, start) === marker && text.slice(end, end + m) === marker) {
      ta.setSelectionRange(start - m, end + m);
      replaceSelection(ta, selected, start - m, end - m, emit);
      return;
    }

    const inner = selected || placeholderText;
    const selStart = start + m;
    replaceSelection(ta, `${marker}${inner}${marker}`, selStart, selStart + inner.length, emit);
  };

  // `matcher` strips any existing prefix; `active` decides whether the format is
  // already applied (so it toggles off instead of being re-added).
  const prefixLines = (getPrefix, matcher, active = matcher) => {
    const ta = textareaRef.current;
    const { selectionStart: start, selectionEnd: end, value: text } = ta;
    const [from, to] = lineBounds(text, start, end);
    const lines = text.slice(from, to).split("\n");
    const allPrefixed = lines.every((line) => active.test(line));

    const next = lines
      .map((line, i) => {
        const stripped = line.replace(matcher, "");
        return allPrefixed ? stripped : `${getPrefix(i)}${stripped}`;
      })
      .join("\n");

    ta.setSelectionRange(from, to);
    // With no selection, leave the caret where the writer keeps typing.
    const caret = from + next.length;
    replaceSelection(ta, next, start === end ? caret : from, caret, emit);
  };

  const insertLink = () => {
    const ta = textareaRef.current;
    const { selectionStart: start, selectionEnd: end, value: text } = ta;
    const label = text.slice(start, end) || "link text";
    const url = "https://";
    const snippet = `[${label}](${url})`;
    const urlStart = start + label.length + 3;
    replaceSelection(ta, snippet, urlStart, urlStart + url.length, emit);
  };

  const codeBlock = () => {
    const ta = textareaRef.current;
    const { selectionStart: start, selectionEnd: end, value: text } = ta;
    const selected = text.slice(start, end) || "code";
    const before = start > 0 && text[start - 1] !== "\n" ? "\n" : "";
    const snippet = `${before}\`\`\`\n${selected}\n\`\`\`\n`;
    const selStart = start + before.length + 4;
    replaceSelection(ta, snippet, selStart, selStart + selected.length, emit);
  };

  // Headings replace any existing level rather than stacking "## ###".
  const heading = /^#{1,6}\s/;
  const actions = [
    { key: "h2", label: "Heading", Icon: Heading2, run: () => prefixLines(() => "## ", heading, /^##\s/) },
    { key: "h3", label: "Subheading", Icon: Heading3, run: () => prefixLines(() => "### ", heading, /^###\s/) },
    { key: "bold", label: `Bold (${MOD}+B)`, Icon: Bold, run: () => wrapInline("**", "bold text") },
    { key: "italic", label: `Italic (${MOD}+I)`, Icon: Italic, run: () => wrapInline("*", "italic text") },
    { key: "link", label: `Link (${MOD}+K)`, Icon: Link2, run: insertLink, divider: true },
    { key: "ul", label: "Bulleted list", Icon: List, run: () => prefixLines(() => "- ", /^[-*]\s/) },
    { key: "ol", label: "Numbered list", Icon: ListOrdered, run: () => prefixLines((i) => `${i + 1}. `, /^\d+\.\s/) },
    { key: "quote", label: "Quote", Icon: Quote, run: () => prefixLines(() => "> ", /^>\s?/), divider: true },
    { key: "code", label: "Inline code", Icon: Code, run: () => wrapInline("`", "code") },
    { key: "codeblock", label: "Code block", Icon: SquareCode, run: codeBlock },
  ];

  const handleKeyDown = (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && !e.shiftKey && !e.altKey) {
      const shortcut = { b: "bold", i: "italic", k: "link" }[e.key.toLowerCase()];
      if (shortcut) {
        e.preventDefault();
        actions.find((a) => a.key === shortcut).run();
        return;
      }
    }

    if (e.key === "Enter" && !mod && !e.shiftKey && !e.nativeEvent.isComposing) {
      const ta = e.currentTarget;
      const { selectionStart: start, selectionEnd: end, value: text } = ta;
      if (start !== end) return;
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const match = text.slice(lineStart, start).match(LIST_LINE);
      if (!match) return;

      e.preventDefault();
      const [, indent, bullet, number, content] = match;
      if (!content.trim()) {
        // Enter on an empty item ends the list.
        ta.setSelectionRange(lineStart, start);
        replaceSelection(ta, "", lineStart, lineStart, emit);
        return;
      }
      const nextMarker = number ? `${Number(number) + 1}.` : bullet;
      const insert = `\n${indent}${nextMarker} `;
      replaceSelection(ta, insert, start + insert.length, start + insert.length, emit);
    }
  };

  const toolButton = `${FOCUS} flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 hover:bg-ink/[0.06] hover:text-ink disabled:pointer-events-none disabled:opacity-40`;
  const tabButton = (active) =>
    `${FOCUS} h-8 rounded-md px-3 text-sm font-medium transition-colors duration-150 ${
      active ? "bg-paper-raised text-ink shadow-[0_1px_2px_rgba(20,20,15,0.08)]" : "text-ink-muted hover:text-ink"
    }`;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      charCount={charCount}
      maxLength={maxLength}
    >
      <div
        className={`overflow-hidden rounded-lg border bg-paper-raised transition-[border-color,box-shadow] duration-150 ${
          error
            ? "border-red-400 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/15"
            : "border-hairline-strong hover:border-ink-faint focus-within:border-moss-600 focus-within:ring-2 focus-within:ring-moss-600/15"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-paper px-2 py-1.5">
          <div role="toolbar" aria-label="Formatting" aria-controls={id} className="flex flex-wrap items-center gap-0.5">
            {actions.map(({ key, label: actionLabel, Icon, run, divider }) => (
              <span key={key} className="flex items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={run}
                  disabled={mode !== "write"}
                  className={toolButton}
                  aria-label={actionLabel}
                  title={actionLabel}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
                {divider && <span className="mx-1 h-5 w-px bg-hairline" aria-hidden="true" />}
              </span>
            ))}
          </div>

          <div role="group" aria-label="Editor view" className="flex rounded-lg bg-ink/[0.05] p-0.5">
            <button type="button" aria-pressed={mode === "write"} onClick={() => setMode("write")} className={tabButton(mode === "write")}>
              Write
            </button>
            <button type="button" aria-pressed={mode === "preview"} onClick={() => setMode("preview")} className={tabButton(mode === "preview")}>
              Preview
            </button>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy(id, { hint, error, maxLength })}
          className={`${mode === "write" ? "block" : "hidden"} w-full resize-y bg-transparent px-4 py-3 text-base leading-7 text-ink placeholder:text-ink-faint caret-moss-700 focus:outline-none`}
        />

        {mode === "preview" && (
          <div className="min-h-[24rem] px-5 py-4" aria-live="polite">
            {value.trim() ? (
              <div className={ARTICLE_PROSE}>
                <ReactMarkdown>{value.replace(/\n{3,}/g, "\n\n")}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-ink-muted">Nothing to preview yet. Switch to Write to start.</p>
            )}
          </div>
        )}
      </div>
    </FieldShell>
  );
}
