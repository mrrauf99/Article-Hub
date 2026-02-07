export default function formatCount(value) {
  const count = Number(value) || 0;
  const absCount = Math.abs(count);

  if (absCount >= 1_000_000_000) {
    const formatted = (count / 1_000_000_000).toFixed(1);
    return `${formatted.replace(/\.0$/, "")}b`;
  }

  if (absCount >= 1_000_000) {
    const formatted = (count / 1_000_000).toFixed(1);
    return `${formatted.replace(/\.0$/, "")}m`;
  }

  if (absCount >= 1_000) {
    const formatted = (count / 1_000).toFixed(1);
    return `${formatted.replace(/\.0$/, "")}k`;
  }

  return `${count}`;
}
