import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Trash2,
  FileText,
} from "lucide-react";

function StatusBadge({ status }) {
  const config = {
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      Icon: CheckCircle2,
    },
    pending: { bg: "bg-amber-50", text: "text-amber-700", Icon: Clock },
    rejected: { bg: "bg-rose-50", text: "text-rose-700", Icon: XCircle },
  };
  const { bg, text, Icon } = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

export default function ArticlesTable({
  articles,
  getLoadingAction,
  onViewArticle,
  onApprove,
  onReject,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">
                  Article
                </th>
                <th className="text-left px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                  Author
                </th>
                <th className="text-left px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
                  Category
                </th>
                <th className="text-left px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
                  Status
                </th>
                <th className="text-left px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                  Views
                </th>
                <th className="text-right px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-slate-500">No articles found</p>
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr
                  key={article.article_id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                    <button
                      onClick={() => onViewArticle(article)}
                      className="text-left group w-full"
                    >
                      <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate sm:line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 truncate sm:line-clamp-1 max-w-[200px] sm:max-w-xs mt-0.5">
                        {article.summary}
                      </p>
                    </button>
                  </td>
                  <td className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <img
                        src={
                          article.author_avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            article.author_name
                          )}&background=6366f1&color=fff`
                        }
                        alt={article.author_name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
                      />
                      <span className="text-xs sm:text-sm text-slate-700 truncate">
                        {article.author_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 whitespace-nowrap">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      {article.views || 0}
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-wrap">
                      {article.status !== "approved" && (
                        <button
                          onClick={() => onApprove(article)}
                          disabled={getLoadingAction(
                            article.article_id
                          )?.startsWith("approve")}
                          className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50 whitespace-nowrap"
                          title="Approve article"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                      )}
                      {article.status !== "rejected" && (
                        <button
                          onClick={() => onReject(article.article_id)}
                          disabled={getLoadingAction(
                            article.article_id
                          )?.startsWith("reject")}
                          className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors disabled:opacity-50 whitespace-nowrap"
                          title="Reject article"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(article)}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
