import { createPortal } from "react-dom";
import {
  X,
  User,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
} from "lucide-react";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleDetailModal({
  article,
  onClose,
  onApprove,
  onReject,
}) {
  if (!article) return null;

  const statusConfig = {
    approved: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
      Icon: CheckCircle2,
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
      Icon: Clock,
    },
    rejected: {
      bg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-200",
      Icon: XCircle,
    },
  };
  const { bg, text, border, Icon } =
    statusConfig[article.status] || statusConfig.pending;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${bg} ${text} ${border} border mb-4`}
          >
            <Icon className="w-4 h-4" />
            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
          </span>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pr-10 leading-tight">
            {article.title}
          </h2>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-medium text-slate-700">
                {article.author_name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(article.created_at)}
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {article.views || 0} views
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Category */}
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg text-sm font-medium text-indigo-700">
              {article.category}
            </span>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Summary
            </h4>
            <p className="text-slate-700 leading-relaxed">{article.summary}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
          {article.status !== "approved" && (
            <button
              onClick={() => {
                onApprove(article.article_id);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </button>
          )}
          {article.status !== "rejected" && (
            <button
              onClick={() => {
                onReject(article.article_id);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/25 transition-all hover:shadow-rose-500/40"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
