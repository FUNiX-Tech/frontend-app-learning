import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';
import { getConfig } from '@edx/frontend-platform';
import CourseLoading from './CourseLoading';
import CourseBtn from './CourseBtn';


const CourseList = ({intl, courses})=>{

    return (
        <div className='d-flex flex-column w-100' style={{gap:'10px'}}>
        {courses.map(c => {
            const {course, courseRun, courseProvider,complete} = c
            let complete_ = complete
            if (complete){
                complete_ = number.toFixed(2)
            }
            return (
                <div className='d-flex border w-100 ' key={courseRun.courseId}>
                    <div className=''>
                        <img src={`${getConfig().LMS_BASE_URL}${course.bannerImgSrc}`} width="346px" height='193px'/>
                    </div>
                    <div className='p-3 w-100 d-flex flex-column justify-content-between'>
                        <div className='course-title'>
                            <span className='text-course-title'> {course.courseName}</span>
                            <span className='text-course-name'>{courseProvider.name} - {course.courseNumber}</span>
                        </div>
          
                        {courseRun.resumeUrl &&  <div className='pt-3'>
                        <div className="progress" style={{height:'5px'}}>
                            <div className="progress-bar" role="progressbar" style={{width:`${complete_}%`,height:'4px'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                       
                            <span className='text-complate-course'>
                                {complete_}% {intl.formatMessage(messages.complete)}
                            </span>
                        </div>}
                        
                        <div className=' d-flex  align-self-end' style={{gap:'10px'}} >
                            <CourseBtn intl={intl} courseRun={courseRun} />
                       
                        </div>
                    </div>
                    
                </div>
            )
        })}

    </div>
    )
 
    
}


CourseList.propTypes = {
   courses : PropTypes.array ,
    intl: intlShape.isRequired,

};



export default injectIntl(CourseList)