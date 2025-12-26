import { Form, useNavigation, useLoaderData } from "react-router-dom";
import { useNewArticleForm } from "../hooks/useNewArticleForm.js";

import TextArea from "../components/new-article/TextArea.jsx";
import Category from "../components/new-article/Category.jsx";
import ImageUpload from "../components/new-article/ImageUpload.jsx";
import Input from "../components/new-article/Input.jsx";

import styles from "../styles/ArticleForm.module.css";

export default function CreateArticlePage() {
  const data = useLoaderData();

  const {
    formData,
    charCounts,
    errors,
    categories,
    handleChange,
    handleImageChange,
    validateForm,
  } = useNewArticleForm(data?.article);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleSubmit = (e) => {
    const isValid = validateForm();
    if (!isValid) e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h1>Submit Your Article</h1>
          <p>Share your knowledge with the Article Hub community</p>
        </div>

        <Form
          className={styles.articleForm}
          onSubmit={handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <Input
            label="Article Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter your article title"
          />

          <Category
            label="Category"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={categories}
            placeholder="Select a category"
          />

          <TextArea
            label="Introduction"
            id="intro"
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            error={errors.intro}
            placeholder="Write the introduction of your article..."
            maxLength={500}
            charCount={charCounts.intro}
          />

          <TextArea
            label="Main Content"
            id="mainContent"
            name="mainContent"
            value={formData.mainContent}
            onChange={handleChange}
            error={errors.mainContent}
            placeholder="Write the main content of your article..."
            rows={12}
          />

          <TextArea
            label="Summary"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            error={errors.summary}
            placeholder="Write a brief summary to wrap up your article..."
            maxLength={300}
            charCount={charCounts.summary}
          />

          <ImageUpload
            label="Featured Image"
            id="image"
            name="image"
            onChange={handleImageChange}
            error={errors.image}
            image={formData.image}
            imagePreview={formData.imagePreview}
          />

          <button className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Publish Article"}
          </button>
        </Form>
      </div>
    </div>
  );
}
