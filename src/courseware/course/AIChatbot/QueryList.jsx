import { useEffect, useState } from "react";
import QueryItem from "./QueryItem";

export default function QueryList({
  queryList,
  onCopyResponse,
  onVote,
  onRetryAskChatbot,
}) {
  const [initiated, setInitiated] = useState(false);

  useEffect(() => {
    console.log("mount list queries", queryList.length);

    if (initiated) return;

    if (queryList.length === 0) return;

    setInitiated(true);

    const container = document.querySelector(
      ".chatbot-messages-list-container"
    );

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [queryList]);
  return (
    <>
      {queryList.map((query) => (
        <li key={query.id}>
          <QueryItem
            query={query}
            onCopyResponse={onCopyResponse}
            onVote={onVote}
            onRetryAskChatbot={onRetryAskChatbot}
          />
        </li>
      ))}
    </>
  );
}
