import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import messages from "./messages";
import { getConfig } from "@edx/frontend-platform";
import CourseBtn from "./CourseBtn";
import { urlToPath } from "../utils";
import { useEffect, useState } from "react";
import { fetchCourseResumeUrl } from "./api.js";
import CustomLink from "./CustomLink";

// temporary response scss
import "./CourseDashboardItem.scss";

function CourseDashboardItem({ intl, courseData }) {
  const { course, courseRun, courseProvider, complete } = courseData;

  function getLearningUnitPath(reactPath) {
    const learningBaseUrl =
      getConfig().LEARNING_BASE_URL || `https://${getConfig().BASE_URL}`;
    const url = learningBaseUrl + reactPath;
    return urlToPath(url);
  }

  let complete_ = complete;
  if (complete) {
    complete_ = complete_.toFixed(0);
  }

  const [goToPath, setGoToPath] = useState(
    courseRun.resumeUrl
      ? `${getConfig().LMS_BASE_URL}${courseRun.resumeUrl}`
      : courseRun.beginUrl.react_path
      ? getLearningUnitPath(courseRun.beginUrl.react_path)
      : getConfig().LMS_BASE_URL + courseRun.beginUrl.jump_url
  );

  useEffect(() => {
    if (!goToPath.startsWith("http")) return;

    fetchCourseResumeUrl(courseRun.courseId, goToPath.split("/jump_to/")[1])
      .then((data) => {
        if (data?.data?.redirect_url) {
          setGoToPath(urlToPath(data.data.redirect_url));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div
      className="course_dashboard_item d-flex border "
      key={courseRun.courseId}
    >
      <div class="course_dashboard_item_thumb">
        <CustomLink path={goToPath}>
          <img
            src={`${getConfig().LMS_BASE_URL}${course.bannerImgSrc}`}
            width="346px"
            height="193px"
          />
        </CustomLink>
      </div>

      <div className="p-3 w-100 d-flex flex-column justify-content-between">
        <div className="course-title">
          <CustomLink className="text-course-title" path={goToPath}>
            {course.courseName}
          </CustomLink>

          <span className="text-course-name">
            {courseProvider.name} - {course.courseNumber}
          </span>
        </div>

        {courseRun.resumeUrl && (
          <div className="pt-3">
            <div className="progress" style={{ height: "5px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${complete_}%`, height: "4px" }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <span className="text-complate-course">
              {complete_}% {intl.formatMessage(messages.complete)}
            </span>
          </div>
        )}

        <div className=" d-flex  align-self-end" style={{ gap: "10px" }}>
          <CourseBtn intl={intl} goToPath={goToPath} courseRun={courseRun} />
        </div>
      </div>
    </div>
  );
}

export default injectIntl(CourseDashboardItem);
