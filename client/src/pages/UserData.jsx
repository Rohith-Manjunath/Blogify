import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFollowUnfollowMutation, useUserDataQuery } from "../Redux/authApi";
import {
  User,
  Heart,
  Calendar,
  Mail,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";

const UserData = () => {
  const params = useParams();
  const userId = params?.id;
  const { data, isLoading, refetch } = useUserDataQuery(userId);
  const [follow] = useFollowUnfollowMutation();
  const alert = useAlert();
  const user = useSelector((state) => state?.user?.user);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  if (!data || !data?.success) {
    return (
      <div className="text-center text-red-500 mt-8">
        Failed to load user data
      </div>
    );
  }

  const { name, email, createdAt, followers, liked, avatar } = data?.user;
  const avatarUrl = avatar?.url || "/api/placeholder/150/150";
  const handleFollowClick = async () => {
    try {
      const data = await follow(userId).unwrap();
      alert.success(data?.message);
    } catch (e) {
      alert.error(e?.data?.err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mt-20">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={avatarUrl}
              alt={name}
            />
          </div>
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              User Profile
            </div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {name}
            </h1>
            <div className="mt-4 flex items-center text-gray-600">
              <Mail className="h-5 w-5 mr-2" />
              <span>{email}</span>
            </div>
            <div className="mt-2 flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Joined {new Date(createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {followers.length}
                  </span>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {liked.length}
                  </span>
                  <p className="text-gray-600">Liked</p>
                </div>
              </div>
              {user?._id !== userId && (
                <button
                  onClick={handleFollowClick}
                  className={`px-4 py-2 rounded-full font-bold text-white transition-colors duration-300 ${
                    data?.user?.followers?.some(
                      (user) => user?._id === user?._id
                    )
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {data?.user?.followers?.some(
                    (user) => user?._id === user?._id
                  )
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
