import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const devUrl = "http://localhost:3000/api/";

export const myApi = createApi({
  reducerPath: "api",
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
      query: (credentials) => ({
        url: "me",
        method: "GET",
        body: credentials,
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
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useLoadUserQuery,
} = myApi;
