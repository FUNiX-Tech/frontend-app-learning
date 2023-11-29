import React from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import classNames from "classnames";

import messages from "./messages";
import Tabs from "../generic/tabs/Tabs";
import "./CourseTabsNavigation.scss";
import RightMenu from "./assets/RightMenu_off.svg";
import Chatbox from "./assets/Chatbot_off.svg";
import Feedback from "./assets/Feedback_off.svg";
import useScroll from "./useScroll";

function CourseTabsNavigation({ activeTabSlug, className, tabs, intl }) {
  const [scrollY] = useScroll();
  const stylesBackgroundColor = {
    backgroundColor: "#fff",
  };

  return (
    <div
      id="courseTabsNavigation"
      className={classNames(
        "course-tabs-navigation",
        className,
        `${scrollY > 50 ? "fixed-position" : ""}`
      )}
      style={scrollY > 50 ? stylesBackgroundColor : {}}
    >
      {/* sub Header - done */}
      <div className="sub-header-container">
        <Tabs
          className="nav-underline-tabs d-flex sub-header-content"
          aria-label={intl.formatMessage(messages.courseMaterial)}
        >
          {tabs.map(({ url, title, slug }) => {
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
        <div className="sub-header-icon d-flex">
          <div className="sub-header-icon-item">
            <img src={RightMenu} alt={`RightMenu`} />
          </div>
          <div className="sub-header-icon-item">
            <img src={Feedback} alt={`Feedback`} />
          </div>
          <div className="sub-header-icon-item">
            <img src={Chatbox} alt={`Chatbox`} />
          </div>
        </div>
      </div>
    </div>
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
