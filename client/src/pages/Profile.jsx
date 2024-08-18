import React, { useState } from "react";
import { FaCamera, FaEdit, FaUserCircle, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RiLockPasswordLine } from "react-icons/ri";
import { setUser } from "../Redux/UserSlice";
import { useAlert } from "react-alert";
import { useAddProfilePictureMutation } from "../Redux/authApi";

const Profile = () => {
  const user = useSelector((state) => state?.user?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const alert = useAlert();
  const dispatch = useDispatch();
  const [updateProfilePic, { isLoading: imageUploadLoading }] =
    useAddProfilePictureMutation();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        const imageUrl = reader.result;
        setSelectedImage(imageUrl);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const data = await updateProfilePic({
        image: selectedImage,
      }).unwrap();
      alert.success(data?.message);
      setIsModalOpen(false);
      setSelectedImage("");
      dispatch(setUser(data?.user));
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col items-center justify-center">
            <div className="relative mb-8 group">
              <img
                src={
                  user?.avatar?.url ||
                  `https://static.vecteezy.com/system/resources/previews/036/280/650/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg`
                }
                alt=""
                className="w-48 h-48 rounded-full border-4 border-white shadow-lg transition-all duration-300 group-hover:opacity-75"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-3 shadow-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-110"
              >
                <FaCamera size={24} title="Add profile picture" />
              </button>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{user?.name}</h2>
            <p className="text-blue-200 mb-4">{user?.email}</p>
            <span className="bg-white text-blue-600 px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              {user?.isAdmin ? "Admin" : "User"}
            </span>
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Profile Details
            </h3>
            <div className="space-y-4">
              <ProfileDetail
                icon={<FaUserCircle />}
                label="User ID"
                value={user?._id}
              />
              <ProfileDetail
                icon={<FaUserCircle />}
                label="Joined"
                value={new Date(user?.createdAt).toLocaleDateString()}
              />
            </div>
            <div className="mt-8 space-y-4">
              <ProfileButton
                icon={<FaEdit />}
                label="Update Profile"
                color="blue"
              />
              <ProfileButton
                icon={<RiLockPasswordLine />}
                label="Change Password"
                color="indigo"
              />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Update Profile Picture</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                Choose Image
              </label>
            </div>
            {selectedImage && (
              <div className="mb-4">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            <button
              onClick={handleImageUpdateSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              {imageUploadLoading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileDetail = ({ icon, label, value }) => (
  <div className="flex items-center text-gray-600 bg-gray-100 p-3 rounded-lg overflow-x-hidden">
    <span className="mr-3 text-blue-500">{icon}</span>
    <span className="font-medium text-[14px]">{label}:</span>
    <span className="ml-2 text-gray-800 text-[14px]">{value}</span>
  </div>
);

const ProfileButton = ({ icon, label, color }) => (
  <button
    className={`w-full flex items-center justify-center gap-2 bg-${color}-500 text-white px-6 py-3 rounded-lg hover:bg-${color}-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Profile;
