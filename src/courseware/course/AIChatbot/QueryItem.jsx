import {
  svgChatGPT,
  svgDownVote,
  svgUpVote,
  svgCopy,
  svgRetry,
  svgCopied,
} from "./AIChabotAssets";
import PropTypes from "prop-types";
import {
  FormattedMessage,
  FormattedDate,
  injectIntl,
  intlShape,
} from "@edx/frontend-platform/i18n";
import messages from "./messages";

function QueryItem({ intl, query, onCopyResponse, onVote, onRetryAskChatbot }) {
  function writeResponseToClipboard(e) {
    onCopyResponse(e.currentTarget, query.response_msg);
  }

  function clickDownvote() {
    onVote(query.id, "down");
  }

  function clickUpvote() {
    onVote(query.id, "up");
  }

  function clickRemoveVote() {
    onVote(query.id, "remove");
  }

  function retryAskChatbot() {
    onRetryAskChatbot(query.id);
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
            <div class="answer-item-content">{query.response_msg}</div>

            <div class="answer-item-buttons">
              <button class="copy-btn" onClick={writeResponseToClipboard}>
                {svgCopy}
                {svgCopied}
              </button>
              {query.vote != "down" && (
                <button
                  className={upvoteClassName}
                  onClick={query.vote == "up" ? clickRemoveVote : clickUpvote}
                >
                  {svgUpVote}
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
