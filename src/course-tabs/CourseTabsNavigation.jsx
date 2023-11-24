import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './messages';
import Tabs from '../generic/tabs/Tabs';

function CourseTabsNavigation({
  activeTabSlug, className, tabs, intl,
}) {
  return (
    <div id="courseTabsNavigation" style={{zIndex:"10",backgroundColor:"#fff", position:"relative"}} className={classNames('course-tabs-navigation')}>
      <div className="container-xl">
        <Tabs
          className="nav-underline-tabs"
          aria-label={intl.formatMessage(messages.courseMaterial)}
        >
          {tabs.map(({ url, title, slug }) => {
             
            
            return <a
              key={slug}
              className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
              href={url}
            >
              {title}
            </a>
})}
        </Tabs>
      </div>
    </div>
  );
}

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  intl: intlShape.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
