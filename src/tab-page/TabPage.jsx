import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { getConfig } from '@edx/frontend-platform';

import Footer from '@edx/frontend-component-footer';
import { Toast } from '@edx/paragon';
import { LearningHeader as Header } from '@edx/frontend-component-header';
import PageLoading from '../generic/PageLoading';
import { getAccessDeniedRedirectUrl } from '../shared/access';
import { useModel } from '../generic/model-store';

import genericMessages from '../generic/messages';
import messages from './messages';
import LoadedTabPage from './LoadedTabPage';
import { setCallToActionToast } from '../course-home/data/slice';
import LaunchCourseHomeTourButton from '../product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';

function TabPage({ intl, ...props }) {
  const {
    activeTabSlug,
    courseId,
    courseStatus,
    metadataModel,
    unitId,
  } = props;
  const {
    toastBodyLink,
    toastBodyText,
    toastHeader,
  } = useSelector(state => state.courseHome);
  const dispatch = useDispatch();
  const {
    courseAccess,
    number,
    org,
    start,
    title,
  } = useModel(metadataModel, courseId);

  const { email } = getAuthenticatedUser();

  useEffect(() => {
    // check if dome have #hflivechat element
    if (!document.getElementById('hflivechat')) {
      // Add audio element with display none to prevent autoplay
      const audio = document.createElement('audio');
      audio.setAttribute('style', 'display:none');
      audio.setAttribute('src', 'https://hf.funix.edu.vn/sounds/chime.mp3');
      audio.setAttribute('type', 'audio/mpeg');
      // Add audio element to body
      document.body.appendChild(audio);

      // Add jquery
      const jquery = document.createElement('script');
      jquery.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
      jquery.addEventListener('load', () => {
        const hfScript = document.createElement('script');
        hfScript.setAttribute('src', 'https://hf.funix.edu.vn/hf40-livechat/hf40-livechat.js');
        hfScript.addEventListener('load', () => {
          // eslint-disable-next-line no-undef
          initHF40('https://hf.funix.edu.vn', false, email);
        });
        document.head.appendChild(hfScript);
      });
      document.body.appendChild(jquery);
    }
  }, []);

  useEffect(() => {
    if (!document.getElementById('feed-back-script')) {
      // Because the feedback style is depend on LMS style so we need to add it to the head
      // Append link to style in body
      const feedbackStyle = document.createElement('link');
      feedbackStyle.setAttribute('rel', 'stylesheet');
      feedbackStyle.setAttribute('href', `${getConfig().LMS_BASE_URL}/static/feedback/feedback.css`);

      // Append link to head
      document.head.appendChild(feedbackStyle);

      const feedScript = document.createElement('script');
      feedScript.setAttribute('src', `${getConfig().LMS_BASE_URL}/static/feedback/add_feedback.js`);
      feedScript.setAttribute('id', 'feed-back-script');
      feedScript.addEventListener('load', () => {
        // eslint-disable-next-line no-undef
        initFUNiXFeedback(getConfig().LMS_BASE_URL);
      });
      document.head.appendChild(feedScript);
    }
  });

  if (courseStatus === 'loading') {
    return (
      <>
        <Header />
        <PageLoading
          srMessage={intl.formatMessage(messages.loading)}
        />
        <Footer />
      </>
    );
  }

  if (courseStatus === 'denied') {
    const redirectUrl = getAccessDeniedRedirectUrl(courseId, activeTabSlug, courseAccess, start, unitId);
    if (redirectUrl) {
      return (<Redirect to={redirectUrl} />);
    }
  }

  // Either a success state or a denied state that wasn't redirected above (some tabs handle denied states themselves,
  // like the outline tab handling unenrolled learners)
  if (courseStatus === 'loaded' || courseStatus === 'denied') {
    return (
      <>
        <Toast
          action={toastBodyText ? {
            label: toastBodyText,
            href: toastBodyLink,
          } : null}
          closeLabel={intl.formatMessage(genericMessages.close)}
          onClose={() => dispatch(setCallToActionToast({ header: '', link: null, link_text: null }))}
          show={!!(toastHeader)}
        >
          {toastHeader}
        </Toast>
        {metadataModel === 'courseHomeMeta' && (<LaunchCourseHomeTourButton srOnly />)}
        <Header
          courseOrg={org}
          courseNumber={number}
          courseTitle={title}
        />
        <LoadedTabPage {...props} />
        <Footer />
      </>
    );
  }

  // courseStatus 'failed' and any other unexpected course status.
  return (
    <>
      <Header />
      <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
        {intl.formatMessage(messages.failure)}
      </p>
      <Footer />
    </>
  );
}

TabPage.defaultProps = {
  courseId: null,
  unitId: null,
};

TabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string,
  courseStatus: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

export default injectIntl(TabPage);
