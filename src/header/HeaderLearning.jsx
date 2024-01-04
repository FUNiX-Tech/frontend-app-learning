import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";
import { useParams } from "react-router-dom";
import "./HeaderLearning.scss";
import "./HeaderLearningResponsive.scss";
import AuthenticatedUserDropdown from "./AuthenticatedUserDropdown";
import { useEffect } from "react";
import { fetchSurveyCourse } from "./data/thunks";
import notification_icon from "./assets/notification.svg";
import avatar_icon from "./assets/avatar.svg";
import useScroll from "../course-tabs/useScroll";
import { NavLink } from "react-router-dom";

const HeaderLearning = ({
  courseOrg,
  courseNumber,
  courseTitle,
  intl,
  showUserDropdown,
  loading,
  isDashoard,
}) => {
  const authenticatedUser = getAuthenticatedUser();
  const { courseId: courseIdFromUrl } = useParams();

  // useEffect(async()=>{
  //   try {
  //     const {checkSurveyCourse, checkUserSurvey } = await fetchSurveyCourse(courseIdFromUrl)
  //     if (!checkSurveyCourse){
  //        if(checkUserSurvey){
  //          return window.location.href = `${getConfig().LMS_BASE_URL}/survey-form/${courseIdFromUrl}`
  //        }else {
  //          return true
  //        }
  //     }else {
  //      return true
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  //  },[])

  // Header for dashboard
  const headerDashboard = (
    <div className="d-flex align-items-center course-title-lockup">
      <ul>
        <li>
          <NavLink
            className="header-dashboard-link"
            activeClassName="active"
            end
            to="/dashboard"
          >
            Khoá học của tôi
          </NavLink>
        </li>
        {/* <li>
          <a
            className="header-dashboard-link"
            // activeClassName="active"
            // to="/course"
            href="#"
          >
            Các khoá khác
          </a>
        </li> */}
      </ul>
    </div>
  );
  let titleContent = "";
  if (courseOrg && courseNumber && courseTitle) {
    titleContent = `${courseTitle}`;
  }

  return (
    <header
      className={`${
        isDashoard ? "learning-header dashboard" : "learning-header"
      }`}
    >
      {/* <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a> */}
      {/* <div className="container-xl py-2 d-flex align-items-center">
        <a href={`${getConfig().LMS_BASE_URL}/dashboard`} className="logo">
          <img
            className="d-block"
            src={getConfig().LOGO_URL}
            alt={getConfig().LOGO_URL}
          />
        </a>
        <div
          className="d-flex align-items-center flex-grow-1 course-title-lockup"
          style={{ gap: "0.5rem" }}
        >
          <span className="d-block font-weight-bold  m-0">
            {courseOrg} {courseNumber}
          </span>
          <span className="d-block m-0  font-weight-bold ">{courseTitle}</span>
        </div>
        {showUserDropdown && authenticatedUser && (
          <AuthenticatedUserDropdown
            username={authenticatedUser.username}
            isLoading={loading}
            courseId={courseIdFromUrl}
          />
        )}
      </div> */}

      <div
        className={`${
          !isDashoard ? "header2-container" : "header1-container"
        } d-flex align-items-center`}
      >
        <div className="logo-container">
          {" "}
          <a
            href={`${getConfig().LMS_BASE_URL}/dashboard`}
            className="logo logo_img"
          >
            <img
              className="d-block"
              src={getConfig().LOGO_URL}
              alt={getConfig().LOGO_URL}
            />
          </a>
        </div>

        <div
          className={`${
            isDashoard
              ? "d-flex align-items-center course-title-lockup header-dashboard"
              : "d-flex align-items-center course-title-lockup"
          }`}
        >
          <span className={`${isDashoard ? "d-block" : "d-block header-2"}`}>
            {isDashoard ? headerDashboard : titleContent}
          </span>
        </div>
        <div className="actions d-flex align-items-center">
          <button className="action-button">
            <img src={notification_icon} alt={notification_icon} />
          </button>
          {/* <button className="action-button">
            <img src={avatar_icon} alt={avatar_icon} />
          </button> */}
          {showUserDropdown && authenticatedUser && (
            <AuthenticatedUserDropdown
              username={authenticatedUser.username}
              isLoading={loading}
              courseId={courseIdFromUrl}
            />
          )}
        </div>
      </div>
    </header>
  );
};

HeaderLearning.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  intl: intlShape.isRequired,
  showUserDropdown: PropTypes.bool,
  isLoading: PropTypes.bool,
  isDashoard: PropTypes.bool,
};

HeaderLearning.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
  isLoading: false,
  isDashoard: false,
};

export default injectIntl(HeaderLearning);
