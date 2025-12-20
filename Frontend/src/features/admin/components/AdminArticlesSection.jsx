import { useState } from "react";
import { Trash2, CheckCircle2, XCircle, Filter } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminArticlesSection({
  articles = [],
  onChangeStatus,
  onDelete,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered =
    statusFilter === "all"
      ? articles
      : articles.filter((a) => a.status === statusFilter);

  return (
    <>
      {/* ================= TABLE ================= */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Manage Articles
            </h2>
            <p className="text-xs text-gray-500">
              Approve, reject, or delete articles submitted by users.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Views</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((article) => (
                <tr key={article.id} className="border-b last:border-0">
                  {/* CLICKABLE TITLE */}
                  <td className="px-4 py-2 max-w-xs">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="text-left w-full"
                    >
                      <p className="font-medium text-red-600 hover:underline truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {article.summary}
                      </p>
                    </button>
                  </td>

                  <td className="px-4 py-2 text-xs text-gray-700">
                    User #{article.id}
                  </td>

                  <td className="px-4 py-2 text-xs text-gray-700">
                    {article.category}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          article.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : article.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {article.status}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-xs text-gray-700">
                    {article.views ?? 0}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onChangeStatus(article.id, "approved")}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>

                      <button
                        onClick={() => onChangeStatus(article.id, "rejected")}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>

                      <button
                        onClick={() => onDelete(article.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-xs text-gray-500"
                  >
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl bg-white shadow-xl border border-red-200"
          >
            <div className="flex justify-between items-center px-4 py-3 bg-red-50 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-700">
                Article Details
              </h3>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-red-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-4 space-y-3 text-sm">
              <p>
                <b>Title:</b> {selectedArticle.title}
              </p>
              <p>
                <b>Summary:</b> {selectedArticle.summary}
              </p>
              <p>
                <b>Category:</b> {selectedArticle.category}
              </p>
              <p>
                <b>Status:</b> {selectedArticle.status}
              </p>
              <p>
                <b>Views:</b> {selectedArticle.views ?? 0}
              </p>
            </div>

            <div className="px-4 py-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
