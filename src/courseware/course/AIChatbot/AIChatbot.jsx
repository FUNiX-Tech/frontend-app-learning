import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { svgChatGPT, svgSubmit, svgSubmitActive } from "./AIChabotAssets";
import { useSelector } from "react-redux";

import {
  fetchQueries,
  askChatbot,
  voteChatbotResponse,
  retryAskChatbot,
} from "./AIChatbotAPI";
import QueryItem from "./QueryItem";
import * as uid from "uuid";
import "./AIChatbot.scss";
import messages from "./messages";

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

  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);

  const msgContainerRef = useRef();
  const inputRef = useRef();
  const submitBtnRef = useRef();
  const inputWrapperRef = useRef();

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
      setPage((prev) => prev + 1);
    }
  }

  function startNewSession() {
    setQueryList([]);
    setInitiated(false);
    setPage(1);
    setSessionId(0);
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

  useEffect(() => {
    setIsFetching(true);
    fetchQueries(sessionId, page, LIMIT)
      .then((data) => {
        data.data.query_list.reverse();

        if (data.data.remain_page <= 0) {
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

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 0;
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    console.log(
      inputWrapperRef.current.scrollHeight,
      inputWrapperRef.current.offsetHeight
    );
    if (
      inputWrapperRef.current.scrollHeight >
      inputWrapperRef.current.offsetHeight
    ) {
      setHasScrollBar(true);
    } else {
      setHasScrollBar(false);
    }
  }, [inputText]);

  // html classes
  let chatbotContainerClasses = "chatbot-container";
  if (isShowChatbot) {
    chatbotContainerClasses += " active";
  }

  if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
    chatbotContainerClasses += " is-firefox";
  }

  return (
    <div className={chatbotContainerClasses}>
      <div className="chatbot-header">
        <span class="chatbot-name">Chat GPT</span>
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

      <form
        onSubmit={onSubmit}
        className={
          hasScrollBar ? "chatbot-footer has-scrollbar" : "chatbot-footer"
        }
      >
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
    </div>
  );
}

AIChatbot.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AIChatbot);
