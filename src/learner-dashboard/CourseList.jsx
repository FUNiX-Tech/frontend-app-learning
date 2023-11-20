import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';

const CourseList = ({intl, courses})=>{

    return <div className='container'>
            <h1>{intl.formatMessage(messages.myCourse)}</h1>
    </div>
}


CourseList.propTypes = {
   courses : PropTypes.array ,
    intl: intlShape.isRequired,
};



export default injectIntl(CourseList)