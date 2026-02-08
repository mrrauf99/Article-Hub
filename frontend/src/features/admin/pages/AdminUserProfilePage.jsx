import { useState, useMemo } from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import {
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { ScrollReveal, StaggerReveal } from "@/components/ScrollReveal";
import ArticleDetailModal from "../components/ArticleDetailModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { adminApi } from "../../api/adminApi.js";

// Reuse profile components
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import AuthorInfo from "@/features/profile/components/AuthorInfo";
import SocialLinks from "@/features/profile/components/SocialLinks";
import ProfileProvider from "@/features/profile/context/ProfileProvider";
import SurfaceCard from "@/components/SurfaceCard";
import formatCount from "@/utils/formatCount";

const statusStyles = {
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: Clock,
  },
  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    icon: XCircle,
  },
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient,
  bgGradient,
  iconBg,
  iconColor,
}) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 group`}
  >
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
        <p
          className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {value}
        </p>
      </div>
      <div className={`${iconBg} p-3 rounded-xl shadow-sm`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
    <div
      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-60`}
    />
  </div>
);

const ArticleChip = ({ status }) => {
  const config = statusStyles[status] || statusStyles.pending;
  const Icon = config.icon;
  return (
    <span
      className={`${config.bg} ${config.text} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

export default function AdminUserProfilePage() {
  const { user, articles } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [confirmApprove, setConfirmApprove] = useState(null);
  const [confirmReject, setConfirmReject] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const isSubmitting = fetcher.state !== "idle";
  const pendingIntent = fetcher.formData?.get("intent");

  const articleStats = articles.reduce(
    (acc, article) => {
      const status = article.status || "pending";
      acc.total += 1;
      acc.views += Number(article.views || 0);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { total: 0, approved: 0, pending: 0, rejected: 0, views: 0 },
  );

  const displayName = user.name || user.username;
  const showArticleSections = user.role !== "admin";

  const handleArticleClick = async (article) => {
    setArticleLoading(true);
    try {
      const response = await adminApi.getArticleDetails(article.article_id);
      setSelectedArticle(response.data.data);
    } catch (error) {
      console.error("Failed to load article details:", error);
      setSelectedArticle({
        ...article,
        author_name: displayName,
      });
    } finally {
      setArticleLoading(false);
    }
  };

  const handleApprove = () => {
    if (!confirmApprove) return;
    fetcher.submit(
      { intent: "approve", articleId: confirmApprove.article_id },
      { method: "post", action: "/admin/articles" },
    );
    setConfirmApprove(null);
  };

  const handleReject = () => {
    if (!confirmReject) return;
    fetcher.submit(
      {
        intent: "reject",
        articleId: confirmReject.article_id,
        reason: rejectReason,
      },
      { method: "post", action: "/admin/articles" },
    );
    setConfirmReject(null);
    setRejectReason("");
  };

  // Transform user data to match profile component expectations
  const formData = useMemo(
    () => ({
      username: user.username,
      email: user.email,
      name: user.name || "",
      expertise: user.expertise || "",
      bio: user.bio || "",
      gender: user.gender || "",
      country: user.country || "",
      portfolio_url: user.portfolio_url || "",
      x_url: user.x_url || "",
      linkedin_url: user.linkedin_url || "",
      facebook_url: user.facebook_url || "",
      instagram_url: user.instagram_url || "",
      joined_at: user.joined_at,
      avatarPreview: null,
      avatarFile: null,
    }),
    [user],
  );

  // Transform user to include avatar_url
  const userWithAvatar = useMemo(
    () => ({
      ...user,
      avatar_url: user.avatar_url,
    }),
    [user],
  );

  // Profile context value - admin view (no editing)
  const profileValue = useMemo(
    () => ({
      user: userWithAvatar,
      formData,
      isEditing: false,
      isSaving: false,
      canEdit: false,
      handleChange: () => {},
      handleCancel: () => {},
      handleEdit: () => {},
    }),
    [userWithAvatar, formData],
  );

  const statCards = [
    {
      label: "Total Articles",
      value: articleStats.total,
      icon: FileText,
      gradient: "from-sky-500 to-blue-600",
      bgGradient: "from-sky-50 to-blue-50",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      label: "Approved",
      value: articleStats.approved,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: articleStats.pending,
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Rejected",
      value: articleStats.rejected,
      icon: XCircle,
      gradient: "from-rose-500 to-red-600",
      bgGradient: "from-rose-50 to-red-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      label: "Total Views",
      value: formatCount(articleStats.views),
      icon: Eye,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <ProfileProvider value={profileValue}>
      <ScrollReveal animation="fade-up" duration={600}>
        <div className="w-full md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="w-full max-w-6xl mx-auto">
            <SurfaceCard>
              {/* Reuse Profile Components */}
              <ProfileHeader />
              <AuthorInfo />
              <SocialLinks />

              {showArticleSections && (
                <>
                  {/* Stats Section */}
                  <div className="p-4 lg:p-6 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/25">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          Performance Overview
                        </h2>
                        <p className="text-sm text-slate-500">
                          Article statistics and engagement
                        </p>
                      </div>
                    </div>

                    <StaggerReveal staggerDelay={80} animation="fade-up">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                        {statCards.map((stat) => (
                          <StatCard key={stat.label} {...stat} />
                        ))}
                      </div>
                    </StaggerReveal>
                  </div>

                  {/* Recent Articles Section */}
                  <div className="p-4 lg:p-6 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            Recent Articles
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500">
                            Click to view details
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-indigo-600">
                        {articles.length} total
                      </span>
                    </div>

                    {articles.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                          <FileText className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-900 mb-1">
                          No Articles Yet
                        </p>
                        <p className="text-sm text-slate-500">
                          This user hasn't published any articles.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {articles.slice(0, 10).map((article) => (
                          <button
                            key={article.article_id}
                            onClick={() => handleArticleClick(article)}
                            disabled={articleLoading}
                            className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group cursor-pointer disabled:opacity-50"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">
                                {article.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <ArticleChip status={article.status} />
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(article.created_at)}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Eye className="h-3.5 w-3.5" />
                                  {formatCount(article.views)} views
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              View Details →
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </SurfaceCard>
          </div>

          {/* Article Detail Modal */}
          {selectedArticle && (
            <ArticleDetailModal
              article={selectedArticle}
              onClose={() => setSelectedArticle(null)}
              onApprove={(article) => {
                setConfirmApprove(article);
                setSelectedArticle(null);
              }}
              onReject={(id) => {
                setConfirmReject({ article_id: id });
                setRejectReason("");
                setSelectedArticle(null);
              }}
              showInternalConfirmations={false}
            />
          )}

          {/* Approve Confirmation Dialog */}
          <ConfirmDialog
            isOpen={!!confirmApprove}
            title="Approve Article"
            message={
              confirmApprove
                ? `Are you sure you want to approve "${confirmApprove.title}"?`
                : ""
            }
            confirmText="Yes, Approve"
            cancelText="Cancel"
            variant="success"
            isLoading={isSubmitting && pendingIntent === "approve"}
            loadingText="Approving"
            onConfirm={handleApprove}
            onCancel={() => setConfirmApprove(null)}
          />

          {/* Reject Confirmation Dialog */}
          <ConfirmDialog
            isOpen={!!confirmReject}
            title="Reject Article"
            message={
              confirmReject
                ? `Are you sure you want to reject "${confirmReject.title}"?`
                : ""
            }
            confirmText="Yes, Reject"
            cancelText="Cancel"
            variant="warning"
            isLoading={isSubmitting && pendingIntent === "reject"}
            loadingText="Rejecting"
            reasonLabel="Reason for rejection"
            reasonPlaceholder="Share the rejection reasons so the author can improve."
            reasonValue={rejectReason}
            reasonRequired
            onReasonChange={setRejectReason}
            onConfirm={handleReject}
            onCancel={() => {
              setConfirmReject(null);
              setRejectReason("");
            }}
          />
        </div>
      </ScrollReveal>
    </ProfileProvider>
  );
}
