import { useRef, useEffect, useState } from "react";
import { svgSubmitActive, svgSubmit } from "./AIChabotAssets";
import { useSelector, useDispatch } from "react-redux";
import { setInputText, askChatbot, setChatbotInputHistory } from "./slice";
import { injectIntl } from "@edx/frontend-platform/i18n";
import messages from "./messages";

function AIChatbotFooter({ intl, mode }) {
  const [hasScrollBar, setHasScrollBar] = useState(false);
  const { ask, query } = useSelector((state) => state.chatbot);

  const dispatch = useDispatch();

  const submitBtnRef = useRef();
  const inputRef = useRef();
  const inputWrapperRef = useRef();

  function onInputKeyUp(e) {
    if (e.keyCode === 13 || e.which == 13) {
      submitBtnRef.current.click();
    }
  }

  function onInputKeyDown(e) {
    if (e.keyCode === 13 || e.which == 13) {
      e.preventDefault();
    }

    if (e.which === 38) {
      e.preventDefault();
      dispatch(setChatbotInputHistory("back"));
    }

    if (e.which === 40) {
      e.preventDefault();
      dispatch(setChatbotInputHistory("next"));
    }
  }

  function onChangeInput(e) {
    dispatch(setInputText(e.target.value));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (query.status === "pending") return;
    if (!ask.input.trim()) return;
    if (ask.status === "pending") {
      alert("Too many request!");
      return;
    }
    dispatch(askChatbot(ask.input));
  }

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 0;
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";

    if (
      inputWrapperRef.current.scrollHeight >
      inputWrapperRef.current.offsetHeight
    ) {
      setHasScrollBar(true);
    } else {
      setHasScrollBar(false);
    }
  }, [ask.input]);

  useEffect(() => {
    if (!inputRef?.current) return;
    inputRef.current.style.height = 0;
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
  }, [mode]);

  useEffect(() => {
    if (mode === "chat" && inputRef.current) inputRef.current.focus();
  }, [mode]);

  let chatbotFooterClasses = "chatbot-footer";
  if (hasScrollBar) {
    chatbotFooterClasses += " has-scrollbar";
  }
  if (mode === "session") {
    chatbotFooterClasses += " d-none";
  }

  return (
    <form onSubmit={onSubmit} className={chatbotFooterClasses}>
      <div ref={inputWrapperRef} className="chatbot-input-wrapper">
        <textarea
          class="chatbot-input"
          type="text"
          placeholder={intl.formatMessage(messages.sendMessage)}
          value={ask.input}
          onChange={onChangeInput}
          ref={inputRef}
          onKeyUp={onInputKeyUp}
          onKeyDown={onInputKeyDown}
        />
      </div>
      <button
        ref={submitBtnRef}
        type="submit"
        title="send"
        className={
          ask.input.trim()
            ? "chatbot-submit-btn"
            : "chatbot-submit-btn disabled"
        }
      >
        {ask.input.trim() ? svgSubmitActive : svgSubmit}
      </button>
    </form>
  );
}

export default injectIntl(AIChatbotFooter);
