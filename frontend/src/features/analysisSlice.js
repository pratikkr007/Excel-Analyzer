import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";

export const fetchHistory = createAsyncThunk("analysis/history", async () => {
  const res = await API.get("/analysis/history");
  return res.data;
});

const analysisSlice = createSlice({
  name: "analysis",
  initialState: { history: [], file: null },
  reducers: {
    uploadFile: (state, action) => {
      state.file = action.payload;   // store uploaded file
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.history = action.payload;
    });
  }
});

export const { uploadFile } = analysisSlice.actions;
export default analysisSlice.reducer;
