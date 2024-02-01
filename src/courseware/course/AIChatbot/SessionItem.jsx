import { useSelector } from "react-redux";

const LANGUAGE_CODE = "vi";

function SessionItem({ session, onSelectSession }) {
  const { session: s } = useSelector((state) => state.chatbot);

  function onClickHandler() {
    onSelectSession(session);
  }

  let classes = "session_item";

  if (session.session_id === s.id) classes += " active";

  return (
    <li className={classes} onClick={onClickHandler}>
      <div className="session_item_header">
        <span>{new Date(session.created).toLocaleString(LANGUAGE_CODE)}</span>
      </div>
      <div className="session_item_ask">
        <span>{session.query_msg}</span>
      </div>
      {session.status === "failed" && (
        <div
          className="session_item_answer"
          dangerouslySetInnerHTML={{
            __html: "<p>Failed to sent message.</p>",
          }}
        ></div>
      )}

      {session.status === "succeeded" && (
        <div
          className="session_item_answer"
          dangerouslySetInnerHTML={{ __html: session.response_msg }}
        ></div>
      )}

      {session.status === "pending" && (
        <div
          className="session_item_answer"
          dangerouslySetInnerHTML={{ __html: "<p>Sending message...</p>" }}
        ></div>
      )}
    </li>
  );
}

export default SessionItem;
