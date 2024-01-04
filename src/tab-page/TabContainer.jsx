import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { OuterExamTimer } from "@edx/frontend-lib-special-exams";
import { useModel } from "../generic/model-store";
import TabPage from "./TabPage";

export default function TabContainer(props) {
  const { children, fetch, slice, tab } = props;
  const [tabStatus, setTabStatus] = useState("idle");
  const [prevTab, setPrevTab] = useState("");

  const { courseId: courseIdFromUrl } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    // The courseId from the URL is the course we WANT to load.
    dispatch(fetch(courseIdFromUrl));
  }, [courseIdFromUrl, tab]);

  // The courseId from the store is the course we HAVE loaded.  If the URL changes,
  // we don't want the application to adjust to it until it has actually loaded the new data.
  const { courseId, courseStatus } = useSelector((state) => state[slice]);

  const { toggleFeature } = useModel("courseHomeMeta", courseId);

  useEffect(() => {
    if (tab === "dates") {
      if (toggleFeature) {
        if (!toggleFeature.includes("dates")) {
          window.location.href = `/course/${courseId}/home`;
        }
      }
    }
  }, [tab, toggleFeature]);

  useEffect(() => {
    setPrevTab(tab);
    setTabStatus("idle");
  }, [tab]);

  useEffect(() => {
    if (courseStatus === "loading" && tabStatus === "idle") {
      setTabStatus("pending");
    }

    if (courseStatus === "loaded" && tabStatus === "pending") {
      setTabStatus("loaded");
    }
  }, [courseStatus, tabStatus]);

  const loadingEle = <span>Loading...</span>;

  const justNavigatedFromOtherTab = tab !== prevTab;

  let shouldShowLoading =
    courseStatus === "loading" ||
    justNavigatedFromOtherTab ||
    tabStatus === "pending";

  return (
    <TabPage
      activeTabSlug={tab}
      courseId={courseId}
      courseStatus={courseStatus}
      metadataModel={`${slice}Meta`}
      shouldShowLoading={shouldShowLoading}
    >
      {courseId && <OuterExamTimer courseId={courseId} />}

      {shouldShowLoading && loadingEle}

      {!shouldShowLoading && children}
    </TabPage>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  fetch: PropTypes.func.isRequired,
  slice: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
};
