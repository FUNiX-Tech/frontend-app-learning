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

  const labels = [];
  const dataGrade = [];
  const tooltipTitles = [];
  const tooltipAfterLabel = [];

  // Get unique assignment type labels not null using set
  const assignmentTypeSet = new Set();
  sectionScoresFlat.forEach(({ assignmentType }) => {
    if (assignmentType !== null) {
      assignmentTypeSet.add(assignmentType);
    }
  });

  const assignmentTypeArr = Array.from(assignmentTypeSet).map(assignmentType => {
    if (assignmentType.split(' ').length >= 2) {
      const assignmentTypeFirstLetter = assignmentType.split(' ').map(el => el[0]).join('');
      return { label: assignmentTypeFirstLetter.toUpperCase(), assignmentType };
    }
    return { label: assignmentType, assignmentType };
  });

  let sumNumPointsPossible = 0;
  let sumGrade = 0;

  // Populate labels, dataGrade, and tooltipTitles each assignmentTypeArr
  assignmentTypeArr.forEach(({ assignmentType, label }) => {
    // Filter all sectionScoresFlat for each assignmentType
    // eslint-disable-next-line max-len
    const filteredSectionScoresFlat = sectionScoresFlat.filter(({ assignmentType: sectionAssignmentType }) => sectionAssignmentType === assignmentType);

    // For each and process the dataGrade and tooltipTitles
    filteredSectionScoresFlat.forEach((el, index) => {
      labels.push(`${label} ${index + 1}`);
      dataGrade.push(Math.round(el.percentGraded * 100));
      tooltipTitles.push(el.displayName);
      tooltipAfterLabel.push(`${el.numPointsEarned} / ${el.numPointsPossible}`);

      sumNumPointsPossible += el.numPointsPossible;
      sumGrade += el.numPointsEarned;
    });
  });

  const totalGrade = Math.round((sumGrade / sumNumPointsPossible) * 100);

  // Push total grade to the end of the array
  labels.push('Total');
  dataGrade.push(totalGrade);
  tooltipTitles.push('Total');
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
