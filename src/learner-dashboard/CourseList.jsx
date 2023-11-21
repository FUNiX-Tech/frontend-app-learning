import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';
import { getConfig } from '@edx/frontend-platform';

const CourseList = ({intl, courses})=>{
    console.log('course ' , courses)
    return <div className='container p-2' >
            <div className='p-2' >
                <h1>{intl.formatMessage(messages.myCourse)}</h1>
            </div>
            <div className='d-flex flex-column ' style={{gap:'10px'}}>
                {courses.map(c => {
                    const {course} = c
                    // console.log('==========', c)
                    return (
                        <div className='d-flex border w-100 ' >
                            <div className=''>
                                <img src={`${getConfig().LMS_BASE_URL}${course.bannerImgSrc}`} width="346px" height='193px'/>
                            </div>
                            <div className='p-3 w-100 d-flex flex-column justify-content-around'>
                                <div className='course-title'>
                                    <h3> {course.courseName}</h3>
                                    <span>{course.courseNumber}</span>
                                </div>
                                <div>
                                    nam nagn
                                </div>
                                <div className=' d-flex  align-self-end' style={{gap:'10px'}} >
                                        <button className='btn-primary-custom outline'> 
                                            <span>Gioi thieu khoa hoc</span>
                                        </button>
                                        <button className='btn-primary-custom'>
                                            <span>Bat dau hoc</span>
                                        </button>
                                </div>
                            </div>
                            
                        </div>
                    )
                })}
            </div>
    </div>
}


CourseList.propTypes = {
   courses : PropTypes.array ,
    intl: intlShape.isRequired,
};



export default injectIntl(CourseList)