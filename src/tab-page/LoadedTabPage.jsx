import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { getConfig } from "@edx/frontend-platform";
import { useToggle } from "@edx/paragon";

import { CourseTabsNavigation } from "../course-tabs";
import { useModel } from "../generic/model-store";
import { AlertList } from "../generic/user-messages";
import StreakModal from "../shared/streak-celebration";
import InstructorToolbar from "../instructor-toolbar";
import useEnrollmentAlert from "../alerts/enrollment-alert";
import useLogistrationAlert from "../alerts/logistration-alert";
import { useSelector, useDispatch } from "react-redux";
import ProductTours from "../product-tours/ProductTours";
import SkeletonOutline from "./SkeletonOutline";
import SkeletonDates from "./SkeletonDates";
import SkeletonSequence from "../courseware/course/sequence/SkeletonSequence";

function LoadedTabPage({
  activeTabSlug,
  children,
  courseId,
  metadataModel,
  unitId,
  shouldShowLoading,
}) {
  const { celebrations, org, originalUserIsStaff, tabs, title, verifiedMode } =
    useModel("courseHomeMeta", courseId);

  const location = useLocation();
  const pathname = location.pathname;

  // Logistration and enrollment alerts are only really used for the outline tab, but loaded here to put them above
  // breadcrumbs when they are visible.
  const logistrationAlert = useLogistrationAlert(courseId);

  const enrollmentAlert = useEnrollmentAlert(courseId);

  const activeTab =
    tabs?.filter((tab) => tab.slug === activeTabSlug)[0] || undefined;

  const streakLengthToCelebrate =
    celebrations && celebrations.streakLengthToCelebrate;
  const streakDiscountCouponEnabled =
    celebrations && celebrations.streakDiscountEnabled && verifiedMode;
  const [isStreakCelebrationOpen, , closeStreakCelebration] = useToggle(
    streakLengthToCelebrate
  );
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [styling, setStyling] = useState("css-yeymkw");
  // const isShowChatGPT = useSelector(
  //   (state) => state.header?.isShowGlobalChatGPT
  // );

  function getTabFromPathname(pathname) {
    if (pathname.endsWith("/dates")) return "dates";
    if (pathname.endsWith("/home")) return "outline";
    return "courseware";
  }

  function getSkeleton(tab) {
    if (tab === "dates") return <SkeletonDates />;
    if (tab === "outline") return <SkeletonOutline />;
    return <SkeletonSequence withSidebar />;
  }

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

  let tabFromUrl = getTabFromPathname(location.pathname);
  let skeleton = getSkeleton(tabFromUrl);

  return (
    <>
      {!shouldShowLoading && activeTab && (
        <>
          <ProductTours
            activeTab={activeTabSlug}
            courseId={courseId}
            isStreakCelebrationOpen={isStreakCelebrationOpen}
            org={org}
          />
          <Helmet>
            <title>{`${activeTab ? `${activeTab.title} | ` : ""}${title} | ${
              getConfig().SITE_NAME
            }`}</title>
          </Helmet>
        </>
      )}

      {originalUserIsStaff && (
        <InstructorToolbar
          courseId={courseId}
          unitId={unitId}
          tab={activeTabSlug}
        />
      )}

      {!shouldShowLoading && activeTab && (
        <StreakModal
          courseId={courseId}
          metadataModel={metadataModel}
          streakLengthToCelebrate={streakLengthToCelebrate}
          isStreakCelebrationOpen={!!isStreakCelebrationOpen}
          closeStreakCelebration={closeStreakCelebration}
          streakDiscountCouponEnabled={streakDiscountCouponEnabled}
          verifiedMode={verifiedMode}
        />
      )}

      <div className={styling}>
        <main id="main-content" className="d-flex flex-column flex-grow-1">
          {!shouldShowLoading && (
            <AlertList
              topic="outline"
              className="mx-5 mt-3"
              customAlerts={{
                ...enrollmentAlert,
                ...logistrationAlert,
              }}
            />
          )}
          <CourseTabsNavigation
            tabs={tabs}
            className=""
            activeTabSlug={activeTabSlug}
          />
          <div className="container-xl position-relative">
            {shouldShowLoading ? skeleton : children}
          </div>
        </main>
      </div>
    </>
  );
}

LoadedTabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
  metadataModel: PropTypes.string,
  unitId: PropTypes.string,
};

LoadedTabPage.defaultProps = {
  children: null,
  metadataModel: "courseHomeMeta",
  unitId: null,
};

export default LoadedTabPage;
