import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../Redux/authApi";
import { LogoutUser } from "../Redux/UserSlice";
import { useAlert } from "react-alert";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutUser = async () => {
    try {
      const data = await logout().unwrap();
      alert.success(data?.message);
      dispatch(LogoutUser());
      navigate("/login");
    } catch (e) {
      alert.error(e?.data?.err);
      return;
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                Blogify
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Blogs
              </Link>
              {user && (
                <Link
                  to={`/myBlogs/${user?._id}`}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  My Blogs
                </Link>
              )}
            </div>
            <div className="ml-4 flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-100 text-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white w-64 transition-all duration-200"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 absolute left-3 top-2.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {!user ? (
                <>
                  <div className="mt-3 px-3">
                    <Link
                      to={"/login"}
                      className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </div>
                  <div className="mt-3 px-3">
                    <Link
                      to={"/register"}
                      className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Register
                    </Link>
                  </div>
                </>
              ) : (
                <div className="mt-3 px-3">
                  <button
                    onClick={logoutUser}
                    className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    {isLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden absolute top-20 left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
          >
            Blogs
          </Link>
          {user && (
            <Link
              to={`/myBlogs/${user?._id}`}
              className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              My Blogs
            </Link>
          )}
          <div className="relative mt-3 px-3">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 text-gray-700 rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 my-4"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 my-4 w-5 text-gray-500 absolute left-6 top-2.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {!user ? (
            <>
              <div className="flex items-center justify-center flex-col gap-4 w-full">
                <div className="mt-3 px-3 w-full">
                  <Link
                    to={"/login"}
                    className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
                <div className="mt-3 px-3 w-full">
                  <Link
                    to={"/register"}
                    className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-3 px-3">
              <button
                onClick={logoutUser}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {isLoading ? "Logging out..." : "Logout"}{" "}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
