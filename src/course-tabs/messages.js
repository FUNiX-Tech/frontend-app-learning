import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  courseMaterial: {
    id: 'learn.navigation.course.tabs.label',
    defaultMessage: 'Course Material',
    description: 'The accessible label for course tabs navigation',
  },
  asessmentSubmission  :{
    id: 'learning.tabs.staticTab.asessmentSubmission',
    defaultMessage: 'Asessment Submission',
},
  dateTab: {
    id:'learning.tabs.date',
    defaultMessage:'Date'
  },
  progressTab: {
    id: 'learning.tabs.progress',
    defineMessages: 'Progress'
  },
  courseTab:{
    id : 'learning.tabs.course',
    defineMessages : 'Course'
  }
});

export default messages;
