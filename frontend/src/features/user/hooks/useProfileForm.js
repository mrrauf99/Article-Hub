import { useEffect, useRef, useState, startTransition } from "react";

function normalizeUser(user) {
  return {
    username: user?.username ?? "",
    email: user?.email ?? "",
    joined_at: user?.joined_at ?? "",

    name: user?.name ?? "",
    expertise: user?.expertise ?? "",
    portfolio_link: user?.portfolio_link ?? "",
    bio: user?.bio ?? "",

    x_link: user?.x_link ?? "",
    linkedin_link: user?.linkedin_link ?? "",
    facebook_link: user?.facebook_link ?? "",
    instagram_link: user?.instagram_link ?? "",

    // Avatar fields
    avatarPreview: null,
    avatarFile: null,
  };
}

export function useProfileForm(user) {
  const initialRef = useRef(() => normalizeUser(user));
  const lastUserRef = useRef(user);

  const [formData, setFormData] = useState(() => normalizeUser(user));

  // sync when backend user changes (loader revalidation)
  useEffect(() => {
    if (user !== lastUserRef.current) {
      lastUserRef.current = user;
      const snapshot = normalizeUser(user);
      initialRef.current = snapshot;
      startTransition(() => {
        setFormData(snapshot);
      });
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) =>
      prev[name] === value ? prev : { ...prev, [name]: value }
    );
  }

  function resetForm() {
    // Clean up blob URL if exists
    if (formData.avatarPreview) {
      URL.revokeObjectURL(formData.avatarPreview);
    }
    if (initialRef.current) {
      setFormData(initialRef.current);
    }
  }

  return {
    formData,
    handleChange,
    resetForm,
  };
}
