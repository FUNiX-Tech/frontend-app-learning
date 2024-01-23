import SessionItem from "./SessionItem";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSessions } from "./slice";
import ChatbotListError from "./ChatbotListError";

function SessionList({ onSelectSession, mode }) {
  const dispatch = useDispatch();

  const { session } = useSelector((state) => state.chatbot);

  function fetchMore() {
    dispatch(fetchSessions());
  }

  useEffect(() => {
    if (!session.initiated) dispatch(fetchSessions());
  }, [session.initiated]);

  let classes = "chatbot-messages-list-container";
  if (mode === "chat") classes += " d-none";
  return (
    <div className={classes}>
      {session.error && <ChatbotListError error={session.error} />}

      {!session.error && (
        <ul className="chatbot-messages-list">
          {session.items.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              onSelectSession={onSelectSession}
            />
          ))}

          {!session.isLastPage && session.status !== "pending" && (
            <li id="fetch_more_sessions" onClick={fetchMore}>
              Xem thêm
            </li>
          )}

          {session.status === "pending" && (
            <li className="text-center">Loading more...</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SessionList;
