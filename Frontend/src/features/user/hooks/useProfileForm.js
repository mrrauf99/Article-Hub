import { useEffect, useRef, useState } from "react";

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
    linkedin_url: user?.linkedin_url ?? "",
    facebook_url: user?.facebook_url ?? "",
    instagram_url: user?.instagram_url ?? "",
  };
}

export function useProfileForm(user) {
  const initialRef = useRef(() => normalizeUser(user));

  const [formData, setFormData] = useState(() => normalizeUser(user));

  // sync when backend user changes (loader revalidation)
  useEffect(() => {
    const snapshot = normalizeUser(user);
    initialRef.current = snapshot;
    setFormData(snapshot);
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) =>
      prev[name] === value ? prev : { ...prev, [name]: value }
    );
  }

  function resetForm() {
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
