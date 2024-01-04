/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "tab",
  initialState: {
    tabName: "",
    status: "idle", // idle | pending | succeeded | failed
  },
  reducers: {
    setStatus: (state) => {
      state.status = "pending";
    },
  },
});

export const { showChatGPT } = slice.actions;

export const { reducer } = slice;
