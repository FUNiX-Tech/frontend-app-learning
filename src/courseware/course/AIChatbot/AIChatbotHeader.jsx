import { useSelector } from "react-redux";
import { svgClose, svgMessage, svgHamburger, svgPlus } from "./AIChabotAssets";
import "./AIChatbotHeader.scss";

function AIChatbotHeader({ startNewSession, toggleMode, hideChatbot, mode }) {
  const { connection } = useSelector((state) => state.chatbot);
  let lightClasses = "light";

  if (connection.status === "succeeded") {
    lightClasses += " connected";
  }

  if (connection.status === "idle") {
    lightClasses += " idle";
  }

  if (connection.status === "failed") {
    lightClasses += " closed";
  }

  return (
    <div className="chatbot-header">
      <p class="chatbot-name">
        Chat GPT
        <span className={lightClasses}></span>
      </p>
      <div>
        <button
          title="New chat"
          onClick={startNewSession}
          id="chatbot-new-session-btn"
          className="chatbot-header-btn"
        >
          {svgPlus}
        </button>
        <button
          onClick={toggleMode}
          id="chatbot-sessions-list-btn"
          title={mode === "chat" ? "Sessions" : "Chat"}
          className="chatbot-header-btn"
        >
          {mode === "chat" && svgHamburger}
          {mode === "session" && svgMessage}
        </button>
        <button
          title="Hide"
          onClick={hideChatbot}
          className="chatbot-header-btn"
        >
          {svgClose}
        </button>
      </div>
    </div>
  );
}

export default AIChatbotHeader;
