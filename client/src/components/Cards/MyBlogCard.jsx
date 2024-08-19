import { Link } from "react-router-dom";
import { useLikeMutation } from "../../Redux/blogAuth";
import { useSelector } from "react-redux";

const MyBlogCard = ({ blog, handleOpen }) => {
  const [like, { isLoading }] = useLikeMutation();
  const user = useSelector((state) => state?.user?.user);

  const handleLike = async (blogId) => {
    try {
      if (user) {
        await like(blogId).unwrap();
      } else {
        alert.show("Please login to like this blog");
      }
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 relative">
      <img
        src={blog?.image.url}
        alt={blog?.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
          {blog?.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{blog?.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-indigo-600 font-semibold">
            {new Date(blog?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <Link
            to={`/blog/${blog?._id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium"
          >
            Read More
          </Link>
        </div>
      </div>
      <button
        onClick={() => handleOpen(blog?._id)}
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
        aria-label="Delete blog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="flex justify-start items-center m-4 gap-1">
        <button
          onClick={() => handleLike(blog?._id)}
          className="focus:outline-none flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-colors duration-300 ${
              blog?.likes?.users?.some((like) => like?._id !== user?._id)
                ? "text-red-500"
                : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <span className="text-gray-600 text-xl">
          {blog?.likes?.users?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default MyBlogCard;
