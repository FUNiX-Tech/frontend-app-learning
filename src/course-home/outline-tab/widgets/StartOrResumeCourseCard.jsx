import React from "react";
import { Button, Card } from "@edx/paragon";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";

import { useSelector } from "react-redux";
import { sendTrackingLogEvent } from "@edx/frontend-platform/analytics";
import messages from "../messages";
import { useModel } from "../../../generic/model-store";
import "./StartOrResumeCourseCard.scss";

function StartOrResumeCourseCard({ intl }) {
  const { courseId } = useSelector((state) => state.courseHome);

  const { org } = useModel("courseHomeMeta", courseId);

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const {
    resumeCourse: { hasVisitedCourse, url: resumeCourseUrl },
  } = useModel("outline", courseId);

  if (!resumeCourseUrl) {
    return null;
  }

  const logResumeCourseClick = () => {
    sendTrackingLogEvent("edx.course.home.resume_course.clicked", {
      ...eventProperties,
      event_type: hasVisitedCourse ? "resume" : "start",
      url: resumeCourseUrl,
    });
  };

  return (
    <div data-testid="start-resume-card">
      <div class="start-or-resume-course">
        <span>{intl.formatMessage(messages.courseContentTitle)}</span>
        <a
          className="remove-link-effect"
          href={resumeCourseUrl}
          onClick={() => logResumeCourseClick()}
        >
          <button className="primary-btn-medium ">
            {hasVisitedCourse
              ? intl.formatMessage(messages.resume)
              : intl.formatMessage(messages.start)}
          </button>
        </a>
      </div>

      {/* Footer is needed for internal vertical spacing to work out. If you can remove, be my guest */}
      <Card.Footer>
        <></>
      </Card.Footer>
    </div>
  );
}

StartOrResumeCourseCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StartOrResumeCourseCard);
