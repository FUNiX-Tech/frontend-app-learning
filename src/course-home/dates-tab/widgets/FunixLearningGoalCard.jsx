import React, { useState } from 'react';

import { Card, Input } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classnames from 'classnames';
// import WeekdayPicker from 'react-weekday-picker';
import messages from '../messages';
// import '../../outline-tab/widgets/FlagButton.scss';

import './FunixLearningGoalCard.scss';

const DATE_TEXT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

function FunixLearningGoalCard({
  intl,
}) {
  const [weekDays, setWeekDays] = useState([true, true, true, true, true, false, false]);
  const [hoursPerDay, setHoursPerDay] = useState(2.5);

  const handleSelect = (index) => {
    const newArray = [...weekDays];
    newArray[index] = !newArray[index];

    setWeekDays(newArray);
  };

  const handleInput = (event) => {
    const value = parseFloat(event.currentTarget.value);
    setHoursPerDay(value);
  };

  const handleSubmit = () => {
    console.log(hoursPerDay, weekDays);
  };

  return (
    <Card
      id="courseHome-weeklyLearningGoal"
      className="row w-100 m-0 mb-3 shadow-sm border-0"
      data-testid="weekly-learning-goal-card"
    >
      <Card.Body className="p-3 p-lg-3.5">
        <h2 className="h4 mb-1 text-primary-500">{intl.formatMessage(messages.setHourDailyText)}</h2>
        <Card.Text
          className="text-gray-700 small mb-2.5"
        >
          {intl.formatMessage(messages.setHourDailyDetail)}
        </Card.Text>
        <Input
          min="1"
          max="24"
          step={0.5}
          type="number"
          value={hoursPerDay}
          onInput={(event) => { handleInput(event); }}
        />
        <br />
        <h2 className="h4 mb-1 text-primary-500">{intl.formatMessage(messages.setWeekdayText)}</h2>
        <Card.Text
          className="text-gray-700 small mb-2.5"
        >
          {intl.formatMessage(messages.setWeekdayDetail)}
        </Card.Text>
        <div
          role="radiogroup"
          aria-labelledby="set-weekly-goal-h2"
          className="flag-button-container m-0 p-0"
        >
          {DATE_TEXT.map((title, index) => {
            const isSelected = weekDays[index];
            return (
              <button
                type="button"
                className={classnames('flag-button row w-100 align-content-between m-1.5', isSelected ? 'funix-flag-button-selected' : '')}
                onClick={() => handleSelect(index)}
              >
                <div className={classnames('row w-100 m-0 justify-content-center small text-gray-700 pb-1 pt-1', isSelected ? 'font-weight-bold' : '')}>
                  {title}
                </div>
              </button>
            );
          })}
        </div>
        <button
          className="btn btn-primary mb-1 mt-3"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
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
