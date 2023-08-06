import PropTypes from 'prop-types';
import {
    FormattedDate,
    FormattedTime,
    injectIntl,
    intlShape,
  } from '@edx/frontend-platform/i18n';
import { useModel } from '../../../generic/model-store';
import { useSelector } from 'react-redux';
import { isLearnerAssignment } from '../utils';
import { getBadgeListAndColor } from './badgelist';

const DayNew = ({
    date,
    first,
    intl,
    items,
    last,
    index,
    /** [MM-P2P] Example */
    mmp2p,
  })=>{

    const {
        courseId,
      } = useSelector(state => state.courseHome);
      const {
        userTimezone,
      } = useModel('courseHomeMeta', courseId);
    
      const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};
      const { color, badges } = getBadgeListAndColor(date, intl, null, items);

    const mmp2pOverride = (
        mmp2p.state.isEnabled
        && items.some((item) => item.dateType === 'verified-upgrade-deadline')
      );
    let check
    if (index % 2 == 0){
        check = true
    }else {
        check = false
    }

   
    return <>
       <div  className="d-flex flex-column justify-content-evenly align-items-center"
              style={{ width: "200px", height: "300px", marginLeft: "-55px" ,marginTop: `${check? '':'8px'}`}}>

                {
                    check ? <>                  
                  <div style={{whiteSpace:'nowrap'}}>
                    <span className="fw-bold text-primary-700">
                    <FormattedDate
    
                    value={mmp2pOverride ? mmp2p.state.upgradeDeadline : date}
                    day="numeric"
                    month="short"
                    weekday="short"
   
                    {...timezoneFormatArgs}
                    />
                    </span>
                    {badges}
                  </div>

                  <div>
                    <svg width="180" height="250" viewBox="0 0 59.531 49.477" style={{width:'180px'}}>
                      <g transform="matrix(.99959 0 0 .99838 -100.96 -48.57)">
                        <path
                          d="M101.002 69.656h55.492l4.064 4.158-4.064 4.205h-55.492l3.85-4.205z"
                          fill="#e0e0e0"
                          strokeWidth="0.24"
                        />
                        <rect
                          width="0.794"
                          height="35.363"
                          x="130.383"
                          y="37.309"
                          ry="0"
                          fill="#e0e0e0"
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
                    {items.map(item=>{
                
                const showLink = item.link && isLearnerAssignment(item);
                let titleSlice
                if (item.title.length > 50){
                   titleSlice = item.title.slice(0,50)+'...'
                

                }
                const title = showLink ? (<u><a href={item.link} className="text-reset">{ titleSlice ? titleSlice :  item.title}</a></u>) : item.title;
            return <div >
                <span className='small'>
                    <span className='font-weight-bold'>{title}</span>
                </span>
            </div>
          })}
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
                    {items.map(item=>{
           
                const showLink = item.link && isLearnerAssignment(item);
                let titleSlice
                if (item.title.length > 50){
                  
                  titleSlice=item.title.slice(0,50)+'...'
                }
                const title = showLink ? (<u><a href={item.link} className="text-reset">{titleSlice ? titleSlice : item.title}</a></u>) : item.title;
            return <div >
                <span className='small'>
                    <span className='font-weight-bold'>{title}</span>
                </span>
            </div>
          })}
                  </div>
                  <div>
                    <svg width="180px" height="250px" viewBox="0 0 59.531 49.477" style={{width:'180px'}}>
                      <g transform="matrix(.99959 0 0 .99838 -100.96 -49.20)">
                        <path
                          d="M101.002 69.656h55.492l4.064 4.158-4.064 4.205h-55.492l3.85-4.205z"
                          fill="#e0e0e0"
                          strokeWidth="0.24"
                        />
                        <rect
                          width="0.794"
                          height="35.363"
                          x="130.383"
                          y="75.309"
                          ry="0"
                          fill="#e0e0e0"
                          strokeWidth="0.108"
                        />
                      </g>
                    </svg>
                  </div>
                  <div style={{whiteSpace:'nowrap'}}>
                    <span className="fw-bold" >

                    <FormattedDate
                    value={mmp2pOverride ? mmp2p.state.upgradeDeadline : date}
                    day="numeric"
                    month="short"
                    weekday="short"

                    {...timezoneFormatArgs}
                    />
                    </span>
                    {badges}
                  </div>
                  
                  </>
                }

       </div>
         {/* <FormattedDate
    
            value={mmp2pOverride ? mmp2p.state.upgradeDeadline : date}
            day="numeric"
            month="short"
            weekday="short"
           
            {...timezoneFormatArgs}
          /> */}

          {/* {items.map(item=>{
                console.log(item)
                const showLink = item.link && isLearnerAssignment(item);
                const title = showLink ? (<u><a href={item.link} className="text-reset">{item.title}</a></u>) : item.title;
            return <div className={`${title==='Enrollment Date' ? 'd-none' : ''}`}>
                <span className='small'>
                    <span className='font-weight-bold'>{title}</span>
                </span>
            </div>
          })} */}
    </>
}



DayNew.propTypes = {
    date: PropTypes.objectOf(Date).isRequired,
    first: PropTypes.bool,
    intl: intlShape.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      dateType: PropTypes.string,
      description: PropTypes.string,
      dueNext: PropTypes.bool,
      learnerHasAccess: PropTypes.bool,
      link: PropTypes.string,
      title: PropTypes.string,
    })).isRequired,
    last: PropTypes.bool,
    /** [MM-P2P] Experiment */
    mmp2p: PropTypes.shape({
      state: PropTypes.shape({
        isEnabled: PropTypes.bool.isRequired,
        upgradeDeadline: PropTypes.string,
      }),
    }),
  };
  
  DayNew.defaultProps = {
    first: false,
    last: false,
    /** [MM-P2P] Experiment */
    mmp2p: {
      state: {
        isEnabled: false,
        upgradeDeadline: '',
      },
    },
  };
export default injectIntl(DayNew)
