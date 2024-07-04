import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSingleBlogQuery } from "../Redux/blogAuth";

const Blog = () => {
  const params = useParams();
  const { data, isLoading, error } = useSingleBlogQuery(params?.id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (data) {
      setIsVisible(true);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
        <div className="text-2xl text-red-600 bg-white p-8 rounded-xl shadow-lg">
          Error: {error.message}
        </div>
      </div>
    );
  }

  const blog = data?.blog;

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
        <div className="text-2xl text-gray-600 bg-white p-8 rounded-xl shadow-lg">
          Blog not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-in-out">
      <div
        className={`max-w-4xl mx-auto transition-all duration-1000 ease-in-out ${
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-10"
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative">
            <img
              src={blog.image.url}
              alt={blog.title}
              className="w-full h-96 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center text-white opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {blog.description}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-center space-x-4"></div>
      </div>
    </div>
  );
};

export default Blog;
