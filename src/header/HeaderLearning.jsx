import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { getConfig } from "@edx/frontend-platform";
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";
import { useParams } from "react-router-dom";
import "./HeaderLearning.scss";
import AuthenticatedUserDropdown from "./AuthenticatedUserDropdown";
import { useEffect } from "react";
import { fetchSurveyCourse } from "./data/thunks";
import notification_icon from "./assets/notification.svg";
import avatar_icon from "./assets/avatar.svg";
import useScroll from "../course-tabs/useScroll";

const HeaderLearning = ({
  courseOrg,
  courseNumber,
  courseTitle,
  intl,
  showUserDropdown,
  loading,
}) => {
  // console.log('=======', courseOrg, courseNumber, courseTitle)

  const authenticatedUser = getAuthenticatedUser();
  const { courseId: courseIdFromUrl } = useParams();
  const [scrollY] = useScroll();

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

  return (
    <header
      className={`learning-header ${scrollY > 100 ? "unset-position" : ""}`}
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

      {/* New header 1 - done */}
      <div className="header1-container d-flex align-items-center">
        {/* Logo */}
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

        {/* Course title */}
        <div
          className="d-flex align-items-center course-title-lockup"
          // style={{ gap: "0.5rem" }}
        >
          <span className="d-block m-0  font-weight-bold ">
            {courseOrg}+{courseNumber}+{courseTitle}
          </span>
        </div>

        <div className="actions d-flex">
          <button className="action-button">
            <img src={notification_icon} alt={notification_icon} />
          </button>
          <button className="action-button">
            {/* avatar icon */}
            <img src={avatar_icon} alt={avatar_icon} />
          </button>
        </div>
      </div>

      {/* New header 2 - done */}
      <div className="header2-container d-flex align-items-center">
        {/* Logo */}
        <div className="logo_img">
          <a
            href={`${getConfig().LMS_BASE_URL}/dashboard`}
            className="logo m-0"
          >
            <img
              className="d-block"
              src={getConfig().LOGO_URL}
              alt={getConfig().LOGO_URL}
            />
          </a>
        </div>

        {/* Course title */}
        <div
          className="d-flex align-items-center course-title-lockup"
          // style={{ gap: "0.5rem" }}
        >
          <span className="d-block m-0  font-weight-bold ">{courseTitle}</span>
        </div>

        <div className="actions d-flex">
          <button className="action-button">
            <img src={notification_icon} alt={notification_icon} />
          </button>
          <button className="action-button">
            {/* avatar icon */}
            <img src={avatar_icon} alt={avatar_icon} />
          </button>
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
};

HeaderLearning.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
  isLoading: false,
};

export default injectIntl(HeaderLearning);
