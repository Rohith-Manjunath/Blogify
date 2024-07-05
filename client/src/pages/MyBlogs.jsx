import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MyBlogCard from "../components/Cards/MyBlogCard";
import DeleteModal from "../components/Modals/DeleteModal";
import AddModal from "../components/Modals/AddModal";
import { useDeleteBlogMutation, useMyBlogsQuery } from "../Redux/blogAuth";
import { useAlert } from "react-alert";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import Button from "@mui/material/Button";

const MyBlogs = () => {
  const params = useParams();
  const { data, isLoading, refetch } = useMyBlogsQuery(params?.userId);
  const [id, setId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteBlog, { isLoading: deleteLoading }] = useDeleteBlogMutation();
  const alert = useAlert();

  const handleDelete = async (blogId) => {
    try {
      const data = await deleteBlog(blogId).unwrap();
      alert.success(data?.message);
      setOpenDelete(false);
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };

  const handleOpenDelete = (blogId) => {
    setId(blogId);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  // if (data?.blogs?.length === 0) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
  //       <div className="text-center p-8 bg-white rounded-lg shadow-xl">
  //         <FaExclamationCircle className="text-6xl text-indigo-500 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Yet</h2>
  //         <p className="text-gray-600">
  //           There are currently no data available.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mt-20"
          >
            My Blogs
          </motion.h1>
          <div className="flex justify-end mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenAdd}
              className="py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex items-center space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Blog</span>
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {data?.blogs?.map((blog) => (
              <motion.div
                key={blog?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MyBlogCard
                  blog={blog}
                  handleOpen={() => handleOpenDelete(blog?._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <DeleteModal
        handleClose={handleCloseDelete}
        deleteLoading={deleteLoading}
        handleDelete={handleDelete}
        id={id}
        open={openDelete}
      />

      <AddModal handleClose={handleCloseAdd} open={openAdd} />
      <button onClick={refetch}>Refetch</button>
    </>
  );
};

export default MyBlogs;
