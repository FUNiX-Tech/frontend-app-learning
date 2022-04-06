import React from 'react';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Bar } from 'react-chartjs-2';

import { useModel } from '../../../generic/model-store';
import messages from './messages';

function GradeBarGraph({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    sectionScores,
  } = useModel('progress', courseId);

  const sectionScoresFlat = sectionScores
    .reduce((arr, el) => arr.concat(el.subsections || []), []);

  const quizGrades = sectionScoresFlat.filter(el => (el.assignmentType || '').includes('Quiz'));

  const labels = quizGrades.map((el, index) => `Quiz ${index + 1}`);
  const dataGrade = quizGrades.map(el => Math.round(el.percentGraded * 100));
  const tooltipTitles = quizGrades.map(el => el.displayName);
  const tooltipAfterLabel = quizGrades.map(el => `${el.numPointsEarned} / ${el.numPointsPossible}`);

  // Add Progress test
  const progressTestGrades = sectionScoresFlat.filter(el => (el.assignmentType || '').includes('Progress test') || (el.assignmentType || '').includes('PT'));

  // Add data for progress test to graph
  progressTestGrades.forEach((el, index) => {
    labels.push(`PT ${index + 1}`);
    dataGrade.push(Math.round(el.percentGraded * 100));
    tooltipTitles.push(el.displayName);
    tooltipAfterLabel.push(`${el.numPointsEarned} / ${el.numPointsPossible}`);
  });

  // Calculate total grade
  let sumNumPointsPossible = 0;
  let sumGrade = 0;

  quizGrades.forEach((el) => {
    sumNumPointsPossible += el.numPointsPossible;
    sumGrade += el.numPointsEarned;
  });

  const totalGrade = Math.round((sumGrade / sumNumPointsPossible) * 100);

  // Push total grade to the end of the array
  labels.push('Quiz Total');
  dataGrade.push(totalGrade);
  tooltipTitles.push('Quiz Total');
  tooltipAfterLabel.push(`${sumGrade} / ${sumNumPointsPossible}`);

  const data = {
    labels,
    datasets: [{
      label: 'Percent',
      data: dataGrade,
      borderWidth: 1,
      backgroundColor: ['rgba(255, 0, 0, 0.5)'],
    }],
  };
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title(tooltipItem) {
            return tooltipTitles[tooltipItem[0].dataIndex];
          },
          afterLabel(chart) {
            return tooltipAfterLabel[chart.dataIndex];
          },
        },
      },
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };
  return (
    <section className="text-dark-700 mb-4 rounded shadow-sm p-4">
      <div className="row w-100 m-0">
        <h2>{ intl.formatMessage(messages.gradeBarGraphtitle) }</h2>
        <Bar
          data={data}
          options={options}
        />
      </div>
    </section>
  );
}

GradeBarGraph.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GradeBarGraph);
