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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Article
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Author
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Views
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No articles found</p>
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr
                  key={article.article_id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewArticle(article)}
                      className="text-left group"
                    >
                      <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">
                        {article.summary}
                      </p>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          article.author_avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            article.author_name
                          )}&background=6366f1&color=fff`
                        }
                        alt={article.author_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-slate-700">
                        {article.author_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Eye className="w-4 h-4" />
                      {article.views || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {article.status !== "approved" && (
                        <button
                          onClick={() => onApprove(article)}
                          disabled={getLoadingAction(
                            article.article_id
                          )?.startsWith("approve")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      {article.status !== "rejected" && (
                        <button
                          onClick={() => onReject(article.article_id)}
                          disabled={getLoadingAction(
                            article.article_id
                          )?.startsWith("reject")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(article)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
  );
}
