import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  svgChatGPT,
  svgDontKnow,
  svgDownVote,
  svgPhone,
  svgReset,
  svgUpVote,
  funixIntro,
} from "./AIChabotAssets";
import { fetchQueries, askChatbot } from "./AIChatbotAPI";
import QueryItem from "./QueryItem";

export default function AIChatbot({
  unitIds,
  unitId,
  showCompletion,
  onNavigate,
  courseId,
  title,
  isShowChatbot,
  shouldDisplayDropdown,
}) {
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(0);
  const [queryList, setQueryList] = useState([]);

  function onChangeInput(e) {
    setInputText(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    askChatbot(inputText, sessionId)
      .then(() => {
        fetchQueries()
          .then((data) => {
            console.log("query list", data.data.query_list);
            setQueryList(data.data.query_list);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  useEffect(() => {
    fetchQueries()
      .then((data) => {
        console.log("query list", data.data.query_list);

        setQueryList(data.data.query_list);
        if (data.data.query_list.length > 0) {
          setSessionId(data.data.query_list[0].session_id);
        }
      })
      .catch(console.error);
  }, []);
  return (
    <div
      className={`${
        isShowChatbot
          ? "sequence-navigation-tabs d-flex flex-grow-1 active"
          : "sequence-navigation-tabs d-flex flex-grow-1"
      }`}
      style={shouldDisplayDropdown ? null : null}
    >
      <h2 className="chat-gpt-title">Chat GPT {queryList.length}</h2>
      <div className="message">
        <div className="you">Y</div>
        <div className="your-message">Mọi người nghĩ gì về Funix?</div>
      </div>
      <div className="chat-gpt-message">
        {/* <div className="chat-gpt-avatar">{svgChatGPT}</div> */}
        <ul
          style={{
            listStyleType: "none",
            width: "100%",
          }}
          className="chat-gpt-response"
        >
          {/* {funixIntro} */}
          {queryList.map((query) => {
            return (
              <li key={query.id}>
                <QueryItem query={query} />
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className={`${isShowChatbot ? "input-message" : "input-message hide"}`}
      >
        <div className="form-container">
          <form
            onSubmit={onSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            className="form-control-container---"
          >
            <input
              type="text"
              placeholder="Gửi tin nhắn"
              value={inputText}
              onChange={onChangeInput}
            />
            <button
              style={{
                border: "none",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {svgDontKnow}
            </button>
          </form>
          {svgReset}
        </div>
      </div>
    </div>
  );
}

AIChatbot.propTypes = {
  unitId: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  isShowChatbot: PropTypes.bool.isRequired,
  shouldDisplayDropdown: PropTypes.bool.isRequired,
};
