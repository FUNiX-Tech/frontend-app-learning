import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleShowFeedback,
  toggleShowLesson,
  toggleShowChatbot,
  setOffMenuState,
  setOnMenuState,
} from "../header/data/slice";
import { useLocation, NavLink, Link } from "react-router-dom";

import messages from "./messages";
import Tabs from "../generic/tabs/Tabs";
import "./CourseTabsNavigation.scss";
import RightMenu from "./assets/RightMenu_off.svg";
import Chatbot from "./assets/Chatbot_off.svg";
import Feedback from "./assets/Feedback_off.svg";
import RightMenuHover from "./assets/RightMenu_hover.svg";
import FeedbackHover from "./assets/Feedback_hover.svg";
import ChatbotHover from "./assets/Chatbot_hover.svg";
import RightMenuActive from "./assets/RightMenu_active.svg";
import FeedbackActive from "./assets/Feedback_active.svg";
import ChatbotActive from "./assets/Chatbot_active.svg";
import useScroll from "./useScroll";
import SkeletonTabs from "./SkeletonTabs";

function CourseTabsNavigation({ activeTabSlug, className, tabs, intl }) {
  //icon src state
  const [rightMenuSrc, setRightMenuSrc] = useState(RightMenu);
  const [feedbackSrc, setFeedbackSrc] = useState(Feedback);
  const [chatbotSrc, setChatbotSrc] = useState(Chatbot);
  const [hideMenu, setHideMenu] = useState(false);

  //redux state from header
  const isShowRightMenu = useSelector(
    (state) => state.header.isShowLessonContent
  );
  const isShowFeedback = useSelector((state) => state.header.isShowFeedback);
  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);

  //redux dispatch
  const dispatch = useDispatch();

  //location
  const location = useLocation();
  const pathname = location.pathname;

  //Handle load effect set active icon
  useEffect(() => {
    if (isShowRightMenu) {
      setRightMenuSrc(RightMenuActive);
    } else {
      setRightMenuSrc(RightMenu);
    }
    if (isShowChatbot) {
      setChatbotSrc(ChatbotActive);
    } else {
      setChatbotSrc(Chatbot);
    }
    if (isShowFeedback) {
      setFeedbackSrc(FeedbackActive);
    } else {
      setFeedbackSrc(Feedback);
    }

    if (pathname.includes("/dates") || pathname.includes("/home")) {
      setHideMenu(true);
    } else {
      setHideMenu(false);
    }
  }, [pathname, isShowChatbot, isShowFeedback]);

  return (
    <>
      <div
        id="courseTabsNavigation"
        className={classNames(
          "course-tabs-navigation",
          className,
          // `${scrollY > 50 ? "fixed-position" : ""}`
          "fixed-position"
        )}
      >
        {/* sub Header - done */}
        <div className="sub-header-container">
          <Tabs
            className="nav-underline-tabs d-flex sub-header-content"
            aria-label={intl.formatMessage(messages.courseMaterial)}
          >
            {!tabs
              ? SkeletonTabs
              : tabs.map(({ url, title, slug }) => {
                  if (url.endsWith("/home") || url.endsWith("/dates")) {
                    const to = url.replace(
                      /^https?:\/\/.+\/(.+\/)?course\//,
                      "/course/"
                    );
                    return (
                      <NavLink
                        key={slug}
                        className={classNames(
                          "nav-item flex-shrink-0 nav-link",
                          {
                            active: slug === activeTabSlug,
                          }
                        )}
                        to={to}
                      >
                        {title}
                      </NavLink>
                    );
                  }

                  return (
                    <a
                      key={slug}
                      className={classNames("nav-item flex-shrink-0 nav-link", {
                        active: slug === activeTabSlug,
                      })}
                      href={url}
                    >
                      {title}
                    </a>
                  );
                })}
          </Tabs>

          {/* sub header Icon */}
          {!hideMenu && (
            <div className="sub-header-icon d-flex">
              {/* <div className="sub-header-icon-item tool-tip-1">
              <img
                onMouseOver={() => {
                  if (!isShowRightMenu) {
                    setRightMenuSrc(RightMenuHover);
                  }
                }}
                onMouseOut={() => {
                  if (!isShowRightMenu) {
                    setRightMenuSrc(RightMenu);
                  }
                }}
                src={rightMenuSrc}
                alt={`RightMenu`}
                onClick={() => {
                  setRightMenuSrc(RightMenuActive);
                  setFeedbackSrc(Feedback);
                  setChatbotSrc(Chatbot);
                  dispatch(toggleShowLesson());
                }}
              />
            </div> */}

              <div className="sub-header-icon-item tool-tip-3">
                <img
                  onMouseOver={() => {
                    if (!isShowChatbot) {
                      setChatbotSrc(ChatbotHover);
                    }
                  }}
                  onMouseOut={() => {
                    if (!isShowChatbot) {
                      setChatbotSrc(Chatbot);
                    } else {
                      setChatbotSrc(ChatbotActive);
                    }
                  }}
                  src={chatbotSrc}
                  alt={`Chatbot`}
                  onClick={() => {
                    setRightMenuSrc(RightMenu);
                    setFeedbackSrc(Feedback);
                    setChatbotSrc(ChatbotActive);
                    dispatch(toggleShowChatbot());
                  }}
                />
              </div>
              <div className="sub-header-icon-item tool-tip-2">
                <img
                  onMouseOver={() => {
                    setFeedbackSrc(FeedbackHover);
                  }}
                  onMouseOut={() => {
                    if (!isShowFeedback) {
                      setFeedbackSrc(Feedback);
                    } else {
                      setFeedbackSrc(FeedbackActive);
                    }
                  }}
                  src={feedbackSrc}
                  alt={`Feedback`}
                  onClick={() => {
                    setRightMenuSrc(RightMenu);
                    setFeedbackSrc(FeedbackActive);
                    setChatbotSrc(Chatbot);
                    dispatch(toggleShowFeedback());
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  intl: intlShape.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
