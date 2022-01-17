import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  completed: {
    id: 'learning.dates.badge.completed',
    defaultMessage: 'Completed',
  },
  dueNext: {
    id: 'learning.dates.badge.dueNext',
    defaultMessage: 'Due next',
  },
  pastDue: {
    id: 'learning.dates.badge.pastDue',
    defaultMessage: 'Past due',
  },
  title: {
    id: 'learning.dates.title',
    defaultMessage: 'Important dates',
  },
  today: {
    id: 'learning.dates.badge.today',
    defaultMessage: 'Today',
  },
  unreleased: {
    id: 'learning.dates.badge.unreleased',
    defaultMessage: 'Not yet released',
  },
  verifiedOnly: {
    id: 'learning.dates.badge.verifiedOnly',
    defaultMessage: 'Verified only',
  },
  setWeeklyGoal: {
    id: 'learning.outline.setWeeklyGoal',
    defaultMessage: 'Set a weekly learning goal',
  },
  setWeeklyGoalDetail: {
    id: 'learning.outline.setWeeklyGoalDetail',
    defaultMessage: 'Setting a goal motivates you to finish the course. You can always change it later.',
  },
  setGoal: {
    id: 'learning.outline.setGoal',
    defaultMessage: 'To start, set a course goal by selecting the option below that best describes your learning plan.',
  },
  setGoalReminder: {
    id: 'learning.outline.setGoalReminder',
    defaultMessage: 'Set a goal reminder',
  },
  setLearningGoalButtonScreenReaderText: {
    id: 'learning.outline.goalButton.casual.title',
    defaultMessage: 'Set a learning goal style.',
    description: 'screen reader text informing learner they can select an intensity of learning goal',
  },
});

export default messages;
