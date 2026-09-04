import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  startTransition,
} from "react";
import {
  useLoaderData,
  useNavigation,
  useActionData,
  useSubmit,
  useRevalidator,
  useLocation,
} from "react-router-dom";

import { CheckCircle, XCircle } from "lucide-react";

import { useProfileForm } from "../hooks/useProfileForm";
import ProfileHeader from "../components/ProfileHeader";
import AuthorInfo from "../components/AuthorInfo";
import SocialLinks from "../components/SocialLinks";
import ProfileActions from "../components/ProfileActions";
import SecuritySettings from "../components/SecuritySettings";
import SEO from "@/components/SEO";
import PageHeader from "@/features/user/components/PageHeader";

import ProfileProvider from "../context/ProfileProvider";

export default function ProfilePage() {
  const { user } = useLoaderData();
  const location = useLocation();
  const actionData = useActionData();
  const submit = useSubmit();
  const revalidator = useRevalidator();

  const [feedback, setFeedback] = useState(null);
  const { formData, handleChange, resetForm } = useProfileForm(user);
  const lastActionDataRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (isSaving) return;

    resetForm(); // restore original data
    setIsEditing(false);
  }, [isSaving, resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // Add text fields
    submitData.append("name", formData.name);
    submitData.append("expertise", formData.expertise);
    submitData.append("bio", formData.bio);
    submitData.append("gender", formData.gender || "");
    submitData.append("country", formData.country || "");
    submitData.append("portfolio_url", formData.portfolio_url);
    submitData.append("x_url", formData.x_url);
    submitData.append("linkedin_url", formData.linkedin_url);
    submitData.append("facebook_url", formData.facebook_url);
    submitData.append("instagram_url", formData.instagram_url);

    // Add avatar file if selected
    if (formData.avatarFile) {
      submitData.append("avatar", formData.avatarFile);
    }

    submit(submitData, {
      method: "patch",
      encType: "multipart/form-data",
    });
  };

  useEffect(() => {
    if (!actionData || actionData === lastActionDataRef.current) return;

    lastActionDataRef.current = actionData;
    startTransition(() => {
      setFeedback(actionData);
      if (actionData.success) {
        setIsEditing(false);
        // Revalidate to get the latest data from the server
        revalidator.revalidate();
      }
    });

    const timeoutId = setTimeout(() => setFeedback(null), 5000);
    return () => clearTimeout(timeoutId);
  }, [actionData, revalidator]);

  const profileValue = useMemo(
    () => ({
      user,
      formData,
      isEditing,
      isSaving,
      canEdit: true,
      handleChange,
      handleCancel,
      handleEdit,
    }),
    [
      user,
      formData,
      isEditing,
      isSaving,
      handleChange,
      handleCancel,
      handleEdit,
    ],
  );

  return (
    <ProfileProvider value={profileValue}>
      <SEO title="Profile & security" canonicalPath={location.pathname} noindex nofollow />

      <div className="font-ui">
        <PageHeader
          title="Profile & security"
          description="Your writer details, the links readers can follow, and how your account is protected."
        />

        {feedback && (
          <div
            role={feedback.success ? "status" : "alert"}
            className={`mt-8 flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm ${
              feedback.success
                ? "border-moss-200 bg-moss-50 text-moss-800"
                : "border-rejected-red-ring bg-rejected-red-bg text-rejected-red-text"
            }`}
          >
            {feedback.success ? (
              <CheckCircle className="h-4 w-4 shrink-0 text-moss-800" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-rejected-red-text" aria-hidden="true" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="mt-10 rounded-xl border border-hairline bg-paper-raised">
          <ProfileHeader />

          <form onSubmit={handleSubmit} className="border-t border-hairline">
            <AuthorInfo />
            <SocialLinks />
            <ProfileActions />
          </form>
        </div>

        <SecuritySettings />
      </div>
    </ProfileProvider>
  );
}
