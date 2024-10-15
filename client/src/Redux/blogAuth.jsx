import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const productionUrl = "https://blogify-1-fspq.onrender.com/api/";

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
      // Invalidates tags manually for a pessimistic update
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // If successful, optimistically update the cache for `myBlogs`
          dispatch(
            blogApi.util.updateQueryData("myBlogs", undefined, (draft) => {
              draft.push(data); // Add the new blog to the cached array
            })
          );
        } catch (error) {
          // Handle error if needed
        }
      },
      invalidatesTags: ["Blog"], // Invalidate the blog tag for other queries
    }),

    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `blog/${blogId}`,
        method: "DELETE",
        credentials: "include",
      }),
      // Invalidates tags manually for a pessimistic update
      async onQueryStarted(blogId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          blogApi.util.updateQueryData("myBlogs", undefined, (draft) => {
            // Remove the deleted blog from the cached array
            return draft.filter((blog) => blog._id !== blogId);
          })
        );
        try {
          await queryFulfilled; // Wait for the delete mutation to complete
        } catch (error) {
          patchResult.undo(); // Roll back the optimistic update on error
        }
      },
      invalidatesTags: ["Blog"], // Invalidate the blog tag for other queries
    }),

    updateBlog: builder.mutation({
      query: ({ blogId, credentials }) => ({
        url: `blog/${blogId}`,
        method: "PUT",
        credentials: "include",
        body: credentials,
      }),
      // Invalidates tags manually for a pessimistic update
      async onQueryStarted(
        { blogId, credentials },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          blogApi.util.updateQueryData("singleBlog", blogId, (draft) => {
            // Update the specific blog in the cache
            Object.assign(draft, credentials); // Assuming credentials contains updated blog data
          })
        );

        try {
          await queryFulfilled; // Wait for the update mutation to complete
        } catch (error) {
          patchResult.undo(); // Roll back the optimistic update on error
        }
      },
      invalidatesTags: ["Blog"], // Invalidate the blog tag for other queries
    }),

    like: builder.mutation({
      query: (id) => ({
        url: `blog/like/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          blogApi.util.updateQueryData("singleBlog", id, (draft) => {
            // Update the blog's like count or status in the cache
            draft.likes += 1; // Adjust based on your data structure
          })
        );

        try {
          await queryFulfilled; // Wait for the like mutation to complete
        } catch (error) {
          patchResult.undo(); // Roll back the optimistic update on error
        }
      },
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

// Export hooks for usage in functional components
export const {
  useCreateMutation,
  useSingleBlogQuery,
  useDeleteBlogMutation,
  useMyBlogsQuery,
  useUpdateBlogMutation,
  useLikeMutation,
  useLikedQuery,
} = blogApi;
