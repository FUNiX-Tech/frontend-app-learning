import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import HeaderLearning from "../header/HeaderLearning";
import { getConfig, history } from "@edx/frontend-platform";
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";
import "./courseAbout.scss";
import { Collapsible, Skeleton } from "@edx/paragon";
import { Helmet } from 'react-helmet';
import CourseTree from "./component/CourseTree";
import CourseCardAbout, { InfoAbout } from "./component/CourseCardAbout";
import TargetCourse from "./component/TargetCourse";
import ParticipantCourse from "./component/ParticipantCourse";
import InputRequired from "./component/InputRequired";
import { useMediaQuery } from "react-responsive";
import StartTeacher from "./component/StartTeacher";
import ExpertTeacher from "./component/ExpertTeacher";
import Footer from "../footer/Footer";

const CourseAbout = (props) => {
  const { fetch } = props;
  const { courseId: courseIdFromUrl } = useParams();
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const elementTitleRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);

  //responsive
  const isDesktop = useMediaQuery({ minWidth: 1134 });
  const isMobile = useMediaQuery({ minWidth: 744 });

  useEffect(async () => {
    try {
      const data = await fetch(courseIdFromUrl);
      setData(data);
    } catch (error) {
      console.log("=============", error);
    } finally {
      setLoading(false);
    }

    const handleScroll = () => {
      const element = elementTitleRef.current;

      if (element) {
        const elementHeight = element.offsetHeight;
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY >= elementHeight) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [courseIdFromUrl]);

  const fixedStyles = {
    position: isFixed ? "fixed" : "relative",
    top: isFixed ? 0 : "auto",
    left: isFixed ? 0 : "auto",
    width: isFixed && "100%",
    padding: isFixed && "16px 8px 16px 80px",
  };

  const handlerLogin = () => {
    window.location.href = getConfig().LOGIN_URL;
  };

  useEffect(() => {
    const authenticatedUser = getAuthenticatedUser();
    if (authenticatedUser) {
      setAuth(true);
    }
  }, []);

  console.log(loading);

  const customWrapper = ({ children }) => {
    return (
      <div
      className="bg-loading-img"

      >
        {children}
      </div>
    )
  }

  return (
    <div>
          <Helmet>
          <title>{data.display_name}</title>
        </Helmet>
      {auth ? (
        <HeaderLearning isDashoard about />
      ) : (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ padding: "10px 16px" , borderBottom : '1px solid #D7D7D7'}}
        >
          <a
            href={`${getConfig().LMS_BASE_URL}/courses`}
            className="logo logo_img"
            width="100%"
          >
       
            <img
              className="d-block"
              src={getConfig().LOGO_URL}
              alt="logo"
              width="88px"
              height="36px"
            />
          </a>

          <div>
            <button
              onClick={handlerLogin}
              className="btn btn-login"
            >
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
      )}
      <div className="container-about">
        <div className="" style={{ background: "#EEF7FF" }}>
          {!isDesktop ? (
            <div className="" style={{ padding: `${!isMobile ? '32px' : "56px"}` }}>
              <div className="">
                <img
                  style={{
                    borderTopRightRadius: "4px",
                    borderTopLeftRadius: "4px",
                  }}
                  src={`${getConfig().LMS_BASE_URL}${
                    data.course_image_urls?.small
                  }`}
                  alt="course"
                  width="100%"
                />
              </div>
              <div style={{paddingTop:'14px'}}>
                {!isMobile ? <h2>{data.display_name}</h2> : <h1>{data.display_name}</h1> }
                
                <span
                  style={{fontSize:'16px',  lineHeight:'24px'}}
                  dangerouslySetInnerHTML={{ __html: data?.overview }}
                ></span>
              </div>
              <div>
                <CourseCardAbout
                  lab={data.lab}
                  quiz={data.quiz}
                  project={data.project}
                  handlerLogin={handlerLogin}
                />
              </div>
            </div>
          ) : (
            <div className="">
              <div className="">
                <div
                  className="about-section"
                  style={{ padding: "56px 0px" }}
                  ref={elementTitleRef}
                >
                  {loading ? (
                    <Skeleton count={4} />
                  ) : (
                    <>
                      <h1
                        className={`${isFixed ? "title_fixed" : ""}`}
                        style={fixedStyles}
                      >
                        {data.display_name}
                      </h1>
                      <span
                        style={{fontSize:'16px', lineHeight:'24px'}}
                        dangerouslySetInnerHTML={{ __html: data?.overview }}
                      ></span>
                    </>
                  )}
                </div>
              </div>

              <div className="about-card">
                <div>
                  {loading ? (
                    <Skeleton
                    wrapper={customWrapper} 
                      
                    />
                  ) : (
                    <img
                      style={{
                        borderTopRightRadius: "4px",
                        borderTopLeftRadius: "4px",
                      }}
                      src={`${getConfig().LMS_BASE_URL}${
                        data.course_image_urls?.small
                      }`}
                      alt="course"
                      width="100%"
                    />
                  )}
                </div>
                <CourseCardAbout
                  loading={loading}
                  lab={data.lab}
                  quiz={data.quiz}
                  project={data.project}
                  handlerLogin={handlerLogin}
                />
              </div>
            </div>
          )}
        </div>
        <div className="pt-5">
          {!isDesktop && (
            <div
              className="about-section section-target d-flex flex-column "
              style={{ gap: "10px" }}
            >
              <InfoAbout loadin={loading}  lab={data.lab}
                  quiz={data.quiz}
                  project={data.project} />
            </div>
          )}

          <div
            className="about-section section-target d-flex flex-column "
            style={{ gap: "10px" }}
          >
            <TargetCourse loading={loading} target={data.target} />
          </div>

          <div
            className="about-section d-flex flex-column "
            style={{ gap: "10px" }}
          >
            <CourseTree lessonTree={data.block_tree} />
          </div>

          <div
            className="about-section d-flex flex-column "
            style={{ gap: "10px" }}
          >
            <ParticipantCourse participant={data.participant} />
          </div>

          <div
            className="about-section d-flex flex-column "
            style={{ gap: "10px" }}
          >
            <InputRequired inputRequired={data.input_required} />
          </div>

          <div
            className="about-section d-flex flex-column "
            style={{ gap: "10px" }}
          >
            <StartTeacher teachers={data?.teachers} />
          </div>

          <div
            className="about-section d-flex flex-column "
            style={{ gap: "10px" }}
          >
            <ExpertTeacher teachers={data?.teachers} />
          </div>
        </div>
      </div>
     <Footer />
    </div>
  );
};

export default CourseAbout;
