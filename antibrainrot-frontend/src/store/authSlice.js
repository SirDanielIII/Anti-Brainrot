import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // Correct import statement

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = {
        ...action.payload.user,
      };
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
    loadAuthFromStorage: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        state.user = decodedToken;
        state.token = token;
      }
    },
  },
});

export const { setAuth, clearAuth, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
