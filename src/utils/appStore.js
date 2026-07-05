import { configureStore } from "@reduxjs/toolkit";  
import userReducer from "./userSlice";    
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,    // user drawer
    feed: feedReducer,    // feed drawer (aage banega)
    connections: connectionReducer,  // connection drawer
    requests: requestReducer,  // requests drawer
  },
});

export default appStore;