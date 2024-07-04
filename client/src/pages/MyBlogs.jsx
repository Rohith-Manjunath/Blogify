import { useParams } from "react-router-dom";
import { useMyBlogsQuery } from "../Redux/authApi";
import BlogCard from "../components/Cards/BlogCard";

const MyBlogs = () => {
  const params = useParams();
  const { data, isLoading } = useMyBlogsQuery(params?.userId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mt-20">
          Discover Our Latest Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data &&
            data.blogs &&
            data.blogs.map((blog) => <BlogCard key={blog?._id} blog={blog} />)}
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
