import { useEffect, useRef } from "react";
import QueryItem from "./QueryItem";
import { useSelector, useDispatch } from "react-redux";
import { svgChatGPT } from "./AIChabotAssets";
import messages from "./messages";
import { injectIntl } from "@edx/frontend-platform/i18n";
import { fetchQueries } from "./slice";
import AIChatbotFooter from "./AIChatbotFooter";
import ChatbotListError from "./ChatbotListError";

function QueryList({ intl, mode, onRetryAskChatbot, onSubmit }) {
  const { query, session } = useSelector((state) => state.chatbot);
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
    if (
      query.items.filter((item) => item.session_id === session.id).length === 0
    )
      return;

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
    if (mode === "session") return null;
    return <ChatbotListError error={query.error} />;
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

          {query.items
            .filter((item) => item.session_id === session.id)
            .map((query) => (
              <li key={query.id}>
                <QueryItem
                  query={query}
                  onRetryAskChatbot={onRetryAskChatbot}
                />
              </li>
            ))}
        </ul>
      </div>

      {mode === "chat" && <AIChatbotFooter mode={mode} onSubmit={onSubmit} />}
    </>
  );
}

export default injectIntl(QueryList);
