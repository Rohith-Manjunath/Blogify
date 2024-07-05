import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = "http://localhost:3000/api/";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: devUrl,
  }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    myBlogs: builder.query({
      query: () => ({
        url: "myBlogs",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Blog"],
    }),

    singleBlog: builder.query({
      query: (blogId) => ({
        url: `/blog/${blogId}`,
        method: "GET",
        credentials: "include",
      }),
      invalidatesTags: ["Blog"],
    }),

    create: builder.mutation({
      query: (credentials) => ({
        url: "create",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `blog/${blogId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useCreateMutation,
  useSingleBlogQuery,
  useDeleteBlogMutation,
  useMyBlogsQuery,
} = blogApi;
