import React, { useState } from "react";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { useSelector, useDispatch } from "react-redux";
import { voteChatbotResponse } from "./AIChatbotAPI";
import QueryList from "./QueryList";
import { toggleShowChatbot } from "../../../header/data/slice";
import SessionList from "./SessionList";
import AIChatbotHeader from "./AIChatbotHeader";
import {
  changeSession,
  startNewSession as startNewSessionAction,
  fetchQueries,
  retryAskChatbot,
  setRetryAskChatbotStatus,
} from "./slice";
import "./AIChatbot.scss";

function AIChatbot({ intl }) {
  const [mode, setMode] = useState("chat"); // chat | session
  const { session, ask } = useSelector((state) => state.chatbot);

  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);

  const dispatch = useDispatch();

  function startNewSession() {
    setMode("chat");
    dispatch(startNewSessionAction());
  }

  function onVote(queryId, type) {
    // up | down | remove
    voteChatbotResponse(queryId, type)
      .then((data) => {
        setQueryList((prev) =>
          prev.map((item) =>
            item.id == data.data.id ? { ...item, vote: data.data.vote } : item
          )
        );
      })
      .catch(console.error);
  }

  function onRetryAskChatbot(queryId) {
    if (ask.status === "pending") {
      alert("Too many request!");
      return;
    }

    dispatch(setRetryAskChatbotStatus(queryId));
    dispatch(retryAskChatbot(queryId));
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
    dispatch(fetchQueries());
  }

  // html classes
  let chatbotContainerClasses = "chatbot-container";
  if (isShowChatbot) {
    chatbotContainerClasses += " active";
  }

  if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
    chatbotContainerClasses += " is-firefox";
  }

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
          onVote={onVote}
          onRetryAskChatbot={onRetryAskChatbot}
        />
        <SessionList mode={mode} onSelectSession={onSelectSession} />
      </div>
    </>
  );
}

AIChatbot.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AIChatbot);
