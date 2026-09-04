import { useEffect, useMemo, useRef } from "react";
import {
  Link,
  useActionData,
  useBlocker,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { AlertCircle, ArrowLeft, Check, Circle, Info, Loader2, Send } from "lucide-react";

import SEO from "@/components/SEO";
import ConfirmDialog from "@/components/ConfirmDialog";
import { BTN_PRIMARY } from "@/styles/panelClasses";
import { useNewArticleForm, MIN_LENGTHS, MAX_LENGTHS } from "../hooks/useNewArticleForm.js";
import PageHeader from "../components/PageHeader";
import TextArea from "../components/new-article/TextArea.jsx";
import Category from "../components/new-article/Category.jsx";
import ImageUpload from "../components/new-article/ImageUpload.jsx";
import Input from "../components/new-article/Input.jsx";
import MarkdownEditor from "../components/new-article/MarkdownEditor.jsx";

const FIELD_KEYS = ["title", "introduction", "content", "summary", "category", "image"];

const EDIT_NOTICES = {
  approved: {
    tone: "warning",
    text: "This article is live. Saving changes sends it back to review, and readers won't see it until a moderator approves it again.",
  },
  pending: {
    tone: "info",
    text: "This article is waiting for review. Saving changes keeps it in the queue with your latest version.",
  },
  rejected: {
    tone: "info",
    text: "A moderator rejected this article. The email we sent explains why. Revise it here and resubmit.",
  },
};

const SUBMIT_LABELS = {
  new: "Submit for review",
  approved: "Save and resubmit",
  pending: "Save changes",
  rejected: "Resubmit for review",
};

// Mirrors validateForm: blank counts as zero, otherwise the normalized length.
const count = (text = "") => (text.trim() ? text.replace(/\r\n/g, "\n").length : 0);

function MarkdownHint() {
  return (
    <>
      Format with the toolbar or type Markdown directly. Use Preview to see it as readers will. At
      least {MIN_LENGTHS.content} characters.
    </>
  );
}

export default function CreateArticlePage() {
  const data = useLoaderData();
  const article = data?.article;
  const isEditing = Boolean(article);
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";
  const submittingRef = useRef(false);

  const {
    formData,
    charCounts,
    errors,
    categories,
    handleChange,
    handleBlur,
    handleImageChange,
    validateForm,
  } = useNewArticleForm(article);

  const initialRef = useRef(formData);

  const { fieldErrors, generalErrors } = useMemo(() => {
    const field = {};
    const general = [];
    for (const err of actionData?.errors || []) {
      const lower = err.toLowerCase();
      const key = FIELD_KEYS.find((k) => lower.includes(k));
      if (key && !field[key]) field[key] = err;
      else general.push(err);
    }
    if (actionData?.success === false && general.length === 0 && Object.keys(field).length === 0) {
      general.push(actionData.message || "Couldn't save the article. Please try again.");
    }
    return { fieldErrors: field, generalErrors: general };
  }, [actionData]);

  const displayErrors = { ...fieldErrors, ...Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) };

  useEffect(() => {
    if (actionData) submittingRef.current = false;
  }, [actionData]);

  const initial = initialRef.current;
  const isDirty =
    ["title", "category", "introduction", "content", "summary"].some(
      (k) => (formData[k] || "") !== (initial[k] || ""),
    ) || Boolean(formData.imageFile);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !submittingRef.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e) => {
      if (submittingRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const checklist = [
    { label: `Title, ${MIN_LENGTHS.title}+ characters`, done: count(formData.title) >= MIN_LENGTHS.title },
    { label: "Category", done: Boolean(formData.category) },
    { label: "Cover image", done: Boolean(formData.imageFile || formData.imageUrl) },
    { label: `Introduction, ${MIN_LENGTHS.introduction}+`, done: count(formData.introduction) >= MIN_LENGTHS.introduction },
    { label: `Main content, ${MIN_LENGTHS.content}+`, done: count(formData.content) >= MIN_LENGTHS.content },
    { label: `Summary, ${MIN_LENGTHS.summary}+`, done: count(formData.summary) >= MIN_LENGTHS.summary },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      requestAnimationFrame(() => {
        document.querySelector('form [aria-invalid="true"]')?.focus();
      });
      return;
    }

    const normalizeText = (text) => {
      if (!text) return "";
      const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    };

    const submitData = new FormData();
    submitData.append("title", normalizeText(formData.title));
    submitData.append("category", formData.category || "");
    submitData.append("introduction", normalizeText(formData.introduction));
    submitData.append("content", normalizeText(formData.content));
    submitData.append("summary", normalizeText(formData.summary));
    if (formData.imageFile) {
      submitData.append("image", formData.imageFile);
    }

    submittingRef.current = true;
    submit(submitData, {
      method: isEditing ? "patch" : "post",
      encType: "multipart/form-data",
    });
  };

  const statusKey = isEditing ? article.status : "new";
  const notice = isEditing ? EDIT_NOTICES[article.status] : null;
  const submitLabel = SUBMIT_LABELS[statusKey] || "Save changes";

  return (
    <div>
      <SEO title={isEditing ? "Edit article" : "New article"} canonicalPath="/user/articles/new" noindex nofollow />

      <Link
        to="/user/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Your articles
      </Link>

      <PageHeader
        title={isEditing ? "Edit article" : "New article"}
        description="Every article is read by a moderator before it's published. Write it here, check the list on the right, then submit."
      />

      {notice && (
        <div
          className={`mt-8 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed ${
            notice.tone === "warning"
              ? "border-review-amber-ring bg-review-amber-bg text-review-amber-text"
              : "border-hairline bg-paper-raised text-ink-muted"
          }`}
        >
          <Info
            className={`mt-0.5 h-4 w-4 shrink-0 ${notice.tone === "warning" ? "text-review-amber-text" : "text-ink-faint"}`}
            aria-hidden="true"
          />
          <p>{notice.text}</p>
        </div>
      )}

      {generalErrors.length > 0 && (
        <div
          role="alert"
          className="mt-8 flex items-start gap-3 rounded-xl border border-rejected-red-ring bg-rejected-red-bg px-4 py-3.5 text-sm text-rejected-red-text"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rejected-red-text" aria-hidden="true" />
          <div>
            <p className="font-semibold">The article wasn't saved.</p>
            <ul className="mt-1 space-y-0.5">
              {generalErrors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14"
      >
        <div className="min-w-0 max-w-3xl space-y-9">
          <Input
            label="Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={displayErrors.title}
            hint={`At least ${MIN_LENGTHS.title} characters. Make it specific.`}
            placeholder="What is this article about?"
            maxLength={MAX_LENGTHS.title}
            charCount={charCounts.title}
            className="px-4 py-3 font-editorial text-2xl leading-snug"
          />

          <div className="max-w-sm">
            <Category
              label="Category"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={displayErrors.category}
              options={categories}
            />
          </div>

          <ImageUpload
            id="image"
            name="image"
            onChange={handleImageChange}
            error={displayErrors.image}
            imageFile={formData.imageFile}
            imageUrl={formData.imageUrl}
          />

          <TextArea
            label="Introduction"
            id="introduction"
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            onBlur={handleBlur}
            error={displayErrors.introduction}
            hint={`The opening readers see first. At least ${MIN_LENGTHS.introduction} characters.`}
            maxLength={MAX_LENGTHS.introduction}
            charCount={charCounts.introduction}
            rows={4}
          />

          <MarkdownEditor
            label="Main content"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            onBlur={handleBlur}
            error={displayErrors.content}
            hint={<MarkdownHint />}
            maxLength={MAX_LENGTHS.content}
            charCount={charCounts.content}
            rows={16}
          />

          <TextArea
            label="Summary"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            onBlur={handleBlur}
            error={displayErrors.summary}
            hint={`Key takeaways, shown on article cards. At least ${MIN_LENGTHS.summary} characters.`}
            maxLength={MAX_LENGTHS.summary}
            charCount={charCounts.summary}
            rows={3}
          />
        </div>

        <aside className="lg:sticky lg:top-12 lg:self-start">
          <div className="rounded-xl border border-hairline bg-paper-raised p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-ink">Before you submit</h2>
              <span className="text-xs tabular-nums text-ink-muted">
                {doneCount} of {checklist.length}
              </span>
            </div>

            <ul className="mt-4 space-y-2.5">
              {checklist.map((item) => (
                <li
                  key={item.label}
                  className={`flex items-center gap-2.5 text-sm transition-colors duration-200 ${
                    item.done ? "text-moss-800" : "text-ink-muted"
                  }`}
                >
                  {item.done ? (
                    <Check className="h-4 w-4 shrink-0 text-moss-700" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                  )}
                  <span>
                    {item.label}
                    <span className="sr-only">{item.done ? ", done" : ", not done yet"}</span>
                  </span>
                </li>
              ))}
            </ul>

            <button type="submit" disabled={isSubmitting} className={`${BTN_PRIMARY} mt-6 w-full`}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {isEditing ? "Saving…" : "Submitting…"}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {submitLabel}
                </>
              )}
            </button>

            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              We'll email you when a moderator approves or rejects it. Until then it stays off the
              public site.
            </p>
          </div>
        </aside>
      </form>

      <ConfirmDialog
        isOpen={blocker.state === "blocked"}
        title="Leave without saving?"
        message="Your changes to this article haven't been submitted and will be lost."
        confirmText="Leave page"
        cancelText="Keep editing"
        variant="warning"
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </div>
  );
}
