import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link, NavLink } from "react-router-dom";
import { Hyperlink, Collapsible, Icon } from "@edx/paragon";
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from "@edx/frontend-platform/i18n";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle as farCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon, faMinus } from "@fortawesome/react-fontawesome";
import { history } from "@edx/frontend-platform";
import { IconButton } from "@edx/paragon";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckBoxOutlineBlank,
  CheckBoxIcon,
} from "@edx/paragon/icons";
import EffortEstimate from "../../shared/effort-estimate";
import { useModel, useModels } from "../../generic/model-store";
import { useLocation } from "react-router-dom";

import messages from "./messages";
// import genericMessages from '../../generic/messages';
import "./CollapsibleSequenceLinkUnit.scss";
import { subTextSuquence } from "../data/index";

function handleHistoryClick(e, courseId, sequenceId, unitId) {
  e.preventDefault();
  history.push(`/course/${courseId}/${sequenceId}/${unitId}`);
}

function CollapsibleSequenceLinkUnit({
  id,
  intl,
  courseId,
  first,
  sequences,
  expand,
  useHistory,
  lesson,
  unitId,
  // hasOneComplete,
  // complete,
}) {
  const sequence = sequences[id];

  // let newSequence;
  // if (Object.keys(newSequences).length > 0) {
  //   newSequence = newSequences[id];
  // }
  // const newSequence = newSequences[id];
  const { description, due, legacyWebUrl, showLink, title, sequenceIds } =
    sequence;
  const unit = useModel("units", id);

  //Set open full text if true

  const { userTimezone } = useModel("outline", courseId);

  const course = useModel("coursewareMeta", courseId);

  //active sequence and unit
  const [activeSequence, setActiveSequence] = useState(false);

  console.log(sequence);

  const { canLoadCourseware } = useModel("courseHomeMeta", courseId);
  const [open, setOpen] = useState(expand);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  const [subText, setSubText] = useState("");
  // useEffect(async () => {
  //   try {
  //     const { sub_text } = await subTextSuquence(id);
  //     if (sub_text.length > 0) {
  //       setSubText(sub_text);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [id]);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};
  // const newTitle = title.replace(
  //   /\b(Questions?|Question)\b/g,
  //   intl.formatMessage(messages.QuestionSequenceTitle)
  // );
  const newTitle = title.replace(/\([^)]*\)/, "");

  // canLoadCourseware is true if the Courseware MFE is enabled, false otherwise
  let coursewareUrl = canLoadCourseware ? (
    <a
      // className={`${
      //   newSequence.complete || complete
      //     ? "complete"
      //     : `${hasOneComplete && "add-padding-left-16"}`
      // }`}
      // isActive={(match, location) => {
      //   if (match) {
      //     setActiveSequence(true);
      //     return true;
      //   } else {
      //     setActiveSequence(false);
      //     return false;
      //   }
      // }}
      // activeClassName="active"
      // to={`/course/${courseId}/${id}`}
      onClick={(e) => {
        e.preventDefault();
      }}
      href="#"
    >
      {newTitle}
    </a>
  ) : (
    <Hyperlink destination={legacyWebUrl}>{newTitle}</Hyperlink>
  );

  if (canLoadCourseware === undefined) {
    if (useHistory) {
      const firstSequence = sequenceIds[0] || id;
      coursewareUrl = (
        <a
          // className={`${
          //   newSequence?.complete || complete
          //     ? "complete"
          //     : `${hasOneComplete && "add-padding-left-16"}`
          // }`}
          // isActive={(match, location) => {
          //   if (match) {
          //     setActiveSequence(true);
          //     return true;
          //   } else {
          //     setActiveSequence(false);
          //     return false;
          //   }
          // }}
          // activeClassName="active"
          // // to={`/course/${courseId}/${id}/${firstSequence}`}
          // to={`/course/${courseId}/${id}`}
          // onClick={(e) => {
          //   handleHistoryClick(e, courseId, id, firstSequence);
          // }}
          onClick={(e) => {
            e.preventDefault();
          }}
          href="#"
        >
          {newTitle}
        </a>
      );
    } else {
      coursewareUrl = (
        <a
          // className={`${
          //   newSequence?.complete || complete
          //     ? "complete"
          //     : `${hasOneComplete && "add-padding-left-16"}`
          // }`}
          // isActive={(match, location) => {
          //   if (match) {
          //     setActiveSequence(true);
          //     return true;
          //   } else {
          //     setActiveSequence(false);
          //     return false;
          //   }
          // }}
          // activeClassName="active"
          // to={`/course/${courseId}/${id}`}
          onClick={(e) => {
            e.preventDefault();
          }}
          href="#"
        >
          {newTitle}
        </a>
      );
    }
  }

  const displayTitle = showLink ? coursewareUrl : newTitle;
  // console.log(id)
  const sectionTitle = (
    <div className={classNames("w-100", { "": !first })}>
      <div className="w-100 m-0">
        {!open ? (
          <KeyboardArrowDown className="icon-toggle" />
        ) : (
          <KeyboardArrowUp className="icon-toggle" />
        )}
        <div className="text-break">
          <span className="d-flex align-items-flex-start align-middle">
            <React.Fragment>
              {/* {newSequence?.complete || complete ? (
                // <FontAwesomeIcon
                //   icon={fasCheckCircle}

                //   className="float-left text-success mt-1"
                //   aria-hidden="true"
                //   title={intl.formatMessage(messages.completedAssignment)}
                // />
                <svg
                  // title={intl.formatMessage(messages.completedAssignment)}
                  xmlns="http://www.w3.org/2000/svg"
                  className="success-icon"
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                >
                  <path
                    d="M5.3 7.4L4.225 6.325C4.13333 6.23333 4.01667 6.1875 3.875 6.1875C3.73333 6.1875 3.61667 6.23333 3.525 6.325C3.43333 6.41667 3.3875 6.53333 3.3875 6.675C3.3875 6.81667 3.43333 6.93333 3.525 7.025L4.95 8.45C5.05 8.55 5.16667 8.6 5.3 8.6C5.43333 8.6 5.55 8.55 5.65 8.45L8.475 5.625C8.56667 5.53333 8.6125 5.41667 8.6125 5.275C8.6125 5.13333 8.56667 5.01667 8.475 4.925C8.38333 4.83333 8.26667 4.7875 8.125 4.7875C7.98333 4.7875 7.86667 4.83333 7.775 4.925L5.3 7.4ZM6 11.5C5.30833 11.5 4.65833 11.3688 4.05 11.1062C3.44167 10.8438 2.9125 10.4875 2.4625 10.0375C2.0125 9.5875 1.65625 9.05833 1.39375 8.45C1.13125 7.84167 1 7.19167 1 6.5C1 5.80833 1.13125 5.15833 1.39375 4.55C1.65625 3.94167 2.0125 3.4125 2.4625 2.9625C2.9125 2.5125 3.44167 2.15625 4.05 1.89375C4.65833 1.63125 5.30833 1.5 6 1.5C6.69167 1.5 7.34167 1.63125 7.95 1.89375C8.55833 2.15625 9.0875 2.5125 9.5375 2.9625C9.9875 3.4125 10.3438 3.94167 10.6062 4.55C10.8688 5.15833 11 5.80833 11 6.5C11 7.19167 10.8688 7.84167 10.6062 8.45C10.3438 9.05833 9.9875 9.5875 9.5375 10.0375C9.0875 10.4875 8.55833 10.8438 7.95 11.1062C7.34167 11.3688 6.69167 11.5 6 11.5Z"
                    fill="#0086FF"
                  />
                </svg>
              ) : (
                ""
              )} */}
            </React.Fragment>
            {displayTitle}
          </span>
          <p className="sequence-effort-time">
            {
              sequenceIds.filter((sequenceId) => {
                const unit = useModel("units", sequenceId);
                const unitOther = sequences[sequenceId];
                return unit?.complete || unitOther?.complete;
              }).length
            }{" "}
            / {sequenceIds.length} |{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M7.99968 1.88477C6.68113 1.88477 5.3922 2.27576 4.29588 3.0083C3.19955 3.74084 2.34506 4.78203 1.84048 6.00021C1.3359 7.21838 1.20387 8.55883 1.46111 9.85203C1.71834 11.1452 2.35328 12.3331 3.28563 13.2655C4.21798 14.1978 5.40587 14.8328 6.69907 15.09C7.99228 15.3472 9.33272 15.2152 10.5509 14.7106C11.7691 14.206 12.8103 13.3516 13.5428 12.2552C14.2753 11.1589 14.6663 9.86997 14.6663 8.55143C14.6644 6.78392 13.9614 5.08937 12.7116 3.83955C11.4617 2.58973 9.76718 1.88673 7.99968 1.88477ZM7.99968 13.7366C6.97414 13.7366 5.97164 13.4325 5.11894 12.8628C4.26624 12.293 3.60164 11.4832 3.20919 10.5357C2.81674 9.58825 2.71405 8.54568 2.91412 7.53985C3.1142 6.53402 3.60804 5.61011 4.3332 4.88495C5.05836 4.15979 5.98227 3.66595 6.9881 3.46588C7.99392 3.26581 9.03649 3.36849 9.98396 3.76095C10.9314 4.1534 11.7412 4.818 12.311 5.6707C12.8808 6.5234 13.1849 7.5259 13.1849 8.55143C13.1834 9.92618 12.6366 11.2442 11.6645 12.2163C10.6924 13.1884 9.37442 13.7351 7.99968 13.7366ZM12.1972 8.55143C12.1972 8.74789 12.1192 8.9363 11.9802 9.07521C11.8413 9.21413 11.6529 9.29217 11.4565 9.29217H7.99968C7.80322 9.29217 7.61481 9.21413 7.47589 9.07521C7.33698 8.9363 7.25894 8.74789 7.25894 8.55143V5.09464C7.25894 4.89819 7.33698 4.70977 7.47589 4.57086C7.61481 4.43194 7.80322 4.3539 7.99968 4.3539C8.19613 4.3539 8.38454 4.43194 8.52346 4.57086C8.66237 4.70977 8.74042 4.89819 8.74042 5.09464V7.81069H11.4565C11.6529 7.81069 11.8413 7.88873 11.9802 8.02765C12.1192 8.16656 12.1972 8.35497 12.1972 8.55143Z"
                fill="#2C3744"
              />
            </svg>
            {sequence?.effortTime ? sequence?.effortTime / 60 : 0} phút
          </p>
          {/* <span className="sr-only">
            ,{" "}
            {intl.formatMessage(
              complete
                ? messages.completedAssignment
                : messages.incompleteAssignment
            )}
          </span> */}

          {/* <EffortEstimate className="ml-3 align-middle" block={sequence} /> */}
        </div>
      </div>
      {due && (
        <div className="row w-100 m-0 ml-3 pl-3">
          <small className="text-body pl-2">
            <FormattedMessage
              id="learning.outline.sequence-due"
              defaultMessage="{description} due {assignmentDue}"
              description="Used below an assignment title"
              values={{
                assignmentDue: (
                  <FormattedTime
                    key={`${id}-due`}
                    day="numeric"
                    month="short"
                    year="numeric"
                    timeZoneName="short"
                    value={due}
                    {...timezoneFormatArgs}
                  />
                ),
                description: description || "",
              }}
            />
          </small>
        </div>
      )}
      {!lesson && (
        <div className="pl-2 ml-4">
          <span class="align-middle">{subText}</span>
        </div>
      )}
    </div>
  );

  return (
    <li
      className={`collapsible-sequence-link-container-unit ${
        activeSequence && "active"
      }`}
    >
      <Collapsible
        className={`border-0 collapsible-tab ${open && "active"}`}
        title={sectionTitle}
        open={open}
        onToggle={() => {
          setOpen(!open);
        }}

        // iconWhenClosed={
        //   <IconButton
        //     // alt={intl.formatMessage(messages.openSection)}
        //     icon={KeyboardArrowDown}
        //     onClick={() => {
        //       setOpen(true);
        //     }}
        //     size="sm"
        //   />
        // }
        // iconWhenOpen={
        //   <IconButton
        //     // alt={intl.formatMessage(genericMessages.close)}
        //     icon={faMinus}
        //     onClick={() => {
        //       setOpen(false);
        //     }}
        //     size="sm"
        //   />
        // }
      >
        <ol className="list-unstyled border-bottom">
          {sequenceIds.map((sequenceId, index) => {
            const sequenceData = sequences[sequenceId];
            const unit = useModel("units", sequenceId);
            return (
              <li key={sequenceId}>
                {/* <div className={classNames("", { "mt-2": !first })}> */}

                <div>
                  {/* <div className="col-auto p-0">
                      {sequenceData.complete ? (
                        <FontAwesomeIcon
                          icon={fasCheckCircle}
                          fixedWidth
                          className="float-left text-success mt-1"
                          aria-hidden="true"
                          title={intl.formatMessage(
                            messages.completedAssignment
                          )}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={farCheckCircle}
                          fixedWidth
                          className="float-left text-gray-400 mt-1"
                          aria-hidden="true"
                          title={intl.formatMessage(
                            messages.incompleteAssignment
                          )}
                        />
                      )}
                    </div> */}
                  <div
                    className={`col d-flex  align-items-center text-break unit-link-wrapper p-0 ${
                      location.pathname.includes(sequenceId) && "active"
                    }`}
                  >
                    <NavLink
                      className={`${
                        (unit && unit.complete) || sequenceData.complete
                          ? "unit-link complete-unit"
                          : "unit-link"
                      }`}
                      to={`/course/${courseId}/${sequence.id}/${sequenceId}`}
                      activeClassName={"active"}
                    >
                      {(unit && unit.complete) || sequenceData.complete ? (
                        <svg
                          onClick={(e) => e.preventDefault()}
                          className="check-icon complete"
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_4588_65155)">
                            <rect
                              x="2"
                              y="2.55078"
                              width="12"
                              height="11"
                              fill="white"
                            />
                            <path
                              d="M6.75556 9.79523L4.84444 7.88411C4.68148 7.72115 4.47407 7.63967 4.22222 7.63967C3.97037 7.63967 3.76296 7.72115 3.6 7.88411C3.43704 8.04708 3.35556 8.25448 3.35556 8.50634C3.35556 8.75819 3.43704 8.9656 3.6 9.12856L6.13333 11.6619C6.31111 11.8397 6.51852 11.9286 6.75556 11.9286C6.99259 11.9286 7.2 11.8397 7.37778 11.6619L12.4 6.63967C12.563 6.47671 12.6444 6.2693 12.6444 6.01745C12.6444 5.7656 12.563 5.55819 12.4 5.39523C12.237 5.23226 12.0296 5.15078 11.7778 5.15078C11.5259 5.15078 11.3185 5.23226 11.1556 5.39523L6.75556 9.79523ZM1.77778 16.5508C1.28889 16.5508 0.87037 16.3767 0.522222 16.0286C0.174074 15.6804 0 15.2619 0 14.773V2.32856C0 1.83967 0.174074 1.42115 0.522222 1.073C0.87037 0.724855 1.28889 0.550781 1.77778 0.550781H14.2222C14.7111 0.550781 15.1296 0.724855 15.4778 1.073C15.8259 1.42115 16 1.83967 16 2.32856V14.773C16 15.2619 15.8259 15.6804 15.4778 16.0286C15.1296 16.3767 14.7111 16.5508 14.2222 16.5508H1.77778Z"
                              fill="#5AA447"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_4588_65155">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0 0.550781)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      ) : (
                        <svg
                          onClick={(e) => e.preventDefault()}
                          className="check-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_4646_25367)">
                            <rect
                              x="1"
                              y="1.55078"
                              width="14"
                              height="14"
                              fill="white"
                            />
                            <path
                              d="M1.77778 16.5508C1.28889 16.5508 0.87037 16.3767 0.522222 16.0286C0.174074 15.6804 0 15.2619 0 14.773V2.32856C0 1.83967 0.174074 1.42115 0.522222 1.073C0.87037 0.724855 1.28889 0.550781 1.77778 0.550781H14.2222C14.7111 0.550781 15.1296 0.724855 15.4778 1.073C15.8259 1.42115 16 1.83967 16 2.32856V14.773C16 15.2619 15.8259 15.6804 15.4778 16.0286C15.1296 16.3767 14.7111 16.5508 14.2222 16.5508H1.77778ZM1.5 15.0508H14.5V2.05078H1.5V15.0508Z"
                              fill="#2C3744"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_4646_25367">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0 0.550781)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      )}
                      {sequenceData.display_name}
                    </NavLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Collapsible>
    </li>
  );
}

CollapsibleSequenceLinkUnit.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  sequences: PropTypes.shape().isRequired,
  useHistory: PropTypes.bool.isRequired,
  lesson: PropTypes.bool,
};

export default injectIntl(CollapsibleSequenceLinkUnit);
