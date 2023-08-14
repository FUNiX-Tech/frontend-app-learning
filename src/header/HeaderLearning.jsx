import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import './HeaderLearning.scss'
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';

const HeaderLearning = ({
    courseOrg, courseNumber, courseTitle, intl, showUserDropdown,
  })=>{
    // console.log('=======', courseOrg, courseNumber, courseTitle)

    const authenticatedUser = getAuthenticatedUser();

   



    return (
    <header className="learning-header">
      {/* <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a> */}
      <div className="container-xl py-2 d-flex align-items-center">
        <a href={`${getConfig().LMS_BASE_URL}/dashboard`} className="logo">
           <img className="d-block" src={getConfig().LOGO_URL} alt={getConfig().LOGO_URL} />
        </a>
        <div className="d-flex align-items-center flex-grow-1 course-title-lockup" style={{ gap:'0.5rem' }}>
          <span className="d-block font-weight-bold  m-0">{courseOrg} {courseNumber}</span>
          <span className="d-block m-0  font-weight-bold ">{courseTitle}</span>
        </div>
        {showUserDropdown && authenticatedUser && (
        <AuthenticatedUserDropdown
          username={authenticatedUser.username}
        />
        )}
      </div>
  </header>
  ) 
}



HeaderLearning.propTypes = {
    courseOrg: PropTypes.string,
    courseNumber: PropTypes.string,
    courseTitle: PropTypes.string,
    intl: intlShape.isRequired,
    showUserDropdown: PropTypes.bool,
  };
  
HeaderLearning.defaultProps = {
    courseOrg: null,
    courseNumber: null,
    courseTitle: null,
    showUserDropdown: true,
  };
  

export default injectIntl(HeaderLearning)