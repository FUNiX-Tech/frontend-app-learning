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
    defaultMessage: 'Important dates for {username}',
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
    id: 'learning.goal.setWeekdayText',
    defaultMessage: 'Select weekdays you want to study',
  },
  setWeekdayDetail: {
    id: 'learning.goal.setWeekdayDetail',
    defaultMessage: 'At least three days a week',
  },
  setHourDailyText: {
    id: 'learning.goal.setHourDailyText',
    defaultMessage: 'Select study hours each day',
  },
  setHourDailyDetail: {
    id: 'learning.goal.setHourDailyyDetail',
    defaultMessage: 'At least 2.5 hours per day',
  },
  mon: {
    id: 'learning.goal.mon',
    defaultMessage: 'Mon',
  },
  tue: {
    id: 'learning.goal.tue',
    defaultMessage: 'Tue',
  },
  wed: {
    id: 'learning.goal.wed',
    defaultMessage: 'Wed',
  },
  thu: {
    id: 'learning.goal.thu',
    defaultMessage: 'Thu',
  },
  fri: {
    id: 'learning.goal.fri',
    defaultMessage: 'Fri',
  },
  sat: {
    id: 'learning.goal.sat',
    defaultMessage: 'Sat',
  },
  sun: {
    id: 'learning.goal.sun',
    defaultMessage: 'Sun',
  },
  submit :{
    id:'learning.dates.submit' ,
    defaultMessage : 'Submit'
  },
  selectDate : {
    id : 'learning.dates.select.date' ,
    defaultMessage : 'Select the start date of study'
  },
  selectUnti : {
    id:'learning.dates.select.unit' , 
    defaultMessage: 'Select the lesson to begin with' 
  },
  weeklyProgress : {
    id : 'learning.dates.progress.weekly' ,
    defaultMessage : 'Weekly progress'
  },
  dailyProgress : {
    id:  'learning.dates.progress.daily' ,
    defaultMessage : 'Daily progress'
  }
});

export default messages;
