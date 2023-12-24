import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link, NavLink } from "react-router-dom";
import { Hyperlink, Collapsible } from "@edx/paragon";
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from "@edx/frontend-platform/i18n";
import { faCheckCircle as fasCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle as farCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { history } from "@edx/frontend-platform";
import EffortEstimate from "../../shared/effort-estimate";
import { useModel } from "../../generic/model-store";
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
  hasOneComplete,
  complete,
}) {
  const sequence = sequences[id];
  const { description, due, legacyWebUrl, showLink, title, sequenceIds } =
    sequence;

  //location
  const location = useLocation();

  //Set open full text if true

  const { userTimezone } = useModel("outline", courseId);

  const course = useModel("coursewareMeta", courseId);

  const { canLoadCourseware } = useModel("courseHomeMeta", courseId);
  const [open, setOpen] = useState(expand);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  const [subText, setSubText] = useState("");
  useEffect(async () => {
    try {
      const { sub_text } = await subTextSuquence(id);
      if (sub_text.length > 0) {
        setSubText(sub_text);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};
  // const newTitle = title.replace(
  //   /\b(Questions?|Question)\b/g,
  //   intl.formatMessage(messages.QuestionSequenceTitle)
  // );
  const newTitle = title.replace(/\([^)]*\)/, "");

  // canLoadCourseware is true if the Courseware MFE is enabled, false otherwise
  let coursewareUrl = canLoadCourseware ? (
    <NavLink
      className={`${
        complete ? "complete" : `${hasOneComplete && "add-padding-left-16"}`
      }`}
      activeClassName="active"
      to={`/course/${courseId}/${id}`}
    >
      {newTitle}
    </NavLink>
  ) : (
    <Hyperlink destination={legacyWebUrl}>{newTitle}</Hyperlink>
  );

  if (canLoadCourseware === undefined) {
    if (useHistory) {
      const firstSequence = sequenceIds[0] || id;
      coursewareUrl = (
        <NavLink
          className={`${
            complete ? "complete" : `${hasOneComplete && "add-padding-left-16"}`
          }`}
          activeClassName="active"
          // to={`/course/${courseId}/${id}/${firstSequence}`}
          to={`/course/${courseId}/${id}`}
          onClick={(e) => {
            handleHistoryClick(e, courseId, id, firstSequence);
          }}
        >
          {newTitle}
        </NavLink>
      );
    } else {
      coursewareUrl = (
        <NavLink
          className={`${
            complete ? "complete" : `${hasOneComplete && "add-padding-left-16"}`
          }`}
          activeClassName="active"
          to={`/course/${courseId}/${id}`}
        >
          {newTitle}
        </NavLink>
      );
    }
  }

  const displayTitle = showLink ? coursewareUrl : newTitle;
  // console.log(id)
  const sectionTitle = (
    <div
      className={classNames("w-100", { "": !first })}
      style={{ backgroundColor: "#FAFBFB" }}
    >
      <div className="position-relative w-100 m-0">
        <div className="text-break">
          <span className="d-flex align-items-flex-start align-middle">
            <React.Fragment>
              {complete ? (
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
              )}
            </React.Fragment>
            {displayTitle}
          </span>
          {/* <span className="sr-only">
            , {intl.formatMessage(complete ? messages.completedAssignment : messages.incompleteAssignment)}
          </span>
          <EffortEstimate className="ml-3 align-middle" block={sequence} /> */}
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
    <li className="collapsible-sequence-link-container-unit">
      <Collapsible
        className="border-0 collapsible-tab"
        title={sectionTitle}
        open={open}
        onToggle={() => {
          setOpen(!open);
        }}
        // onToggle={() => {
        //   setOpen(false);
        // }}
        // iconWhenClosed={
        //   <IconButton
        //     alt={intl.formatMessage(messages.openSection)}
        //     icon={faPlus}
        //     onClick={() => {
        //       setOpen(true);
        //     }}
        //     size="sm"
        //   />
        // }
        // iconWhenOpen={
        //   <IconButton
        //     alt={intl.formatMessage(genericMessages.close)}
        //     icon={faMinus}
        //     onClick={() => {
        //       setOpen(false);
        //     }}
        //     size="sm"
        //   />
        // }
      >
        <ol
          className={`${
            complete || hasOneComplete
              ? "list-unstyled add-padding-left-16"
              : "list-unstyled"
          }`}
        >
          {sequenceIds.map((sequenceId) => {
            const sequenceData = sequences[sequenceId];

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
                  <div className="col  text-break">
                    <NavLink
                      className={`${
                        sequenceData.complete
                          ? "unit-link complete-unit"
                          : "unit-link"
                      }`}
                      to={`/course/${courseId}/${sequence.id}/${sequenceId}`}
                      activeClassName={"active"}
                    >
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
