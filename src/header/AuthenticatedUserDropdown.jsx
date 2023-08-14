import React,{useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown  } from '@edx/paragon';

import messages from './messages';
import { fetchDataLanguage, fetchPreferences ,fetchLanguage } from './data/thunks';



const AuthenticatedUserDropdown = ({ intl, username }) => {
  const dashboardMenuItem = (
    <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
      {intl.formatMessage(messages.dashboard)}
    </Dropdown.Item>
  );
    

  const  [language, setLanguage] = useState('vi')
  const [loading, setLoading] = useState(false)
  const [loadingSetLanguage, setLoadingSetLanguage] = useState(false)

    const handlerLanguage = async (e)=>{
      setLanguage(e.target.value)
      setLoadingSetLanguage(true)

    }

    useEffect(async()=>{
      if(loadingSetLanguage){
        await fetchDataLanguage(language)
        await fetchPreferences(username, language)
        setLoading(true)
        setLoadingSetLanguage(false)
      }
      if (loading){
        window.location.reload();
        setLoading(false)
      }
      if(!loading && !loadingSetLanguage){
        const data = await fetchLanguage(username)
        setLanguage(data['pref-lang'])
      }
    },[language ,loading])


  return (
    <>

   
      <div className='d-flex align-items-center ' style={{gap:'1rem'}}>
        <a  className="text-gray-700" href={`${getConfig().SUPPORT_URL}`}>{intl.formatMessage(messages.help)}</a>
        <select value={language} onChange={(e)=>handlerLanguage(e)} >
          <option value='vi'>Tiếng Việt</option>
          <option value='en'>English</option>
        </select>
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
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/u/${username}`}>
            {intl.formatMessage(messages.profile)}
          </Dropdown.Item>
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/account/settings`}>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>
          {/* { getConfig().ORDER_HISTORY_URL && (
            <Dropdown.Item href={getConfig().ORDER_HISTORY_URL}>
              {intl.formatMessage(messages.orderHistory)}
            </Dropdown.Item>
          )} */}
          
          <Dropdown.Item href={getConfig().LOGOUT_URL}>
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
