import { useState, useEffect, useMemo, useRef, useCallback, startTransition } from "react";
import {
  useLoaderData,
  useNavigation,
  useActionData,
  useSubmit,
  useRevalidator,
} from "react-router-dom";

import { CheckCircle, XCircle } from "lucide-react";

import { useProfileForm } from "../hooks/useProfileForm";
import ProfileHeader from "../components/ProfileHeader";
import AuthorInfo from "../components/AuthorInfo";
import SocialLinks from "../components/SocialLinks";
import ProfileActions from "../components/ProfileActions";
import { ScrollReveal } from "@/components/ScrollReveal";

import ProfileProvider from "../context/ProfileProvider";

export default function ProfilePage() {
  const { user } = useLoaderData();
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
      handleChange,
      handleCancel,
      handleEdit,
    }),
    [user, formData, isEditing, isSaving, handleChange, handleCancel, handleEdit]
  );

  return (
    <ProfileProvider value={profileValue}>
      <ScrollReveal animation="fade-up" duration={600}>
        <div className="w-full md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <ProfileHeader />

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
              <ProfileActions />
            </form>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </ProfileProvider>
  );
}
