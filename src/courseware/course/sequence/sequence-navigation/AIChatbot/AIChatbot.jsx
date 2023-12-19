import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
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

  const msgContainerRef = useRef();

  function onChangeInput(e) {
    setInputText(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
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
      e.currentTarget.scrollTop < 150 &&
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

  return (
    <div
      className={`${
        isShowChatbot
          ? "sequence-navigation-tabs d-flex flex-grow-1 active"
          : "sequence-navigation-tabs d-flex flex-grow-1"
      }`}
      style={{
        top: 0,
        bottom: 0,
        borderRight: "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <h2 className="chat-gpt-title">Chat GPT</h2>
        <div className="message">
          <button
            onClick={startNewSession}
            style={{
              borderRadius: "999px",
              padding: ".1rem .5rem",
              display: "flex",
              alignItems: "center",
              fontSize: ".875rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              // dataSlot="icon"
              className="w-6 h-6"
              style={{
                width: "1rem",
                flexShrink: 0,
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span
              style={{
                whiteSpace: "nowrap",
              }}
            >
              New chat
            </span>
          </button>
        </div>
      </div>
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
          {isFetching && <li>Pending...</li>}
          {isLastPage && (
            <li
              style={{
                textAlign: "center",
                fontSize: ".875rem",
                marginBottom: "1rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              No more messages
            </li>
          )}
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
        <svg
          onClick={clearInput}
          style={{
            flexShrink: 0,
            width: "1rem",
            minWidth: 0,
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.05919 3.46207C6.17433 2.8109 7.474 2.54811 8.75452 2.71488C10.035 2.88166 11.2241 3.46858 12.1352 4.38366C13.0463 5.29874 13.6281 6.49027 13.7894 7.7715C13.8239 8.04548 13.6297 8.29554 13.3557 8.33002C13.0818 8.36451 12.8317 8.17036 12.7972 7.89637C12.6636 6.83476 12.1815 5.84747 11.4266 5.08925C10.6716 4.33102 9.6864 3.8447 8.62537 3.70651C7.56434 3.56832 6.48744 3.78606 5.56345 4.32562C4.86218 4.73512 4.27907 5.31242 3.86336 6.0006H6.0013C6.27744 6.0006 6.5013 6.22446 6.5013 6.5006C6.5013 6.77675 6.27744 7.0006 6.0013 7.0006H2.66797C2.39183 7.0006 2.16797 6.77675 2.16797 6.5006V3.16727C2.16797 2.89113 2.39183 2.66727 2.66797 2.66727C2.94411 2.66727 3.16797 2.89113 3.16797 3.16727V5.23247C3.65486 4.51232 4.29959 3.90563 5.05919 3.46207ZM2.64651 8.67123C2.92046 8.63655 3.17066 8.83052 3.20534 9.10447C3.33969 10.1657 3.82214 11.1524 4.57718 11.9102C5.33221 12.6679 6.3172 13.1539 7.37794 13.292C8.43868 13.4302 9.51529 13.2127 10.4392 12.6736C11.1402 12.2646 11.7232 11.688 12.1392 11.0006H10.0013C9.72516 11.0006 9.5013 10.7767 9.5013 10.5006C9.5013 10.2245 9.72516 10.0006 10.0013 10.0006H13.3346C13.6108 10.0006 13.8346 10.2245 13.8346 10.5006V13.8339C13.8346 14.1101 13.6108 14.3339 13.3346 14.3339C13.0585 14.3339 12.8346 14.1101 12.8346 13.8339V11.7684C12.3475 12.488 11.7027 13.0942 10.9432 13.5373C9.82817 14.1879 8.52891 14.4504 7.2488 14.2837C5.96868 14.117 4.77999 13.5305 3.86881 12.616C2.95762 11.7016 2.37539 10.5108 2.21326 9.23007C2.17858 8.95611 2.37255 8.70591 2.64651 8.67123Z"
            fill="black"
          />
        </svg>
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "1px solid #e5e5e5",
            borderRadius: "999px",
            padding: "0 .2rem",
            minWidth: 0,
          }}
        >
          <input
            type="text"
            placeholder="Gửi tin nhắn"
            value={inputText}
            onChange={onChangeInput}
            style={{
              flex: "1",
              minWidth: 0,
              border: "none",
              outline: "none",
            }}
          />
          <button
            style={{
              border: "none",
              outline: "none",
              cursor: "pointer",
              minWidth: 0,
              background: "transparent",
              flexShrink: 0,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              // dataSlot="icon"
              className="w-6 h-6"
              style={{
                width: "1rem",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

AIChatbot.propTypes = {
  isShowChatbot: PropTypes.bool.isRequired,
};
