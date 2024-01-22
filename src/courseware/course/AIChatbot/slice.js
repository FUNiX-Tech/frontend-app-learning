import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  askChatbot as askChatbotAPI,
  fetchSessions as fetchSessionsAPI,
  fetchQueries as fetchQueriesAPI,
  retryAskChatbot as retryAskChatbotAPI,
  voteChatbotResponse as voteChatbotResponseAPI,
  giveFeedbackChatbot as giveFeedbackChatbotAPI,
} from "./AIChatbotAPI";
import * as uid from "uuid";

const LIMIT = 5;
const MAX_HISTORY = 10;

export const fetchQueries = createAsyncThunk(
  "chatbot/fetchQueries",
  async (_, thunkAPI) => {
    try {
      const { session, query } = thunkAPI.getState().chatbot;
      const response = await fetchQueriesAPI(
        session.id,
        query.items.length,
        LIMIT
      );

      console.log("chatbot queries response", response);
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
    }
  }
);

export const askChatbot = createAsyncThunk(
  "chatbot/askChatbot",
  async (_, thunkAPI) => {
    try {
      const { ask, session } = thunkAPI.getState().chatbot;

      const response = await askChatbotAPI(
        ask.input,
        session.id,
        thunkAPI.requestId
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
    }
  }
);

export const fetchSessions = createAsyncThunk(
  "chatbot/fetchSessions",
  async (_, thunkAPI) => {
    try {
      const { session } = thunkAPI.getState().chatbot;

      const response = await fetchSessionsAPI(session.items.length, LIMIT);
      console.log("session list response", response);
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
    }
  }
);

export const retryAskChatbot = createAsyncThunk(
  "chatbot/retryAskChatbot",
  async (queryId, thunkAPI) => {
    try {
      const response = await retryAskChatbotAPI(queryId);

      return {
        queryId: queryId,
        response_msg: response.data.response_msg,
        status: response.data.status,
        error: "",
      };
    } catch (error) {
      console.error(error);
      return {
        queryId: queryId,
        response_msg: "",
        status: "failed",
        error: _composeErrorMessage(error),
      };
    }
  }
);

export const voteResponse = createAsyncThunk(
  "chatbot/voteResponse",
  async ({ queryId, vote }, thunkAPI) => {
    try {
      const response = await voteChatbotResponseAPI(queryId, vote);

      return {
        queryId: response.data.id,
        vote: response.data.vote,
      };
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
    }
  }
);

export const giveFeedbackChatbot = createAsyncThunk(
  "chatbot/giveFeedbackChatbot",
  async ({ queryId, feedback }, thunkAPI) => {
    try {
      const response = await giveFeedbackChatbotAPI(queryId, feedback);

      return {
        queryId: response.data.id,
        feedback: response.data.feedback,
      };
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
    }
  }
);

const initialState = {
  ask: {
    status: "idle",
    input: "",
    history: [],
    current: -1,
  },

  query: {
    items: [],
    status: "idle",
    error: "",
    isLastPage: false,
    totalPage: 0,
    page: 0,
    initiated: false,
  },

  session: {
    items: [],
    id: 0,
    initiated: false,
    status: "idle",
    error: "",
    page: 0,
    totalPage: 0,
    isLastPage: false,
  },

  feedback: {
    isShowModal: false,
    queryId: null,
    status: "idle",
    error: "",
  },
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    setInputText: (state, action) => {
      state.ask.input = action.payload;
      state.ask.history = state.ask.history.map((item, index) => {
        return index === state.ask.history.length - 1 ? action.payload : item;
      });
    },
    setAskStatus: (state, action) => {
      state.ask.status = action.payload;
    },
    addNewQueryItem: (state, action) => {
      const hash = uid();

      state.query.items = [
        ...state.query.items,
        {
          id: hash,
          query_msg: state.inputText,
          response_msg: undefined,
          vote: undefined,
          status: "pending",
          hash: hash,
        },
      ];
    },
    startNewSession: (state, action) => {
      state.query.items = [];
      state.session.id = 0;
    },
    changeSession: (state, action) => {
      state.session.id = action.payload;
      state.query.items = [];
      state.query.isLastPage = false;
    },
    setRetryAskChatbotStatus: (state, action) => {
      state.query.items = state.query.items.map((item) =>
        item.id === action.payload ? { ...item, status: "pending" } : item
      );
    },
    showChatbotFeedbackModal: (state, action) => {
      state.feedback.isShowModal = true;
      state.feedback.queryId = action.payload;
    },
    hideChatbotFeedbackModal: (state, action) => {
      state.feedback.isShowModal = false;
      state.feedback.queryId = null;
    },
    setChatbotInputHistory: (state, action) => {
      if (state.ask.current === -1) return;

      const newIndex =
        action.payload === "next"
          ? state.ask.current + 1
          : state.ask.current - 1;

      if (newIndex === -1) return;
      if (newIndex === state.ask.history.length) return;

      state.ask.input = state.ask.history[newIndex];
      state.ask.current = newIndex;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askChatbot.pending, (state, action) => {
        state.ask.status = "pending";
        state.ask.error = "";

        state.query.items = [
          ...state.query.items,
          {
            id: action.meta.requestId,
            query_msg: state.ask.input,
            response_msg: undefined,
            vote: undefined,
            status: "pending",
            hash: action.meta.requestId,
          },
        ];

        let updatedHistory = [...state.ask.history, state.ask.input, ""];

        state.ask.history = updatedHistory;
        state.ask.current = updatedHistory.length - 1;
        state.ask.history = updatedHistory.slice(
          updatedHistory.length - MAX_HISTORY,
          updatedHistory.length
        );
        state.ask.input = "";
      })
      .addCase(askChatbot.fulfilled, (state, action) => {
        state.ask.status = "succeeded";
        state.query.items = state.query.items.map((item) =>
          item.hash === action.meta.requestId
            ? {
                ...item,
                response_msg: action.payload.response_msg,
                status: action.payload.status,
              }
            : item
        );

        if (!state.query.initiated) state.query.initiated = true;

        if (state.session.id !== 0) return;

        state.session.id = action.payload.session_id;
        state.session.items = [action.payload, ...state.session.items];
      })
      .addCase(askChatbot.rejected, (state, action) => {
        state.ask.status = "failed";
        state.ask.error = action.payload;
        state.query.items = state.query.items.map((item) =>
          item.hash === action.meta.requestId
            ? { ...item, status: "failed" }
            : item
        );
      })
      // fetch sessions
      .addCase(fetchSessions.pending, (state, action) => {
        state.session.status = "pending";
        state.session.error = "";
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        console.log("payload: ", action.payload);
        state.session.status = "succeeded";
        state.session.items = [
          ...state.session.items,
          ...action.payload.session_list,
        ];
        if (action.payload.remain_page === 0) state.session.isLastPage = true;

        if (!state.session.initiated) state.session.initiated = true;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.session.status = "failed";
        state.session.error = action.payload;
      })
      // fetch queries
      .addCase(fetchQueries.pending, (state, action) => {
        state.query.error = "";
        state.query.status = "pending";
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.query.status = "succeeded";
        action.payload.query_list.reverse();
        state.query.items = [
          ...action.payload.query_list,
          ...state.query.items,
        ];

        if (action.payload.remain_page === 0) {
          state.query.isLastPage = true;
        }

        if (!state.query.initiated) {
          state.query.initiated = true;
        }

        if (state.session.id === 0 && action.payload.query_list.length > 0) {
          state.session.id = action.payload.query_list[0].session_id;
        }
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.query.error = action.payload;
        state.query.status = "failed";
      })
      // retry
      .addCase(retryAskChatbot.pending, (state, action) => {
        state.ask.status = "pending";
        state.ask.error = "";
      })
      .addCase(retryAskChatbot.fulfilled, (state, action) => {
        state.ask.status = action.payload.status;
        state.query.items = state.query.items.map((item) =>
          item.id === action.payload.queryId
            ? {
                ...item,
                response_msg: action.payload.response_msg,
                status: action.payload.status,
              }
            : item
        );
        state.ask.error = action.payload.error;
      })
      .addCase(retryAskChatbot.rejected, (state, action) => {
        //
      })
      .addCase(voteResponse.pending, (state, action) => {
        // handle pending status
      })
      .addCase(voteResponse.fulfilled, (state, action) => {
        state.query.items = state.query.items.map((item) =>
          item.id === action.payload.queryId
            ? { ...item, vote: action.payload.vote, feedback: "" }
            : item
        );

        if (state.feedback.isShowModal) {
          state.feedback.isShowModal = false;
          state.feedback.queryId = null;
        }
      })
      .addCase(voteResponse.rejected, (state, action) => {
        // handle error status
      })
      // feedback
      .addCase(giveFeedbackChatbot.pending, (state, action) => {
        state.feedback.status = "pending";
        state.feedback.error = "";
      })
      .addCase(giveFeedbackChatbot.fulfilled, (state, action) => {
        state.query.items = state.query.items.map((item) =>
          item.id === action.payload.queryId
            ? { ...item, feedback: action.payload.feedback }
            : item
        );
        state.feedback.status = "succeeded";
        state.feedback.isShowModal = false;
        state.feedback.queryId = null;
      })
      .addCase(giveFeedbackChatbot.rejected, (state, action) => {
        state.feedback.status = "failed";
        state.feedback.error = action.payload;
      });
  },
});

export const {
  setInputText,
  setAskStatus,
  fetchMoreSession,
  changeSession,
  startNewSession,
  setRetryAskChatbotStatus,
  showChatbotFeedbackModal,
  hideChatbotFeedbackModal,
  setChatbotInputHistory,
} = chatbotSlice.actions;
export default chatbotSlice.reducer;

function _composeErrorMessage(error) {
  const statusCode = error.response?.status;

  let errorMsg =
    error.response?.data?.message ||
    error.customAttributes?.httpErrorResponseData ||
    error.message;

  if (errorMsg === "<Response is HTML>" && statusCode === 500) {
    errorMsg = "Internal Server Error.";
  }

  return `${statusCode} - ${errorMsg}`;
}