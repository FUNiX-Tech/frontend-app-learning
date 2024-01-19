import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { Hyperlink, Collapsible } from "@edx/paragon";
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from "@edx/frontend-platform/i18n";
// import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
// import { faCheckCircle as farCheckCircle } from "@fortawesome/free-regular-svg-icons";
// import { FontAwesomeIcon, faMinus } from "@fortawesome/react-fontawesome";
import { history } from "@edx/frontend-platform";
import { KeyboardArrowDown, KeyboardArrowUp } from "@edx/paragon/icons";
// import EffortEstimate from "../../shared/effort-estimate";
import { useModel, useModels } from "../../generic/model-store";
// import { useLocation } from "react-router-dom";

// import messages from "./messages";
// import genericMessages from '../../generic/messages';
import "./CollapsibleSequenceLinkUnit.scss";
// import { subTextSuquence } from "../data/index";

// function handleHistoryClick(e, courseId, sequenceId, unitId) {
//   e.preventDefault();
//   history.push(`/course/${courseId}/${sequenceId}/${unitId}`);
// }

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
  // const unit = useModel("units", id);

  //Set open full text if true

  const { userTimezone } = useModel("outline", courseId);

  const course = useModel("coursewareMeta", courseId);

  //active sequence and unit
  const [activeSequence, setActiveSequence] = useState(false);

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
            / {sequenceIds.length}
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.00007 12.3834C9.06488 12.3834 9.96997 12.0107 10.7153 11.2654C11.4607 10.52 11.8334 9.61493 11.8334 8.55011C11.8334 7.64756 11.555 6.84991 10.9981 6.15718C10.4413 5.46445 9.72485 5.01723 8.8488 4.81551C8.66589 4.79329 8.50648 4.84137 8.37058 4.95975C8.23469 5.07811 8.16675 5.22875 8.16675 5.41166V8.61422L5.90522 10.8758C5.76932 11.0117 5.70906 11.17 5.72445 11.3507C5.73983 11.5315 5.82102 11.6766 5.96803 11.786C6.26461 11.9988 6.58759 12.1516 6.93697 12.2443C7.28634 12.3371 7.64071 12.3834 8.00007 12.3834ZM8.00118 14.8834C7.12523 14.8834 6.30187 14.7172 5.53112 14.3848C4.76035 14.0523 4.08989 13.6012 3.51975 13.0313C2.94959 12.4614 2.49822 11.7912 2.16563 11.0208C1.83304 10.2504 1.66675 9.42719 1.66675 8.55123C1.66675 7.67528 1.83297 6.85192 2.16541 6.08116C2.49786 5.3104 2.94903 4.63994 3.51891 4.0698C4.08882 3.49964 4.75898 3.04827 5.5294 2.71568C6.29981 2.38309 7.12299 2.2168 7.99895 2.2168C8.8749 2.2168 9.69826 2.38302 10.469 2.71546C11.2398 3.04791 11.9102 3.49907 12.4804 4.06896C13.0505 4.63886 13.5019 5.30903 13.8345 6.07945C14.1671 6.84986 14.3334 7.67304 14.3334 8.549C14.3334 9.42495 14.1672 10.2483 13.8347 11.0191C13.5023 11.7898 13.0511 12.4603 12.4812 13.0304C11.9113 13.6006 11.2412 14.052 10.4707 14.3845C9.70032 14.7171 8.87714 14.8834 8.00118 14.8834ZM8.00007 13.8834C9.48895 13.8834 10.7501 13.3668 11.7834 12.3334C12.8167 11.3001 13.3334 10.039 13.3334 8.55011C13.3334 7.06123 12.8167 5.80011 11.7834 4.76678C10.7501 3.73345 9.48895 3.21678 8.00007 3.21678C6.51118 3.21678 5.25007 3.73345 4.21673 4.76678C3.1834 5.80011 2.66673 7.06123 2.66673 8.55011C2.66673 10.039 3.1834 11.3001 4.21673 12.3334C5.25007 13.3668 6.51118 13.8834 8.00007 13.8834Z"
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

export default injectIntl(React.memo(CollapsibleSequenceLinkUnit));
