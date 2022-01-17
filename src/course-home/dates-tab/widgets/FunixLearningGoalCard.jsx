import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Form, Card, Icon } from '@edx/paragon';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Email } from '@edx/paragon/icons';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
// import WeekdayPicker from 'react-weekday-picker';
import messages from '../messages';
import LearningGoalButton from '../../outline-tab/widgets/LearningGoalButton';
import { saveWeeklyLearningGoal } from '../../data';
import { useModel } from '../../../generic/model-store';
import '../../outline-tab/widgets/FlagButton.scss';

const DATE_TEXT = [
  'Sun.',
  'Mon.',
  'Tue.',
  'Wed.',
  'Thu.',
  'Fri.',
  'Sat.',
];

function FunixLearningGoalCard({
  intl,
}) {
  return (
    <Card
      id="courseHome-weeklyLearningGoal"
      className="row w-100 m-0 mb-3 shadow-sm border-0"
      data-testid="weekly-learning-goal-card"
    >
      <Card.Body className="p-3 p-lg-3.5">
        <h2 id="set-weekly-goal-h2" className="h4 mb-1 text-primary-500">{intl.formatMessage(messages.setWeeklyGoal)}</h2>
        <Card.Text
          className="text-gray-700 small mb-2.5"
        >
          {intl.formatMessage(messages.setWeeklyGoalDetail)}
        </Card.Text>
        <div
          role="radiogroup"
          aria-labelledby="set-weekly-goal-h2"
          className="flag-button-container m-0 p-0"
        >
          {DATE_TEXT.map((title, index) => {
            return (
              <button
                type="button"
                className={classnames('flag-button row w-100 align-content-between m-1.5')}
                role="radio"
              >
                <div className={classnames('row w-100 m-0 justify-content-center small text-gray-700 pb-1 pt-1')}>
                  {title}
                </div>
              </button>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}

FunixLearningGoalCard.propTypes = {
  intl: intlShape.isRequired,
};

FunixLearningGoalCard.defaultProps = {
};
export default injectIntl(FunixLearningGoalCard);
