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
import CollapsibleSequenceLink from "./CollapsibleSequenceLink";

import genericMessages from "../../generic/messages";
import messages from "./messages";

function Section({
  courseId,
  defaultOpen,
  expand,
  intl,
  section,
  useHistory,
  lesson,
  hasCompletedUnit,
}) {
  const { complete, sequenceIds, title } = section;
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

  return (
    <li>
      {sequenceIds.map((sequenceId, index) => (
        <CollapsibleSequenceLink
          lesson={lesson}
          key={sequenceId}
          id={sequenceId}
          courseId={courseId}
          sequences={sequences}
          first={index === 0}
          expand={expand}
          useHistory={useHistory}
          hasCompletedUnit={hasCompletedUnit}
        />
      ))}
    </li>
  );
}

Section.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  section: PropTypes.shape().isRequired,
  useHistory: PropTypes.bool.isRequired,
  lesson: PropTypes.bool,
  hasCompletedUnit: PropTypes.bool,
};

export default injectIntl(Section);
