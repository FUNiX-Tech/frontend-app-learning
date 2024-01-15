import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import HeaderLearning from "../header/HeaderLearning";

import { fetchDashboard } from "../course-home/data";
import CourseList from "./CourseList";
import messages from "./messages";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import CourseLoading from "./CourseLoading";
import iconVector from "../assets/icon/Vector.png";
import Footer from "../footer/Footer";

const Dashboard = ({ intl }) => {
  const [listCourse, setListCourse] = useState([]);
  const [loading, setLoading] = useState(true);

  //icon src
  const [iconVectorSrc, setIconVectorSrc] = useState(iconVector);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { courses } = await fetchDashboard();
        setListCourse(courses);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeaderLearning isDashoard />

      <div
        className="container container-padding"
        style={{ width: "47.75rem", maxWidth: "100%" }}
      >
        <div className="d-flex flex-column">
          {/* <div className=" pb-2 pr-2 pt-0 pl-0">
            <h2 className="message-course">
              {intl.formatMessage(messages.myCourse)}
            </h2>
          </div> */}
          <div
            className={`${
              listCourse.length == 0 ? "w-100 background-no-course" : "w-100"
            }`}
          >
            <div
              className={`d-flex height-content justify-content-center w-100 ${
                listCourse.length == 0 && !loading && "align-items-center"
              } `}
              style={{ minHeight: "31.25rem" }}
            >
              {loading && (
                <div
                  className="pb-3 d-flex flex-column w-100 "
                  style={{ gap: "0.625rem" }}
                >
                  <CourseLoading />
                  <CourseLoading />
                  <CourseLoading />
                </div>
              )}
              {listCourse.length == 0 && !loading && (
                <>
                  <span className="d-flex flex-column  align-items-center model-not-course ">
                    <img
                      src={iconVectorSrc}
                      width="37px"
                      height="30px"
                      alt="iconVector"
                    />
                    <span className="text-not-course">
                      {intl.formatMessage(messages.notCourse)}
                    </span>
                  </span>
                </>
              )}
              {listCourse.length > 0 && (
                <CourseList showFooter courses={listCourse} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

Dashboard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Dashboard);
