import React from 'react';
import PropTypes from 'prop-types';
// import {
//   injectIntl,
//   intlShape,
// } from '@edx/frontend-platform/i18n';

import Section from './Section';

function SectionList({
  course,
  courseId,
  sections,
  expandAll,
}) {
  return (
    <ol id="courseHome-outline" className="list-unstyled">
      {course.sectionIds.map((sectionId) => (
        <Section
          key={sectionId}
          courseId={courseId}
          defaultOpen={sections[sectionId].resumeBlock}
          expand={expandAll}
          section={sections[sectionId]}
        />
      ))}
    </ol>
  );
}

SectionList.propTypes = {
  courseId: PropTypes.string.isRequired,
  sections: PropTypes.shape().isRequired,
  expandAll: PropTypes.bool.isRequired,
  course: PropTypes.shape().isRequired,
};

export default SectionList;