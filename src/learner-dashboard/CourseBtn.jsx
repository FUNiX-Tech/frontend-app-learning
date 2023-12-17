import PropTypes from "prop-types";
import { getConfig } from "@edx/frontend-platform";
import messages from "./messages";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";

const CourseBtn = ({ intl, courseRun }) => {
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
          <a href={courseRun.homeUrl} className="remove-link-effect">
            <button className="primary-btn-medium btn-modify">
              <span>{intl.formatMessage(messages.btnBeginCourse)}</span>
            </button>
          </a>
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
