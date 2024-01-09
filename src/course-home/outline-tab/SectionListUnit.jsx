/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// import {
//   injectIntl,
//   intlShape,
// } from '@edx/frontend-platform/i18n';

import SectionUnit from "./SectionUnit";
import { useModel } from "../../generic/model-store";
import { getOutlineTabData } from "../data/api";

const MAX_HEIGHT_PERCENT = 80;

function SectionListUnit({
  courseId,
  expandAll,
  relativeHeight,
  useHistory,
  lesson,
  unitId,
  showLeftbarContent,
  sequenceIds,
  sequenceId,
}) {
  const isMounted = useRef(true);
  const [height, setHeight] = useState(window.height);
  const resizeObserver = new ResizeObserver(() => {
    // Get height of #section-list-container
    const sectionListContainer = document.getElementById(
      "section-list-container"
    );

    if (relativeHeight && sectionListContainer) {
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );

      const vhHeight = Math.round((vh / 100) * MAX_HEIGHT_PERCENT);
      const sectionListContainerHeight = sectionListContainer.offsetHeight;

      const finalHeight = Math.min(
        vhHeight,
        Math.round((sectionListContainerHeight / 100) * MAX_HEIGHT_PERCENT)
      );
      setHeight(finalHeight);
    }
  });

  resizeObserver.observe(document.body);

  const {
    courseBlocks: { courses, sections },
  } = useModel("outline", courseId);

  // const style = {
  //     maxHeight: `${height}px`,
  //     overflow : 'auto',
  //   };
  //newSequences
  const [newSequences, setNewSequences] = useState([]);

  const rootCourseId = courses && Object.keys(courses)[0];
  useEffect(() => {
    const fetchNewSequence = async (courseId) => {
      if (courseId) {
        const data = await getOutlineTabData(courseId);
        if (data && isMounted.current) {
          setNewSequences(data.courseBlocks.sequences);
        }
      }
    };
    fetchNewSequence(courseId);
    return () => {
      isMounted.current = false;
    };
  }, [unitId, sequenceId, courseId]);

  return (
    <ol
      id="courseHome-utline"
      className={`${
        showLeftbarContent ? "list-unstyled show-leftbar" : " list-unstyled"
      }`} /* style={style} */
    >
      {courses[rootCourseId].sectionIds.map((sectionId, index) => {
        if (index >= 1) {
          return;
        }
        return (
          <SectionUnit
            key={sectionId}
            courseId={courseId}
            defaultOpen={false}
            expand={expandAll}
            section={sections[sectionId]}
            useHistory={useHistory}
            lesson={lesson}
            unitId={unitId}
            allSequenceIds={sequenceIds}
            newSequences={newSequences}
          />
        );
      })}
    </ol>
  );
}

SectionListUnit.propTypes = {
  courseId: PropTypes.string,
  expandAll: PropTypes.bool,
  relativeHeight: PropTypes.bool,
  useHistory: PropTypes.bool,
  lesson: PropTypes.bool,
};

SectionListUnit.defaultProps = {
  courseId: "",
  expandAll: false,
  relativeHeight: false,
  useHistory: false,
  lesson: false,
};

export default SectionListUnit;
