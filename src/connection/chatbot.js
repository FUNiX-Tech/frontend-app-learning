import Cookies from "js-cookie";
import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

// const CHATBOT_HOST = "ws://172.188.64.77:8001/v01_dev/chat";
// const CHATBOT_HOST = "ws://localhost:9999";

let websocket = null;

export function stopChatConnection() {
  if (!websocket) return;
  websocket.close();
  websocket = null;
}

export async function startChatConnection(
  onResponse,
  onResponseFinished,
  onError,
  onConnect
) {
  const site_config_url = `${getConfig().LMS_BASE_URL}/api/site_config/`;

  let response;
  try {
    response = await getAuthenticatedHttpClient().get(site_config_url);
  } catch (error) {
    throw new Error("Failed to get Chatbot host.");
  }

  const CHATBOT_HOST = response?.data?.data?.CHATBOT_HOST;

  if (!CHATBOT_HOST)
    throw new Error("Not found CHATBOT_HOST in site config response.");

  if (!websocket) {
    websocket = new WebSocket(CHATBOT_HOST);
  }
  websocket.onopen = () => {
    if (websocket.readyState === WebSocket.OPEN) {
      onConnect();
      const accessToken = _getAccessToken();
      if (!accessToken) {
        websocket.close(1000, "Not found accessToken.");
        return;
      }
      websocket.send(accessToken);
    }
  };

  websocket.onerror = (error) => {
    const message = `${error.code} - ${error.reason}`;
    onError(message);
  };

  websocket.onclose = (event) => {
    const message = `${event.code} - ${event.reason}`;
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
  if (!websocket) throw new Error("Chatbot connection has not started.");

  const accessToken = _getAccessToken();
  if (!accessToken) {
    websocket.close(1000, "Not found accessToken.");
    return;
  }
  const payload = {
    query,
    chat_id,
    course_id,
  };

  const message = `${accessToken}<END>${JSON.stringify(payload)}`;
  websocket.send(message);
}

function _getAccessToken() {
  return Cookies.get("accessToken");
}
