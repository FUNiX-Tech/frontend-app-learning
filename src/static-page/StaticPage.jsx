import React, { useEffect, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';

function StaticPage({ courseId, staticId }) {
  let isMounted = false;
  const [iframeHeight, setIframeHeight] = useState(1000);

  function receiveMessage(event) {
    const { type, payload } = event.data;
    if (type === 'plugin.resize') {
      let height = payload.height;
      if (iframeHeight === 0 && height === 1000 && isMounted) {
        height = 1010;
      }
      setIframeHeight(height);
    }
   
  }

  useEffect(() => {
    isMounted = true;
    global.addEventListener('message', receiveMessage);
  },[iframeHeight]);

  return (
    <div className="sequence-container">
      <div className="sequence">
        <div className="unit-container flex-grow-1">
          <div className="unit-iframe-wrapper">
            <iframe
              id="unit-iframe"
              title="Static Page iframe"
              src={`${getConfig().LMS_BASE_URL}/iframe/${courseId}/${staticId}/`}
              allowFullScreen=""
              scrolling="no"
              height={iframeHeight}
              referrerPolicy="origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

StaticPage.propTypes = {
  courseId: PropTypes.string.isRequired,
  staticId: PropTypes.string.isRequired,
};

export default StaticPage;
