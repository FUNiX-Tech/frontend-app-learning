import React, { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { getConfig } from "@edx/frontend-platform";
import { breakpoints, useWindowSize } from "@edx/paragon";
import { useLocation } from "react-router-dom";
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { updateModel, updateModels } from "../../generic/model-store";

import { AlertList } from "../../generic/user-messages";

import Sequence from "./sequence";

import {
  CelebrationModal,
  shouldCelebrateOnSectionLoad,
  WeeklyGoalCelebrationModal,
} from "./celebration";
import ContentTools from "./content-tools";
import CourseBreadcrumbs from "./CourseBreadcrumbs";
import SidebarProvider from "./sidebar/SidebarContextProvider";
import SidebarTriggers from "./sidebar/SidebarTriggers";
import SectionListUnit from "../../course-home/outline-tab/SectionListUnit";
import { useModel } from "../../generic/model-store";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../data/sessionStorage";
import { useSelector } from "react-redux";
import "./course.scss";
import "./CourseResponsive.scss";

import {
  toggleShowLeftbar,
  setOffMenuState,
  toggleShowFeedback,
  toggleShowChatbot,
  setOffLeft,
  setOffRight,
} from "../../header/data/slice";
import AIChatbot from "./AIChatbot/AIChatbot";
import { getSequenceMetadata } from "../data/api";

/** [MM-P2P] Experiment */
import { initCoursewareMMP2P, MMP2PBlockModal } from "../../experiments/mm-p2p";
import ChatbotFeedbackModal from "./AIChatbot/ChatbotFeedbackModal";

function Course({
  courseId,
  sequenceId,
  unitId,
  nextSequenceHandler,
  previousSequenceHandler,
  unitNavigationHandler,
  windowWidth,
}) {
  ///////////////////// chatbot /////////////////////////
  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);
  const isShowFeedback = useSelector((state) => state.header.isShowFeedback);
  const { feedback } = useSelector((state) => state.chatbot);
  ///////////////////// chatbot end /////////////////////
  const dispatch = useDispatch();

  //passed  project state
  const [isPassedProject, setIsPassedProject] = useState(false);
  //get user
  const authenticatedUser = getAuthenticatedUser();
  const location = useLocation();
  const [styling, setStyling] = useState("css-yeymkw");
  const isShowLeftbar = useSelector((state) => state.header.isShowLeftbar);

  const course = useModel("coursewareMeta", courseId);
  const {
    courseBlocks: { sequences, courses, sections },
  } = useModel("outline", courseId);

  const { celebrations, isStaff, title } = useModel("courseHomeMeta", courseId);
  const sequence = useModel("sequences", sequenceId);
  const section = useModel("sections", sequence ? sequence.sectionId : null);

  //Logic get all sequenceIds in section via sectionIds
  const rootCourseId = courses && Object.keys(courses)[0];
  const allSequenceIds = useMemo(() => {
    const output = [];
    for (let value of courses[rootCourseId].sectionIds) {
      output.push(...sections[value].sequenceIds);
    }
    return output;
  }, [rootCourseId, courses]);

  //Complete All Sections Course
  const isCompleteCourse = useMemo(() => {
    const outputArr = [];
    for (let value of courses[rootCourseId].sectionIds) {
      outputArr.push(sections[value]);
    }
    return outputArr.every((section) => section.complete);
  }, [rootCourseId, courses]);

  const pageTitleBreadCrumbs = [sequence, section, course]
    .filter((element) => element != null)
    .map((element) => element.title);

  //Get project name
  const projectName = useMemo(() => {
    const outputArr = [];
    for (let value of courses[rootCourseId].sectionIds) {
      outputArr.push(sections[value]);
    }
    return outputArr[outputArr.length - 1].title;
  }, [rootCourseId, courses]);

  const getPortalUrl = useCallback(async () => {
    try {
      const url = new URL(
        `${getConfig().LMS_BASE_URL}/api/funix_portal/portal_host`
      );
      const response = await getAuthenticatedHttpClient().get(url.href);
      // const response = await data.json();
      if (response) {
        return response.data;
      }
    } catch (error) {}
  }, []);

  function showChatbot() {
    dispatch(toggleShowChatbot());
  }

  function showFeedback() {
    dispatch(toggleShowFeedback());
  }

  //call func get passed state of project
  useEffect(async () => {
    //Get Assignment Passed
    const getAssignmentPassed = async () => {
      try {
        const url = await getPortalUrl();

        const lesson_url = window.location.href;
        const regex = /course-v1:([^/]+)/;
        const course_id = lesson_url.match(regex)[0];
        const dataSend = {
          email: authenticatedUser.email,
          project_name: projectName,
          course_code: course_id,
        };

        const data = await fetch(`${url.HOST}/api/v1/project/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataSend),
        });
        const response = await data.json();
        return response.data.status;
      } catch (error) {
        console.log(error);
      }
    };

    const data = await getAssignmentPassed();
    if (data && data === "passed") {
      setIsPassedProject(true);
    } else {
      setIsPassedProject(false);
    }
  }, [unitId, sequenceId, courseId, location.pathname]);
  // Below the tabs, above the breadcrumbs alerts (appearing in the order listed here)
  const [firstSectionCelebrationOpen, setFirstSectionCelebrationOpen] =
    useState(false);
  // If streakLengthToCelebrate is populated, that modal takes precedence. Wait til the next load to display
  // the weekly goal celebration modal.
  const [weeklyGoalCelebrationOpen, setWeeklyGoalCelebrationOpen] = useState(
    celebrations &&
      !celebrations.streakLengthToCelebrate &&
      celebrations.weeklyGoal
  );
  const shouldDisplayTriggers = windowWidth >= breakpoints.small.minWidth;
  const daysPerWeek = course?.courseGoals?.selectedGoal?.daysPerWeek;

  // Responsive breakpoints for showing the notification button/tray
  const shouldDisplayNotificationTrayOpenOnLoad =
    windowWidth > breakpoints.medium.minWidth;

  // Course specific notification tray open/closed persistance by browser session
  if (!getSessionStorage(`notificationTrayStatus.${courseId}`)) {
    if (shouldDisplayNotificationTrayOpenOnLoad) {
      setSessionStorage(`notificationTrayStatus.${courseId}`, "open");
    } else {
      // responsive version displays the tray closed on initial load, set the sessionStorage to closed
      setSessionStorage(`notificationTrayStatus.${courseId}`, "closed");
    }
  }

  /** [MM-P2P] Experiment */
  const MMP2P = initCoursewareMMP2P(courseId, sequenceId, unitId);

  useEffect(() => {
    const celebrateFirstSection = celebrations && celebrations.firstSection;
    setFirstSectionCelebrationOpen(
      shouldCelebrateOnSectionLoad(
        courseId,
        sequenceId,
        celebrateFirstSection,
        dispatch,
        celebrations
      )
    );
  }, [sequenceId]);

  //Left side bar scrolling hander
  useEffect(() => {
    // Get the fixed element
    const fixedElement = document.querySelector(".unit-left-sidebar");
    const instructorToolbar = document.querySelector("#instructor-toolbar");
    const header = document.querySelector(".learning-header");
    const headerHeight = header?.offsetHeight;
    const courseTagsNav = document.querySelector("#courseTabsNavigation");
    const courseTagsNavHeight = courseTagsNav?.offsetHeight;

    let instructorToolbarHeight = 0;
    if (instructorToolbar) {
      instructorToolbarHeight = instructorToolbar.offsetHeight;
      console.log(instructorToolbarHeight);
      fixedElement.style.paddingTop =
        headerHeight + courseTagsNavHeight + instructorToolbarHeight + "px";
    } else {
      fixedElement.style.paddingTop = headerHeight + courseTagsNavHeight + "px";
    }

    // Adjust position on scroll
    const handleScroll = () => {
      if (instructorToolbar) {
        if (
          window.scrollY <
          headerHeight + courseTagsNavHeight + instructorToolbarHeight
        ) {
          fixedElement.style.paddingTop =
            headerHeight +
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY +
            "px";
        }
        if (window.scrollY > headerHeight + instructorToolbarHeight) {
          fixedElement.style.paddingTop = courseTagsNavHeight + "px";
        }
      } else {
        if (window.scrollY < headerHeight + courseTagsNavHeight) {
          fixedElement.style.paddingTop =
            headerHeight + courseTagsNavHeight + window.scrollY + "px";
        }
        if (window.scrollY > headerHeight) {
          fixedElement.style.paddingTop = courseTagsNavHeight + "px";
        }
      }
    };

    function resizeRightbar() {
      const bottomHeader = document.querySelector("#courseTabsNavigation");
      document.querySelector(".rightbar").style.top = `${
        bottomHeader?.getBoundingClientRect().bottom
      }px`;
      if (window.innerWidth <= 992) {
        if (instructorToolbar) {
          document.querySelector(".rightbar").style.top = `${
            instructorToolbar?.getBoundingClientRect().bottom
          }px`;
        } else {
          document.querySelector(".rightbar").style.top = `${
            headerHeight?.getBoundingClientRect().bottom
          }px`;
        }
      }
    }
    handleScroll();
    resizeRightbar();
    window.addEventListener("scroll", handleScroll);

    window.addEventListener("scroll", resizeRightbar);
    window.addEventListener("resize", resizeRightbar);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);

      window.removeEventListener("scroll", resizeRightbar);
      window.removeEventListener("resize", resizeRightbar);
    };
  }, [location.pathname, window.innerWidth]);

  useEffect(() => {
    if (window.innerWidth <= 1300) {
      dispatch(setOffMenuState());
    }
  }, []);

  let rightBarClasses = "rightbar";

  if (isShowLeftbar) {
    rightBarClasses = "rightbar hide";
  }

  if (isShowChatbot) {
    rightBarClasses += " is-show-chatbot is-show";
  }

  if (isShowFeedback) {
    rightBarClasses += " is-show-feedback";
  }

  return (
    <SidebarProvider courseId={courseId} unitId={unitId}>
      <Helmet>
        <title>{`${pageTitleBreadCrumbs.join(" | ")} | ${
          getConfig().SITE_NAME
        }`}</title>
      </Helmet>
      {feedback.isShowModal && <ChatbotFeedbackModal />}

      <div
        className={`${
          isShowLeftbar
            ? isShowChatbot || isShowFeedback
              ? "unit-left-sidebar left-side hide"
              : "unit-left-sidebar left-side"
            : isShowChatbot || isShowFeedback
            ? "unit-left-sidebar hide"
            : "unit-left-sidebar"
        }`}
      >
        <div class="content">
          <React.Fragment>
            <div
              className={`${
                isShowLeftbar ? "menu-lesson show-leftbar" : "menu-lesson"
              }`}
            >
              <h2 className="menu-lesson-title">Mục lục bài học</h2>
              <div
                className="icon-left-menu-wrapper"
                onClick={() => {
                  if (window.innerWidth <= 1300) {
                    dispatch(setOffRight());
                    dispatch(toggleShowLeftbar());
                  } else {
                    dispatch(toggleShowLeftbar());
                  }
                }}
              >
                {!isShowLeftbar && (
                  <svg
                    className="show-menu-lesson left-side"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12.6008 12.0008L8.70078 8.10078C8.51745 7.91745 8.42578 7.68411 8.42578 7.40078C8.42578 7.11745 8.51745 6.88411 8.70078 6.70078C8.88411 6.51745 9.11745 6.42578 9.40078 6.42578C9.68411 6.42578 9.91745 6.51745 10.1008 6.70078L14.7008 11.3008C14.8008 11.4008 14.8716 11.5091 14.9133 11.6258C14.9549 11.7424 14.9758 11.8674 14.9758 12.0008C14.9758 12.1341 14.9549 12.2591 14.9133 12.3758C14.8716 12.4924 14.8008 12.6008 14.7008 12.7008L10.1008 17.3008C9.91745 17.4841 9.68411 17.5758 9.40078 17.5758C9.11745 17.5758 8.88411 17.4841 8.70078 17.3008C8.51745 17.1174 8.42578 16.8841 8.42578 16.6008C8.42578 16.3174 8.51745 16.0841 8.70078 15.9008L12.6008 12.0008Z"
                      fill="#576F8A"
                    />
                  </svg>
                )}
                {isShowLeftbar && (
                  <svg
                    className="show-menu-lesson right-side"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12.0008 13.4008L7.10078 18.3008C6.91745 18.4841 6.68411 18.5758 6.40078 18.5758C6.11745 18.5758 5.88411 18.4841 5.70078 18.3008C5.51745 18.1174 5.42578 17.8841 5.42578 17.6008C5.42578 17.3174 5.51745 17.0841 5.70078 16.9008L10.6008 12.0008L5.70078 7.10078C5.51745 6.91745 5.42578 6.68411 5.42578 6.40078C5.42578 6.11745 5.51745 5.88411 5.70078 5.70078C5.88411 5.51745 6.11745 5.42578 6.40078 5.42578C6.68411 5.42578 6.91745 5.51745 7.10078 5.70078L12.0008 10.6008L16.9008 5.70078C17.0841 5.51745 17.3174 5.42578 17.6008 5.42578C17.8841 5.42578 18.1174 5.51745 18.3008 5.70078C18.4841 5.88411 18.5758 6.11745 18.5758 6.40078C18.5758 6.68411 18.4841 6.91745 18.3008 7.10078L13.4008 12.0008L18.3008 16.9008C18.4841 17.0841 18.5758 17.3174 18.5758 17.6008C18.5758 17.8841 18.4841 18.1174 18.3008 18.3008C18.1174 18.4841 17.8841 18.5758 17.6008 18.5758C17.3174 18.5758 17.0841 18.4841 16.9008 18.3008L12.0008 13.4008Z"
                      fill="#576F8A"
                    />
                  </svg>
                )}
              </div>
            </div>

            <SectionListUnit
              sequenceIds={allSequenceIds}
              courseId={courseId}
              unitId={unitId}
              relativeHeight
              useHistory
              lesson
              showLeftbarContent={isShowLeftbar}
              sequenceId={sequenceId}
            />
          </React.Fragment>
        </div>
        {/* className={show? 'css-11m367g' : 'css-1qz66c7'} */}
        {/* <div style={{padding:'20px 10px' , paddingRight:'50px'}}>
                    <h4>{title}</h4>
                </div> */}
      </div>
      {/*<div className="position-relative d-flex align-items-start">
        <CourseBreadcrumbs
          courseId={courseId}
          sectionId={section ? section.id : null}
          sequenceId={sequenceId}
          isStaff={isStaff}
          unitId={unitId}
      
          mmp2p={MMP2P}
        /> 
        {shouldDisplayTriggers && (
          <SidebarTriggers />
        )}
      </div>*/}
      <AlertList topic="sequence" />

      <div className={rightBarClasses}>
        <div
          id="chatbot-feedback-btns"
          // className={!isShowChatbot && !isShowFeedback ? "is-show" : ""}
        >
          <button
            onClick={() => {
              if (window.innerWidth <= 1300) {
                showChatbot();
                dispatch(setOffLeft());
              } else {
                showChatbot();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M19.813 10.367a4.431 4.431 0 0 0-.39-3.683c-.996-1.71-2.997-2.59-4.95-2.176A4.574 4.574 0 0 0 11.043 3c-1.997-.004-3.77 1.265-4.384 3.14a4.543 4.543 0 0 0-3.04 2.175 4.49 4.49 0 0 0 .566 5.318 4.432 4.432 0 0 0 .39 3.684c.996 1.71 2.997 2.59 4.951 2.175A4.57 4.57 0 0 0 12.955 21c1.999.005 3.772-1.265 4.386-3.142a4.543 4.543 0 0 0 3.04-2.176 4.49 4.49 0 0 0-.567-5.316l-.001.001zm-6.857 9.457a3.435 3.435 0 0 1-2.188-.781c.028-.015.076-.041.107-.06l3.633-2.07c.186-.104.3-.3.299-.51v-5.054l1.535.875a.053.053 0 0 1 .03.042v4.184c-.003 1.861-1.53 3.37-3.416 3.374zm-7.345-3.096a3.321 3.321 0 0 1-.407-2.26l.108.064 3.632 2.07a.598.598 0 0 0 .597 0l4.434-2.527v1.75a.056.056 0 0 1-.021.046l-3.672 2.092c-1.635.93-3.724.377-4.67-1.235zm-.956-7.824a3.396 3.396 0 0 1 1.78-1.479l-.002.124v4.14a.582.582 0 0 0 .298.51l4.435 2.527-1.536.874a.055.055 0 0 1-.051.005L5.906 13.51a3.353 3.353 0 0 1-1.251-4.606zm12.614 2.897-4.435-2.527L14.37 8.4a.055.055 0 0 1 .052-.005l3.673 2.092a3.35 3.35 0 0 1 1.25 4.61 3.406 3.406 0 0 1-1.778 1.478V12.31a.58.58 0 0 0-.297-.51zm1.528-2.27a4.805 4.805 0 0 0-.108-.063l-3.633-2.07a.598.598 0 0 0-.596 0l-4.435 2.527v-1.75a.056.056 0 0 1 .022-.047l3.671-2.09c1.636-.93 3.727-.377 4.67 1.238.398.682.542 1.48.407 2.255h.002zM9.19 12.65l-1.535-.874a.053.053 0 0 1-.03-.042V7.55c.001-1.864 1.533-3.373 3.421-3.372.799 0 1.572.277 2.186.78a2.564 2.564 0 0 0-.108.06L9.49 7.088a.58.58 0 0 0-.298.51l-.003 5.051v.001zm.834-1.774L12 9.75l1.975 1.125v2.25L12 14.25l-1.976-1.125v-2.25z" />
            </svg>
          </button>

          <button
            onClick={() => {
              if (window.innerWidth <= 1300) {
                showFeedback();
                dispatch(setOffLeft());
              } else {
                showFeedback();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path d="M7 9.1C7.19833 9.1 7.3647 9.0328 7.4991 8.8984C7.6335 8.764 7.70047 8.59787 7.7 8.4C7.7 8.20167 7.6328 8.0353 7.4984 7.9009C7.364 7.7665 7.19787 7.69953 7 7.7C6.80167 7.7 6.6353 7.7672 6.5009 7.9016C6.3665 8.036 6.29953 8.20213 6.3 8.4C6.3 8.59833 6.3672 8.7647 6.5016 8.8991C6.636 9.0335 6.80213 9.10047 7 9.1ZM6.3 6.3H7.7V2.1H6.3V6.3ZM0 14V1.4C0 1.015 0.1372 0.685301 0.4116 0.410901C0.686 0.136501 1.01547 -0.000465478 1.4 1.18846e-06H12.6C12.985 1.18846e-06 13.3147 0.137201 13.5891 0.411601C13.8635 0.686001 14.0005 1.01547 14 1.4V9.8C14 10.185 13.8628 10.5147 13.5884 10.7891C13.314 11.0635 12.9845 11.2005 12.6 11.2H2.8L0 14ZM2.205 9.8H12.6V1.4H1.4V10.5875L2.205 9.8Z" />
            </svg>
          </button>
        </div>
        <AIChatbot />
      </div>
      <div
        id="sequence-custom"
        className={`${isShowLeftbar ? "d-flex show-leftbar" : "d-flex"}`}
      >
        {/* <div className={show? 'css-16e9fpx' : 'css-17h1ao9'}> */}
        <div style={{ height: "100%" }}>
          {/* <div className={show ? 'css-mtrik7' : 'css-dh1ib6'}>
                  <button className={`btn-toggle-section ${show ? "btn-hidden-section rotated" : "btn-show-section"}`}  onClick={()=>setShow(!show)}>

                    <i class="bi bi-arrow-right"></i>
                  </button>
              </div> */}
          {/* <div className={show? 'css-11m367g' : 'css-1qz66c7'} style={{marginTop:'3px'}}>
                <div style={{padding:'20px 10px' , paddingRight:'50px'}}>
                    <h4>{title}</h4>
                </div>
                <SectionListUnit
              courseId={courseId}
              relativeHeight
              useHistory
              lesson
            />
              </div> */}
        </div>
      </div>
      <div className={styling} style={{ width: "100%" }}>
        <CourseBreadcrumbs
          courseId={courseId}
          sectionId={section ? section.id : null}
          sequenceId={sequenceId}
          isStaff={isStaff}
          unitId={unitId}
          //* * [MM-P2P] Experiment */
          mmp2p={MMP2P}
        />
        <Sequence
          isPassedProject={isPassedProject}
          isCompleteCourse={isCompleteCourse}
          sequenceIds={allSequenceIds}
          sequences={sequences}
          unitId={unitId}
          sequenceId={sequenceId}
          courseId={courseId}
          unitNavigationHandler={unitNavigationHandler}
          nextSequenceHandler={nextSequenceHandler}
          previousSequenceHandler={previousSequenceHandler}
          //* * [MM-P2P] Experiment */
          mmp2p={MMP2P}
        />
        {/* </div> */}

        {/* <div className="col-12 col-md-3" id="section-list-container">
          <SectionList
            courseId={courseId}
            relativeHeight
            useHistory
          />
        </div> */}
      </div>
      <CelebrationModal
        courseId={courseId}
        isOpen={firstSectionCelebrationOpen}
        onClose={() => setFirstSectionCelebrationOpen(false)}
      />
      <WeeklyGoalCelebrationModal
        courseId={courseId}
        daysPerWeek={daysPerWeek}
        isOpen={weeklyGoalCelebrationOpen}
        onClose={() => setWeeklyGoalCelebrationOpen(false)}
      />
      <ContentTools course={course} />
      {/** [MM-P2P] Experiment */}
      {MMP2P.meta.modalLock && <MMP2PBlockModal options={MMP2P} />}
    </SidebarProvider>
  );
}

Course.propTypes = {
  courseId: PropTypes.string,
  sequenceId: PropTypes.string,
  unitId: PropTypes.string,
  nextSequenceHandler: PropTypes.func.isRequired,
  previousSequenceHandler: PropTypes.func.isRequired,
  unitNavigationHandler: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

Course.defaultProps = {
  courseId: null,
  sequenceId: null,
  unitId: null,
};

function CourseWrapper(props) {
  // useWindowSize initially returns an undefined width intentionally at first.
  // See https://www.joshwcomeau.com/react/the-perils-of-rehydration/ for why.
  // But <Course> has some tricky window-size-dependent, session-storage-setting logic and React would yell at us if
  // we exited that component early, before hitting all the useState() calls.
  // So just skip all that until we have a window size available.
  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    return null;
  }

  return <Course {...props} windowWidth={windowWidth} />;
}

export default CourseWrapper;
