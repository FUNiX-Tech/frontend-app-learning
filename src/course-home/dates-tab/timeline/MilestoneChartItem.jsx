
import PropTypes from 'prop-types';

import {
    FormattedDate,
    FormattedTime,
    injectIntl,
    intlShape,
} from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';
import { useModel } from '../../../generic/model-store';
import { getBadgeListAndColor } from './badgelist';


const MilestoneChartItem = ({ mmp2p, startDate, title, index ,intl }) => {

    const {
        courseId,
    } = useSelector(state => state.courseHome);
    const {
        userTimezone,
    } = useModel('courseHomeMeta', courseId);
    const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};
    // const { color, badges } = getBadgeListAndColor(startDate, intl, null, items);
    const mmp2pOverride = (
        mmp2p.state.isEnabled
        && items.some((item) => item.dateType === 'verified-upgrade-deadline')
    );

    const check = index % 2 === 0 ? true : false


    const today = new Date()

    const formattedToday = today.toISOString().slice(0, 10);
    const formattedDate = startDate?.toISOString().slice(0, 10)
    let setColor = '#80cac2'

    if (formattedDate < formattedToday) {
        setColor = '#01796b'
    }
    else if (formattedDate == formattedToday) {
        setColor = '#004e40'

    }



    return <>
        
        <div  className="d-flex flex-column justify-content-evenly align-items-center"
              style={{ width: "200px", height: "300px", marginLeft: "-55px" ,marginTop: `${check? '':'8px'}`}}>

                {
                    check ? <>                  
                  <div style={{whiteSpace:'nowrap'}}>
                    <span className="fw-bold text-primary-700">
                    <FormattedDate
    
                    value={mmp2pOverride ? mmp2p.state.upgradeDeadline : startDate}
                    day="numeric"
                    month="short"
                    weekday="short"
   
                    {...timezoneFormatArgs}
                    />
                    </span>
                
                  </div>

                  <div>
                    <svg width="180" height="250" viewBox="0 0 59.531 49.477" style={{width:'180px'}}>
                      <g transform="matrix(.99959 0 0 .99838 -100.96 -47.70)">
                        <path
                          d="M101.002 69.656h55.492l4.064 4.158-4.064 4.205h-55.492l3.85-4.205z"
                          fill={setColor}
                          strokeWidth="0.24"
                        />
                        <rect
                          width="0.794"
                          height="35.363"
                          x="130.383"
                          y="37.309"
                          ry="0"
                          fill={setColor}
                          strokeWidth="0.108"
                        />
                      </g>
                    </svg>
                  </div>
                  <div
                    className="d-flex flex-column"
                    style={{
                      width: "200px",
                      height: "300px",
                      wordWrap: "break-word",
                      marginTop: "-100px",
                      zIndex:'2'
                    }}
                  >
                    <span className='small'>
                        <span className='font-weight-bold'>{title}</span>
                    </span>
                  </div> </> 
                  : <>
                  
                  <div
                    className="d-flex flex-column justify-content-end px-3 "
                    style={{
                      marginBottom: "-100px",
                      wordWrap: "break-word",
                      width: "200px",
                      height: "300px",
                      zIndex:'2'
                    }}
                  >
                    <span className='small'>
                        <span className='font-weight-bold'>{title}</span>
                    </span>
                  </div>
                  <div>
                    <svg width="180px" height="250px" viewBox="0 0 59.531 49.477" style={{width:'180px'}}>
                      <g transform="matrix(.99959 0 0 .99838 -100.96 -49.20)">
                        <path
                          d="M101.002 69.656h55.492l4.064 4.158-4.064 4.205h-55.492l3.85-4.205z"
                          fill={setColor}
                          strokeWidth="0.24"
                        />
                        <rect
                          width="0.794"
                          height="35.363"
                          x="130.383"
                          y="75.309"
                          ry="0"
                          fill={setColor}
                          strokeWidth="0.108"
                        />
                      </g>
                    </svg>
                  </div>
                  <div style={{whiteSpace:'nowrap'}}>
                    <span className="fw-bold" >

                    <FormattedDate
                    value={mmp2pOverride ? mmp2p.state.upgradeDeadline : startDate}
                    day="numeric"
                    month="short"
                    weekday="short"

                    {...timezoneFormatArgs}
                    />
                    </span>
              
                  </div>
                  
                  </>
                }

       </div> 


       


    </>
}




MilestoneChartItem.propTypes = {
    mmp2p: PropTypes.shape({}),
    startDate: PropTypes.objectOf(Date).isRequired,
    title: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

MilestoneChartItem.defaultProps = {
    mmp2p: {},

};
export default injectIntl(MilestoneChartItem)