export default function ArticlesList({
  items,
  renderItem,
  emptyState = null,
  container: Container = "div",
  containerProps = {},
  className = "",
}) {
  if (!items || items.length === 0) {
    return emptyState;
  }

  const children = items.map((item, index) => renderItem(item, index));
  const mergedClassName = [containerProps.className, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Container {...containerProps} className={mergedClassName}>
      {children}
    </Container>
  );
}
