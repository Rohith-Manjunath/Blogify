import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = "http://localhost:3000/api/";
const productionUrl = "https://assignment-blog-1ek8.onrender.com/api/";

export const myApi = createApi({
  reducerPath: "myApi",
  baseQuery: fetchBaseQuery({
    baseUrl: productionUrl,
  }),
  tagTypes: ["Blogs", "Liked"],
  endpoints: (builder) => ({
    blogs: builder.query({
      query: () => ({
        url: "blogs",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Blogs"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      invalidatesTags: ["Blogs"],
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
      invalidatesTags: ["Blogs"],
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "forgotPassword",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `resetPassword/${data?.token}`,
        method: "PUT",
        credentials: "include",
        body: {
          password: data?.password,
          confirmPassword: data?.confirmPassword,
        },
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = myApi;
