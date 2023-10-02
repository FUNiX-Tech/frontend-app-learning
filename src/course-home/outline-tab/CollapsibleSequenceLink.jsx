import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Hyperlink, Collapsible } from '@edx/paragon';
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { history } from '@edx/frontend-platform';
import EffortEstimate from '../../shared/effort-estimate';
import { useModel } from '../../generic/model-store';
import messages from './messages';
// import genericMessages from '../../generic/messages';
import './CollapsibleSequenceLink.scss';
import {subTextSuquence} from '../data/index'

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
  lesson
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

  const [subText , setSubText] = useState('')
  useEffect(async ()=>{
    try {
    const {sub_text} = await subTextSuquence(id)
      if (sub_text.length > 0) {
        setSubText(sub_text)
      }
    } catch (error) {
      console.log(error)
    }
  },[id])

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};
  const newTitle = title.replace(/\b(Questions?|Question)\b/g, intl.formatMessage(messages.QuestionSequenceTitle));
  // canLoadCourseware is true if the Courseware MFE is enabled, false otherwise
  let coursewareUrl = (
    canLoadCourseware
      ? <Link to={`/course/${courseId}/${id}`}>{newTitle}</Link>
      : <Hyperlink destination={legacyWebUrl}>{newTitle}</Hyperlink>
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
      coursewareUrl = (<Link to={`/course/${courseId}/${id}`}>{newTitle}</Link>);
    }
  }

  const displayTitle = showLink ? coursewareUrl : newTitle;
  // console.log(id)
  const sectionTitle = (
    <div className={classNames('', { 'mt-2': !first })}>
    <div className=" w-100 m-0">
      <div className=" p-0">
     
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
      <div className=" p-0 ml-3 text-break">
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
         {!lesson && <div className='pl-2 ml-4'>
          <span class="align-middle">{subText}</span>
          </div>}
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


       <ol className="list-unstyled" style={{ paddingLeft: '1rem' }}>
          {sequenceIds.map((sequenceId) => {
             const sequenceData = sequences[sequenceId];
        
            return (
              <li key={sequenceId}>
	     
                <div className={classNames('', { 'mt-2': !first })}>
                  <div className="row w-100 m-0">
                    <div className="col-auto p-0">
                      {sequenceData.complete ? (
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
                    <div className="col p-0 ml-3 text-break">
                      <span className="align-middle">
                      <Link to={`/course/${courseId}/${sequenceId}`}>{sequenceData.display_name}</Link>
                      </span>
                    </div>
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

CollapsibleSequenceLink.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  sequences: PropTypes.shape().isRequired,
  useHistory: PropTypes.bool.isRequired,
  lesson : PropTypes.bool
};

export default injectIntl(CollapsibleSequenceLink);
