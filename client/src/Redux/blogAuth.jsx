import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = "http://localhost:3000/api/";
const productionUrl = "https://blogify-1-fspq.onrender.com/api/";

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
    like: builder.mutation({
      query: (id) => ({
        url: `blog/like/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Blog"],
    }),
    liked: builder.query({
      query: (userId) => ({
        url: `blogs/liked/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useCreateMutation,
  useSingleBlogQuery,
  useDeleteBlogMutation,
  useMyBlogsQuery,
  useUpdateBlogMutation,
  useLikeMutation,
  useLikedQuery,
} = blogApi;
