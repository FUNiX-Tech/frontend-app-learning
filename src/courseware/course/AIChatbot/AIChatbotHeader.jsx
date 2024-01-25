import { svgClose, svgMessage, svgHamburger, svgPlus } from "./AIChabotAssets";

function AIChatbotHeader({ startNewSession, toggleMode, hideChatbot, mode }) {
  return (
    <div className="chatbot-header">
      <p class="chatbot-name">Chat GPT</p>
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
