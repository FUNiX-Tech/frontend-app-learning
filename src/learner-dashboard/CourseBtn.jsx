import PropTypes from "prop-types";
import { getConfig } from "@edx/frontend-platform";
import messages from "./messages";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import CustomLink from "./CustomLink";

const CourseBtn = ({ intl, courseRun, goToPath }) => {
  // resume btn
  if (courseRun.resumeUrl)
    return (
      <CustomLink className="remove-link-effect" path={goToPath}>
        <button className="primary-btn-medium btn-modify">
          <span>{intl.formatMessage(messages.btnResumeCourse)}</span>
        </button>
      </CustomLink>
    );

  // about btn and begin btn
  return (
    <>
      <a
        href={`${getConfig().LMS_BASE_URL}/courses/${courseRun.courseId}/about`}
        target="_blank"
        rel="noopener noreferrer"
        className="remove-link-effect"
      >
        <button className="secondary-btn-medium btn-modify">
          <span>{intl.formatMessage(messages.btnIntroductionCourse)}</span>
        </button>
      </a>
      <CustomLink path={goToPath} className="remove-link-effect">
        <button className="primary-btn-medium btn-modify">
          <span>{intl.formatMessage(messages.btnBeginCourse)}</span>
        </button>
      </CustomLink>
    </>
  );
};

CourseBtn.propTypes = {
  courseRun: PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(CourseBtn);
