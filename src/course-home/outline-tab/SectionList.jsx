/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import {
//   injectIntl,
//   intlShape,
// } from '@edx/frontend-platform/i18n';

import { useModel } from '../../generic/model-store';
import Section from './Section';

function SectionList({
  courseId,
  expandAll,
  relativeHeight,
}) {
  // console.log(courseId);
  // const [height, setHeight] = useState(window.height);
  // const resizeObserver = new ResizeObserver(() => {
  //   // Get height of #section-list-container
  //   const sectionListContainer = document.getElementById('section-list-container');

  //   if (relativeHeight && sectionListContainer) {
  //     const sectionListContainerHeight = sectionListContainer.offsetHeight;
  //     setHeight(Math.round((sectionListContainerHeight / 100) * 60));
  //   }
  // });

  // start observing a DOM node
  // resizeObserver.observe(document.body);
  const {
    courseBlocks: {
      courses,
      sections,
    },
  } = useModel('outline', courseId);

  // const style = {
  //   maxHeight: `${height}px`,
  // };
  const style = {};

  const rootCourseId = courses && Object.keys(courses)[0];

  return (
    <ol id="courseHome-utline" className="list-unstyled" style={style}>
      {courses[rootCourseId].sectionIds.map((sectionId) => (
        <Section
          key={sectionId}
          courseId={courseId}
          defaultOpen={false}
          expand={expandAll}
          section={sections[sectionId]}
        />
      ))}
    </ol>
  );
}

SectionList.propTypes = {
  courseId: PropTypes.string,
  expandAll: PropTypes.bool,
  relativeHeight: PropTypes.bool,
};

SectionList.defaultProps = {
  courseId: '',
  expandAll: false,
  relativeHeight: false,
};

export default SectionList;
