import { useCallback, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, FileText, Trash2 } from "lucide-react";

import ProfileHeader from "@/features/profile/components/ProfileHeader";
import AuthorInfo from "@/features/profile/components/AuthorInfo";
import SocialLinks from "@/features/profile/components/SocialLinks";
import ProfileProvider from "@/features/profile/context/ProfileProvider";
import StatusPill from "@/features/user/components/StatusPill";
import EmptyState from "@/features/user/components/EmptyState";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { BTN_GHOST, BTN_SECONDARY } from "@/styles/panelClasses";
import ArticleReviewDialog from "../components/ArticleReviewDialog";
import ActionNotice from "../components/ActionNotice";
import useArticleModeration from "../hooks/useArticleModeration";
import useMemberActions from "../hooks/useMemberActions";
import { formatDate, plural } from "../utils/format";
import { isSelfMember } from "../utils/identity";

const noop = () => {};

function Figure({ children }) {
  return <span className="font-semibold tabular-nums text-ink">{children}</span>;
}

function ArticleRows({ articles, authorName, onReview }) {
  return (
    <ul className="border-t border-hairline">
      {articles.map((article) => (
        <li
          key={article.id}
          className="flex flex-col gap-2 border-b border-hairline py-3.5 sm:flex-row sm:items-center sm:gap-6"
        >
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onReview({ ...article, author_name: authorName })}
              className="line-clamp-2 rounded-sm text-left font-editorial text-[1.0625rem] leading-snug text-ink transition-colors hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
            >
              {capitalizeFirstLetter(article.title)}
            </button>
            <p className="mt-0.5 text-sm text-ink-muted">
              Created {formatDate(article.created_at)} ·{" "}
              <span className="tabular-nums">{formatCount(article.views)}</span> reads
            </p>
          </div>
          <StatusPill status={article.status} className="self-start sm:self-auto" />
        </li>
      ))}
    </ul>
  );
}

export default function AdminUserProfilePage() {
  const { user, articles } = useLoaderData();
  const { user: currentUser } = useOutletContext() ?? {};
  const navigate = useNavigate();
  const [reviewing, setReviewing] = useState(null);

  const moderation = useArticleModeration();
  const onMemberSuccess = useCallback(
    (type, _member, text) => {
      if (type === "delete") {
        navigate("/admin/users", { replace: true, state: { notice: { id: Date.now(), text } } });
      }
    },
    [navigate],
  );
  const members = useMemberActions({ onSuccess: onMemberSuccess });

  const displayName = user.name || user.username;
  const isSelf = isSelfMember(currentUser, user);
  const showArticles = user.role !== "admin" || articles.length > 0;

  const tally = articles.reduce(
    (acc, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1;
      acc.views += Number(article.views || 0);
      return acc;
    },
    { approved: 0, pending: 0, rejected: 0, views: 0 },
  );

  const member = useMemo(() => ({ ...user, article_count: articles.length }), [user, articles.length]);

  const profileValue = useMemo(
    () => ({
      user,
      formData: {
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
      },
      isEditing: false,
      isSaving: false,
      canEdit: false,
      handleChange: noop,
      handleCancel: noop,
      handleEdit: noop,
    }),
    [user],
  );

  const decide = (type, article) => {
    setReviewing(null);
    moderation.open(type, article);
  };

  const notice = moderation.notice ?? members.notice;
  const dismissNotice = () => {
    moderation.dismissNotice();
    members.dismissNotice();
  };

  return (
    <ProfileProvider value={profileValue}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Members
        </Link>

        {isSelf ? (
          <Link to="/admin/profile" className={BTN_SECONDARY}>
            Edit your profile
          </Link>
        ) : (
          <div className="-mr-3 flex items-center gap-2">
            <button type="button" onClick={() => members.open("role", member)} className={BTN_SECONDARY}>
              Change role
            </button>
            <button
              type="button"
              onClick={() => members.open("delete", member)}
              className={`${BTN_GHOST} hover:bg-rejected-red-bg hover:text-rejected-red-text`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete member
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <ActionNotice notice={notice} onDismiss={dismissNotice} />
      </div>

      <div className="border-y border-hairline [&>section]:px-0">
        <ProfileHeader headingLevel={1} />
      </div>

      {showArticles && (
        <section aria-labelledby="member-articles" className="mt-12">
          <h2 id="member-articles" className="font-editorial text-2xl text-ink">
            Articles
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            {articles.length === 0 ? (
              `${displayName} hasn't written anything yet.`
            ) : (
              <>
                <Figure>{plural(articles.length, "article")}</Figure>: {tally.approved} published,{" "}
                {tally.pending} in review, {tally.rejected} rejected.{" "}
                <Figure>{formatCount(tally.views)}</Figure> reads in total.
              </>
            )}
          </p>

          {articles.length === 0 ? (
            <div className="mt-6 border-y border-hairline">
              <EmptyState icon={FileText} title="No articles yet">
                Anything this member submits will show up here and in the review queue.
              </EmptyState>
            </div>
          ) : (
            <div className="mt-6">
              <ArticleRows articles={articles} authorName={displayName} onReview={setReviewing} />
            </div>
          )}
        </section>
      )}

      <div className="mt-12 border-b border-hairline [&>section]:px-0">
        <AuthorInfo />
        <SocialLinks />
      </div>

      {reviewing && (
        <ArticleReviewDialog
          article={reviewing}
          onClose={() => setReviewing(null)}
          onDecide={decide}
        />
      )}
      {moderation.dialog}
      {members.dialog}
    </ProfileProvider>
  );
}
