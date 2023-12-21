import {
  svgChatGPT,
  svgDownVote,
  svgUpVote,
  svgCopy,
  svgRetry,
} from "./AIChabotAssets";

export default function QueryItem({
  query,
  onCopyResponse,
  onVote,
  onRetryAskChatbot,
}) {
  function writeResponseToClipboard() {
    onCopyResponse(query.response_msg);
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
        <div class="ask-item-content">
          {query.query_msg}
          {query.status === "pending" && (
            <span class="ask-item-pending">sending...</span>
          )}
        </div>

        {query.status === "failed" && (
          <div class="failed-to-ask" onClick={retryAskChatbot}>
            <p>Message failed to send.</p>
            <button class="retry-btn">{svgRetry}</button>
          </div>
        )}
      </div>

      {/* ================================= answer item ===============================  */}
      {query.response_msg && (
        <div class="query-item answer-item">
          <div class="answer-item-inner">
            <div class="answer-item-title">
              {svgChatGPT}
              <span>ChatGPT</span>
            </div>

            <div class="answer-item-content">{query.response_msg}</div>

            <div class="answer-item-buttons">
              <button onClick={writeResponseToClipboard}>{svgCopy}</button>
              {query.vote != "down" && (
                <button
                  title={query.vote == "up" ? "remove vote" : "like"}
                  className={upvoteClassName}
                  onClick={query.vote == "up" ? clickRemoveVote : clickUpvote}
                >
                  {svgUpVote}
                </button>
              )}
              {query.vote != "up" && (
                <button
                  title={query.vote == "down" ? "remove vote" : "dislike"}
                  className={downvoteClassName}
                  onClick={
                    query.vote == "down" ? clickRemoveVote : clickDownvote
                  }
                >
                  {svgDownVote}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
