import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/blog/:id" element={<Blog />}></Route>
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
    </BrowserRouter>
  );
};

export default App;
