import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

function baseUrl() {
  return `${getConfig().LMS_BASE_URL}/api/chatbot/`;
}

export const fetchQueries = async (session_id = 0, skip = 0, limit = 5) => {
  const url = `${baseUrl()}query/${session_id}/${skip}/${limit}/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const fetchSessions = async (skip = 0, limit = 5) => {
  const url = `${baseUrl()}session/${skip}/${limit}/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const createQueryItemToDB = async ({
  query_msg,
  session_id = undefined,
  status,
  hash,
}) => {
  const url = `${baseUrl()}query/request/`;
  const { data } = await getAuthenticatedHttpClient().post(url, {
    query_msg,
    session_id,
    status,
    hash,
  });
  return data;
};

export const updateQueryItemToDB = async ({
  status,
  response_msg,
  id,
  error,
}) => {
  const url = `${baseUrl()}query/request/`;
  const { data } = await getAuthenticatedHttpClient().put(url, {
    status,
    response_msg,
    error,
    id,
  });
  console.log("UPATE QUERY ITEM::::", response_msg);
  return data;
};

export const voteChatbotResponse = async (query_id, vote) => {
  const url = `${baseUrl()}query/vote/`;
  const { data } = await getAuthenticatedHttpClient().put(url, {
    query_id,
    vote,
  });
  return data;
};

export const giveFeedbackChatbot = async (query_id, feedback) => {
  const url = `${baseUrl()}query/feedback/`;
  const { data } = await getAuthenticatedHttpClient().put(url, {
    query_id,
    feedback,
  });
  return data;
};

export const retryAskChatbot = async (query_id) => {
  const url = `${baseUrl()}query/retry/`;
  const { data } = await getAuthenticatedHttpClient().put(url, {
    query_id,
  });
  return data;
};

export const cancelQuery = () => {
  //
};

export const saveChabotErrorToDB = async (error_msg) => {
  const url = `${baseUrl()}error/`;
  const { data } = await getAuthenticatedHttpClient().post(url, {
    error_msg,
  });
  return data;
};
