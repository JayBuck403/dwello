// app/admin/blog/new/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAuthToken } from "@/components/getToken";
import { useRouter } from "next/navigation";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFeaturedImage(event.target.files[0]);
    } else {
      setFeaturedImage(null);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // For now, we'll use a placeholder URL
    // In a real implementation, you'd upload to Firebase Storage or similar
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPublishing(true);
    setPublishError("");
    setPublishSuccess(false);

    try {
      const token = await getAuthToken();
      if (!token) {
        setPublishError("Authentication required");
        setIsPublishing(false);
        return;
      }

      let imageUrl = "";
      if (featuredImage) {
        imageUrl = await uploadImage(featuredImage);
      }

      const blogData = {
        title,
        content,
        excerpt,
        author,
        category,
        featured_image_url: imageUrl,
        tags: [],
      };

      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/blog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(blogData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog post");
      }

      setPublishSuccess(true);
      setTitle("");
      setContent("");
      setExcerpt("");
      setAuthor("");
      setCategory("");
      setFeaturedImage(null);
      setFeaturedImageUrl("");

      // Redirect to blog list after 2 seconds
      setTimeout(() => {
        router.push("/admin/blog");
      }, 2000);
    } catch (error: any) {
      console.error("Publish error:", error);
      setPublishError(
        error.message || "Failed to publish blog post. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
      <Card className="w-full max-w-2xl py-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create New Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          {publishSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ✅ Blog post published successfully. Redirecting...
            </div>
          )}
          {publishError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              ❌ {publishError}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="text-sm font-medium">
                Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Brief summary of the blog post..."
              />
            </div>
            <div>
              <label htmlFor="content" className="text-sm font-medium">
                Content *
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="text-sm font-medium">
                Author *
              </label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Real Estate Tips, Market News"
              />
            </div>
            <div>
              <label htmlFor="featuredImage" className="text-sm font-medium">
                Featured Image
              </label>
              <Input
                id="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {featuredImage && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {featuredImage.name}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isPublishing} className="w-full">
              {isPublishing ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
