import PropTypes from "prop-types";
import { getConfig } from "@edx/frontend-platform";
import messages from "./messages";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import CustomLink from "./CustomLink";
import CustomButton from "../custom-components/CustomButton";

const CourseBtn = ({ intl, courseRun, goToPath }) => {
  // resume btn
  if (courseRun.resumeUrl)
    return (
      <CustomLink className="remove-link-effect" path={goToPath}>
        <CustomButton className="primary-btn-medium btn-modify">
          <span>{intl.formatMessage(messages.btnResumeCourse)}</span>
        </CustomButton>
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
        <CustomButton className="secondary-btn-medium btn-modify">
          <span>{intl.formatMessage(messages.btnIntroductionCourse)}</span>
        </CustomButton>
      </a>
      <CustomLink path={goToPath} className="remove-link-effect">
        <CustomButton className="primary-btn-medium btn-modify">
          <span>{intl.formatMessage(messages.btnBeginCourse)}</span>
        </CustomButton>
      </CustomLink>
    </>
  );
};

CourseBtn.propTypes = {
  courseRun: PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(CourseBtn);
