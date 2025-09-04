import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import analysisReducer from "../features/analysisSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer
  }
});
