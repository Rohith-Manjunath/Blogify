import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSingleBlogQuery, useUpdateBlogMutation } from "../Redux/blogAuth";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  FiEdit3,
  FiSave,
  FiX,
  FiCalendar,
  FiUser,
  FiClock,
} from "react-icons/fi";
import { useAlert } from "react-alert";
import MetaData from "../components/layouts/MetaData";

const Blog = () => {
  const params = useParams();
  const { data, isLoading, error } = useSingleBlogQuery(params?.id);
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const alert = useAlert();

  useEffect(() => {
    if (data) {
      setIsVisible(true);
      setEditedTitle(data?.blog?.title);
      setEditedContent(data?.blog?.description);
    }
  }, [data]);

  const stripPTags = (html) => {
    return html.replace(/<\/?p>/g, "");
  };

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
          Error: {error?.message}
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const credentials = {
        title: editedTitle,
        description: stripPTags(editedContent),
      };
      const data = await updateBlog({
        blogId: blog?._id,
        credentials,
      }).unwrap();
      setIsEditing(false);
      alert.success(data?.message);
    } catch (err) {
      alert.error("Failed to update blog");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(blog?.title);
    setEditedContent(blog?.description);
  };

  return (
    <>
      <MetaData title={blog?.title} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-in-out">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 mt-20">
            <div className="relative">
              <img
                src={blog?.image?.url}
                alt={blog?.title}
                className="w-full h-96 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.input
                      key="input"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight bg-transparent border-b-2 border-white w-full focus:outline-none"
                    />
                  ) : (
                    <motion.h1
                      key="title"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight"
                    >
                      {blog?.title}
                    </motion.h1>
                  )}
                </AnimatePresence>
                <div className="flex flex-wrap items-center text-white opacity-90 space-x-4 mt-4">
                  <div className="flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm">
                    <FiUser className="h-4 w-4 mr-2" />
                    <span>{blog?.author?.name}</span>
                  </div>
                  <div className="flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm">
                    <FiClock className="h-4 w-4 mr-2" />
                    <span>
                      {Math.ceil(blog?.description.split(" ").length / 200)} min
                      read
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 relative">
              {!isEditing && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="absolute top-4 right-4 p-2 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition duration-300"
                >
                  <FiEdit3 className="h-5 w-5" />
                </motion.button>
              )}
              <div className="prose prose-lg max-w-none">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <ReactQuill
                        theme="snow"
                        value={editedContent}
                        onChange={setEditedContent}
                        className="h-64 mb-16"
                      />
                      <div className="absolute bottom-0 right-0 space-x-4 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300"
                          disabled={isUpdating}
                        >
                          <FiSave className="inline-block mr-2" />
                          {isUpdating ? "Saving..." : "Save"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-300"
                        >
                          <FiX className="inline-block mr-2" />
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      dangerouslySetInnerHTML={{
                        __html: stripPTags(blog?.description),
                      }}
                      className="text-gray-700 leading-relaxed text-lg"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Blog;
