import React, { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { getConfig } from "@edx/frontend-platform";
import { breakpoints, useWindowSize } from "@edx/paragon";
import { useLocation } from "react-router-dom";
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";

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

import group from "./assets/group.svg";
import group_active from "./assets/group_active.svg";
import group_hover from "./assets/group_hover.svg";
import { toggleShowLeftbar, setOffMenuState } from "../../header/data/slice";
import AIChatbot from "./AIChatbot/AIChatbot";

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

  //passed  project state
  const [isPassedProject, setIsPassedProject] = useState(false);
  //get user
  const authenticatedUser = getAuthenticatedUser();
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [styling, setStyling] = useState("css-yeymkw");
  const isShowLeftbar = useSelector((state) => state.header.isShowLeftbar);

  const [groupSrc, setGroupSrc] = useState(group);

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
      const data = await fetch(url.href);
      const response = await data.json();
      if (response) {
        return response;
      }
    } catch (error) {}
  }, []);

  //Get Assignment Passed
  const getAssignmentPassed = useCallback(async (url) => {
    try {
      const lesson_url = window.location.href;
      const regex = /course-v1:([^/]+)/;
      const course_id = lesson_url.match(regex)[0];
      const dataSend = {
        email: authenticatedUser.email,
        project_name: projectName,
        course_code: course_id,
      };
      const data = await fetch(`${url}/api/v1/project/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSend),
      });
      const response = await data.json();
      if (response) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  //call func get passed state of project
  useEffect(async () => {
    const url = await getPortalUrl();
    const data = await getAssignmentPassed(url.HOST);
    if (data && data?.status === "passed") {
      setIsPassedProject(true);
    } else {
      setIsPassedProject(false);
    }
  }, [location.pathname]);

  // Below the tabs, above the breadcrumbs alerts (appearing in the order listed here)
  const dispatch = useDispatch();

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
      setGroupSrc(group_active);
    } else {
      setGroupSrc(group);
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
          !isShowLeftbar ? "unit-left-sidebar" : "unit-left-sidebar right-side"
        }`}
      >
        <div class="content">
          <div
            onMouseOver={() => {
              setGroupSrc(group_hover);
            }}
            onMouseOut={() => {
              if (isShowLeftbar) {
                setGroupSrc(group_active);
              } else {
                setGroupSrc(group);
              }
            }}
            onClick={() => {
              dispatch(toggleShowLeftbar());
              if (!isShowLeftbar) {
                setGroupSrc(group_active);
              }
            }}
            className={`${
              !isShowLeftbar
                ? `show-menu-lesson right-side ${
                    groupSrc === group_hover && "hover"
                  }`
                : `show-menu-lesson left-side ${
                    groupSrc === group_hover && "hover"
                  }`
            }`}
          >
            <img src={groupSrc} alt={group} />
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
