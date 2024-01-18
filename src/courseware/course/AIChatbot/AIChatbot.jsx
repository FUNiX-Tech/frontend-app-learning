import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { svgChatGPT, svgSubmit, svgSubmitActive } from "./AIChabotAssets";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  fetchQueries,
  fetchSessions,
  askChatbot,
  voteChatbotResponse,
  retryAskChatbot,
} from "./AIChatbotAPI";
import QueryList from "./QueryList";
import * as uid from "uuid";
import "./AIChatbot.scss";
import messages from "./messages";
import { toggleShowChatbot } from "../../../header/data/slice";

const LIMIT = 5;

function AIChatbot({ intl }) {
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(0);
  const [queryList, setQueryList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasScrollBar, setHasScrollBar] = useState(false);

  // session
  const [mode, setMode] = useState("chat"); // chat | session
  const [sessionList, setSessionList] = useState([]);
  const [isLastSessionPage, setIsLastSessionPage] = useState(false);
  const [sessionPage, setSessionPage] = useState(1);

  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);

  const msgContainerRef = useRef();
  const inputRef = useRef();
  const submitBtnRef = useRef();
  const inputWrapperRef = useRef();

  const dispatch = useDispatch();

  function onChangeInput(e) {
    setInputText(e.target.value);
  }

  function onInputKeyUp(e) {
    if (e.keyCode === 13 || e.which == 13) {
      submitBtnRef.current.click();
    }
  }

  function onInputKeyDown(e) {
    if (e.keyCode === 13 || e.which == 13) {
      e.preventDefault();
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (isFetching) return;
    if (!inputText.trim()) return;
    if (isAsking) {
      alert("Too many request!");
      return;
    }

    setIsAsking(true);
    const hash = uid.v4();
    setQueryList((prev) => [
      ...prev,
      {
        id: hash,
        query_msg: inputText,
        response_msg: undefined,
        vote: undefined,
        status: "pending",
        hash: hash,
      },
    ]);
    setInputText("");

    askChatbot(inputText, sessionId, hash)
      .then((data) => {
        setQueryList((prev) =>
          prev.map((item) => (item.hash == data.hash ? data.data : item))
        );

        if (sessionId === 0) {
          setSessionId(data.data.session_id);
          setSessionList((prev) => [data.data, ...prev]);
        }
      })
      .catch((error) => {
        console.error(error);
        setQueryList((prev) =>
          prev.map((item) =>
            item.hash == hash ? { ...item, status: "failed" } : item
          )
        );
      })
      .finally(() => {
        setIsAsking(false);
      });
  }

  function onScroll(e) {
    if (
      initiated &&
      e.currentTarget.scrollTop < 50 &&
      !isFetching &&
      !isLastPage &&
      mode === "chat"
    ) {
      setPage((prev) => prev + 1);
    }
  }

  function startNewSession() {
    setMode("chat");
    setQueryList([]);
    setInitiated(false);
    setPage(0);
    setSessionId(0);
    if (inputRef?.current) inputRef.current.focus();
  }

  function onCopyResponse(ele, responseMsg) {
    navigator.clipboard.writeText(responseMsg);
    if (ele) {
      ele.classList.add("copied");
      setTimeout(() => {
        ele.classList.remove("copied");
      }, 1000);
    }
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
    if (isAsking) {
      alert("Too many request!");
      return;
    }

    setIsAsking(true);
    setQueryList((prev) =>
      prev.map((item) =>
        item.id == queryId ? { ...item, status: "pending" } : item
      )
    );
    retryAskChatbot(queryId)
      .then((data) => {
        setQueryList((prev) =>
          prev.map((item) => (item.id == data.data.id ? data.data : item))
        );
      })
      .catch((error) => {
        console.error(error);
        setQueryList((prev) =>
          prev.map((item) =>
            item.id == queryId ? { ...item, status: "failed" } : item
          )
        );
      })
      .finally(() => {
        setIsAsking(false);
      });
  }

  function toggleMode() {
    setMode((prev) => {
      return prev === "chat" ? "session" : "chat";
    });
  }

  function fetchMoreSessionList() {
    setSessionPage((prev) => prev + 1);
  }

  function hideChatbot() {
    dispatch(toggleShowChatbot());
  }

  useEffect(() => {
    if (page === 0 || sessionId === 0 || isFetching) return;

    setIsFetching(true);
    fetchQueries(sessionId, queryList.length, LIMIT)
      .then((data) => {
        data.data.query_list.reverse();

        if (data.data.remain_page <= 0) {
          setIsLastPage(true);
        }

        setQueryList((prev) => [...data.data.query_list, ...prev]);
      })
      .catch(console.error)
      .finally(() => {
        if (!isInitialLoading) {
          if (msgContainerRef.current.scrollTop <= 50 && !isLastPage) {
            msgContainerRef.current.scrollTop = 51;
          }
        }

        if (isInitialLoading) {
          setIsInitialLoading(false);
        }
        setIsFetching(false);
      });
  }, [page, sessionId]);

  useEffect(() => {
    if (queryList.length === 0) return;

    if (!initiated) {
      if (msgContainerRef.current) {
        msgContainerRef.current.scrollTop =
          msgContainerRef.current.scrollHeight -
          msgContainerRef.current.clientHeight;
      }
      setInitiated(true);
    }

    if (initiated) {
      if (isAsking) {
        msgContainerRef.current.scrollTop =
          msgContainerRef.current.scrollHeight -
          msgContainerRef.current.clientHeight;
      }
    }
  }, [queryList]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 0;
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";

    if (
      inputWrapperRef.current.scrollHeight >
      inputWrapperRef.current.offsetHeight
    ) {
      setHasScrollBar(true);
    } else {
      setHasScrollBar(false);
    }
  }, [inputText]);

  useEffect(() => {
    if (!inputRef?.current) return;
    inputRef.current.style.height = 0;
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
  }, [mode]);

  useEffect(() => {
    if (sessionPage === 0) return;
    // setIsFetching(true);
    fetchSessions(sessionList.length, LIMIT)
      .then((data) => {
        // data.data.session_list.reverse();

        if (data.data.remain_page <= 0) {
          setIsLastSessionPage(true);
        }

        setSessionList((prev) => [...prev, ...data.data.session_list]);
        if (sessionId === 0 && data.data.session_list.length > 0) {
          setSessionId(data.data.session_list[0].session_id);
        }
      })
      .catch(console.error)
      .finally(() => {
        // if (!isInitialLoading) {
        //   if (msgContainerRef.current.scrollTop <= 50 && !isLastPage) {
        //     msgContainerRef.current.scrollTop = 51;
        //   }
        // }
        // if (isInitialLoading) {
        //   setIsInitialLoading(false);
        // }
        // setIsFetching(false);
      });
  }, [sessionPage]);

  // html classes
  let chatbotContainerClasses = "chatbot-container";
  if (isShowChatbot) {
    chatbotContainerClasses += " active";
  }

  if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
    chatbotContainerClasses += " is-firefox";
  }

  let chatbotFooterClasses = "chatbot-footer";
  if (hasScrollBar) {
    chatbotFooterClasses += " has-scrollbar";
  }
  if (mode === "session") {
    chatbotFooterClasses += " d-none";
  }

  return (
    <div className={chatbotContainerClasses}>
      <div className="chatbot-header">
        <p class="chatbot-name">Chat GPT</p>
        <div>
          <button
            title="New chat"
            onClick={startNewSession}
            id="chatbot-new-session-btn"
            className="chatbot-header-btn"
          >
            +
          </button>
          <button
            onClick={toggleMode}
            id="chatbot-sessions-list-btn"
            title={mode === "chat" ? "Sessions" : "Chat"}
            className="chatbot-header-btn"
          >
            {mode === "chat" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
            {mode === "session" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            )}
          </button>
          <button
            title="Hide"
            onClick={hideChatbot}
            className="chatbot-header-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="m15.834 5.343-1.175-1.175L10 8.826 5.342 4.168 4.167 5.343l4.658 4.658-4.658 4.659 1.175 1.175L10 11.176l4.659 4.659 1.175-1.175L11.175 10l4.659-4.658z"
                fill="#2D2F31"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* ================================= messages ================================= */}
      <div
        ref={msgContainerRef}
        onScroll={onScroll}
        className="chatbot-messages-list-container"
      >
        {queryList.length === 0 && (
          <div className="chatbot-intro">
            <div className="chatbot-intro-avatar">{svgChatGPT}</div>
            <p className="chatbot-intro-text">
              {intl.formatMessage(messages.welcome)}
            </p>
          </div>
        )}

        <ul className="chatbot-messages-list">
          {/* {isInitialLoading && (
            <li class="chatbot-initial-loading">
              <span class="chatbot-loader"></span>
            </li>
          )} */}

          {/* {isFetching && !isInitialLoading && (
            <li class="loading-more-msg">Loading more...</li>
          )} */}
          {/* {isLastPage && <li class="no-more-messages">No more messages</li>} */}
          {mode === "chat" && (
            <QueryList
              queryList={queryList}
              onCopyResponse={onCopyResponse}
              onVote={onVote}
              onRetryAskChatbot={onRetryAskChatbot}
            />
          )}

          {mode === "session" &&
            sessionList.map((session) => (
              <li
                key={session.id}
                className="session_item"
                onClick={() => {
                  if (session.session_id === sessionId) {
                    setMode("chat");
                    return;
                  }

                  setSessionId(session.session_id);
                  setQueryList([]);
                  setPage(1);
                  setMode("chat");
                  setIsLastPage(false);
                }}
              >
                <div className="session_item_header">
                  <span>{new Date(session.created).toLocaleString("vi")}</span>
                </div>
                <div className="session_item_ask">
                  <span>{session.query_msg}</span>
                </div>
                <div
                  className="session_item_answer"
                  dangerouslySetInnerHTML={{ __html: session.response_msg }}
                ></div>
              </li>
            ))}

          {mode === "session" && !isLastSessionPage && (
            <li id="fetch_more_sessions" onClick={fetchMoreSessionList}>
              Xem thêm
            </li>
          )}
        </ul>
      </div>

      {mode === "chat" && (
        <form onSubmit={onSubmit} className={chatbotFooterClasses}>
          <div ref={inputWrapperRef} className="chatbot-input-wrapper">
            <textarea
              class="chatbot-input"
              type="text"
              placeholder={intl.formatMessage(messages.sendMessage)}
              value={inputText}
              onChange={onChangeInput}
              ref={inputRef}
              onKeyUp={onInputKeyUp}
              onKeyDown={onInputKeyDown}
            />
          </div>
          <button
            ref={submitBtnRef}
            type="submit"
            title="send"
            class={
              inputText.trim()
                ? "chatbot-submit-btn"
                : "chatbot-submit-btn disabled"
            }
          >
            {inputText.trim() ? svgSubmitActive : svgSubmit}
          </button>
        </form>
      )}
    </div>
  );
}

AIChatbot.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AIChatbot);
