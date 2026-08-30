import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function NavLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
        <BookOpen className="w-4.5 h-4.5 text-slate-950" strokeWidth={2} />
      </div>
      <span className="text-[1.05rem] font-semibold text-white tracking-tight">
        Article Hub
      </span>
    </Link>
  );
}
