import { useLayoutEffect, useRef, useState } from "react";
import { STATUS_TABS } from "../constants/articleStatus";

export default function StatusTabs({ value, counts, onChange }) {
  const listRef = useRef(null);
  const [indicator, setIndicator] = useState(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const active = list.querySelector('[aria-pressed="true"]');
      if (active) {
        setIndicator({ x: active.offsetLeft, w: active.offsetWidth });
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [value, counts]);

  // Enable the glide only after the first placement so the bar doesn't sweep in from 0.
  useLayoutEffect(() => {
    if (indicator && !animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [indicator, animate]);

  return (
    <div className="-mb-px overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        ref={listRef}
        role="group"
        aria-label="Filter by status"
        className="relative flex min-w-max gap-1"
      >
        {STATUS_TABS.map((tab) => {
          const isActive = value === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(tab.value)}
              className={`flex h-11 items-center gap-2 rounded-t-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-moss-600 ${
                isActive ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
              <span
                className={`min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-center text-xs tabular-nums ${
                  isActive ? "bg-moss-700 text-paper" : "bg-ink/[0.06] text-ink-muted"
                }`}
              >
                {counts[tab.value] ?? 0}
              </span>
            </button>
          );
        })}

        {indicator && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-moss-700 motion-reduce:transition-none ${
              animate
                ? "transition-[transform,width] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
                : ""
            }`}
            style={{
              width: indicator.w,
              transform: `translateX(${indicator.x}px)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
