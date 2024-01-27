import "./ChatbotListError.scss";

function ChatbotListError({ error }) {
  return (
    <div className="chatbot-list-error">
      <div className="chatbot-list-error-inner">
        <p>:( Something wrong happened.</p>
        <p>{error}</p>
      </div>
    </div>
  );
}

export default ChatbotListError;
