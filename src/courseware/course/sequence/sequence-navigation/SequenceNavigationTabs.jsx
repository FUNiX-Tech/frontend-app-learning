import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useModel } from "../../../../generic/model-store";

import UnitButton from "./UnitButton";
import SequenceNavigationDropdown from "./SequenceNavigationDropdown";
import useIndexOfLastVisibleChild from "../../../../generic/tabs/useIndexOfLastVisibleChild";
import { useSelector } from "react-redux";
import Feedback from "./Feedback/Feedback";

import sequence from "..";

export default function SequenceNavigationTabs({
  unitIds,
  unitId,
  showCompletion,
  onNavigate,
  courseId,
  title,
}) {
  const [indexOfLastVisibleChild, containerRef, invisibleStyle] =
    useIndexOfLastVisibleChild();
  const shouldDisplayDropdown = indexOfLastVisibleChild === -1;

  //get state
  const isShowRightMenu = useSelector(
    (state) => state.header.isShowLessonContent
  );

  const isShowFeedback = useSelector((state) => state.header.isShowFeedback);

  return (
    <div style={{ flexBasis: "100%", minWidth: 0 }}>
      {/* <AIChatbot
        isShowChatbot={isShowChatbot}
        shouldDisplayDropdown={shouldDisplayDropdown}
      /> */}
      <div
        className="sequence-navigation-tabs-container"
        ref={containerRef}
        style={{ height: "100%" }}
      >
        {/* Right Menu */}

        {/* <div
          className={`${
            isShowRightMenu
              ? "sequence-navigation-tabs d-flex flex-grow-1 active"
              : "sequence-navigation-tabs d-flex flex-grow-1"
          }`}
          style={shouldDisplayDropdown ? null : null}
        >
          <div className="sequence-lesson-title">
            <h2 className="lesson-title">{title}</h2>
          </div>

          {unitIds.map((buttonUnitId) => (
            <UnitButton
              key={buttonUnitId}
              unitId={buttonUnitId}
              isActive={unitId === buttonUnitId}
              showCompletion={showCompletion}
              onClick={(...params) => {
                document
                  .querySelector(`iframe[data-unit-usage-id='${buttonUnitId}'`)
                  .contentWindow.postMessage(
                    { type: "learningprojectxblock", resize: true },
                    "*"
                  );
                onNavigate(...params);
              }}
            />
          ))}
        </div> */}

        {/* Feedback */}
        <Feedback
          isShowFeedback={isShowFeedback}
          shouldDisplayDropdown={shouldDisplayDropdown}
        />
      </div>
      {/* {shouldDisplayDropdown && (
        <SequenceNavigationDropdown
          unitId={unitId}
          onNavigate={onNavigate}
          showCompletion={showCompletion}
          unitIds={unitIds}
        />
      )} */}
    </div>
  );
}

SequenceNavigationTabs.propTypes = {
  unitId: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
