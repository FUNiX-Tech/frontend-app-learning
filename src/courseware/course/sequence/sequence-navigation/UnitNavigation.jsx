import React from "react";
import PropTypes from "prop-types";
import { Button } from "@edx/paragon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  injectIntl,
  intlShape,
  isRtl,
  getLocale,
} from "@edx/frontend-platform/i18n";
import { useSelector } from "react-redux";

import { getCourseExitNavigation } from "../../course-exit";

import UnitNavigationEffortEstimate from "./UnitNavigationEffortEstimate";
import { useSequenceNavigationMetadata } from "./hooks";
import messages from "./messages";

function UnitNavigation({
  intl,
  sequenceId,
  unitId,
  onClickPrevious,
  onClickNext,
  goToCourseExitPage,
}) {
  const { isFirstUnit, isLastUnit } = useSequenceNavigationMetadata(
    sequenceId,
    unitId
  );
  const { courseId } = useSelector((state) => state.courseware);

  const renderNextButton = () => {
    const { exitActive, exitText } = getCourseExitNavigation(courseId, intl);
    const buttonOnClick = isLastUnit ? goToCourseExitPage : onClickNext;

    const disabled = isLastUnit && !exitActive;
    const buttonText = intl.formatMessage(messages.nextButton);
    const nextArrow = isRtl(getLocale()) ? faChevronLeft : faChevronRight;
    return (
      <Button
        variant="outline-primary"
        className="next-button d-flex align-items-center justify-content-center"
        onClick={buttonOnClick}
        disabled={disabled}
      >
        <div className="next-btn-text">
          <p className="next-btn-small-text">Bài tiếp theo</p>
          <p className="next-btn-large-text">Next lesson</p>
        </div>
        <UnitNavigationEffortEstimate sequenceId={sequenceId} unitId={unitId}>
          {/* {buttonText} */}
        </UnitNavigationEffortEstimate>
        {/* <FontAwesomeIcon icon={nextArrow} className="ml-2" size="sm" /> */}
        <svg
          style={{ width: "1.5rem", height: "1.5rem" }}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            className="unit-btn-arrow"
            d="M16.175 13.0001H5C4.71667 13.0001 4.47917 12.9043 4.2875 12.7126C4.09583 12.5209 4 12.2834 4 12.0001C4 11.7168 4.09583 11.4793 4.2875 11.2876C4.47917 11.0959 4.71667 11.0001 5 11.0001H16.175L11.275 6.10011C11.075 5.90011 10.9792 5.66678 10.9875 5.40011C10.9958 5.13344 11.1 4.90011 11.3 4.70011C11.5 4.51678 11.7333 4.42094 12 4.41261C12.2667 4.40428 12.5 4.50011 12.7 4.70011L19.3 11.3001C19.4 11.4001 19.4708 11.5084 19.5125 11.6251C19.5542 11.7418 19.575 11.8668 19.575 12.0001C19.575 12.1334 19.5542 12.2584 19.5125 12.3751C19.4708 12.4918 19.4 12.6001 19.3 12.7001L12.7 19.3001C12.5167 19.4834 12.2875 19.5751 12.0125 19.5751C11.7375 19.5751 11.5 19.4834 11.3 19.3001C11.1 19.1001 11 18.8626 11 18.5876C11 18.3126 11.1 18.0751 11.3 17.8751L16.175 13.0001Z"
            fill="#576F8A"
          />
        </svg>
      </Button>
    );
  };

  const prevArrow = isRtl(getLocale()) ? faChevronRight : faChevronLeft;
  return (
    <div className="border-top " style={{ paddingTop: "2rem" }}>
      <div className="unit-navigation d-flex ">
        <Button
          variant="outline-secondary"
          className={`previous-button mr-2 align-items-center justify-content-center ${
            isFirstUnit ? "d-none" : "d-flex"
          }`}
          disabled={isFirstUnit}
          onClick={onClickPrevious}
        >
          {/* <FontAwesomeIcon icon={prevArrow} className="mr-2" size="sm"  /> */}
          {/* <FontAwesomeIcon icon={prevArrow} className="mr-2"   /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "1.5rem", height: "1.5rem" }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              className="unit-btn-arrow"
              d="M7.82578 12.9998L12.7258 17.8998C12.9258 18.0998 13.0216 18.3331 13.0133 18.5998C13.0049 18.8665 12.9008 19.0998 12.7008 19.2998C12.5008 19.4831 12.2674 19.579 12.0008 19.5873C11.7341 19.5956 11.5008 19.4998 11.3008 19.2998L4.70078 12.6998C4.60078 12.5998 4.52995 12.4915 4.48828 12.3748C4.44661 12.2581 4.42578 12.1331 4.42578 11.9998C4.42578 11.8665 4.44661 11.7415 4.48828 11.6248C4.52995 11.5081 4.60078 11.3998 4.70078 11.2998L11.3008 4.6998C11.4841 4.51647 11.7133 4.4248 11.9883 4.4248C12.2633 4.4248 12.5008 4.51647 12.7008 4.6998C12.9008 4.8998 13.0008 5.1373 13.0008 5.4123C13.0008 5.6873 12.9008 5.9248 12.7008 6.1248L7.82578 10.9998H19.0008C19.2841 10.9998 19.5216 11.0956 19.7133 11.2873C19.9049 11.479 20.0008 11.7165 20.0008 11.9998C20.0008 12.2831 19.9049 12.5206 19.7133 12.7123C19.5216 12.904 19.2841 12.9998 19.0008 12.9998H7.82578Z"
              fill="#576F8A"
            />
          </svg>

          {/* {intl.formatMessage(messages.previousButton)} */}
        </Button>
        {renderNextButton()}
      </div>
    </div>
  );
}

UnitNavigation.propTypes = {
  intl: intlShape.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  onClickPrevious: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  goToCourseExitPage: PropTypes.func.isRequired,
};

UnitNavigation.defaultProps = {
  unitId: null,
};

export default injectIntl(UnitNavigation);
