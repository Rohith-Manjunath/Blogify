import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Navbar from "./components/Navbar";
import MyBlogs from "./pages/MyBlogs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import LikedBlogs from "./pages/LikedBlogs";
import Profile from "./pages/Profile";
import UserData from "./pages/UserData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LogoutUser, removeTokenExpiration } from "./Redux/UserSlice";
import { useAlert } from "react-alert";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tokenExpiration } = useSelector((state) => state?.user); // Adjust based on your state structure
  const [alertShown, setAlertShown] = useState(false); // State to track if the alert has been shown
  const alert = useAlert();
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (tokenExpiration) {
        const expirationTime = new Date(tokenExpiration).getTime(); // Convert to timestamp
        if (Date.now() >= expirationTime) {
          if (!alertShown) {
            // Only show alert if it hasn't been shown yet
            alert.error("Token expired, please login again");
            setAlertShown(true); // Set the alert shown state to true
          }
          dispatch(LogoutUser()); // Dispatch logout action
          navigate("/login"); // Redirect to login
          dispatch(removeTokenExpiration());
        } else {
          setAlertShown(false); // Reset alert shown if token is still valid
        }
      }
    };

    checkTokenExpiration(); // Check immediately on mount

    // Set an interval to check every 5 seconds
    const intervalId = setInterval(checkTokenExpiration, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [dispatch, navigate, tokenExpiration, alertShown, alert]); // Add alertShown to dependencies

  return (
    // <BrowserRouter>

    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/blog/:id" element={<Blog />}></Route>
        <Route path="/user/:id" element={<UserData />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/myBlogs/:userId" element={<MyBlogs />}></Route>
          <Route path="/liked/:userId" element={<LikedBlogs />}></Route>
          <Route path="/profile/:userId" element={<Profile />}></Route>
        </Route>
        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route
          path="/reset/password/:token"
          element={<ResetPassword />}
        ></Route>
      </Routes>
    </>
    // </BrowserRouter>
  );
};

export default App;
