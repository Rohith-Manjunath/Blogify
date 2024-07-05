import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MyBlogCard from "../components/Cards/MyBlogCard";
import DeleteModal from "../components/Modals/DeleteModal";
import { useDeleteBlogMutation, useMyBlogsQuery } from "../Redux/blogAuth";
import { useAlert } from "react-alert";

const MyBlogs = () => {
  const params = useParams();
  const { data, isLoading } = useMyBlogsQuery(params?.userId);
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteBlog, { isLoading: deleteLoading }] = useDeleteBlogMutation();
  const alert = useAlert();

  const handleDelete = async (blogId) => {
    try {
      const data = await deleteBlog(blogId).unwrap();
      alert.success(data?.message); // Assuming alert is imported and available
      setOpen(false);
    } catch (e) {
      alert.error(e?.data?.err); // Assuming alert is imported and available
    }
  };

  const handleOpen = (blogId) => {
    setId(blogId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mt-20">
            My Blogs
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data?.blogs.map((blog) => (
              <MyBlogCard
                key={blog?._id}
                blog={blog}
                handleOpen={() => handleOpen(blog?._id)}
              />
            ))}
          </div>
        </div>
      </div>

      <DeleteModal
        handleClose={handleClose}
        deleteLoading={deleteLoading}
        handleDelete={handleDelete}
        id={id}
        open={open}
      />
    </>
  );
};

export default MyBlogs;
