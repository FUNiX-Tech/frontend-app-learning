import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
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
import messages from "./messages";
// import genericMessages from '../../generic/messages';
import "./CollapsibleSequenceLink.scss";
import { subTextSuquence } from "../data/index";

function handleHistoryClick(e, courseId, sequenceId, unitId) {
  e.preventDefault();
  history.push(`/course/${courseId}/${sequenceId}/${unitId}`);
}

function CollapsibleSequenceLink({
  id,
  intl,
  courseId,
  first,
  sequences,
  expand,
  useHistory,
  lesson,
  hasCompletedUnit,
}) {
  const sequence = sequences[id];
  const {
    complete,
    description,
    due,
    legacyWebUrl,
    showLink,
    title,
    sequenceIds,
  } = sequence;
  const { userTimezone } = useModel("outline", courseId);

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
  const newTitle = title.replace(
    /\b(Questions?|Question)\b/g,
    intl.formatMessage(messages.QuestionSequenceTitle)
  );

  // canLoadCourseware is true if the Courseware MFE is enabled, false otherwise
  let coursewareUrl = canLoadCourseware ? (
    <Link to={`/course/${courseId}/${id}`}>{newTitle}</Link>
  ) : (
    <Hyperlink destination={legacyWebUrl}>{newTitle}</Hyperlink>
  );

  if (canLoadCourseware === undefined) {
    if (useHistory) {
      const firstSequence = sequenceIds[0] || id;
      coursewareUrl = (
        <Link
          to={`/course/${courseId}/${id}/${firstSequence}`}
          onClick={(e) => {
            handleHistoryClick(e, courseId, id, firstSequence);
          }}
        >
          {newTitle}
        </Link>
      );
    } else {
      coursewareUrl = <Link to={`/course/${courseId}/${id}`}>{newTitle}</Link>;
    }
  }

  const displayTitle = showLink ? coursewareUrl : newTitle;

  const sectionTitle = (
    <div>
      <div className=" w-100 m-0">
        <div className="d-flex align-items-center justify-content-between">
          <div className=" p-0 text-break">
            <div className="align-middle d-flex align-items-center subsection-title-item">
              {hasCompletedUnit && (
                <div className="sequence-completed-icon-container">
                  {complete && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="completed-sequence-icon"
                    >
                      <path
                        d="m10.6 13.8-2.15-2.15a.948.948 0 0 0-.7-.275.948.948 0 0 0-.7.275.948.948 0 0 0-.275.7c0 .283.092.517.275.7L9.9 15.9c.2.2.433.3.7.3.267 0 .5-.1.7-.3l5.65-5.65a.948.948 0 0 0 .275-.7.948.948 0 0 0-.275-.7.948.948 0 0 0-.7-.275.948.948 0 0 0-.7.275L10.6 13.8zM12 22a9.738 9.738 0 0 1-3.9-.788 10.099 10.099 0 0 1-3.175-2.137c-.9-.9-1.612-1.958-2.137-3.175A9.738 9.738 0 0 1 2 12c0-1.383.263-2.683.788-3.9a10.099 10.099 0 0 1 2.137-3.175c.9-.9 1.958-1.612 3.175-2.137A9.738 9.738 0 0 1 12 2c1.383 0 2.683.263 3.9.788a10.098 10.098 0 0 1 3.175 2.137c.9.9 1.613 1.958 2.137 3.175A9.738 9.738 0 0 1 22 12a9.738 9.738 0 0 1-.788 3.9 10.098 10.098 0 0 1-2.137 3.175c-.9.9-1.958 1.613-3.175 2.137A9.738 9.738 0 0 1 12 22z"
                        fill="#007AE6"
                      />
                    </svg>
                  )}
                </div>
              )}
              <span className={complete ? "completed" : ""}>
                {displayTitle}
              </span>
            </div>
            <span className="sr-only">
              ,{" "}
              {intl.formatMessage(
                complete
                  ? messages.completedAssignment
                  : messages.incompleteAssignment
              )}
            </span>
            <EffortEstimate className="ml-3 align-middle" block={sequence} />
          </div>

          <button
            className={open ? "toggle-btn is-expand" : "toggle-btn"}
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0008 10.7754L8.10078 14.6754C7.91745 14.8587 7.68411 14.9504 7.40078 14.9504C7.11745 14.9504 6.88411 14.8587 6.70078 14.6754C6.51745 14.4921 6.42578 14.2587 6.42578 13.9754C6.42578 13.6921 6.51745 13.4587 6.70078 13.2754L11.3008 8.67539C11.4008 8.57539 11.5091 8.50456 11.6258 8.46289C11.7424 8.42122 11.8674 8.40039 12.0008 8.40039C12.1341 8.40039 12.2591 8.42122 12.3758 8.46289C12.4924 8.50456 12.6008 8.57539 12.7008 8.67539L17.3008 13.2754C17.4841 13.4587 17.5758 13.6921 17.5758 13.9754C17.5758 14.2587 17.4841 14.4921 17.3008 14.6754C17.1174 14.8587 16.8841 14.9504 16.6008 14.9504C16.3174 14.9504 16.0841 14.8587 15.9008 14.6754L12.0008 10.7754Z"
                fill="#576F8A"
              />
            </svg>
          </button>
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
    <li className="collapsible-sequence-link-container">
      <Collapsible
        className="mb-2 p-0"
        styling="card-lg"
        title={sectionTitle}
        open={open}
        onToggle={() => {}}
      >
        <ol className="list-unstyled p-0 units-container">
          {sequenceIds.map((sequenceId) => {
            const sequenceData = sequences[sequenceId];

            return (
              <li key={sequenceId} className="m-0 unit-item">
                {/* unit item */}
                {hasCompletedUnit && (
                  <div className="sequence-completed-icon-container"></div>
                )}
                <div className="">
                  <span
                    className={
                      sequenceData.resume_block
                        ? "align-middle unit-title is-learning"
                        : sequenceData.complete
                        ? "align-middle unit-title complete"
                        : "align-middle unit-title"
                    }
                  >
                    <Link
                      to={`/course/${courseId}/${sequence.id}/${sequenceId}`}
                    >
                      {sequenceData.display_name}
                    </Link>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </Collapsible>
    </li>
  );
}

CollapsibleSequenceLink.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  sequences: PropTypes.shape().isRequired,
  useHistory: PropTypes.bool.isRequired,
  lesson: PropTypes.bool,
  hasCompletedUnit: PropTypes.bool,
};

export default injectIntl(CollapsibleSequenceLink);
