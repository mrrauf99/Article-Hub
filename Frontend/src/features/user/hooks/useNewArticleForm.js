import { useState } from "react";
import { ARTICLE_CATEGORIES as categories } from "@/data/articleCategories";

export function useNewArticleForm(article) {
  const [formData, setFormData] = useState({
    title: article?.title ?? "",
    category: article?.category ?? "",
    introduction: article?.introduction ?? "",
    content: article?.content ?? "",
    summary: article?.summary ?? "",
    imageFile: null,
    imageUrl: article?.imageUrl ?? null,
  });

  const [charCounts, setCharCounts] = useState({
    introduction: article?.introduction?.length ?? 0,
    summary: article?.summary?.length ?? 0,
  });

  const [errors, setErrors] = useState({});

  /* ---------------- TEXT HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "introduction" || name === "summary") {
      setCharCounts((prev) => ({ ...prev, [name]: value.length }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* ---------------- BLUR HANDLER ---------------- */
  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Only validate if field is empty
    if (!value || !value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "Please fill out this field." }));
    }
  };

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Only image files are allowed" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({
        ...p,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: previewUrl,
    }));

    setErrors((p) => ({ ...p, image: "" }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.category) newErrors.category = "Please select a category";

    if (!formData.introduction.trim()) {
      newErrors.introduction = "Introduction is required";
    } else if (formData.introduction.length < 50) {
      newErrors.introduction = "Introduction should be at least 50 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Main content is required";
    } else if (formData.content.length < 200) {
      newErrors.content = "Main content should be at least 200 characters";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    } else if (formData.summary.length < 30) {
      newErrors.summary = "Summary should be at least 30 characters";
    }

    if (!formData.imageFile && !formData.imageUrl) {
      newErrors.image = "Featured image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    charCounts,
    errors,
    categories,
    setFormData,
    handleChange,
    handleBlur,
    handleImageChange,
    validateForm,
  };
}
