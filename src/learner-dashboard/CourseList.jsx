import PropTypes from "prop-types";
import CourseDashboardItem from "./CourseDashboardItem";

const CourseList = ({ courses }) => {
  return (
    <div
      className="d-flex flex-row flex-wrap flex-lg-column w-100"
      style={{ gap: "10px" }}
    >
      {courses.map((courseData) => (
        <CourseDashboardItem
          key={courseData.courseRun.courseId}
          courseData={courseData}
        />
      ))}
    </div>
  );
};

CourseList.propTypes = {
  courses: PropTypes.array,
};

export default CourseList;
