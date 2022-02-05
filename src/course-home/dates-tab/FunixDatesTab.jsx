import React from 'react';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import Timeline from './timeline/Timeline';

import { useModel } from '../../generic/model-store';

/** [MM-P2P] Experiment */
import { initDatesMMP2P } from '../../experiments/mm-p2p';
import FunixLearningGoalCard from './widgets/FunixLearningGoalCard';

function FunixDatesTab({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    goalHoursPerDay,
    goalWeekdays,
    username,
  } = useModel('dates', courseId);

  /** [MM-P2P] Experiment */
  const mmp2p = initDatesMMP2P(courseId);
  return (
    <>
      <div role="heading" aria-level="1" className="h2 my-3">
        {intl.formatMessage(messages.title, { username })}
      </div>
      <div className="row">
        <div className="col col-12 col-md-7">
          <Timeline mmp2p={mmp2p} />
        </div>
        <div className="col col-12 col-md-5">
          <FunixLearningGoalCard
            goalHoursPerDay={goalHoursPerDay}
            goalWeekdays={goalWeekdays}
          />
        </div>
      </div>
    </>
  );
}

FunixDatesTab.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(FunixDatesTab);
