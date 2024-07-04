import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = "http://localhost:3000/api/";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: devUrl,
  }),
  endpoints: (builder) => ({
    create: builder.mutation({
      query: (credentials) => ({
        url: "create",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    singleBlog: builder.query({
      query: (blogId) => ({
        url: `/blog/${blogId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useCreateMutation, useSingleBlogQuery } = blogApi;
