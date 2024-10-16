import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  tokenExpiration: "",
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    LogoutUser: (state) => {
      state.user = null;
    },
    setTokenExpiration: (state, action) => {
      state.tokenExpiration = action.payload;
    },
    removeTokenExpiration: (state) => {
      state.tokenExpiration = "";
    },
  },
});

export const {
  setUser,
  LogoutUser,
  setTokenExpiration,
  removeTokenExpiration,
} = UserSlice.actions;
export default UserSlice.reducer;
