/* eslint-disable camelcase */
import React from 'react';
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
}) {
  // console.log(courseId);
  const {
    courseBlocks: {
      courses,
      sections,
    },
  } = useModel('outline', courseId);

  const rootCourseId = courses && Object.keys(courses)[0];

  return (
    <ol id="courseHome-outline" className="list-unstyled">
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
};

SectionList.defaultProps = {
  courseId: '',
  expandAll: false,
};

export default SectionList;
