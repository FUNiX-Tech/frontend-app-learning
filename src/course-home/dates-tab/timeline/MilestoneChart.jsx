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

      const updatedSections = sections.map(section => {
        let startDate;
        
        section.sequenceIds.forEach(sequence => {
          const newSequence = { ...sequence };
          const parsedDate = new Date(newSequence.date);

          if (!startDate || parsedDate < startDate) {
            startDate = parsedDate;
  
          }
        });
        
        return { ...section, startDate };
      });



    return <>
    <div className='container' style={{marginRight:'-40px'}}>
        <div className='d-flex flex-wrap pe-2' style={{gap:'25px'}}>
            {updatedSections.map((section, index) => <MilestoneChartItem mmp2p={mmp2p} {...section}  index={index}/>)}
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