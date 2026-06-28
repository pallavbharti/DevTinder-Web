import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state,action) => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

/* User Login kare
    ↓
Backend se response aaye (user data)
    ↓
addUser() call karo → Redux Store mein save
    ↓
NavBar, Feed, Profile — sab components
store se user data le sakte hain! */