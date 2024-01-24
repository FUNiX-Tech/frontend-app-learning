import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QueryList from "./QueryList";
import { toggleShowChatbot } from "../../../header/data/slice";
import SessionList from "./SessionList";
import AIChatbotHeader from "./AIChatbotHeader";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import {
  changeSession,
  startNewSession as startNewSessionAction,
  fetchQueries,
  retryAskChatbot,
  writeChatbotResponse,
  finishChatbotResponse,
  connectionOpen,
  connectionClose,
  reConnect,
  askChatbot,
  setChatbotCourseId,
  connectionError,
} from "./slice";

import {
  startChatConnection,
  stopChatConnection,
} from "../../../connection/chatbot";

import "./AIChatbot.scss";

const MAX_RETRY_TIMES = 2;

function AIChatbot() {
  // toggle giữa chat messages list và session list
  const [mode, setMode] = useState("chat"); // chat | session

  // dùng để handle/trigger reconnect - send message khi có error / disconnect
  const [waitToAsk, setWaitToAsk] = useState(0);

  // dùng để handle/trigger reconnect - retry asking khi có error / disconnect
  const [waitToReask, setWaitToReask] = useState(0);

  // Lưu query id dùng để retry
  const [retryQueryId, setRetryQueryId] = useState(null);

  const { courseId } = useParams();

  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);
  const { session, ask, query, connection } = useSelector(
    (state) => state.chatbot
  );

  const dispatch = useDispatch();

  function startNewSession() {
    // set mode = chat => set session.id = 0
    setMode("chat");
    dispatch(startNewSessionAction());
  }

  function toggleMode() {
    setMode((prev) => {
      return prev === "chat" ? "session" : "chat";
    });
  }

  function hideChatbot() {
    dispatch(toggleShowChatbot());
  }

  function onSelectSession(s) {
    setMode("chat");
    if (s.session_id === session.id) return;

    dispatch(changeSession(s.session_id));

    const newSessionHasNotFetchedQueryList =
      query.items.filter((item) => item.session_id === s.session_id).length ===
      0;

    if (newSessionHasNotFetchedQueryList) {
      dispatch(fetchQueries());
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (query.status === "pending") return;
    if (!ask.input.trim()) return;
    if (ask.status === "pending") {
      alert("Too many request!");
      return;
    }

    if (connection.status !== "succeeded") {
      setWaitToAsk(1);
      return;
    }
    dispatch(askChatbot(ask.input));
  }

  function onRetryAskChatbot(queryId) {
    if (ask.status === "pending") {
      alert("Too many request!");
      return;
    }
    if (connection.status !== "succeeded") {
      setWaitToReask(1);
      setRetryQueryId(queryId);
      return;
    }
    dispatch(retryAskChatbot(queryId));
  }

  // html classes
  let chatbotContainerClasses = "chatbot-container";
  if (isShowChatbot) {
    chatbotContainerClasses += " active";
  }

  if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
    chatbotContainerClasses += " is-firefox";
  }

  useEffect(() => {
    if (
      waitToAsk === 0 ||
      waitToAsk === MAX_RETRY_TIMES ||
      connection.status === "succeeded"
    )
      return;
    dispatch(reConnect());
  }, [waitToAsk, connection.status]);

  useEffect(() => {
    if (
      waitToAsk === MAX_RETRY_TIMES ||
      !(waitToAsk === 0 || connection.status !== "succeeded")
    ) {
      dispatch(askChatbot(ask.input));
      setWaitToAsk(0);
    }
  }, [waitToAsk, connection.status]);

  useEffect(() => {
    if (
      waitToReask === 0 ||
      waitToReask === MAX_RETRY_TIMES ||
      connection.status === "succeeded"
    )
      return;
    dispatch(reConnect());
  }, [waitToReask, connection.status]);

  useEffect(() => {
    if (
      waitToReask === MAX_RETRY_TIMES ||
      !(waitToReask === 0 || connection.status !== "succeeded")
    ) {
      dispatch(retryAskChatbot(retryQueryId));
      setWaitToReask(0);
      setRetryQueryId(null);
    }
  }, [waitToReask, connection.status]);

  useEffect(() => {
    if (connection.status === "succeeded") return;

    function onResponse(msg) {
      dispatch(writeChatbotResponse(msg));
    }

    function onResponseFinished() {
      dispatch(finishChatbotResponse());
    }

    function onWebSocketError(msg) {
      dispatch(finishChatbotResponse(msg));
      dispatch(connectionClose());
      dispatch(connectionError(msg));
    }

    function onConnect() {
      dispatch(connectionOpen());
    }

    startChatConnection(
      onResponse,
      onResponseFinished,
      onWebSocketError,
      onConnect
    ).catch(console.error);

    return () => {
      stopChatConnection();
    };
  }, [connection.retry]);

  useEffect(() => {
    setChatbotCourseId(courseId);
  }, [courseId]);

  return (
    <>
      <div className={chatbotContainerClasses}>
        <AIChatbotHeader
          startNewSession={startNewSession}
          toggleMode={toggleMode}
          hideChatbot={hideChatbot}
          mode={mode}
        />

        <QueryList
          mode={mode}
          onRetryAskChatbot={onRetryAskChatbot}
          onSubmit={onSubmit}
        />
        <SessionList mode={mode} onSelectSession={onSelectSession} />
      </div>
    </>
  );
}

export default AIChatbot;
