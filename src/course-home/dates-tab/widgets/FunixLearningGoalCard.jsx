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
import { useModel } from '../../../generic/model-store';
import './FunixLearningGoalCard.scss';


function FunixLearningGoalCard({
  goalHoursPerDay,
  goalWeekdays,
  enrollCourseDate,
  intl,
}) {
  const {
    courseId,
    targetUserId,
  } = useSelector(state => state.courseHome);

  const {
    courseDateBlocks,
  } = useModel('dates', courseId);

  const filterCourseBlock = courseDateBlocks.filter(courseBlock=>courseBlock.title!=='Enrollment Date')
  filterCourseBlock.sort((a,b)=>{
    const titleA = a.title;
    const titleB = b.title;
  
    if (titleA.startsWith("Assignment")) {
      return 1; 
    }
  
    if (titleB.startsWith("Assignment")) {
      return -1; 
    }
  
    const numberA = parseInt(titleA.split(" ")[1]);
    const numberB = parseInt(titleB.split(" ")[1]);
  
    return numberA - numberB;
  })

  const [weekDays, setWeekDays] = useState(goalWeekdays);
  const [hoursPerDay, setHoursPerDay] = useState(goalHoursPerDay);
  const [selectedDate, setSelectedDate] = useState(enrollCourseDate);
  const [selectBlockId, SetSelectBlockId] = useState(filterCourseBlock[0]?.link?.split('/')[6]||'')
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const MySwal = withReactContent(Swal);

  const DATE_TEXT = [
    intl.formatMessage(messages.mon),
    intl.formatMessage(messages.tue),
    intl.formatMessage(messages.wed),
    intl.formatMessage(messages.thu),
    intl.formatMessage(messages.fri),
    intl.formatMessage(messages.sat),
    intl.formatMessage(messages.sun),
  ];

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



    await saveGoal(courseId, hoursPerDay, weekDays, targetUserId,selectedDate , selectBlockId);
    global.location.reload();
  };


  return (
    <Card
      id="courseHome-weeklyLearningGoal"
      className="row w-100 p-2 m-0 mb-3 border border-dark "
      data-testid="weekly-learning-goal-card"
    >

      <Card.Body className=" p-3 p-lg-3.5">
        <div className='row ' style={{gap:'30px'}}>
         <div className='col-2.5 form-date '>
            <h2 className="h4 mb-1 text-primary-500">{intl.formatMessage(messages.setHourDailyText)}</h2>
            <div className="text-gray-700 small mb-2.5">
              {intl.formatMessage(messages.setHourDailyDetail)}
            </div>
            <Input
              className='input-time'
              min="1"
              max="24"
              step={0.5}
              type="number"
              value={hoursPerDay}
              onInput={(event) => { handleInput(event); }}
            />
         </div>
         <div className='col-2.5 form-date' >
         <h2 className="h4 mb-2.5 text-primary-500 ">Nhập ngày bắt đầu học</h2>
            <Input type="date"
            value={selectedDate}
            onChange={handleDateChange} />
          
         </div>
      <div className='col form-date'>
        <h2 className="h4 mb-2.5 text-primary-500 ">Chọn bài bắt đầu học</h2>
          <div>
            <select className="form-control w-100" value={selectBlockId} onChange={(e)=>SetSelectBlockId(e.target.value)}>
              {filterCourseBlock.map(courseBlock=>{
                const blockId = courseBlock.link.split('/')[6]
                return <option value={blockId}  key={blockId}>{courseBlock.title}</option>
              })}
            </select>
            
          </div>
        </div>
        <div className='col form-date '  style={{marginLeft:'-18px'}}>
          <h2 className="h4 mb-1 text-primary-500">{intl.formatMessage(messages.setWeekdayText)}</h2>
          <div className="text-gray-700 small mb-2.5">
            {intl.formatMessage(messages.setWeekdayDetail)}
          </div>
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
        </div>
        </div>
        <div className='d-flex justify-content-between align-items-end pt-3'>
          <div className=' '>
            <span style={{fontWeight:'650'}}>Kế hoạch học tập dự kiến dựa trên quỹ tời gian cá nhân của học viên</span>
          </div>
          <div className=''>
            <button
          className="btn btn-primary mb-1 mt-3 "
          type="submit"
          onClick={handleSubmit}
          >
          Submit
          </button> 
          </div>
          
        </div>
       
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



