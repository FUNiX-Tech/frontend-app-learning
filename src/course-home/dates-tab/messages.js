import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  completed: {
    id: 'learning.dates.badge.completed',
    defaultMessage: 'Completed',
    description: 'shown as label for the assignments which learner has completed.',
  },
  dueNext: {
    id: 'learning.dates.badge.dueNext',
    defaultMessage: 'Due next',
    description: 'Shown as label for the assignment which date is in the future',
  },
  pastDue: {
    id: 'learning.dates.badge.pastDue',
    defaultMessage: 'Past due',
    description: 'Shown as label for the assignments which deadline has passed',
  },
  title: {
    id: 'learning.dates.title',
    defaultMessage: 'Important dates',
    description: 'The title of dates tab (course timeline).',
  },
  today: {
    id: 'learning.dates.badge.today',
    defaultMessage: 'Today',
    description: 'Label used when the scheduled date for the assignment matches the current day',
  },
  unreleased: {
    id: 'learning.dates.badge.unreleased',
    defaultMessage: 'Not yet released',
    description: 'Shown as label for assignments which date is unknown yet',
  },
  verifiedOnly: {
    id: 'learning.dates.badge.verifiedOnly',
    defaultMessage: 'Verified only',
    description: 'Shown as label for assignments which learner has no access to.',
  },
  setWeekdayText: {
    id: 'learning.dates.setWeekdayText',
    defaultMessage: 'Select weekdays you want to study',
  },
  setWeekdayDetail: {
    id: 'learning.dates.setWeekdayDetail',
    defaultMessage: 'At least four days a week',
  },
  setHourDailyText: {
    id: 'learning.dates.setHourDailyText',
    defaultMessage: 'Select study hours each day',
  },
  setHourDailyDetail: {
    id: 'learning.dates.setHourDailyText',
    defaultMessage: 'At least 2.5 hours per day',
  },
});

export default messages;
