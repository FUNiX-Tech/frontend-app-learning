import React,{useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown  } from '@edx/paragon';

import messages from './messages';

import SelectLanguage from './SelectLanguage';
import SearchCourse from './SearchCourse';



const AuthenticatedUserDropdown = ({ intl, username }) => {

  const dashboardMenuItem = (
    <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
       <i class="bi bi-house" ></i>
      {intl.formatMessage(messages.dashboard)}
    </Dropdown.Item>
  );

    
    

  return (
    <>
      
      <div className='d-flex align-items-center ' style={{gap:'1rem'}}>
    
        <SearchCourse />
        <a  className="text-gray-700" href='https://funix.gitbook.io/funix-documentation/' target='_blank'>{intl.formatMessage(messages.help)}</a>
        {/* <select value={language} onChange={(e)=>handlerLanguage(e)} >
          <option value='vi'>Tiếng Việt</option>
          <option value='en'>English</option>
        </select> */}
        <SelectLanguage username={username}/>
      </div>
      <Dropdown className="user-dropdown ml-3">
        <Dropdown.Toggle variant="outline-primary">
          <FontAwesomeIcon icon={faUserCircle} className="d-md-none" size="lg" />
          <span data-hj-suppress className="d-none d-md-inline">
            {username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right">
          
          {dashboardMenuItem}
          {/* <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/u/${username}`}>
            {intl.formatMessage(messages.profile)}
          </Dropdown.Item> */}
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/account/settings`}>
          <i class="bi bi-person"></i>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>
          {/* { getConfig().ORDER_HISTORY_URL && (
            <Dropdown.Item href={getConfig().ORDER_HISTORY_URL}>
              {intl.formatMessage(messages.orderHistory)}
            </Dropdown.Item>
          )} */}
          
          <Dropdown.Item href={getConfig().LOGOUT_URL}>
          <i class="bi bi-box-arrow-left" ></i>
            {intl.formatMessage(messages.signOut)}
          </Dropdown.Item  >
          
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

AuthenticatedUserDropdown.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
};

export default injectIntl(AuthenticatedUserDropdown);
