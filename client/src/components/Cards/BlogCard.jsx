import { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useLikeMutation } from "../../Redux/blogAuth";
import { useSelector } from "react-redux";
import {
  useCommentMutation,
  useDeleteCommentMutation,
} from "../../Redux/authApi";

const BlogCard = ({ blog, refetch }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const alert = useAlert();
  const user = useSelector((state) => state?.user?.user);
  const [commentNow, { data }] = useCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [like, { isLoading }] = useLikeMutation();

  const handleLike = async (blogId) => {
    try {
      if (user) {
        const data = await like(blogId).unwrap();
        await refetch();
      } else {
        alert.show("Please login to like this blog");
      }
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };

  const handleCommentSubmit = async (blogId) => {
    try {
      if (user) {
        const data = await commentNow({ blogId, comment }).unwrap();
        setComment("");
        alert.success(data?.message);
      } else {
        alert.show("Please login to like this blog");
      }
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };
  const handleDeleteComment = async (blogId, commentId) => {
    try {
      if (user) {
        const data = await deleteComment({ blogId, commentId }).unwrap();
        setComment("");
        alert.success(data?.message);
      } else {
        alert.show("Please login to like this blog");
      }
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ height: "250px" }}>
        <img
          src={blog?.image?.url}
          alt={blog?.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white line-clamp-2">
            {blog?.title}
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {!blog?.user?.avatar?.url ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <img
                src={blog?.user?.avatar?.url}
                alt=""
                className="w-8 mr-2 h-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium text-gray-700">
              {blog?.user?.name || blog?.user?.email || "Anonymous"}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(blog?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{blog?.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-indigo-600 font-semibold">
            {blog?.category}
          </span>
          <Link
            to={`/blog/${blog?._id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-1"
          >
            <span>Read More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        <div className="flex justify-start items-center mt-4 gap-4">
          <button
            onClick={() => handleLike(blog?._id)}
            className="focus:outline-none flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 transition-colors duration-300 ${
                blog?.likes?.users?.some((like) => like?._id === user?._id)
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="ml-1 text-gray-600">
              {blog?.likes?.users?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="focus:outline-none flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-300 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span className="ml-1">
              {blog?.comments?.length || 0} Comment
              {blog?.comments?.length !== 1 ? "s" : ""}
            </span>
          </button>
        </div>
        {showComments && (
          <div className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-2 sm:p-4 md:p-8 transition-all duration-300 ease-in-out hover:shadow-xl">
            <h3 className="text-xxl font-bold mb-6 text-gray-600 border-b pb-2">
              Comments
            </h3>

            {blog?.comments && blog?.comments.length > 0 ? (
              <div className="space-y-6 max-h-[200px] overflow-y-scroll p-2">
                {blog?.comments?.map((comment) => (
                  <div
                    key={comment?._id}
                    className=" bg-white rounded-lg shadow-md p-3 transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <div className="xl:flex justify-between items-center mb-3">
                      <div className="flex items-center justify-start gap-2">
                        <img
                          src={comment?.user?.avatar?.url}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <h4 className="text-[15px] font-bold text-gray-600">
                          {comment?.user?.name}
                        </h4>
                      </div>
                      <span className="text-[12px] text-gray-400 italic">
                        {new Date(comment?.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {comment?.comment}
                    </p>
                    {comment?.user?._id === user?._id && (
                      <button
                        onClick={() =>
                          handleDeleteComment(blog?._id, comment?._id)
                        }
                        className="mt-3 text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-center py-2">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}

            <div className="mt-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full outline-none border-gray-300 px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                rows="4"
              />
              <button
                onClick={() => handleCommentSubmit(blog?._id)}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 transform group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Submit Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
