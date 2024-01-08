/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

export const LOADING = "loading";
export const LOADED = "loaded";
export const FAILED = "failed";
export const DENIED = "denied";

const slice = createSlice({
  name: "course-home",
  initialState: {
    courseStatus: "loading",
    courseId: null,
    proctoringPanelStatus: "loading",
    toastBodyText: null,
    toastBodyLink: null,
    toastHeader: "",
    courseInRun: null,
  },
  reducers: {
    fetchProctoringInfoResolved: (state) => {
      state.proctoringPanelStatus = LOADED;
    },
    fetchTabDenied: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = DENIED;
    },
    fetchTabFailure: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = FAILED;
    },
    fetchTabRequest: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = LOADING;
    },
    fetchTabSuccess: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.targetUserId = payload.targetUserId;
      state.courseStatus = LOADED;
    },
    setCallToActionToast: (state, { payload }) => {
      const { header, link, linkText } = payload;
      state.toastBodyLink = link;
      state.toastBodyText = linkText;
      state.toastHeader = header;
    },
    setCourseInRun: (state, { payload }) => {
      state.courseInRun = payload;
    },
  },
});

export const {
  fetchProctoringInfoResolved,
  fetchTabDenied,
  fetchTabFailure,
  fetchTabRequest,
  fetchTabSuccess,
  setCallToActionToast,
  setCourseInRun,
} = slice.actions;

export const { reducer } = slice;
