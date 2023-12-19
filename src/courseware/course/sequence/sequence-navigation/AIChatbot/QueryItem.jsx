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

  let upvoteClassName = "upvote";
  let downvoteClassName = "downvote";

  if (query.vote == "up") upvoteClassName += " text-danger";
  if (query.vote == "down") downvoteClassName += " text-danger";
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: query.status != "succeeded" ? "2.5rem" : "1rem",
          width: "100%",
        }}
      >
        <div style={{}}>
          <p
            style={{
              borderRadius: "6px",
              padding: "4px 10px",
              background: "#ffbcbc",
              margin: 0,
              textAlign: "right",
              wordBreak: "break-word",
              position: "relative",
            }}
          >
            {query.query_msg}
            {query.status === "pending" && (
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  fontSize: ".875rem",
                  wordBreak: "normal",
                }}
              >
                Sending...
              </span>
            )}

            {query.status === "failed" && (
              <span
                onClick={retryAskChatbot}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  fontSize: ".875rem",
                  wordBreak: "normal",
                  cursor: "pointer",
                }}
              >
                Retry
              </span>
            )}

            {query.status === "failed" && (
              <svg
                style={{
                  position: "absolute",
                  right: "calc(100% + 8px)",
                  top: "50%",
                  fontSize: ".875rem",
                  wordBreak: "normal",
                  transform: "translateY(-50%)",
                  width: "1rem",
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                // dataSlot="icon"
                className="w-6 h-6 text-danger"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            )}
          </p>
        </div>
      </div>

      {query.response_msg && (
        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <p
              style={{
                margin: 0,
                wordBreak: "break-word",
                gap: ".2rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                style={{
                  flexShrink: 0,
                  width: "1rem",
                }}
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="30" rx="2" fill="#10A37F" />
                <path
                  d="M24.141 13.052a5.347 5.347 0 0 0-.46-4.391 5.408 5.408 0 0 0-5.824-2.595 5.346 5.346 0 0 0-4.033-1.798 5.408 5.408 0 0 0-5.159 3.744 5.348 5.348 0 0 0-3.575 2.594 5.409 5.409 0 0 0 .665 6.341 5.347 5.347 0 0 0 .46 4.392 5.408 5.408 0 0 0 5.824 2.595 5.348 5.348 0 0 0 4.033 1.797 5.408 5.408 0 0 0 5.16-3.746 5.349 5.349 0 0 0 3.576-2.594 5.408 5.408 0 0 0-.667-6.339zm-8.067 11.276a4.01 4.01 0 0 1-2.575-.93l.127-.072 4.273-2.47a.694.694 0 0 0 .352-.607v-6.025l1.806 1.043a.064.064 0 0 1 .035.05v4.989a4.028 4.028 0 0 1-4.018 4.022zm-8.642-3.69a4.01 4.01 0 0 1-.48-2.696l.127.076 4.273 2.468a.696.696 0 0 0 .702 0l5.218-3.012v2.086a.065.065 0 0 1-.026.055l-4.32 2.494a4.026 4.026 0 0 1-5.494-1.472zm-1.125-9.33a4.007 4.007 0 0 1 2.094-1.764l-.002.147v4.938a.695.695 0 0 0 .35.607l5.218 3.012-1.806 1.043a.065.065 0 0 1-.061.006L7.78 16.8a4.026 4.026 0 0 1-1.473-5.492zm14.841 3.453-5.217-3.012 1.806-1.043a.064.064 0 0 1 .06-.005l4.321 2.494a4.024 4.024 0 0 1-.621 7.259v-5.085a.693.693 0 0 0-.349-.608zm1.798-2.706a5.988 5.988 0 0 0-.127-.075L18.546 9.51a.696.696 0 0 0-.702 0l-5.218 3.013v-2.086a.064.064 0 0 1 .026-.056l4.32-2.492a4.023 4.023 0 0 1 5.974 4.165zm-11.302 3.719L9.837 14.73a.065.065 0 0 1-.035-.05V9.69a4.023 4.023 0 0 1 6.597-3.088 3.72 3.72 0 0 0-.127.072l-4.274 2.468a.695.695 0 0 0-.351.608l-.003 6.023zm.981-2.116 2.324-1.342 2.324 1.341v2.683l-2.324 1.342-2.324-1.342v-2.682z"
                  fill="#fff"
                />
              </svg>
              <span style={{ fontSize: ".875rem" }}>Chat GPT</span>
            </p>
            <p
              style={{
                borderRadius: "6px",
                padding: "4px 10px",
                background: "rgb(124 227 186)",
                margin: 0,
                textAlign: "right",
                minWidth: 0,
                wordBreak: "break-word",
              }}
            >
              {query.response_msg}
            </p>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                padding: ".5rem",
              }}
            >
              <svg
                onClick={writeResponseToClipboard}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                // dataSlot="icon"
                className="w-6 h-6"
                width="16"
                style={{
                  cursor: "pointer",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
              <svg
                onClick={clickUpvote}
                className={upvoteClassName}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  fill: query.vote == "up" ? "red" : "none",
                  cursor: "pointer",
                }}
              >
                <path
                  d="M4.66536 7.33301L7.33203 1.33301C7.86246 1.33301 8.37117 1.54372 8.74625 1.91879C9.12132 2.29387 9.33203 2.80257 9.33203 3.33301V5.99967H13.1054C13.2986 5.99749 13.4901 6.03734 13.6664 6.11649C13.8428 6.19563 13.9998 6.31216 14.1266 6.45802C14.2534 6.60387 14.347 6.77556 14.4009 6.96118C14.4548 7.1468 14.4677 7.34191 14.4387 7.53301L13.5187 13.533C13.4705 13.8509 13.309 14.1407 13.064 14.349C12.819 14.5573 12.5069 14.67 12.1854 14.6663H4.66536M4.66536 7.33301V14.6663M4.66536 7.33301H2.66536C2.31174 7.33301 1.9726 7.47348 1.72256 7.72353C1.47251 7.97358 1.33203 8.31272 1.33203 8.66634V13.333C1.33203 13.6866 1.47251 14.0258 1.72256 14.2758C1.9726 14.5259 2.31174 14.6663 2.66536 14.6663H4.66536"
                  stroke="#ACACBE"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                onClick={clickDownvote}
                className={downvoteClassName}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  fill: query.vote == "down" ? "red" : "none",
                  cursor: "pointer",
                }}
              >
                <path
                  d="M11.3314 8.66658L8.66473 14.6666C8.1343 14.6666 7.62559 14.4559 7.25052 14.0808C6.87545 13.7057 6.66473 13.197 6.66473 12.6666V9.99992H2.8914C2.69813 10.0021 2.50669 9.96225 2.33035 9.8831C2.15401 9.80396 1.99699 9.68743 1.87016 9.54157C1.74333 9.39572 1.64973 9.22403 1.59584 9.03841C1.54195 8.85279 1.52906 8.65768 1.55807 8.46658L2.47807 2.46658C2.52628 2.14864 2.68778 1.85884 2.9328 1.65058C3.17782 1.44231 3.48985 1.32961 3.8114 1.33325H11.3314M11.3314 8.66658V1.33325M11.3314 8.66658H13.1114C13.4887 8.67326 13.8553 8.54116 14.1417 8.29537C14.428 8.04958 14.6142 7.70721 14.6647 7.33325V2.66658C14.6142 2.29262 14.428 1.95025 14.1417 1.70446C13.8553 1.45867 13.4887 1.32658 13.1114 1.33325H11.3314"
                  stroke="#ACACBE"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
