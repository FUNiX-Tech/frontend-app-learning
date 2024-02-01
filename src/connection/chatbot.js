import Cookies from "js-cookie";
import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

export let websocket = null;
let CHATBOT_HOST = "";

export function stopChatConnection(reason) {
  if (!websocket) return;
  websocket.close(1000, reason);
  websocket = null;
}

export function sendMessageToChatbot(query, chat_id, course_id) {
  return new Promise(async (res, rej) => {
    const accessToken = _getAccessToken();

    if (!accessToken) return rej("Missing accessToken");

    const payload = {
      query,
      chat_id,
      course_id,
    };

    const message = `${accessToken}<END>${JSON.stringify(payload)}`;

    if (!CHATBOT_HOST) {
      CHATBOT_HOST = await _getChatbotHost();

      if (!CHATBOT_HOST) {
        return rej("Cannot get chatbot host");
      }
    }

    websocket = new WebSocket(CHATBOT_HOST);

    websocket.onopen = () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(accessToken);
        websocket.send(message);
        return res(true);
      } else {
        return rej("Failed to connect to chatbot server");
      }
    };
  });
}

function _getAccessToken() {
  return Cookies.get("accessToken");
}

function _parseWebsocketError(error) {
  let clientMsg = "";

  if (error.type === "close") {
    clientMsg = `${error.code}${error.reason ? " - " + error.reason : ""}`;
  }

  if (error.type === "error") {
    clientMsg = `${error.message}`;
  }

  return clientMsg;
}

function _getChatbotHost() {
  return new Promise(async (res, _) => {
    const site_config_url = `${getConfig().LMS_BASE_URL}/api/site_config/`;

    try {
      const response = await getAuthenticatedHttpClient().get(site_config_url);
      CHATBOT_HOST = response?.data?.data?.CHATBOT_HOST || "";

      if (!CHATBOT_HOST) {
        console.error("Not found CHATBOT_HOST in site config response");
      }

      return CHATBOT_HOST;
    } catch (error) {
      console.error("Failed to get chatbot host: ", error);
      return res("");
    }
  });
}
