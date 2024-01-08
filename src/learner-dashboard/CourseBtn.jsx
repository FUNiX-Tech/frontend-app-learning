import PropTypes from "prop-types";
import { getConfig } from "@edx/frontend-platform";
import messages from "./messages";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { Link } from "react-router-dom";
import { urlToPath } from "../utils";

const CourseBtn = ({ intl, courseRun }) => {
  console.log("from course btn", courseRun.resumeUrl);
  return (
    <>
      {courseRun.resumeUrl ? (
        <a
          className="remove-link-effect"
          href={`${getConfig().LMS_BASE_URL}${courseRun.resumeUrl}`}
        >
          <button className="primary-btn-medium btn-modify">
            <span>{intl.formatMessage(messages.btnResumeCourse)}</span>
          </button>
        </a>
      ) : (
        <>
          <a
            href={`${getConfig().LMS_BASE_URL}/courses/${
              courseRun.courseId
            }/about`}
            target="_blank"
            rel="noopener noreferrer"
            className="remove-link-effect"
          >
            <button className="secondary-btn-medium btn-modify">
              <span>{intl.formatMessage(messages.btnIntroductionCourse)}</span>
            </button>
          </a>
          <Link
            to={urlToPath(courseRun.homeUrl)}
            className="remove-link-effect"
          >
            <button className="primary-btn-medium btn-modify">
              <span>{intl.formatMessage(messages.btnBeginCourse)}</span>
            </button>
          </Link>
        </>
      )}
    </>
  );
};

CourseBtn.propTypes = {
  courseRun: PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(CourseBtn);
