import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createQueryItemToDB,
  updateQueryItemToDB,
  fetchSessions as fetchSessionsAPI,
  fetchQueries as fetchQueriesAPI,
  voteChatbotResponse as voteChatbotResponseAPI,
  giveFeedbackChatbot as giveFeedbackChatbotAPI,
  saveChabotErrorToDB,
} from "./AIChatbotAPI";
import { sendMessageToChatbot } from "../../../connection/chatbot";
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
        query.items.filter((item) => item.session_id === session.id).length,
        LIMIT
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
    }
  }
);

export const askChatbot = createAsyncThunk(
  "chatbot/askChatbot",
  async (askInput, thunkAPI) => {
    try {
      const { session, courseId } = thunkAPI.getState().chatbot;

      const response = await createQueryItemToDB({
        query_msg: askInput,
        session_id: session.id,
        hash: thunkAPI.requestId,
        status: "idle",
      });

      sendMessageToChatbot(askInput, session.id, courseId);
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
      const { session, query, courseId } = thunkAPI.getState().chatbot;

      const queryItem = query.items.find((item) => item.id === queryId);

      sendMessageToChatbot(queryItem.query_msg, session.id, courseId);
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
    }
  }
);

export const finishChatbotResponse = createAsyncThunk(
  "chatbot/finishChatbotResponse",
  async (errorMsg, thunkAPI) => {
    try {
      const { query } = thunkAPI.getState().chatbot;
      const queryItem = query.items.find(
        (item) => item.status === "writing" || item.status === "pending"
      );

      let status;

      if (queryItem) {
        status = errorMsg ? "failed" : "succeeded";
        await updateQueryItemToDB({
          id: queryItem.id,
          response_msg: status === "succeeded" ? queryItem.response_msg : "",
          status: status,
        });
      }

      if (errorMsg) {
        saveChabotErrorToDB(errorMsg)
          .then(() => {
            console.log("Saved chatbot error to db");
          })
          .catch(console.error);
      }

      /**
       * 1. if status is undefined
       *    this is an error not relevant to any writing item (no writing item)
       *    so we don't need to update query list
       *
       * 2. otherwise we need to update writing query with corresponding status
       */

      return status;
    } catch (error) {
      /**
       * error due to requesting to server
       * that means there is an error with writing item
       * => we need to update writing item status to failed in finishChatbotResponse.rejected
       */
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
      return response.data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue(_composeErrorMessage(error));
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
    id: -1,
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

  connection: {
    status: "idle",
    error: "",
    retry: 0,
  },

  courseId: null,
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    reConnect: (state, action) => {
      state.connection.retry += 1;
    },
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
      state.session.id = 0;
    },
    changeSession: (state, action) => {
      state.session.id = action.payload;
      // state.query.items = [];
      state.query.isLastPage = false;
    },
    setRetryAskChatbotStatus: (state, action) => {
      state.query.items = state.query.items.map((item) =>
        item.id === action.payload
          ? { ...item, status: "pending", response_msg: "" }
          : item
      );
    },
    setChatbotCourseId: (state, action) => {
      state.courseId = action.payload || "NO_COURSE_ID";
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
    writeChatbotResponse: (state, action) => {
      if (!action.payload) return;

      state.query.items = state.query.items.map((item) =>
        item.status === "pending" || item.status === "writing"
          ? {
              ...item,
              response_msg:
                (item.response_msg || "") +
                (action.payload === "<<Response Finished>>"
                  ? ""
                  : action.payload),
              status:
                action.payload !== "<<Response Finished>>"
                  ? "writing"
                  : "succeeded",
            }
          : item
      );
    },
    connectionClose: (state, action) => {
      state.connection.status = "failed";
    },
    connectionOpen: (state, action) => {
      state.connection.error = "";
      state.connection.status = "succeeded";
    },
    connectionError: (state, action) => {
      state.connection.error = action.payload;
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
            session_id: state.session.id,
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
        state.query.items = state.query.items.map((item) =>
          item.hash === action.meta.requestId
            ? {
                ...item,
                id: action.payload.id,
                created: action.payload.created,
                session_id: action.payload.session_id,
              }
            : item
        );

        if (!state.query.initiated) state.query.initiated = true;

        if (state.session.id === 0) {
          state.session.id = action.payload.session_id;
          state.session.items = [action.payload, ...state.session.items];
        } else {
          state.session.items = state.session.items.map((item) =>
            item.session_id === action.payload.session_id
              ? action.payload
              : item
          );
        }

        state.ask.id = action.payload.id;
      })
      .addCase(askChatbot.rejected, (state, action) => {
        state.ask.status = "failed";
        state.ask.error = action.payload;
        state.query.items = state.query.items.map((item) =>
          item.hash === action.meta.requestId
            ? { ...item, status: "failed", response_msg: "" }
            : item
        );
        state.ask.id = -1;
      })
      // fetch sessions
      .addCase(fetchSessions.pending, (state, action) => {
        state.session.status = "pending";
        state.session.error = "";
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
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
        // state.query.items = [
        //   ...action.payload.query_list.map((item) =>
        //     item.status === "idle" ? { ...item, status: "failed" } : item
        //   ),
        //   ...state.query.items,
        // ];

        state.query.items = _removeDuplicatedQueries([
          ...action.payload.query_list.map((item) =>
            item.status === "idle" ? { ...item, status: "failed" } : item
          ),
          ...state.query.items,
        ]);

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
        state.query.items = state.query.items.map((item) =>
          item.id === action.meta.arg
            ? { ...item, status: "pending", response_msg: "" }
            : item
        );
      })
      // .addCase(retryAskChatbot.fulfilled, (state, action) => {
      //   state.ask.status = action.payload.status;
      //   state.query.items = state.query.items.map((item) =>
      //     item.id === action.payload.queryId
      //       ? {
      //           ...item,
      //           response_msg: action.payload.response_msg,
      //           status: action.payload.status,
      //         }
      //       : item
      //   );
      //   state.ask.error = action.payload.error;
      // })
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
      })
      // finish
      .addCase(finishChatbotResponse.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        let updatedItem;
        state.query.items = state.query.items.map((item) => {
          if (item.status === "writing" || item.status === "pending") {
            updatedItem = {
              ...item,
              status: action.payload,
              response_msg:
                action.payload === "succeeded" ? item.response_msg : "",
            };

            return updatedItem;
          }
          return item;
        });
        state.ask.status = action.payload;
        state.session.items = state.session.items.map((item) =>
          item.session_id === updatedItem.session_id ? updatedItem : item
        );

        state.ask.id = -1;
        state.ask.status = "succeeded";
      })
      .addCase(finishChatbotResponse.rejected, (state, action) => {
        if (state.ask.status !== "pending") return;

        let updatedItem;
        state.query.items = state.query.items.map((item) => {
          if (item.status === "writing" || item.status === "pending") {
            updatedItem = { ...item, status: "failed", response_msg: "" };
            return updatedItem;
          }

          return item;
        });
        state.ask.status = "failed";

        state.session.items = state.session.items.map((item) =>
          item.session_id === updatedItem.session_id ? updatedItem : item
        );

        state.ask.id = -1;
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
  writeChatbotResponse,
  connectionClose,
  connectionOpen,
  reConnect,
  setChatbotCourseId,
  connectionError,
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

function _removeDuplicatedQueries(queries) {
  const result = [];

  queries.forEach((query) => {
    if (!result.find((item) => item.id === query.id)) {
      result.push(query);
    }
  });

  return result;
}
