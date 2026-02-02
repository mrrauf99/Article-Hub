import { useNavigation, useLoaderData, useSubmit } from "react-router-dom";
import { useNewArticleForm } from "../hooks/useNewArticleForm.js";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Feather,
  Type,
  FolderOpen,
  FileText,
  ListChecks,
  ImagePlus,
  Sparkles,
  Send,
  Loader2,
  PenLine,
  AlignLeft,
} from "lucide-react";

import TextArea from "../components/new-article/TextArea.jsx";
import Category from "../components/new-article/Category.jsx";
import ImageUpload from "../components/new-article/ImageUpload.jsx";
import Input from "../components/new-article/Input.jsx";

import styles from "../styles/ArticleForm.module.css";

export default function CreateArticlePage() {
  const data = useLoaderData();
  const submit = useSubmit();
  const {
    formData,
    charCounts,
    errors,
    categories,
    handleChange,
    handleBlur,
    handleImageChange,
    validateForm,
  } = useNewArticleForm(data?.article);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isEditing = !!data?.article;

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    // Normalize line breaks: convert Windows \r\n to Unix \n
    // This ensures character count matches between frontend and backend
    const normalizeText = (text) => text.replace(/\r\n/g, "\n");

    const submitData = new FormData();

    submitData.append("title", normalizeText(formData.title));
    submitData.append("category", formData.category || "");
    submitData.append("introduction", normalizeText(formData.introduction));
    submitData.append("content", normalizeText(formData.content));
    submitData.append("summary", normalizeText(formData.summary));

    if (formData.imageFile) {
      submitData.append("image", formData.imageFile);
    } else if (
      isEditing &&
      formData.imageUrl &&
      !formData.imageUrl.startsWith("blob:")
    ) {
      submitData.append("existingImageUrl", formData.imageUrl);
    }

    submit(submitData, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Background decorations */}
      <div className={styles.bgDecoration}>
        <div className={styles.bgCircle1} />
        <div className={styles.bgCircle2} />
      </div>

      <ScrollReveal animation="fade-up" duration={600}>
        <div className={styles.container}>
          {/* Header Section - Inline like navbar */}
          <div className={styles.headerSection}>
            <div className={styles.headerRow}>
              <div className={styles.headerIcon}>
                <Feather className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <h1 className={styles.headerTitle}>
                {isEditing ? "Edit Article" : "Create Article"}
              </h1>
              <Sparkles className={styles.sparkleIcon} />
            </div>
            <p className={styles.headerSubtitle}>
              {isEditing
                ? "Update your article and share your thoughts"
                : "Share your knowledge with the community"}
            </p>
          </div>

          {/* Form Card */}
          <div className={styles.formCard}>
            <form className={styles.articleForm} onSubmit={handleSubmit}>
              {/* Section: Basic Info */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={styles.sectionTitle}>Basic Information</h3>
                    <p className={styles.sectionDesc}>
                      Give your article a compelling title and category
                    </p>
                  </div>
                </div>

                <div className={styles.fieldsGrid}>
                  <Input
                    label="Article Title"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.title}
                    placeholder="Enter a captivating title..."
                    icon={<Type className="w-4 h-4" />}
                    maxLength={200}
                    charCount={charCounts.title}
                  />

                  <Category
                    label="Category"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.category}
                    options={categories}
                    placeholder="Select a category"
                    icon={<FolderOpen className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Section: Content */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <PenLine className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={styles.sectionTitle}>Article Content</h3>
                    <p className={styles.sectionDesc}>
                      Write your introduction, main content, and summary
                    </p>
                  </div>
                </div>

                <TextArea
                  label="Introduction"
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.introduction}
                  placeholder="Hook your readers with an engaging introduction..."
                  maxLength={500}
                  charCount={charCounts.introduction}
                  rows={4}
                  icon={<AlignLeft className="w-4 h-4" />}
                />

                <TextArea
                  label="Main Content"
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.content}
                  placeholder="Share your insights, ideas, and knowledge..."
                  rows={10}
                  icon={<PenLine className="w-4 h-4" />}
                />

                <TextArea
                  label="Summary"
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.summary}
                  placeholder="Wrap up with key takeaways..."
                  maxLength={300}
                  charCount={charCounts.summary}
                  rows={3}
                  icon={<ListChecks className="w-4 h-4" />}
                />
              </div>

              {/* Section: Media */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <ImagePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={styles.sectionTitle}>Featured Image</h3>
                    <p className={styles.sectionDesc}>
                      Add a cover image to make your article stand out
                    </p>
                  </div>
                </div>

                <ImageUpload
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  error={errors.image}
                  imageFile={formData.imageFile}
                  imageUrl={formData.imageUrl}
                />

                {/* Hidden field to preserve existing image URL during edit */}
                {isEditing && formData.imageUrl && !formData.imageFile && (
                  <input
                    type="hidden"
                    name="existingImageUrl"
                    value={formData.imageUrl}
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className={styles.submitSection}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>
                        {isEditing ? "Update Article" : "Publish Article"}
                      </span>
                    </>
                  )}
                </button>
                <p className={styles.submitHint}>
                  Your article will be reviewed before publishing
                </p>
              </div>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
