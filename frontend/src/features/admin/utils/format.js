const DAY = 24 * 60 * 60 * 1000;

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAge(value, now = Date.now()) {
  if (!value) return "";
  const days = Math.floor((now - new Date(value).getTime()) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function ageInDays(value, now = Date.now()) {
  return value ? Math.floor((now - new Date(value).getTime()) / DAY) : 0;
}

export function plural(count, one, many = `${one}s`) {
  return `${count} ${Number(count) === 1 ? one : many}`;
}
