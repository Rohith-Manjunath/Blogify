import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
              {user && (
                <>
                  <NavLink
                    to="/"
                    className=" text-gray-700 hover:text-white hover:bg-[#4f4ff9] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Blogs
                  </NavLink>
                  <NavLink
                    to={`/myBlogs/${user?._id}`}
                    className=" text-gray-700 hover:text-white hover:bg-[#4f4ff9] hover:bg-[rgba((77, 77, 235)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    My Blogs
                  </NavLink>
                  <NavLink
                    to={`/liked/${user?._id}`}
                    className=" text-gray-700 hover:text-white hover:bg-[#4f4ff9] hover:bg-[rgba((77, 77, 235)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Liked
                  </NavLink>
                </>
              )}
            </div>
            <div className="ml-4 flex items-center">
              {!user ? (
                <>
                  <div className=" px-3">
                    <Link
                      to={"/login"}
                      className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </div>
                  <div className=" px-3">
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
          {user && (
            <>
              <NavLink
                to="/"
                className=" text-gray-700 hover:text-white hover:bg-[#4f4ff9] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Blogs
              </NavLink>
              <NavLink
                to={`/myBlogs/${user?._id}`}
                className=" text-gray-700 hover:text-white hover:bg-[#4f4ff9] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                My Blogs
              </NavLink>
              <NavLink
                to={`/liked/${user?._id}`}
                className=" text-gray-700 hover:text-white hover:bg-[#4f4ff9] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200c"
              >
                Liked
              </NavLink>
            </>
          )}

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
