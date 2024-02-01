import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import QueryList from "./QueryList";
import { toggleShowChatbot } from "../../../header/data/slice";
import SessionList from "./SessionList";
import AIChatbotHeader from "./AIChatbotHeader";
import { injectIntl } from "@edx/frontend-platform/i18n";
import { useParams } from "react-router-dom";

import {
  changeSession,
  startNewSession as startNewSessionAction,
  fetchQueries,
  retryAskChatbot,
  writeChatbotResponse,
  finishChatbotResponse,
  askChatbot,
  setChatbotCourseId,
} from "./slice";

import { websocket, stopChatConnection } from "../../../connection/chatbot";

import "./AIChatbot.scss";

function AIChatbot() {
  // toggle giữa chat messages list và session list
  const [mode, setMode] = useState("chat"); // chat | session
  const { courseId } = useParams();
  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);
  const { session, ask, query } = useSelector((state) => state.chatbot);

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

    dispatch(askChatbot(ask.input));
  }

  function onRetryAskChatbot(queryId) {
    if (ask.status === "pending") {
      alert("Too many request!");
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
    dispatch(setChatbotCourseId(courseId));
  }, [courseId]);

  useEffect(() => {
    if (ask.status === 'pending' && websocket) {
      websocket.onmessage = (response) => {
        const message = response.data;
        dispatch(writeChatbotResponse(message));

        if (message === '<<Response Finished>>') {
          stopChatConnection('RESPONSE_FINISHED');
        }
      }

      websocket.onerror = error => {
        console.error('WEBSOCKET ERROR: ', error);
        dispatch(finishChatbotResponse("Websocket error."))
      }

      websocket.onclose = event => {
        console.log('WEBSOCKET CLOSED: ', event)
        if (event.reason === 'RESPONSE_FINISHED') {
          dispatch(finishChatbotResponse())
        } else {
          dispatch(finishChatbotResponse(`Websocket closed with code ${event.code} and reason ${event.reason}`))
        }
      }
    }
  }, [ask.status, websocket])

  useEffect(() => {
    return () => {
      stopChatConnection('Connection closed because the user has exit AIChatbot component.');
    }
  }, [])

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

export default injectIntl(AIChatbot);
