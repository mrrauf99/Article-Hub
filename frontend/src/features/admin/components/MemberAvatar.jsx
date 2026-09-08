import { useState } from "react";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
};

export default function MemberAvatar({ name, src, size = "md" }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const box = `flex shrink-0 items-center justify-center overflow-hidden rounded-full ${SIZES[size]}`;

  if (!src?.trim() || failed) {
    return (
      <span className={`${box} bg-moss-100 font-semibold text-moss-800`} aria-hidden="true">
        {initial}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${box} bg-ink/[0.05] object-cover`}
    />
  );
}
