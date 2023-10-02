import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { breakpoints, useWindowSize } from '@edx/paragon';

import { AlertList } from '../../generic/user-messages';

import Sequence from './sequence';

import { CelebrationModal, shouldCelebrateOnSectionLoad, WeeklyGoalCelebrationModal } from './celebration';
import ContentTools from './content-tools';
import CourseBreadcrumbs from './CourseBreadcrumbs';
import SidebarProvider from './sidebar/SidebarContextProvider';
import SidebarTriggers from './sidebar/SidebarTriggers';
import SectionList from '../../course-home/outline-tab/SectionList';
import { useModel } from '../../generic/model-store';
import { getSessionStorage, setSessionStorage } from '../../data/sessionStorage';

import './course.scss'

/** [MM-P2P] Experiment */
import { initCoursewareMMP2P, MMP2PBlockModal } from '../../experiments/mm-p2p';

function Course({
  courseId,
  sequenceId,
  unitId,
  nextSequenceHandler,
  previousSequenceHandler,
  unitNavigationHandler,
  windowWidth,
}) {
  const course = useModel('coursewareMeta', courseId);
  const {
    celebrations,
    isStaff,
    title
  } = useModel('courseHomeMeta', courseId);
  const sequence = useModel('sequences', sequenceId);
  const section = useModel('sections', sequence ? sequence.sectionId : null);

  const pageTitleBreadCrumbs = [
    sequence,
    section,
    course,
  ].filter(element => element != null).map(element => element.title);

  // Below the tabs, above the breadcrumbs alerts (appearing in the order listed here)
  const dispatch = useDispatch();

  const [firstSectionCelebrationOpen, setFirstSectionCelebrationOpen] = useState(false);
  // If streakLengthToCelebrate is populated, that modal takes precedence. Wait til the next load to display
  // the weekly goal celebration modal.
  const [weeklyGoalCelebrationOpen, setWeeklyGoalCelebrationOpen] = useState(
    celebrations && !celebrations.streakLengthToCelebrate && celebrations.weeklyGoal,
  );
  const shouldDisplayTriggers = windowWidth >= breakpoints.small.minWidth;
  const daysPerWeek = course?.courseGoals?.selectedGoal?.daysPerWeek;

  // Responsive breakpoints for showing the notification button/tray
  const shouldDisplayNotificationTrayOpenOnLoad = windowWidth > breakpoints.medium.minWidth;

  // Course specific notification tray open/closed persistance by browser session
  if (!getSessionStorage(`notificationTrayStatus.${courseId}`)) {
    if (shouldDisplayNotificationTrayOpenOnLoad) {
      setSessionStorage(`notificationTrayStatus.${courseId}`, 'open');
    } else {
      // responsive version displays the tray closed on initial load, set the sessionStorage to closed
      setSessionStorage(`notificationTrayStatus.${courseId}`, 'closed');
    }
  }

  /** [MM-P2P] Experiment */
  const MMP2P = initCoursewareMMP2P(courseId, sequenceId, unitId);

  useEffect(() => {
    const celebrateFirstSection = celebrations && celebrations.firstSection;
    setFirstSectionCelebrationOpen(shouldCelebrateOnSectionLoad(
      courseId,
      sequenceId,
      celebrateFirstSection,
      dispatch,
      celebrations,
    ));
  }, [sequenceId]);

  const [show , setShow] = useState(false)


  
  return (
    <SidebarProvider courseId={courseId} unitId={unitId}>
      <Helmet>
        <title>{`${pageTitleBreadCrumbs.join(' | ')} | ${getConfig().SITE_NAME}`}</title>
      </Helmet>
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
      <div id='sequence-custom' className="d-flex" >
        <div className={show? 'css-16e9fpx' : 'css-17h1ao9'}>
        <div style={{height:'100%' }}>
            <div className={show ? 'css-mtrik7' : 'css-dh1ib6'}>
                  <button className={`btn-toggle-section ${show ? "btn-hidden-section rotated" : "btn-show-section"}`}  onClick={()=>setShow(!show)}>

                    <i class="bi bi-arrow-right"></i>
                  </button>
              </div>
              <div className={show? 'css-11m367g' : 'css-1qz66c7'} style={{marginTop:'3px'}}>
                <div style={{padding:'20px 10px' , paddingRight:'50px'}}>
                    <h4>{title}</h4>
                </div>
                <SectionList
              courseId={courseId}
              relativeHeight
              useHistory
              lesson
            />
              </div>
           </div>
        </div>
        <div className={show ?  'css-jygthk' : 'css-yeymkw'}style={{width:'100%'}} >
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
      </div>
     
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
      { /** [MM-P2P] Experiment */ }
      { MMP2P.meta.modalLock && <MMP2PBlockModal options={MMP2P} /> }
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
