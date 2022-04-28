import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Hyperlink, IconButton, Collapsible } from '@edx/paragon';
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { faCheckCircle as fasCheckCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EffortEstimate from '../../shared/effort-estimate';
import { useModel } from '../../generic/model-store';
import messages from './messages';
// import genericMessages from '../../generic/messages';
import './CollapsibleSequenceLink.scss'

function CollapsibleSequenceLink({
  id,
  intl,
  courseId,
  first,
  sequences,
  expand,
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
  const {
    userTimezone,
  } = useModel('outline', courseId);
  const {
    canLoadCourseware,
  } = useModel('courseHomeMeta', courseId);
  const [open, setOpen] = useState(expand);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  // canLoadCourseware is true if the Courseware MFE is enabled, false otherwise
  let coursewareUrl = (
    canLoadCourseware
      ? <Link to={`/course/${courseId}/${id}`}>{title}</Link>
      : <Hyperlink destination={legacyWebUrl}>{title}</Hyperlink>
  );

  if (canLoadCourseware === undefined) {
    coursewareUrl = (<Link to={`/course/${courseId}/${id}`}>{title}</Link>);
  }

  const displayTitle = showLink ? coursewareUrl : title;

  const sectionTitle = (
    <div className={classNames('', { 'mt-2': !first })}>
    <div className="w-100 m-0">
      <div className="p-0">
        {complete ? (
          <FontAwesomeIcon
            icon={fasCheckCircle}
            fixedWidth
            className="float-left text-success mt-1"
            aria-hidden="true"
            title={intl.formatMessage(messages.completedAssignment)}
          />
        ) : (
          <FontAwesomeIcon
            icon={farCheckCircle}
            fixedWidth
            className="float-left text-gray-400 mt-1"
            aria-hidden="true"
            title={intl.formatMessage(messages.incompleteAssignment)}
          />
        )}
      </div>
      <div className="p-0 ml-3 text-break">
        <span className="align-middle">{displayTitle}</span>
        <span className="sr-only">
          , {intl.formatMessage(complete ? messages.completedAssignment : messages.incompleteAssignment)}
        </span>
        <EffortEstimate className="ml-3 align-middle" block={sequence} />
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
                description: description || '',
              }}
            />
          </small>
        </div>
      )}
    </div>
  );

  return (
    <li className="collapsible-sequence-link-container">
      <Collapsible
        className="mb-2"
        styling="card-lg"
        title={sectionTitle}
        open={open}
        onToggle={() => { setOpen(!open); }}
        // iconWhenClosed={(
        //   <IconButton
        //     alt={intl.formatMessage(messages.openSection)}
        //     icon={faPlus}
        //     onClick={() => { setOpen(true); }}
        //     size="sm"
        //   />
        // )}
        // iconWhenOpen={(
        //   <IconButton
        //     alt={intl.formatMessage(genericMessages.close)}
        //     icon={faMinus}
        //     onClick={() => { setOpen(false); }}
        //     size="sm"
        //   />
        // )}
      >
        <ol className="list-unstyled" style={{paddingLeft: '1.5rem'}}>
          {sequenceIds.map((sequenceId) => {
            const sequence = sequences[sequenceId];

            return (
              <li key={sequenceId}>
                <div className={classNames('', { 'mt-2': !first })}>
                  <div className="row w-100 m-0">
                    <div className="col-auto p-0">
                      {sequence.complete ? (
                        <FontAwesomeIcon
                          icon={fasCheckCircle}
                          fixedWidth
                          className="float-left text-success mt-1"
                          aria-hidden="true"
                          title={intl.formatMessage(messages.completedAssignment)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={farCheckCircle}
                          fixedWidth
                          className="float-left text-gray-400 mt-1"
                          aria-hidden="true"
                          title={intl.formatMessage(messages.incompleteAssignment)}
                        />
                      )}
                    </div>
                    <div className="col-8 p-0 ml-3 text-break">
                      <span className="align-middle">
                        <Link to={`/course/${courseId}/${sequenceId}`}>{sequence.display_name}</Link>
                      </span>
                    </div>
                  </div>
                </div>
            </li>
            )
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
};

export default injectIntl(CollapsibleSequenceLink);
