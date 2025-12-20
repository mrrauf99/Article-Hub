import { useState } from "react";

export function useNewArticleForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    intro: "",
    mainContent: "",
    summary: "",
    image: null,
    imagePreview: "",
  });

  const [charCounts, setCharCounts] = useState({
    intro: 0,
    summary: 0,
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Technology",
    "Business",
    "Lifestyle",
    "Health & Wellness",
    "Education",
    "Entertainment",
    "Travel",
    "Food & Cooking",
    "Science",
    "Sports",
    "Others",
  ];

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
