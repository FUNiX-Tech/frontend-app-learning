import PropTypes from 'prop-types';
import { useModel } from '../../../generic/model-store';
import { useSelector } from 'react-redux';
import MilestoneChartItem from './MilestoneChartItem';

const MilestoneChart = ({mmp2p})=>{
    const {
        courseId,
      } = useSelector(state => state.courseHome);
    
    const {
        courseDateBlocks,
        sections
      } = useModel('dates', courseId);
      let asms = []
      const updatedSections = sections?.map(section => {
        let startDate;
        
        section.sequenceIds.forEach(sequence => {
          const newSequence = { ...sequence };
          const parsedDate = new Date(newSequence.date);

          if (!startDate || parsedDate < startDate) {
            startDate = parsedDate;
  
          }
          if (sequence.assignmentType === 'Assignment'){
            asms.push(sequence)
          }
        });
        
        return { ...section, startDate };
      });

      asms.forEach(asm =>updatedSections.push({startDate : new Date(asm.date), title: asm.title}))
      updatedSections.sort((a, b)=>a.startDate - b.startDate)
    return <>
    <div className='container d-flex justify-content-center' >
        <div className='d-flex flex-nowrap pe-2' >
            {updatedSections?.map((section, index) => <MilestoneChartItem mmp2p={mmp2p} {...section}  index={index}/>)}
        </div>
    </div>
    </>
}





/** [MM-P2P] Experiment */
MilestoneChart.propTypes = {
    mmp2p: PropTypes.shape({}),
  };
  
  MilestoneChart.defaultProps = {
    mmp2p: {},
  
  };
  
export default MilestoneChart