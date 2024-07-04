import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = "http://localhost:3000/api/";

export const myApi = createApi({
  reducerPath: "myApi",
  baseQuery: fetchBaseQuery({
    baseUrl: devUrl,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    blogs: builder.query({
      query: () => ({
        url: "blogs",
        method: "GET",
      }),
    }),
    myBlogs: builder.query({
      query: () => ({
        url: "myBlogs",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useLoadUserQuery,
  useBlogsQuery,
  useMyBlogsQuery,
} = myApi;
