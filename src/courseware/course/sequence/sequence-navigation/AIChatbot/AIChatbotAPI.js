import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

function baseUrl() {
  return `${getConfig().LMS_BASE_URL}/api/chatbot/`;
}

export const fetchQueries = async () => {
  const url = `${baseUrl()}query/0/1/1/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const askChatbot = async (query_msg, session_id = undefined) => {
  const url = `${baseUrl()}query/request/`;
  const { data } = await getAuthenticatedHttpClient().post(url, {
    query_msg,
    session_id,
  });
  return data;
};

export const voteQuery = () => {
  //
};

export const cancelQuery = () => {
  //
};
