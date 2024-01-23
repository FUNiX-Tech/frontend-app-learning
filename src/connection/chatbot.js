import Cookies from "js-cookie";

// const CHATBOT_URL = "ws://172.188.64.77:8001/v01_dev/chat";
const CHATBOT_URL = "ws://localhost:9999";
let websocket = null;

export function stopChatConnection() {
  console.log("stop connection");
  if (!websocket) return;
  websocket.close();
  websocket = null;
}

export function startChatConnection(
  onResponse,
  onResponseFinished,
  onError,
  onConnect
) {
  if (!websocket) {
    websocket = new WebSocket(CHATBOT_URL);
  }
  websocket.onopen = () => {
    const accessToken = _getAccessToken();
    if (!accessToken) throw new Error("No accessToken");
    // websocket.send(accessToken);
    if (websocket.readyState === WebSocket.OPEN) {
      onConnect();
      console.log("CHATBOT WS CONNECTION STARTED");
    }
  };

  websocket.onerror = (error) => {
    console.error("CHATBOT WS ERROR: ", error);
    const message = `${error.code} - ${error.reason}`;
    onError(message);
  };

  websocket.onclose = (event) => {
    const message = `${event.code} - ${event.reason}`;
    console.log("ONCLOSE ", message);
    onError(message);
  };

  websocket.onmessage = (event) => {
    if (event.data !== "<<Response Finished>>") {
      onResponse(event.data);
    } else {
      onResponseFinished();
    }
  };
}

export function sendMessageToChatbot(query, chat_id, course_id) {
  console.log("CHATBOT STARTED SENDING MSG");
  if (!websocket) throw new Error("Chatbot connection has not started.");

  const accessToken = _getAccessToken();
  if (!accessToken) throw new Error("No accessToken");

  const payload = {
    query,
    chat_id,
    course_id,
  };

  console.log("CHATBOT PAYLOAD: ", payload);

  //   const message = `${accessToken}<END>${JSON.stringify(payload)}`;
  const message = `${JSON.stringify(payload)}`;
  websocket.send(message);
}

function _getAccessToken() {
  return "uT1uK4xbFygDmZI5YGJ0jXfGkH8Ymr";
  return Cookies.get("accessToken");
}
