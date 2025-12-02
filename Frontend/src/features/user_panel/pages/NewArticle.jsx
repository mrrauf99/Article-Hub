import { Form, useNavigation } from "react-router-dom";
import { useNewArticleForm } from "../hooks/useNewArticleForm.js";
import Input from "../components/NewArticle/Input.jsx";
import TextArea from "../components/NewArticle/TextArea.jsx";
import Category from "../components/NewArticle/Category.jsx";
import ImageUpload from "../components/NewArticle/ImageUpload.jsx";
import "../styles/form-layout.css";

export default function NewArticle() {
  const {
    formData,
    charCounts,
    errors,
    categories,
    handleChange,
    handleImageChange,
    validateForm,
  } = useNewArticleForm();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleSubmit = (e) => {
    const isValid = validateForm();
    if (!isValid) e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container ">
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Submit Your Article</h1>
          <p>Share your knowledge with the Article Hub community</p>
        </div>

        <Form
          className="article-form"
          onSubmit={handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <Input
            label="Article Title"
            id="title"
            name="title"
            type="text"
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
            rows={4}
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
            rows={4}
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

          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Publish Article"}
          </button>
        </Form>
      </div>
    </div>
  );
}
