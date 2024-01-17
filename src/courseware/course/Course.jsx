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

import left_on from "./assets/left_on.svg";
import left_off from "./assets/left_off.svg";
import left_on_hover from "./assets/left_on_hover.svg";
import left_off_hover from "./assets/left_off_hover.svg";
import { toggleShowLeftbar, setOffMenuState } from "../../header/data/slice";
import AIChatbot from "./AIChatbot/AIChatbot";
import { getSequenceMetadata } from "../data/api";

/** [MM-P2P] Experiment */
import { initCoursewareMMP2P, MMP2PBlockModal } from "../../experiments/mm-p2p";

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
  ///////////////////// chatbot end /////////////////////
  const dispatch = useDispatch();

  //passed  project state
  const [isPassedProject, setIsPassedProject] = useState(false);
  //get user
  const authenticatedUser = getAuthenticatedUser();
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [styling, setStyling] = useState("css-yeymkw");
  const isShowLeftbar = useSelector((state) => state.header.isShowLeftbar);

  const [groupSrc, setGroupSrc] = useState(left_off);

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

  // useEffect(() => {
  //   setStyling(
  //     show
  //       ? isShowChatGPT
  //         ? "css-14u8e49"
  //         : "css-jygthk"
  //       : isShowChatGPT
  //       ? "css-1mjee9h"
  //       : "css-yeymkw"
  //   );
  // }, [show, isShowChatGPT]);

  //Left side bar scrolling hander
  useEffect(() => {
    // Get the fixed element
    const fixedElement = document.querySelector(".unit-left-sidebar");
    const instructorToolbar = document.querySelector("#instructor-toolbar");
    const header = document.querySelector(".learning-header");
    const headerHeight = header.offsetHeight;
    const courseTagsNav = document.querySelector("#courseTabsNavigation");
    const courseTagsNavHeight = courseTagsNav.offsetHeight;

    let instructorToolbarHeight = 0;
    if (instructorToolbar) {
      instructorToolbarHeight = instructorToolbar.offsetHeight;
      fixedElement.style.paddingTop =
        (headerHeight + courseTagsNavHeight + instructorToolbarHeight) / 16 +
        "rem";
    } else {
      fixedElement.style.paddingTop =
        (headerHeight + courseTagsNavHeight) / 16 + "rem";
    }

    // Adjust position on scroll
    const handleScroll = () => {
      if (window.scrollY >= 137.5) {
        fixedElement.style.paddingTop = courseTagsNavHeight / 16 + "rem";
        return;
      } else if (
        window.scrollY > courseTagsNavHeight &&
        window.scrollY < 137.5
      ) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            (headerHeight +
              courseTagsNavHeight +
              instructorToolbarHeight -
              window.scrollY) /
              16 +
            "rem";
          return;
        } else {
          fixedElement.style.paddingTop = courseTagsNavHeight / 16;
          return;
        }
      } else if (window.scrollY <= courseTagsNavHeight) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            (headerHeight +
              courseTagsNavHeight +
              instructorToolbarHeight -
              window.scrollY) /
              16 +
            "rem";
          return;
        } else {
          fixedElement.style.paddingTop =
            (headerHeight + courseTagsNavHeight - window.scrollY) / 16 + "rem";
          return;
        }
      }
    };

    function resizeRightbar() {
      const bottomHeader = document.querySelector("#courseTabsNavigation");
      document.querySelector(".rightbar").style.top = `${
        bottomHeader.getBoundingClientRect().bottom
      }px`;
    }

    resizeRightbar();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", resizeRightbar);
    window.addEventListener("resize", resizeRightbar);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", resizeRightbar);
      window.removeEventListener("resize", resizeRightbar);
    };
  }, [location.pathname]);

  //set show leftbar icon
  useEffect(() => {
    if (isShowLeftbar) {
      setGroupSrc(left_on);
    } else {
      setGroupSrc(left_off);
    }
  }, [location.pathname, isShowLeftbar]);

  useEffect(() => {
    if (window.innerWidth < 992) {
      dispatch(setOffMenuState());
    }
  }, []);

  return (
    <SidebarProvider courseId={courseId} unitId={unitId}>
      <Helmet>
        <title>{`${pageTitleBreadCrumbs.join(" | ")} | ${
          getConfig().SITE_NAME
        }`}</title>
      </Helmet>

      <div
        className={`${
          !isShowLeftbar ? "unit-left-sidebar" : "unit-left-sidebar left-side"
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Icon/Left">
            <path
              id="Vector"
              d="M10.8008 12.0008L14.7008 15.9008C14.8841 16.0841 14.9758 16.3174 14.9758 16.6008C14.9758 16.8841 14.8841 17.1174 14.7008 17.3008C14.5174 17.4841 14.2841 17.5758 14.0008 17.5758C13.7174 17.5758 13.4841 17.4841 13.3008 17.3008L8.70078 12.7008C8.60078 12.6008 8.52995 12.4924 8.48828 12.3758C8.44661 12.2591 8.42578 12.1341 8.42578 12.0008C8.42578 11.8674 8.44661 11.7424 8.48828 11.6258C8.52995 11.5091 8.60078 11.4008 8.70078 11.3008L13.3008 6.70078C13.4841 6.51745 13.7174 6.42578 14.0008 6.42578C14.2841 6.42578 14.5174 6.51745 14.7008 6.70078C14.8841 6.88411 14.9758 7.11745 14.9758 7.40078C14.9758 7.68411 14.8841 7.91745 14.7008 8.10078L10.8008 12.0008Z"
              fill="white"
            />
          </g>
        </svg>

        <div class="content">
          <div className="left-icon-container">
            <div
              onMouseOver={() => {
                if (isShowLeftbar) {
                  setGroupSrc(left_on_hover);
                } else {
                  setGroupSrc(left_off_hover);
                }
              }}
              onMouseOut={() => {
                if (isShowLeftbar) {
                  setGroupSrc(left_on);
                } else {
                  setGroupSrc(left_off);
                }
              }}
              onClick={() => {
                dispatch(toggleShowLeftbar());
                if (!isShowLeftbar) {
                  setGroupSrc(left_off);
                } else {
                  setGroupSrc(left_on);
                }
              }}
              className={`${
                !isShowLeftbar
                  ? `show-menu-lesson left-side ${
                      groupSrc === left_on_hover && "hover"
                    }`
                  : `show-menu-lesson right-side ${
                      groupSrc === left_off_hover && "hover"
                    }`
              }`}
            >
              <img src={groupSrc} alt="Expand Lesson" />
            </div>
          </div>

          <React.Fragment>
            <div
              className={`${
                isShowLeftbar ? "menu-lesson show-leftbar" : "menu-lesson"
              }`}
            >
              <h2 className="menu-lesson-title">Mục lục bài học</h2>
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

      <div className={isShowChatbot ? "rightbar is-show" : "rightbar"}>
        <AIChatbot isShowChatbot={isShowChatbot} />
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
          chatbot={<AIChatbot isShowChatbot={true} />}
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
