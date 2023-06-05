import React, { useState } from 'react';

import { Card, Input } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import messages from '../messages';
import { saveGoal } from '../../data';

import './FunixLearningGoalCard.scss';

const DATE_TEXT = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

function FunixLearningGoalCard({
  goalHoursPerDay,
  goalWeekdays,
  intl,
}) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const [weekDays, setWeekDays] = useState(goalWeekdays);
  const [hoursPerDay, setHoursPerDay] = useState(goalHoursPerDay);
  const MySwal = withReactContent(Swal);

  const handleSelect = (index) => {
    const newArray = [...weekDays];
    newArray[index] = !newArray[index];

    setWeekDays(newArray);
  };

  const handleInput = (event) => {
    const value = parseFloat(event.currentTarget.value);
    setHoursPerDay(value);
  };

  const handleSubmit = async () => {
    if (weekDays.every(el => !el)) {
      MySwal.fire({
        title: <strong>False!</strong>,
        html: <i>Select weekdays!</i>,
        icon: 'error',
      });

      return;
    }

    if (hoursPerDay <= 0 || hoursPerDay > 24) {
      MySwal.fire({
        title: <strong>False!</strong>,
        html: <i>Select study hours each day in range 1 to 24!</i>,
        icon: 'error',
      });

      return;
    }

    await saveGoal(courseId, hoursPerDay, weekDays);
    global.location.reload();
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
          {/* {intl.formatMessage(messages.setHourDailyDetail)} */}
        </Card.Text>
        {/* <Input
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
        </button>*/}
      </Card.Body> 
    </Card>
  );
}

FunixLearningGoalCard.propTypes = {
  intl: intlShape.isRequired,
  goalHoursPerDay: PropTypes.number,
  goalWeekdays: PropTypes.arrayOf(PropTypes.bool),
};

FunixLearningGoalCard.defaultProps = {
  goalHoursPerDay: 2.5,
  goalWeekdays: [true, true, true, true, true, false, false],
};
export default injectIntl(FunixLearningGoalCard)