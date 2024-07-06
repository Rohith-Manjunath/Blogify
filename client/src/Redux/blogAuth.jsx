import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = "http://localhost:3000/api/";
const productionUrl = "https://assignment-blog-1ek8.onrender.com/";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: productionUrl,
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
      providesTags: ["Blog"],
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
    updateBlog: builder.mutation({
      query: ({ blogId, credentials }) => ({
        url: `blog/${blogId}`,
        method: "PUT",
        credentials: "include",
        body: credentials,
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
  useUpdateBlogMutation,
} = blogApi;
