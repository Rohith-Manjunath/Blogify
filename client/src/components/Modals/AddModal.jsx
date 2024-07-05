import React, { useState } from "react";
import { useAlert } from "react-alert";
import { useCreateMutation } from "../../Redux/blogAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUpload, FiEdit3, FiAlignLeft } from "react-icons/fi";

const AddModal = ({ handleClose, open }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createBlog, { isLoading }] = useCreateMutation();
  const alert = useAlert();
  const [userImage, setUserImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createBlog({
        title,
        description,
        image: userImage,
      }).unwrap();
      alert.success(data?.message);
      handleClose();
      setTitle("");
      setDescription("");
      setUserImage("");
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        const imageUrl = reader.result;
        setUserImage(imageUrl);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 "></div>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Create New Blog
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <FiEdit3 className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter title"
                  className="w-full pl-10 outline-none pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                />
              </div>
              <div className="relative">
                <FiAlignLeft className="absolute top-3 left-3 text-gray-400" />
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  placeholder="Enter description"
                  className="w-full pl-10 pr-4 py-2 outline-none border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-gray-700 mb-1"
                  htmlFor="image"
                >
                  Blog Image
                </label>
                <div className="relative">
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    name="image"
                    id="image"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image"
                    className="flex items-center justify-center w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer transition duration-200 ease-in-out"
                  >
                    <FiUpload className="mr-2" />
                    Upload Image
                  </label>
                </div>
                {userImage && (
                  <motion.img
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    src={userImage}
                    alt="Preview"
                    className="mt-2 rounded-lg shadow-md max-h-40 object-cover"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2 px-4 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ease-in-out"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Blog"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddModal;
