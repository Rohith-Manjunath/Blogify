import { useState } from "react";
import { Link } from "react-router-dom";

const LikedBlogCard = ({ blog }) => {
  const [isHovered, setIsHovered] = useState(false);

  console.log(blog);

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
      </div>
    </div>
  );
};

export default LikedBlogCard;
