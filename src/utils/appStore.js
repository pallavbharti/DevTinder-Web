import { configureStore } from "@reduxjs/toolkit";  
import userReducer from "./userSlice";    

const appStore = configureStore({
  reducer: {
    user: userReducer,    // user drawer
    //feed: feedReducer,    // feed drawer (aage banega)
  },
});

export default appStore;