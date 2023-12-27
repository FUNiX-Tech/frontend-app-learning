/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
// import {
//   injectIntl,
//   intlShape,
// } from '@edx/frontend-platform/i18n';

import Section from "./Section";
import { useModel } from "../../generic/model-store";

const MAX_HEIGHT_PERCENT = 80;

function SectionList({
  courseId,
  expandAll,
  relativeHeight,
  useHistory,
  lesson,
}) {
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
    courseBlocks: { courses, sections, sequences },
  } = useModel("outline", courseId);

  const style = {
    maxHeight: `${height}px`,
    overflow: "auto",
  };

  const rootCourseId = courses && Object.keys(courses)[0];

  // let hasCompletedUnit = Object.keys(sequences).some(
  //   (key) => sequences[key].complete
  // );

  return (
    <ol id="courseHome-utline" className="list-unstyled" style={style}>
      {courses[rootCourseId].sectionIds.map((sectionId) => {
        return (
          <Section
            key={sectionId}
            courseId={courseId}
            defaultOpen={true}
            expand={expandAll}
            section={sections[sectionId]}
            useHistory={useHistory}
            lesson={lesson}
          />
        );
      })}
    </ol>
  );
}

SectionList.propTypes = {
  courseId: PropTypes.string,
  expandAll: PropTypes.bool,
  relativeHeight: PropTypes.bool,
  useHistory: PropTypes.bool,
  lesson: PropTypes.bool,
};

SectionList.defaultProps = {
  courseId: "",
  expandAll: false,
  relativeHeight: false,
  useHistory: false,
  lesson: false,
};

export default SectionList;
