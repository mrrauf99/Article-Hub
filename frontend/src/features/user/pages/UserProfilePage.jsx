import { useState, useEffect, useMemo, useRef, useCallback, startTransition } from "react";
import {
  useLoaderData,
  useNavigation,
  useActionData,
  useSubmit,
} from "react-router-dom";

import { CheckCircle, XCircle } from "lucide-react";

import { useProfileForm } from "../hooks/useProfileForm";
import ProfileHeader from "../components/profile/ProfileHeader";
import AuthorInfo from "../components/profile/AuthorInfo";
import SocialLinks from "../components/profile/SocialLinks";
import ProfileActions from "../components/profile/ProfileActions";
import { ScrollReveal } from "@/components/ScrollReveal";

import ProfileProvider from "../context/ProfileContext";

export default function UserProfilePage() {
  const { user } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();

  const [feedback, setFeedback] = useState(null);
  const { formData, handleChange, resetForm } = useProfileForm(user);
  const lastActionDataRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  const handleEdit = () => setIsEditing(true);

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
    submitData.append("portfolio_link", formData.portfolio_link);
    submitData.append("x_link", formData.x_link);
    submitData.append("linkedin_link", formData.linkedin_link);
    submitData.append("facebook_link", formData.facebook_link);
    submitData.append("instagram_link", formData.instagram_link);

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
      if (actionData.success) setIsEditing(false);

      const t = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(t);
    });
  }, [actionData]);

  const profileValue = useMemo(
    () => ({
      user,
      formData,
      isEditing,
      isSaving,
      handleChange,
      handleCancel,
    }),
    [user, formData, isEditing, isSaving, handleChange, handleCancel]
  );

  return (
    <ProfileProvider value={profileValue}>
      <ScrollReveal animation="fade-up" duration={600}>
        <div className="max-w-6xl mx-auto py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <ProfileHeader
              user={user}
              isEditing={isEditing}
              onEdit={handleEdit}
            />

            {/* FEEDBACK */}
            {feedback && (
              <div
                className={`mx-6 mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
                  feedback.success
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {feedback.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <AuthorInfo />
              <SocialLinks />
              <ProfileActions
                isEditing={isEditing}
                isSaving={isSaving}
                onCancel={handleCancel}
              />
            </form>
          </div>
        </div>
      </ScrollReveal>
    </ProfileProvider>
  );
}
