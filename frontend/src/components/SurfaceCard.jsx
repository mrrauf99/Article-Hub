export default function SurfaceCard({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
