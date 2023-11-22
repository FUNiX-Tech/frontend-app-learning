import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({

  myCourse: {
    id: 'dashboard.myCourse',
    defaultMessage: 'My Course',

  },
  btnBeginCourse:{
    id: 'dashboard.btn.beginCourse',
    defaultMessage: 'Begin Course',
  },
  btnViewCourse:{
    id : 'dashboard.btn.viewCourse',
    defineMessages : 'View Course',
    
  },
  btnResumeCourse:{
    id: 'dashboard.btn.resumeCourse',
    defaultMessage: 'Resume Course',
  },
  btnIntroductionCourse:{
    id:'dashboard.btn.introductionCourse',
    defaultMessage: 'Introduction Course',
    description : 'about course description',
  } ,
  notCourse :{
    id: 'dashboard.notCourse',
    defaultMessage: 'You are not currently registered for any courses',
  }
  

});

export default messages;
