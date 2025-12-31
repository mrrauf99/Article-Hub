import { Link } from "react-router-dom";
import { Clock, Users, FileText } from "lucide-react";

export default function QuickActions({ pendingCount }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <p className="text-slate-400 text-sm mt-1">
            Common admin tasks at your fingertips
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/articles?status=pending"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
          >
            <Clock className="w-4 h-4" />
            Pending Articles ({pendingCount})
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
