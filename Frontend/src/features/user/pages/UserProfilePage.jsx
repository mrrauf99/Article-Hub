import { useState, useEffect, useMemo } from "react";
import {
  useRouteLoaderData,
  useLoaderData,
  Form,
  useNavigation,
  useActionData,
} from "react-router-dom";

import { CheckCircle, XCircle } from "lucide-react";

import { useProfileForm } from "../hooks/useProfileForm";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import AuthorInfo from "../components/profile/AuthorInfo";
import SocialLinks from "../components/profile/SocialLinks";
import ProfileActions from "../components/profile/ProfileActions";

import ProfileProvider from "../context/ProfileContext";

export default function UserProfilePage() {
  const { user } = useRouteLoaderData("user-layout");
  const { stats } = useLoaderData();
  const actionData = useActionData();

  const [feedback, setFeedback] = useState(null);
  const { formData, handleChange, resetForm } = useProfileForm(user);

  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (isSaving) return;

    resetForm(); // restore original data
    setIsEditing(false);
  };

  useEffect(() => {
    if (!actionData) return;

    setFeedback(actionData);
    if (actionData.success) setIsEditing(false);

    const t = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(t);
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
    [user, formData, isEditing, isSaving]
  );

  return (
    <ProfileProvider value={profileValue}>
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <ProfileHeader
            user={user}
            isEditing={isEditing}
            onEdit={handleEdit}
          />

          <ProfileStats stats={stats} />

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

          <Form method="patch">
            <AuthorInfo />
            <SocialLinks />
            <ProfileActions
              isEditing={isEditing}
              isSaving={isSaving}
              onCancel={handleCancel}
            />
          </Form>
        </div>
      </div>
    </ProfileProvider>
  );
}
