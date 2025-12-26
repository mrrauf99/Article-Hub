import { useState } from "react";
import { ARTICLE_CATEGORIES as categories } from "@/data/articleCategories";

export function useNewArticleForm(article) {
  const [formData, setFormData] = useState({
    title: article?.title ?? "",
    category: article?.category ?? "",
    intro: article?.intro ?? "",
    mainContent: article?.mainContent ?? "",
    summary: article?.summary ?? "",
    image: null,
    imagePreview: article?.imageUrl ?? null,
  });

  const [charCounts, setCharCounts] = useState({
    intro: article?.intro?.length ?? 0,
    summary: article?.summary?.length ?? 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "intro" || name === "summary") {
      setCharCounts((prev) => ({
        ...prev,
        [name]: value.length,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (!formData.category) newErrors.category = "Please select a category";

    if (!formData.intro.trim()) {
      newErrors.intro = "Introduction is required";
    } else if (formData.intro.length < 50) {
      newErrors.intro = "Introduction should be at least 50 characters";
    }

    if (!formData.mainContent.trim()) {
      newErrors.mainContent = "Main content is required";
    } else if (formData.mainContent.length < 200) {
      newErrors.mainContent = "Main content should be at least 200 characters";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    } else if (formData.summary.length < 30) {
      newErrors.summary = "Summary should be at least 30 characters";
    }

    if (!formData.image) newErrors.image = "Featured image is required";

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
    handleImageChange,
    validateForm,
  };
}
