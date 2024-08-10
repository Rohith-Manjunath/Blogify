import { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useLikeMutation } from "../../Redux/blogAuth";
import { useSelector } from "react-redux";

const BlogCard = ({ blog, refetch }) => {
  const [isHovered, setIsHovered] = useState(false);
  const alert = useAlert();
  const [likes, setLikes] = useState(blog?.likes?.users?.length);
  const [isLiked, setIsLiked] = useState(blog?.isLiked);
  const user = useSelector((state) => state?.user?.user);

  const [like, { isLoading }] = useLikeMutation();

  const handleLike = async (blogId) => {
    try {
      if (user) {
        const data = await like(blogId).unwrap();
        setLikes(data?.likes || 0);
        setIsLiked(data?.isLiked);
        await refetch();
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
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <img
          src={blog?.image?.url}
          alt={blog?.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {blog?.title}
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
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
        <div className="flex justify-start items-center mt-4 gap-1">
          <button
            onClick={() => {
              handleLike(blog?._id);
            }}
            className="focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 transition-colors duration-300 ${
                isLiked ? "text-red-500" : "text-gray-400"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <span className="text-gray-600 text-xl">{likes || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
