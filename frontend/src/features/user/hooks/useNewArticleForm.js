import { useState } from "react";
import { ARTICLE_CATEGORIES } from "@/data/articleCategories";

// Normalize line breaks: convert Windows \r\n to Unix \n
// This ensures consistent character counting between frontend and backend
const normalizeLineBreaks = (text) => text.replace(/\r\n/g, "\n");

// Max character limits matching backend validation
// Industry standard limits for professional article publishing
const MAX_LENGTHS = {
  title: 150,
  introduction: 1000,
  summary: 500,
  content: 100000,
};

const MIN_LENGTHS = {
  title: 10,
  introduction: 100,
  summary: 50,
  content: 300,
};

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
    title: normalizeLineBreaks(article?.title ?? "").length,
    introduction: normalizeLineBreaks(article?.introduction ?? "").length,
    content: normalizeLineBreaks(article?.content ?? "").length,
    summary: normalizeLineBreaks(article?.summary ?? "").length,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const normalizedLength = normalizeLineBreaks(value).length;

    // Always update form data - don't block input
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update character counts for all tracked fields
    if (
      name === "title" ||
      name === "introduction" ||
      name === "content" ||
      name === "summary"
    ) {
      setCharCounts((prev) => ({
        ...prev,
        [name]: normalizedLength,
      }));
    }

    // Show real-time error when exceeding limits
    if (MAX_LENGTHS[name] && normalizedLength > MAX_LENGTHS[name]) {
      const fieldLabels = {
        title: "Title",
        introduction: "Introduction",
        content: "Content",
        summary: "Summary",
      };
      setErrors((prev) => ({
        ...prev,
        [name]: `${fieldLabels[name]} exceeds maximum limit of ${MAX_LENGTHS[name].toLocaleString()} characters`,
      }));
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value || !value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "Please fill out this field." }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.croppedFile || e.target?.files?.[0];

    if (!file) return;

    if (!file.type || !file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    const previewUrl = e.croppedPreviewUrl || URL.createObjectURL(file);

    setFormData((prev) => {
      if (prev.imageUrl && prev.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prev.imageUrl);
      }
      return {
        ...prev,
        imageFile: file,
        imageUrl: previewUrl,
      };
    });

    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    const normalizedTitle = normalizeLineBreaks(formData.title);
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (normalizedTitle.length < MIN_LENGTHS.title) {
      newErrors.title = `Title should be at least ${MIN_LENGTHS.title} characters`;
    } else if (normalizedTitle.length > MAX_LENGTHS.title) {
      newErrors.title = `Title must be at most ${MAX_LENGTHS.title} characters`;
    }

    if (!formData.category) newErrors.category = "Please select a category";

    const normalizedIntro = normalizeLineBreaks(formData.introduction);
    if (!formData.introduction.trim()) {
      newErrors.introduction = "Introduction is required";
    } else if (normalizedIntro.length < MIN_LENGTHS.introduction) {
      newErrors.introduction = `Introduction should be at least ${MIN_LENGTHS.introduction} characters`;
    } else if (normalizedIntro.length > MAX_LENGTHS.introduction) {
      newErrors.introduction = `Introduction must be at most ${MAX_LENGTHS.introduction.toLocaleString()} characters`;
    }

    const normalizedContent = normalizeLineBreaks(formData.content);
    if (!formData.content.trim()) {
      newErrors.content = "Main content is required";
    } else if (normalizedContent.length < MIN_LENGTHS.content) {
      newErrors.content = `Main content should be at least ${MIN_LENGTHS.content} characters`;
    } else if (normalizedContent.length > MAX_LENGTHS.content) {
      newErrors.content = `Main content must be at most ${MAX_LENGTHS.content.toLocaleString()} characters`;
    }

    const normalizedSummary = normalizeLineBreaks(formData.summary);
    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    } else if (normalizedSummary.length < MIN_LENGTHS.summary) {
      newErrors.summary = `Summary should be at least ${MIN_LENGTHS.summary} characters`;
    } else if (normalizedSummary.length > MAX_LENGTHS.summary) {
      newErrors.summary = `Summary must be at most ${MAX_LENGTHS.summary} characters`;
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
    categories: ARTICLE_CATEGORIES,
    handleChange,
    handleBlur,
    handleImageChange,
    validateForm,
  };
}
