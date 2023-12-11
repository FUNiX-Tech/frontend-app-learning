import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { getConfig } from "@edx/frontend-platform";
import { breakpoints, useWindowSize } from "@edx/paragon";
import { useLocation } from "react-router-dom";

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
  const course = useModel("coursewareMeta", courseId);
  const { celebrations, isStaff, title } = useModel("courseHomeMeta", courseId);
  const sequence = useModel("sequences", sequenceId);
  const section = useModel("sections", sequence ? sequence.sectionId : null);

  const pageTitleBreadCrumbs = [sequence, section, course]
    .filter((element) => element != null)
    .map((element) => element.title);

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

  const [show, setShow] = useState(false);
  const [showLeftbarContent, setShowLeftbarContent] = useState(false);
  const location = useLocation();
  const [styling, setStyling] = useState("css-yeymkw");
  const isShowChatGPT = useSelector((state) => state.header.isShowChatGPT);

  useEffect(() => {
    setStyling(
      show
        ? isShowChatGPT
          ? "css-14u8e49"
          : "css-jygthk"
        : isShowChatGPT
        ? "css-1mjee9h"
        : "css-yeymkw"
    );
  }, [show, isShowChatGPT]);

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
        headerHeight + courseTagsNavHeight + instructorToolbarHeight + "px";
    } else {
      fixedElement.style.paddingTop = headerHeight + courseTagsNavHeight + "px";
    }

    // Adjust position on scroll
    const handleScroll = () => {
      if (window.scrollY >= 137.5) {
        fixedElement.style.paddingTop = courseTagsNavHeight + "px";
        return;
      } else if (window.scrollY >= 50 && window.scrollY < 85.5) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            courseTagsNavHeight - window.scrollY + "px";
          return;
        }
      } else if (window.scrollY >= 122 && window.scrollY < 137.5) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            headerHeight +
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            headerHeight + courseTagsNavHeight - window.scrollY + "px";
          return;
        }
      } else if (window.scrollY >= 85.5 && window.scrollY < 122) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            courseTagsNavHeight +
            30 +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            courseTagsNavHeight + 30 - window.scrollY + "px";
          return;
        }
      } else if (window.scrollY <= 50) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            headerHeight +
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            headerHeight + courseTagsNavHeight - window.scrollY + "px";
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <SidebarProvider courseId={courseId} unitId={unitId}>
      <Helmet>
        <title>{`${pageTitleBreadCrumbs.join(" | ")} | ${
          getConfig().SITE_NAME
        }`}</title>
      </Helmet>

      <div className="unit-left-sidebar">
        {/* className={show? 'css-11m367g' : 'css-1qz66c7'} */}
        {/* <div style={{padding:'20px 10px' , paddingRight:'50px'}}>
                    <h4>{title}</h4>
                </div> */}
        <div
          className={`${
            !showLeftbarContent
              ? "show-menu-lesson right-side"
              : "show-menu-lesson left-side"
          }`}
        >
          <svg
            onClick={() => {
              setShowLeftbarContent(!showLeftbarContent);
            }}
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "1.5rem", height: "1.5rem" }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            {!showLeftbarContent && (
              <path
                d="M12.6008 11.9998L8.70078 8.0998C8.51745 7.91647 8.42578 7.68314 8.42578 7.3998C8.42578 7.11647 8.51745 6.88314 8.70078 6.6998C8.88411 6.51647 9.11745 6.4248 9.40078 6.4248C9.68411 6.4248 9.91745 6.51647 10.1008 6.6998L14.7008 11.2998C14.8008 11.3998 14.8716 11.5081 14.9133 11.6248C14.9549 11.7415 14.9758 11.8665 14.9758 11.9998C14.9758 12.1331 14.9549 12.2581 14.9133 12.3748C14.8716 12.4915 14.8008 12.5998 14.7008 12.6998L10.1008 17.2998C9.91745 17.4831 9.68411 17.5748 9.40078 17.5748C9.11745 17.5748 8.88411 17.4831 8.70078 17.2998C8.51745 17.1165 8.42578 16.8831 8.42578 16.5998C8.42578 16.3165 8.51745 16.0831 8.70078 15.8998L12.6008 11.9998Z"
                fill="#2C3744"
              />
            )}
            {showLeftbarContent && (
              <path
                d="M10.8008 11.9998L14.7008 15.8998C14.8841 16.0831 14.9758 16.3165 14.9758 16.5998C14.9758 16.8831 14.8841 17.1165 14.7008 17.2998C14.5174 17.4831 14.2841 17.5748 14.0008 17.5748C13.7174 17.5748 13.4841 17.4831 13.3008 17.2998L8.70078 12.6998C8.60078 12.5998 8.52995 12.4915 8.48828 12.3748C8.44661 12.2581 8.42578 12.1331 8.42578 11.9998C8.42578 11.8665 8.44661 11.7415 8.48828 11.6248C8.52995 11.5081 8.60078 11.3998 8.70078 11.2998L13.3008 6.6998C13.4841 6.51647 13.7174 6.4248 14.0008 6.4248C14.2841 6.4248 14.5174 6.51647 14.7008 6.6998C14.8841 6.88314 14.9758 7.11647 14.9758 7.3998C14.9758 7.68314 14.8841 7.91647 14.7008 8.0998L10.8008 11.9998Z"
                fill="#2C3744"
              />
            )}
          </svg>
        </div>

        <React.Fragment>
          <div
            className={`${
              showLeftbarContent ? "menu-lesson show-leftbar" : "menu-lesson"
            }`}
          >
            <h2 className="menu-lesson-title">Mục lục bài học</h2>
          </div>
          <SectionListUnit
            courseId={courseId}
            unitId={unitId}
            relativeHeight
            useHistory
            lesson
            showLeftbarContent={showLeftbarContent}
          />
        </React.Fragment>
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
      <div id="sequence-custom" className="d-flex">
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
