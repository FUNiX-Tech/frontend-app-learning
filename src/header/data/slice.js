/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "header",
  initialState: {
    isShowChatGPT: false,
    isShowGlobalChatGPT: false,
    isShowLessonContent: false,
    isShowFeedback: false,
    isShowChatbot: true,
    isShowLeftbar: true,
  },
  reducers: {
    showChatGPT: (state) => {
      state.isShowChatGPT = !state.isShowChatGPT;
    },
    showGlobalChatGPT: (state) => {
      state.isShowGlobalChatGPT = !state.isShowGlobalChatGPT;
      state.isShowLessonContent = false;
      state.isShowFeedback = false;
    },
    closeChatGPT: (state) => {
      state.isShowGlobalChatGPT = false;
    },
    toggleShowChatbot: (state) => {
      state.isShowChatbot = !state.isShowChatbot;
      state.isShowLessonContent = false;
      state.isShowFeedback = false;
    },
    toggleShowLesson: (state) => {
      state.isShowLessonContent = !state.isShowLessonContent;
      state.isShowChatbot = false;
      state.isShowFeedback = false;
    },
    toggleShowFeedback: (state) => {
      state.isShowFeedback = !state.isShowFeedback;
      state.isShowChatbot = false;
      state.isShowLessonContent = false;
    },
    toggleShowLeftbar: (state) => {
      state.isShowLeftbar = !state.isShowLeftbar;
    },

    setOffMenuState: (state) => {
      state.isShowFeedback = false;
      state.isShowChatbot = false;
      state.isShowLeftbar = false;
    },
  },
});

export const {
  showChatGPT,
  showGlobalChatGPT,
  closeChatGPT,
  toggleShowLesson,
  toggleShowFeedback,
  toggleShowChatbot,
  setOffMenuState,
  toggleShowLeftbar,
} = slice.actions;

export const { reducer } = slice;
