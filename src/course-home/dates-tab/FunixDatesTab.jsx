import React from "react";
import { useSelector } from "react-redux";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";

import messages from "./messages";
import Timeline from "./timeline/Timeline";

import { useModel } from "../../generic/model-store";

/** [MM-P2P] Experiment */
import { initDatesMMP2P } from "../../experiments/mm-p2p";
import FunixLearningGoalCard from "./widgets/FunixLearningGoalCard";
import MilestoneChart from "./timeline/MilestoneChart";
import GradeBarGraph from "../progress-tab/grade-graph/GradeBarGraph";

function FunixDatesTab({ intl }) {
  const { courseId } = useSelector((state) => state.courseHome);

  const { goalHoursPerDay, goalWeekdays, username, enrollCourseDate } =
    useModel("dates", courseId);

  /** [MM-P2P] Experiment */
  const mmp2p = initDatesMMP2P(courseId);
  return (
    <>
      <div role="heading" aria-level="1" className="h2 my-3">
        {intl.formatMessage(messages.title, { username })}
      </div>
      <div className="d-flex flex-column " style={{ gap: "20px" }}>
        <div className="w-100">
          <FunixLearningGoalCard
            goalHoursPerDay={goalHoursPerDay}
            goalWeekdays={goalWeekdays}
            enrollCourseDate={enrollCourseDate}
          />
        </div>
        <div>
          <h3 className="py-5">Tiến độ theo tuần</h3>
          <MilestoneChart mmp2p={mmp2p} />
        </div>
        <div>
          <h3 className="pt-5 pb-2">Tiến độ theo ngày</h3>
          <Timeline mmp2p={mmp2p} />
        </div>
      </div>

      <div>
        <GradeBarGraph />
      </div>
    </>
  );
}

FunixDatesTab.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(FunixDatesTab);
