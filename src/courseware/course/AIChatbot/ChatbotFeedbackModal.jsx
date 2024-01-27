import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  giveFeedbackChatbot,
  hideChatbotFeedbackModal,
  voteResponse,
} from "./slice";
import "./ChatbotFeedbackModal.scss";
import { injectIntl } from "@edx/frontend-platform/i18n";
import message from "./messages";

const reasons = ["inaccurate", "unhelpful", "offensive", "other"];

function ChatbotFeedbackModal({ intl }) {
  const [isOther, setIsOther] = useState(false);
  const [text, setText] = useState("");

  const { feedback } = useSelector((state) => state.chatbot);

  const dispatch = useDispatch();
  const container = useRef();

  function clickModalHandler(e) {
    if (container.current && !container.current.contains(e.target)) {
      dispatch(hideChatbotFeedbackModal());
    }
  }

  function onChangeInput(e) {
    setText(e.target.value);
  }

  function onClickSendFeedbackBtn() {
    if (!text) return;

    dispatch(
      giveFeedbackChatbot({
        queryId: feedback.queryId,
        feedback: text,
      })
    );
  }

  function onClickReasonItem(reason) {
    if (reason === "other") {
      setIsOther(true);
      return;
    }

    dispatch(
      giveFeedbackChatbot({
        queryId: feedback.queryId,
        feedback: reason,
      })
    );
  }

  function closeModal() {
    dispatch(hideChatbotFeedbackModal());
  }

  function removeDislike() {
    dispatch(
      voteResponse({
        queryId: feedback.queryId,
        vote: "remove",
      })
    );
  }

  return (
    <div id="chatbot-feedback-modal" onClick={clickModalHandler}>
      <div id="chatbot-feedback-modal-inner" ref={container}>
        <div id="chatbot-feedback-modal-header">
          <button
            onClick={closeModal}
            style={{
              border: "1px solid #e5e5e5",
            }}
          >
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {!isOther && (
          <p className="text-center">
            {intl.formatMessage(message["feedbackIntro"])}
          </p>
        )}

        {isOther && (
          <div>
            <p className="text-center">
              <strong>{intl.formatMessage(message["sorryAboutThat"])}</strong>
            </p>

            <p>{intl.formatMessage(message["whyYouDislike"])}</p>
          </div>
        )}

        {!isOther && (
          <ul
            style={{
              display: "flex",
              width: "100%",
              listStyle: "none",
              gap: "1rem",
              padding: 0,
              flexWrap: "wrap",
            }}
          >
            {reasons.map((item) => (
              <li
                style={{
                  height: "40px",
                  borderRadius: "4px",
                  border: "2px solid var(--color-active)",
                  color: "var(--color-active)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  onClickReasonItem(item);
                }}
                key={item}
              >
                {intl.formatMessage(message[item])}
              </li>
            ))}
          </ul>
        )}

        {isOther && (
          <>
            <textarea
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem",
                border: "4px solid var(--color-active)",
                outline: "none",
                marginBottom: "1rem",
                borderRadius: "4px",
              }}
              value={text}
              onChange={onChangeInput}
            ></textarea>

            <button
              onClick={onClickSendFeedbackBtn}
              style={{
                width: "100%",
                borderRadius: "4px",
                backgroundColor: "var(--color-active)",
                color: "white",
                fontWeight: "500",
                padding: "0.5rem",
                border: "none",
                outline: "none",
                letterSpacing: ".3px",
              }}
            >
              {intl.formatMessage(message["sendFeedback"])}
            </button>
          </>
        )}

        {!isOther && (
          <button
            onClick={removeDislike}
            style={{
              width: "100%",
              borderRadius: "4px",
              backgroundColor: "var(--color-active)",
              color: "white",
              fontWeight: "500",
              padding: "0.5rem",
              border: "none",
              outline: "none",
              letterSpacing: ".3px",
            }}
          >
            {intl.formatMessage(message["removeDislike"])}
          </button>
        )}

        <p className="text-danger">{feedback.error}</p>
      </div>
    </div>
  );
}

export default injectIntl(ChatbotFeedbackModal);
