import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { getConfig } from "@edx/frontend-platform";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { Dropdown } from "@edx/paragon";
import { useSelector, useDispatch } from "react-redux";
import { showGlobalChatGPT } from "./data/slice";
import messages from "./messages";
import logoChatGPT from "./assets/chatGPT.svg";

import SelectLanguage from "./SelectLanguage";
import SearchCourse from "./SearchCourse";
import ChatGPT from "../chatGPT/ChatGPT";
import { useModel } from "../generic/model-store";
import avatar_icon from "./assets/avatar.svg";
import avatar_hover_icon from "./assets/avatar_hover.svg";

const AuthenticatedUserDropdown = ({ intl, username, isLoading, courseId }) => {
  const dashboardMenuItem = (
    <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
      <i class="bi bi-house"></i>
      {intl.formatMessage(messages.dashboard)}
    </Dropdown.Item>
  );

  //avatar state
  const [avatarSrc, setAvatarSrc] = useState(avatar_icon);

  const isShowGlobalChatGPT = useSelector(
    (state) => state.header.isShowGlobalChatGPT
  );
  const dispatch = useDispatch();

  const handlerChatGPT = () => {
    dispatch(showGlobalChatGPT());
  };
  const [isSearch, setIsSearch] = useState(true);
  const [isChatGPT, setIsChatGPT] = useState(true);
  const { toggleFeature } = useModel("courseHomeMeta", courseId);
  useEffect(() => {
    if (!toggleFeature?.includes("search")) {
      setIsSearch(false);
    }
    if (!toggleFeature?.includes("chatGPT")) {
      setIsChatGPT(false);
    }
  }, [toggleFeature]);
  return (
    <>
      {!isLoading && (
        <div className="d-flex align-items-center " style={{ gap: "1rem" }}>
          {/* {isChatGPT && (
            <div className="btn-chatGPT" onClick={handlerChatGPT}>
              <span>
                <img src={logoChatGPT} alt="logo-chatGPT" />
              </span>
            </div>
          )} */}
          {/* {isSearch && <SearchCourse />} */}

          {/* <a
            className="text-gray-700"
            href="https://funix.gitbook.io/funix-documentation/"
            target="_blank"
          >
            {intl.formatMessage(messages.help)}
          </a>
          <SelectLanguage username={username} /> */}
        </div>
      )}
      <Dropdown className="user-dropdown position-relative z-index-100000">
        <Dropdown.Toggle
          variant="outline-primary"
          onMouseOver={() => setAvatarSrc(avatar_hover_icon)}
          onMouseOut={() => setAvatarSrc(avatar_icon)}
        >
          {/* <FontAwesomeIcon
            icon={faUserCircle}
            className="d-md-none"
            size="lg"
          /> */}
          <button className="action-button mr-1">
            <img src={avatarSrc} alt={avatar_icon} />
          </button>
          <span data-hj-suppress className="d-none d-md-inline">
            {username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right">
          {dashboardMenuItem}

          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/account/settings`}>
            <i class="bi bi-person"></i>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>

          <Dropdown.Item href={getConfig().LOGOUT_URL}>
            <i class="bi bi-box-arrow-left"></i>
            {intl.formatMessage(messages.signOut)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* {!isLoading && (
        <div className={isShowGlobalChatGPT ? "css-1bljlat" : "css-16kvbm"}>
          <div className={isShowGlobalChatGPT ? "css-19dz5pz" : "css-1dntyew"}>
            <ChatGPT />
          </div>
        </div>
      )} */}
    </>
  );
};

AuthenticatedUserDropdown.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  courseId: PropTypes.string,
};

AuthenticatedUserDropdown.defaultProps = {
  isLoading: false,
};

export default injectIntl(AuthenticatedUserDropdown);
