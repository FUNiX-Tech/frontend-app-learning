import "./dashboard.scss";

const CourseLoading = ({ courseLearning }) => {
  return (
    <div
      className={`${
        courseLearning
          ? "d-flex w-100 course-loading course-learning"
          : "d-flex w-100 course-loading border"
      }`}
      style={{ height: "193px" }}
    >
      <div className="bg-loading">
        {/* <img  width="346px" height='193px'/> */}
      </div>
      <div
        className={`${
          courseLearning
            ? "p-3 w-100 d-flex flex-column justify-content-around"
            : "p-3 w-100 d-flex border-left flex-column justify-content-around"
        }`}
      >
        <div className="course-title-loading"></div>
        <div></div>
        <div className=" d-flex  align-self-end" style={{ gap: "10px" }}>
          <div className="btn-loading"></div>
          <div className="btn-loading"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseLoading;
