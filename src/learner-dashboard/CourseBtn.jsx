import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';


const CourseBtn = ({intl ,courseRun})=>{
    return (
        <>
             {courseRun.resumeUrl ? 
                        <a href={`${getConfig().LMS_BASE_URL}${courseRun.resumeUrl}`}  >
                            <button className='btn-primary-custom'> 
                                <span>{intl.formatMessage(messages.btnResumeCourse)}</span>
                            </button>
                        </a> : <>
                        <a href={`${getConfig().LMS_BASE_URL}/courses/${courseRun.courseId}/about`} target="_blank" rel="noopener noreferrer" >
                            <button className='btn-primary-custom-outline'> 
                                <span>{intl.formatMessage(messages.btnIntroductionCourse)}</span>
                            </button>
                        </a>
                            <a href={courseRun.homeUrl} >
                                    <button className='btn-primary-custom'>
                                        <span>{intl.formatMessage(messages.btnBeginCourse)}</span>
                                    </button>
                             </a>
                        </>}
        </>
    )
}


CourseBtn.propTypes ={
    courseRun : PropTypes.object,
    intl: intlShape.isRequired,
}

export default injectIntl(CourseBtn)
