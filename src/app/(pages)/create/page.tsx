"use client";

import { useState } from "react";
import AIPanel from "@/components/AIPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faUpload } from "@fortawesome/free-solid-svg-icons";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content, tags });
    alert("✅ Your post has been saved (mock)");
  };

  return (
    <section className="py-20 bg-faith-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Create a New Post
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Share your reflections, devotionals, or testimonies with the FaithConnect community.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left side: Post Editor */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Post Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How Faith Overcomes Fear"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-faith-blue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full h-56 border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-faith-blue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tags
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. #faith #hope #prayer"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-faith-blue outline-none"
                />
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => setUploading(true)}
                  className="flex items-center bg-faith-gold text-white px-5 py-2 rounded-lg font-medium hover:bg-yellow-600"
                >
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Upload Image
                </button>

                <button
                  type="submit"
                  className="flex items-center bg-faith-blue text-white px-5 py-2 rounded-lg font-medium hover:bg-faith-purple"
                >
                  <FontAwesomeIcon icon={faPen} className="mr-2" />
                  Publish Post
                </button>
              </div>
            </form>
          </div>

          {/* Right side: AI Panel */}
          <AIPanel />
        </div>
      </div>
    </section>
  );
}
