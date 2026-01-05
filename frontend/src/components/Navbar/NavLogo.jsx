import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function NavLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
      {/* Logo Icon - Blue rounded background with book icon */}
      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/25">
        <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-[1.35rem] font-bold text-white">
        Article Hub
      </span>
    </Link>
  );
}
