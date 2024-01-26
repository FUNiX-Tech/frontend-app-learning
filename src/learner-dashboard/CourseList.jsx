import PropTypes from "prop-types";
import CourseDashboardItem from "./CourseDashboardItem";

const CourseList = ({ courses }) => {
  return (
    <div
      className="d-flex flex-row flex-wrap flex-lg-column course_list_container_02"
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
