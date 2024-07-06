import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../Redux/authApi";
import { setUser } from "../Redux/UserSlice";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../components/layouts/MetaData";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setUser(data?.user));
      alert.success(data?.message);
      navigate("/");
    } catch (e) {
      alert.error(e?.data?.err);
      return;
    }
  };

  return (
    <>
      <MetaData title={"Login"} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
          <h2
            style={{ lineHeight: "1.5" }} // Adjust line height as needed
            className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500"
          >
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/forgotPassword"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
