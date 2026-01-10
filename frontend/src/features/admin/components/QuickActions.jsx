import { Link } from "react-router-dom";
import { Clock, Users, FileText } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function QuickActions({ pendingCount }) {
  return (
    <ScrollReveal animation="fade-up" duration={500}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Quick Actions</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Common admin tasks at your fingertips
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              to="/admin/articles?status=pending"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Pending Articles ({pendingCount})</span>
              <span className="sm:hidden">Pending ({pendingCount})</span>
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Manage Users</span>
              <span className="sm:hidden">Users</span>
            </Link>
            <Link
              to="/admin/articles"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">All Articles</span>
              <span className="sm:hidden">Articles</span>
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
