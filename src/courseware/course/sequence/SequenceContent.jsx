import React, { Suspense, useEffect, useContext, useState , useCallback , useRef} from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PageLoading from '../../../generic/PageLoading';
import { useModel } from '../../../generic/model-store';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import messages from './messages';
import BookmarkButton from '../bookmark/BookmarkButton';
import { useEventListener } from '../../../generic/hooks';
import Unit from './Unit';



const IFRAME_FEATURE_POLICY = (
  'microphone *; camera *; midi *; geolocation *; encrypted-media *'
);


const ContentLock = React.lazy(() => import('./content-lock'));

function SequenceContent({
  gated,
  intl,
  courseId,
  sequenceId,
  unitId,


}) {
  const sequence = useModel('sequences', sequenceId);

  // Go back to the top of the page whenever the unit or sequence changes.
  useEffect(() => {
    global.scrollTo(0, 0);
  }, [sequenceId, unitId]);

  if (gated) {
    return (
      <Suspense
        fallback={(
          <PageLoading
            srMessage={intl.formatMessage(messages.loadingLockedContent)}
          />
        )}
      >
        <ContentLock
          courseId={courseId}
          sequenceTitle={sequence.title}
          prereqSectionName={sequence.gatedContent.prereqSectionName}
          prereqId={sequence.gatedContent.prereqId}
        />
      </Suspense>
    );
  }

  const unit = useModel('units', unitId);
  // if (!unitId || !unit) {
  //   return (
  //     <div>
  //       {intl.formatMessage(messages.noContent)}
  //     </div>
  //   );
  // }

  const { authenticatedUser } = useContext(AppContext);
  const view = authenticatedUser ? 'student_view' : 'public_view';

  const getIframeUrl = (unitId) => {
    let iframeUrl = `${getConfig().LMS_BASE_URL}/xblock/${unitId}?show_title=0&show_bookmark_button=0&recheck_access=1&view=${view}`;
    if (sequence.format) {
      iframeUrl += `&format=${sequence.format}`;
    }
    return iframeUrl;
  };

  const iframeURLS = sequence.unitIds.map(e =>{
    return {id : e , url : getIframeUrl(e)}
  }
    
  )

  const [loadedIframeId, setLoadedIframeId] = useState(unitId);
  const [iframeHeight, setIframeHeight] = useState(0);
  const [iframeHeightValues, setIframeHeightValues] = useState([]);
  const [load , setLoad] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoadedIframeId(unitId)
  },[unitId ])

  const handleIframeLoad = (id) => {
    setLoading(true)
  };


  const receiveMessage = useCallback(({ data }) => {
    const {
      type,
      payload,
    } = data;
    if (type === 'plugin.resize' && payload.height > 0) {
            setIframeHeight(payload.height);

            // document.getElementById('unit-iframe').setAttribute('data-height', payload.height);     
    } 
  }, [unitId ,iframeHeight, setIframeHeight,loadedIframeId ]);
  useEventListener('message', receiveMessage);


  
  useEffect(() => {
    if (iframeHeight > 0) {
      const existingItemIndex = iframeHeightValues.findIndex((item) => item.id === unitId);
      if (existingItemIndex === -1 || iframeHeightValues[existingItemIndex].height < iframeHeight) {
        setIframeHeightValues((prevValues) => {
          const updatedValues = prevValues.filter((item) => item.id !== unitId);
          return [...updatedValues, { id: unitId, height: iframeHeight }];
        });
      }
    }
  }, [iframeHeight]);
 



  return (
    <div className='unit'> 
    <div style={{ marginLeft: '-15px' }}>
        <h1 className="mb-0 h3">{unit.title}</h1>
        <h2 className="sr-only">{intl.formatMessage(messages['learn.header.h2.placeholder'])}</h2>
        <BookmarkButton
          unitId={unit.id}
          isBookmarked={unit.bookmarked}
          isProcessing={unit.bookmarkedUpdateState === 'loading'}
        />
    </div>
    <div className="unit-iframe-wrapper">
      {load && <iframe
              id="unit-iframe"
             src={getIframeUrl(unitId)}  
            allow={IFRAME_FEATURE_POLICY}
            allowFullScreen
            height={iframeHeight}
            scrolling="no"
            referrerPolicy="origin"
            // data-height={iframeHeight}
             onLoad={()=>handleIframeLoad(unitId)}/> }
    { loading && <div>
      {/* <div>
        <p>iframeHeight:{iframeHeight}</p>
      </div> */}
      {iframeURLS.map((e) => {
        const isLoaded = loadedIframeId === e.id;
        return (
          <iframe
            id="unit-iframe"
            key={e.id}
            src={e.url}
            allow={IFRAME_FEATURE_POLICY}
            allowFullScreen
            onLoad={() =>{
            setLoad(false)             
            }}
            scrolling="no"
            referrerPolicy="origin"
            style={{ display: isLoaded && !load ? 'block' : 'none'  , }}
            height={iframeHeightValues.find(h=>h.id === e.id)?.height }

           
          />
          
        );
      })}
  
      </div>}
      </div>
    </div>
    // <Unit
    //   courseId={courseId}
    //   format={sequence.format}
    //   key={unitId}
    //   id={unitId}
    //   onLoaded={unitLoadedHandler}
    //   /** [MM-P2P] Experiment */
    //   mmp2p={mmp2p}
    // />
  );
}

SequenceContent.propTypes = {
  gated: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  unitLoadedHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  /** [MM-P2P] Experiment */
  mmp2p: PropTypes.shape({
    flyover: PropTypes.shape({
      isVisible: PropTypes.bool.isRequired,
    }),
    meta: PropTypes.shape({
      showLock: PropTypes.bool,
    }),
    state: PropTypes.shape({
      isEnabled: PropTypes.bool.isRequired,
    }),
  }),
};

SequenceContent.defaultProps = {
  unitId: null,
  /** [MM-P2P] Experiment */
  mmp2p: {
    flyover: { isVisible: false },
    meta: { showLock: false },
    state: { isEnabled: false },
  },
};

export default injectIntl(SequenceContent);
