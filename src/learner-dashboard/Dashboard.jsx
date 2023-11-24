import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import HeaderLearning from "../header/HeaderLearning"

import { fetchDashboard } from "../course-home/data";
import CourseList from "./CourseList";
import messages from "./messages";
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import CourseLoading from "./CourseLoading";
import iconVector from '../assets/icon/Vector.png'
import Footer from "../footer/Footer";

const Dashboard = ({ intl }) => {
  const [listCourse, setListCourse] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
      const fetchData = async () => {
          try {
              const { courses } = await fetchDashboard();
              setListCourse(courses);
          } catch (error) {
          } finally {
              setLoading(false); 
          }
      };

      fetchData();
  }, []);

  return (
      <>
          <HeaderLearning  isDashoard/>

          <div className='container pt-4'style={{width:'1100px'}} >
            <div className="d-flex flex-column">
              <div className='p-2' >
                  <h2>{intl.formatMessage(messages.myCourse)}</h2>
              </div>
              <div className="w-100" >
                <div className={`d-flex justify-content-center w-100 ${listCourse.length == 0 && !loading && 'align-items-center'} `} style={{minHeight:'500px'}}>
                {loading  && <div className="pb-3 d-flex flex-column w-100 " style={{gap:'10px'}}>
                  <CourseLoading />
                  <CourseLoading />
                  <CourseLoading />
                </div>}
                {listCourse.length == 0 && !loading 
                  && <>
                    <span className="d-flex flex-column  align-items-center model-not-course " >
                      <img src={iconVector} width="37px" height="30px" />
                      <span className="text-not-course"> {intl.formatMessage(messages.notCourse)}</span>
                    </span>
                  </>
                }
                {listCourse.length >0 && <CourseList courses={listCourse} />}
                   
                </div>
              </div>
                
              </div>
          </div>

          
         <Footer />
      </>
  );
};

Dashboard.propTypes = {
  intl: intlShape.isRequired,
  };
  

export default injectIntl(Dashboard)
