import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { svgChatGPT, svgPlane, svgReset } from "./AIChabotAssets";

import {
  fetchQueries,
  askChatbot,
  voteChatbotResponse,
  retryAskChatbot,
} from "./AIChatbotAPI";
import QueryItem from "./QueryItem";
import * as uid from "uuid";
import "./AIChatbot.scss";

const LIMIT = 5;

export default function AIChatbot({ isShowChatbot }) {
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(0);
  const [queryList, setQueryList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const msgContainerRef = useRef();
  const inputRef = useRef();
  const submitBtnRef = useRef();

  function onChangeInput(e) {
    setInputText(e.target.value);
    inputRef.current.style.height = 0;
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
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
      !isLastPage
    ) {
      console.log("set page from scroll");
      setPage((prev) => prev + 1);
    }
  }

  function startNewSession() {
    setQueryList([]);
    setInitiated(false);
    setPage(1);
    setSessionId(0);
  }

  function clearInput() {
    setInputText("");
  }

  function onCopyResponse(responseMsg) {
    navigator.clipboard.writeText(responseMsg);
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

  useEffect(() => {
    setIsFetching(true);
    fetchQueries(sessionId, page, LIMIT)
      .then((data) => {
        data.data.query_list.reverse();

        if (data.data.remain_page == 0) {
          setIsLastPage(true);
        }

        setQueryList((prev) => [...data.data.query_list, ...prev]);
        if (
          data.data.query_list.length > 0 &&
          data.data.query_list[0].session_id != sessionId
        ) {
          setSessionId(data.data.query_list[0].session_id);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!isInitialLoading) {
          console.log("set scroll top to 200");
          if (msgContainerRef.current.scrollTop <= 50 && !isLastPage) {
            msgContainerRef.current.scrollTop = 51;
          }
        }

        if (isInitialLoading) {
          setIsInitialLoading(false);
        }
        setIsFetching(false);
      });
  }, [page]);

  useEffect(() => {
    if (queryList.length > 0 && !initiated) {
      if (msgContainerRef.current) {
        msgContainerRef.current.scrollTop =
          msgContainerRef.current.scrollHeight -
          msgContainerRef.current.clientHeight;
      }
      setInitiated(true);
    }

    if (queryList.length > 0 && initiated) {
      if (isAsking) {
        msgContainerRef.current.scrollTop =
          msgContainerRef.current.scrollHeight -
          msgContainerRef.current.clientHeight;
      }
    }
  }, [queryList]);

  // html classes
  let chatbotContainerClasses =
    "sequence-navigation-tabs d-flex flex-grow-1 chatbot-container";
  if (isShowChatbot) {
    chatbotContainerClasses += " active";
  }

  return (
    <div className={chatbotContainerClasses}>
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          {svgChatGPT}
          <div class="textbox">
            <p>
              <strong>Chat GPT</strong>
            </p>
            <p class="powerby">Power by FUNiX</p>
          </div>
        </div>
      </div>
      {/* ================================= messages ================================= */}
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          padding: "1rem .5rem",
          width: "100%",
        }}
        ref={msgContainerRef}
        onScroll={onScroll}
        className="chatbotMessages"
      >
        <ul
          style={{
            listStyleType: "none",
            width: "100%",
            padding: 0,
          }}
          className="chat-gpt-response"
        >
          {isInitialLoading && (
            <li class="chatbot-initial-loading">
              <span class="chatbot-loader"></span>
            </li>
          )}

          {isFetching && !isInitialLoading && (
            <li class="loading-more-msg">Loading more...</li>
          )}
          {isLastPage && <li class="no-more-messages">No more messages</li>}
          {queryList.map((query) => {
            return (
              <li key={query.id}>
                <QueryItem
                  query={query}
                  onCopyResponse={onCopyResponse}
                  onVote={onVote}
                  onRetryAskChatbot={onRetryAskChatbot}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div
        style={{
          width: "100%",
          padding: "1rem .5rem",
          borderTop: "1px solid #e5e5e5",
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <button
          onClick={clearInput}
          title="clear input"
          class="clear-input-btn"
          type="button"
        >
          {svgReset}
        </button>
        <form onSubmit={onSubmit} class="chatbot-input-container">
          <textarea
            class="chatbot-input"
            type="text"
            placeholder="Gửi tin nhắn"
            value={inputText}
            onChange={onChangeInput}
            ref={inputRef}
            onKeyUp={onInputKeyUp}
            onKeyDown={onInputKeyDown}
          />
          <button
            ref={submitBtnRef}
            type="submit"
            title="send"
            class="chatbot-submit-btn"
          >
            {svgPlane}
          </button>
        </form>
      </div>
    </div>
  );
}

AIChatbot.propTypes = {
  isShowChatbot: PropTypes.bool.isRequired,
};
