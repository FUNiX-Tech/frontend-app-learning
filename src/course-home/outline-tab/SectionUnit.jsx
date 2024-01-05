import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { Collapsible, IconButton } from "@edx/paragon";
import {
  faCheckCircle as fasCheckCircle,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle as farCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import SequenceLink from './SequenceLink';
import { useModel } from "../../generic/model-store";
import CollapsibleSequenceLinkUnit from "./CollapsibleSequenceLinkUnit";

import genericMessages from "../../generic/messages";
import messages from "./messages";
import "./SectionUnit.scss";
function SectionUnit({
  courseId,
  defaultOpen,
  expand,
  intl,
  section,
  useHistory,
  lesson,
  unitId,
  allSequenceIds,
}) {
  const { complete, sequenceIds, title } = section;
  //check has one sequence complete
  const [hasOneSequenceComplete, setHasOneSequenceComplete] = useState(false);

  const {
    courseBlocks: { sequences },
  } = useModel("outline", courseId);
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, []);

  // const sectionTitle = (
  //   <div className=" w-100 m-0">
  {
    /* <div className=" p-0">
        {complete ? (
          <FontAwesomeIcon
            icon={fasCheckCircle}
            fixedWidth
            className="float-left mt-1 text-success"
            aria-hidden="true"
            title={intl.formatMessage(messages.completedSection)}
          />
        ) : (
          <FontAwesomeIcon
            icon={farCheckCircle}
            fixedWidth
            className="float-left mt-1 text-gray-400"
            aria-hidden="true"
            title={intl.formatMessage(messages.incompleteSection)}
          />
        )}
      </div> */
  }
  {
    /* <div className=" ml-3 p-0 font-weight-bold text-dark-500">
        <span className="align-middle">{title}</span>
            <span className="sr-only">
        {intl.formatMessage(complete ? messages.completedSection : messages.incompleteSection)}
        </span>
      </div> */
  }
  //   </div>
  // );
  useEffect(() => {
    sequenceIds.map((sequenceId, index) => {
      const sequence = sequences[sequenceId];
      const { complete } = sequence;
      if (complete) {
        setHasOneSequenceComplete(true);
      }
    });
  }, []);

  return (
    <li className="bg-light">
      {/* <Collapsible 
     
        className={`mb-2 ${lesson ? 'lesson' : 'home'}`}
        // styling="card-lg"
        // title={sectionTitle}
        // open={open}
        // onToggle={() => { setOpen(!open); }}
        open={true}
        onToggle={() => { setOpen(false); }}
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
     </Collapsible> 
      */}

      <ol className="list-unstyled bg-list-unstyled">
        {allSequenceIds.map((sequenceId, index) => {
          const sequence = sequences[sequenceId];
          const { complete } = sequence;
          return (
            <CollapsibleSequenceLinkUnit
              lesson={lesson}
              key={sequenceId}
              id={sequenceId}
              courseId={courseId}
              sequences={sequences}
              first={index === 0}
              expand={expand}
              useHistory={useHistory}
              unitId={unitId}
              hasOneComplete={hasOneSequenceComplete}
              complete={complete}
            />
          );
        })}
      </ol>
    </li>
  );
}

SectionUnit.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  section: PropTypes.shape().isRequired,
  useHistory: PropTypes.bool.isRequired,
  lesson: PropTypes.bool,
};

export default injectIntl(SectionUnit);
