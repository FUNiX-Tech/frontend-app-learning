function ConnectionError() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <p className="text-center">
          :( Your chatbot connection has been interrupted.
        </p>
        <div className="d-flex justify-content-center">
          <button onClick={retryConnectingToChatbot}>Reconnect</button>
        </div>
      </div>
    </div>
  );
}

export default ConnectionError;
