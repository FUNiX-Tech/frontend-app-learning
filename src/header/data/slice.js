/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "header",
  initialState: {
    isShowChatGPT: false,
    isShowGlobalChatGPT: false,
    isShowLessonContent: true,
    isShowFeedback: false,
    isShowChatbot: true,
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
    setOffMenuState: (state) => {
      state.isShowFeedback = false;
      state.isShowChatbot = false;
      state.isShowLessonContent = false;
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
} = slice.actions;

export const { reducer } = slice;
