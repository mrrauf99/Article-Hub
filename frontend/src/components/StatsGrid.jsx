import { Fragment } from "react";
import { StaggerReveal } from "@/components/ScrollReveal";

export default function StatsGrid({
  items,
  renderItem,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
  containerClassName = "",
  staggerDelay = 100,
  animation = "fade-up",
}) {
  if (!items || items.length === 0) return null;

  return (
    <StaggerReveal
      staggerDelay={staggerDelay}
      animation={animation}
      className={containerClassName}
    >
      <div className={gridClassName}>
        {items.map((item, index) => (
          <Fragment key={item.key || item.label || index}>
            {renderItem(item, index)}
          </Fragment>
        ))}
      </div>
    </StaggerReveal>
  );
}
