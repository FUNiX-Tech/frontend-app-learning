import { defineMessages } from "@edx/frontend-platform/i18n";

const messages = defineMessages({
  welcome: {
    id: "chatbot.welcome",
    defaultMessage:
      "Hello. I am Chat GPT and will help you answer your questions.",
    description: "Chat GPT Welcome.",
  },
  sending: {
    id: "chatbot.sending",
    defaultMessage: "Sending",
    description: "Sending message.",
  },
  failedToSend: {
    id: "chatbot.failedToSend",
    defaultMessage: "Message failed to send.",
    description: "Failed to send message.",
  },
  retry: {
    id: "chatbot.retry",
    defaultMessage: "Retry.",
    description: "Retry to send message.",
  },
  sendMessage: {
    id: "chatbot.sendMessage",
    defaultMessage: "Send message",
    description: "Send message placeholder.",
  },
});

export default messages;
