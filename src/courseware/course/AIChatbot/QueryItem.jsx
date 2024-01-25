import {
  svgChatGPT,
  svgUpVote,
  svgCopy,
  svgRetry,
  svgCopied,
} from "./AIChabotAssets";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import messages from "./messages";
import { showChatbotFeedbackModal, voteResponse } from "./slice";
import { useDispatch } from "react-redux";
import { useRef } from "react";

function QueryItem({ intl, query, onRetryAskChatbot }) {
  const dispatch = useDispatch();
  const copyBtnRef = useRef();

  function onClickDownVoteBtn() {
    if (query.vote !== "down") {
      dispatch(
        voteResponse({
          queryId: query.id,
          vote: "down",
        })
      );
      return;
    }

    if (!query.feedback) {
      dispatch(showChatbotFeedbackModal(query.id));
      return;
    }

    dispatch(
      voteResponse({
        queryId: query.id,
        vote: "remove",
      })
    );
  }

  function onClickUpVoteBtn() {
    if (query.vote === "up") {
      dispatch(
        voteResponse({
          queryId: query.id,
          vote: "remove",
        })
      );
      return;
    }

    dispatch(
      voteResponse({
        queryId: query.id,
        vote: "up",
      })
    );
  }

  function writeResponseToClipboard() {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = query.response_msg;
    const textContent = tmp.textContent || tmp.innerText || "";

    navigator.clipboard.writeText(textContent);

    copyBtnRef.current?.classList.add("copied");
    setTimeout(() => {
      copyBtnRef.current?.classList.remove("copied");
    }, 1000);
  }

  function retryAskChatbot() {
    onRetryAskChatbot(query.id);
  }

  function getFeedbackDisplay(feedbackContent) {
    if (!feedbackContent) return "Send feedback?";

    const reasons = ["Inaccurate", "Offensive", "Unhelpful"];

    if (reasons.includes(feedbackContent)) return feedbackContent;

    return "Other";
  }

  let upvoteClassName = "upvote-btn";
  let downvoteClassName = "downvote-btn";

  if (query.vote == "up") upvoteClassName += " active";
  if (query.vote == "down") downvoteClassName += " active";

  return (
    <>
      <div class="ask-item">
        <div class="ask-item-content">{query.query_msg}</div>
        {query.status === "pending" && (
          <p class="ask-item-pending">{intl.formatMessage(messages.sending)}</p>
        )}
        {query.status === "failed" && (
          <p className="retry-msg">
            {intl.formatMessage(messages.failedToSend)}{" "}
            <span className="retry-btn" onClick={retryAskChatbot}>
              {intl.formatMessage(messages.retry)}
            </span>
          </p>
        )}
      </div>

      {/* ================================= answer item ===============================  */}
      {query.response_msg && (
        <div class="query-item answer-item">
          <div class="answer-item-inner">
            <div
              class="answer-item-content"
              dangerouslySetInnerHTML={{ __html: query.response_msg }}
            ></div>

            <div class="answer-item-buttons">
              <button
                ref={copyBtnRef}
                class="copy-btn"
                onClick={writeResponseToClipboard}
              >
                {svgCopy}
                {svgCopied}
              </button>

              {query.vote != "down" && (
                <button className={upvoteClassName} onClick={onClickUpVoteBtn}>
                  {svgUpVote}
                </button>
              )}

              {query.vote !== "up" && (
                <button
                  className={downvoteClassName}
                  onClick={onClickDownVoteBtn}
                >
                  {svgUpVote}
                  {query.vote === "down" && (
                    <span>{getFeedbackDisplay(query.feedback)}</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

QueryItem.propTypes = {
  intl: intlShape.isRequired,
  onCopyResponse: PropTypes.func.isRequired,
  onVote: PropTypes.func.isRequired,
  onRetryAskChatbot: PropTypes.func.isRequired,
};

export default injectIntl(QueryItem);
