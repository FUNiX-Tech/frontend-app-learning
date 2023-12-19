import {
  svgChatGPT,
  svgDontKnow,
  svgDownVote,
  svgPhone,
  svgReset,
  svgUpVote,
  funixIntro,
} from "./AIChabotAssets";

export default function QueryItem({ query }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
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
            }}
          >
            {query.query_msg}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: ".5rem",
              padding: ".5rem",
            }}
          >
            {svgPhone}
            {svgUpVote}
            {svgDownVote}
          </div>
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
              display: "flex",
              gap: ".5rem",
              width: "100%",
            }}
          >
            <svg
              style={{
                flexShrink: 0,
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
            <p
              style={{
                borderRadius: "6px",
                padding: "4px 10px",
                background: "rgb(124 227 186)",
                margin: 0,
                textAlign: "right",
                minWidth: 0,
              }}
            >
              {query.response_msg}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
