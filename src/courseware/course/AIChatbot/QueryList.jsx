import { useEffect, useRef } from "react";
import QueryItem from "./QueryItem";
import { useSelector, useDispatch } from "react-redux";
import { svgChatGPT } from "./AIChabotAssets";
import messages from "./messages";
import { injectIntl } from "@edx/frontend-platform/i18n";
import { fetchQueries } from "./slice";
import AIChatbotFooter from "./AIChatbotFooter";

function QueryList({ intl, mode, onVote, onRetryAskChatbot }) {
  const { query } = useSelector((state) => state.chatbot);
  const dispatch = useDispatch();

  const msgContainerRef = useRef();

  function onScroll(e) {
    const maxScrollTop =
      e.currentTarget.scrollHeight - e.currentTarget.clientHeight;

    if (
      query.initiated &&
      e.currentTarget.scrollTop < -maxScrollTop + 50 &&
      query.status !== "pending" &&
      !query.isLastPage
    ) {
      dispatch(fetchQueries());
    }
  }

  useEffect(() => {
    if (query.initiated) return;
    if (query.items.length === 0) return;

    const container = document.querySelector(
      ".chatbot-messages-list-container"
    );

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [query.items]);

  useEffect(() => {
    if (query.initiated) return;
    dispatch(fetchQueries());
  }, [query.initiated]);

  // need to re-position this
  if (query.status === "failed") {
    return (
      <div
        className="query-list-error"
        style={{
          height: "100%",
          flex: 1,
        }}
      >
        <p>🥲 Something wrong happened.</p>
        <p className="text-center text-danger">{query.error}</p>
      </div>
    );
  }

  let classes = "chatbot-messages-list-container";
  if (mode === "session") classes += " d-none";

  return (
    <>
      <div ref={msgContainerRef} onScroll={onScroll} className={classes}>
        <ul className="chatbot-messages-list">
          {query.items.length === 0 && query.status === "succeeded" && (
            <div className="chatbot-intro">
              <div className="chatbot-intro-avatar">{svgChatGPT}</div>
              <p className="chatbot-intro-text">
                {intl.formatMessage(messages.welcome)}
              </p>
            </div>
          )}

          {query.items.map((query) => (
            <li key={query.id}>
              <QueryItem
                query={query}
                onVote={onVote}
                onRetryAskChatbot={onRetryAskChatbot}
              />
            </li>
          ))}
        </ul>
      </div>

      {mode === "chat" && <AIChatbotFooter mode={mode} />}
    </>
  );
}

export default injectIntl(QueryList);
