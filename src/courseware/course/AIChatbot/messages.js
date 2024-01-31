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
  inaccurate: {
    id: "chatbot.feedback.inaccurate",
    defaultMessage: "Inaccurate",
    description: "Inaccurate resposne.",
  },
  unhelpful: {
    id: "chatbot.feedback.unhelpful",
    defaultMessage: "Unhelpful",
    description: "Unhelpful response.",
  },
  offensive: {
    id: "chatbot.feedback.offensive",
    defaultMessage: "Offensive",
    description: "Offensive response.",
  },
  other: {
    id: "chatbot.feedback.other",
    defaultMessage: "Other",
    description: "Other response.",
  },
  feedbackIntro: {
    id: "chatbot.feedback.intro",
    defaultMessage:
      "Tell us why you dislike this message. Your feedback will help us improve the bots.",
    description: "Feedback modal intro.",
  },
  removeDislike: {
    id: "chatbot.feedback.removeDislike",
    defaultMessage: "Remove dislike",
    description: "Remove dislike.",
  },
  sendFeedback: {
    id: "chatbot.feedback.sendFeedback",
    defaultMessage: "Send feedback",
    description: "Send feedback.",
  },
  sorryAboutThat: {
    id: "chatbot.feedback.sorryAboutThat",
    defaultMessage: "Sorry about that",
    description: "Sorry about that.",
  },
  whyYouDislike: {
    id: "chatbot.feedback.whyYouDislike",
    defaultMessage:
      "Can you tell us why you dislike this message? Your feedback will help us improve the bots.",
    description: "Why do you dislike?",
  },
  connectionClosed: {
    id: "chatbot.error.connectionClosed",
    defaultMessage: "Connection closed",
    description: "Connection closed",
  },
  connectionError: {
    id: "chatbot.error.connectionError",
    defaultMessage: "Connection error",
    description: "Connection error",
  },
});

export default messages;
