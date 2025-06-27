import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "User",
  initialState: {
    data: null,
  },
  reducers: {
    login(currentState, { payload }) {
      currentState.data = payload.user;
    },
    logout(currentState) {
      currentState.data = null;
    },
    lsLogin(currentState) {
      // No-op in React Native unless using redux-persist
    }
  }
});

export const { login, logout, lsLogin } = UserSlice.actions;
export default UserSlice.reducer;