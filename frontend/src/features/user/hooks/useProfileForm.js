import { useEffect, useRef, useState, startTransition } from "react";

function normalizeUser(user) {
  return {
    username: user?.username ?? "",
    email: user?.email ?? "",
    joined_at: user?.joined_at ?? "",

    name: user?.name ?? "",
    expertise: user?.expertise ?? "",
    portfolio_url: user?.portfolio_url ?? "",
    bio: user?.bio ?? "",
    gender: user?.gender ?? "",

    x_url: user?.x_url ?? "",
    linkedin_url: user?.linkedin_url ?? "",
    facebook_url: user?.facebook_url ?? "",
    instagram_url: user?.instagram_url ?? "",
    avatarPreview: null,
    avatarFile: null,
  };
}

export function useProfileForm(user) {
  const initialRef = useRef(normalizeUser(user));
  const lastUserRef = useRef(user);

  const [formData, setFormData] = useState(() => normalizeUser(user));

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
