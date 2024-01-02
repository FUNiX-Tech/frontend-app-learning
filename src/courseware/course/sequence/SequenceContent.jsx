import React, {
  Suspense,
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import PageLoading from "../../../generic/PageLoading";
import { useModel } from "../../../generic/model-store";
import { getConfig } from "@edx/frontend-platform";
import { AppContext } from "@edx/frontend-platform/react";
import messages from "./messages";
import BookmarkButton from "../bookmark/BookmarkButton";
import { useEventListener } from "../../../generic/hooks";
import { Pl } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const IFRAME_FEATURE_POLICY =
  "microphone *; camera *; midi *; geolocation *; encrypted-media *";

const ContentLock = React.lazy(() => import("./content-lock"));

function SequenceContent({ gated, intl, courseId, sequenceId, unitId }) {
  const sequence = useModel("sequences", sequenceId);
  const [loadedUnits, setLoadedUnits] = useState([]);

  // Go back to the top of the page whenever the unit or sequence changes.
  useEffect(() => {
    global.scrollTo(0, 0);
  }, [sequenceId, unitId]);

  if (gated) {
    return (
      <Suspense
        fallback={
          <PageLoading
            srMessage={intl.formatMessage(messages.loadingLockedContent)}
          />
        }
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

  const unit = useModel("units", unitId);

  const { authenticatedUser } = useContext(AppContext);
  const view = authenticatedUser ? "student_view" : "public_view";

  const getIframeUrl = (unitId) => {
    let iframeUrl = `${
      getConfig().LMS_BASE_URL
    }/xblock/${unitId}?show_title=0&show_bookmark_button=0&recheck_access=1&view=${view}`;

    if (sequence.format) {
      iframeUrl += `&format=${sequence.format}`;
    }

    return iframeUrl;
  };

  const iframeURLS = sequence.unitIds.map((e) => {
    return { id: e, url: getIframeUrl(e) };
  });

  const [loadedIframeId, setLoadedIframeId] = useState(unitId);
  const [iframeHeight, setIframeHeight] = useState(0);
  const [iframeHeightValues, setIframeHeightValues] = useState([]);

  useEffect(() => {
    setLoadedIframeId(unitId);
  }, [unitId]);

  const receiveMessage = useCallback(
    ({ data }) => {
      const { type, payload } = data;
      if (type === "plugin.resize" && payload.height > 0) {
        setIframeHeight(payload.height);
        console.log("event dataaaaaaaaaaa:::", data);
        console.log("event dataaaaaaaaaaa:::", data);
        console.log("event dataaaaaaaaaaa:::", data);
        console.log("event dataaaaaaaaaaa:::", data);
      }
    },
    [unitId, iframeHeight, setIframeHeight, loadedIframeId]
  );
  useEventListener("message", receiveMessage);

  useEffect(() => {
    if (iframeHeight > 0) {
      const existingItemIndex = iframeHeightValues.findIndex(
        (item) => item.id === unitId
      );
      if (
        existingItemIndex === -1 ||
        iframeHeightValues[existingItemIndex].height < iframeHeight
      ) {
        setIframeHeightValues((prevValues) => {
          const updatedValues = prevValues.filter((item) => item.id !== unitId);
          return [...updatedValues, { id: unitId, height: iframeHeight }];
        });
      }
    }
  }, [iframeHeight]);

  return (
    <div className="unit">
      <div className="position-relative">
        <h1 className="mb-0  unit-title header-title pr-5">{unit.title}</h1>
        <h2 className="sr-only">
          {intl.formatMessage(messages.headerPlaceholder)}
        </h2>
        <div
          className="position-absolute"
          style={{ top: "0", right: "-0.5rem" }}
        >
          <BookmarkButton
            unitId={unit.id}
            isBookmarked={unit.bookmarked}
            isProcessing={unit.bookmarkedUpdateState === "loading"}
          />
        </div>
      </div>

      <div className="unit-iframe-wrapper" style={{ minHeight: "31.25rem" }}>
        <div>
          {iframeURLS.map((e) => {
            const isSelectedUnit = loadedIframeId === e.id;
            const thisUnitIsLoaded = loadedUnits.includes(e.id);
            const shouldDisplayContent = isSelectedUnit && thisUnitIsLoaded;

            return (
              <>
                {isSelectedUnit && !thisUnitIsLoaded && (
                  <div>
                    <br />
                    <Skeleton width="50%" />
                    <Skeleton width="70%" />
                    <Skeleton width="80%" />
                    <br />
                    <Skeleton width="50%" />
                    <Skeleton width="70%" />
                    <Skeleton width="80%" />
                    <br />
                    <Skeleton width="50%" />
                    <Skeleton width="70%" />
                    <Skeleton width="80%" />
                    <br />
                    <Skeleton width="50%" />
                    <Skeleton width="70%" />
                    <Skeleton width="80%" />
                  </div>
                )}

                <iframe
                  id="unit-iframe"
                  key={e.id}
                  data-unit-usage-id={e.id}
                  src={e.url}
                  allow={IFRAME_FEATURE_POLICY}
                  allowFullScreen
                  onLoad={() => {
                    setLoadedUnits((prev) => {
                      return [...prev, e.id];
                    });
                  }}
                  scrolling="no"
                  referrerPolicy="origin"
                  style={{
                    display: shouldDisplayContent ? "block" : "none",
                  }}
                  height={iframeHeightValues.find((h) => h.id === e.id)?.height}
                />
              </>
            );
          })}
        </div>
      </div>
    </div>
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
