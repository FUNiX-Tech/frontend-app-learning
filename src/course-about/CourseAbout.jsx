import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import HeaderLearning from "../header/HeaderLearning";
import { getConfig } from "@edx/frontend-platform";
import './courseAbout.scss'
import {Collapsible} from '@edx/paragon'
import CourseTree from "./component/CourseTree";
import CourseCardAbout, { InfoAbout } from "./component/CourseCardAbout";
import TargetCourse from "./component/TargetCourse";
import ParticipantCourse from "./component/ParticipantCourse";
import InputRequired from "./component/InputRequired";
import { useMediaQuery } from 'react-responsive';



const CourseAbout = (props)=>{
    const { fetch } = props;
    const { courseId: courseIdFromUrl } = useParams();
    const [data, setData] = useState([])

    const elementTitleRef = useRef(null)
    const [isFixed, setIsFixed] = useState(false);

    //responsive
    const isDesktop =useMediaQuery({ minWidth: 1134 });

    useEffect(async() => {
      try {
        const data = await fetch(courseIdFromUrl);
        setData(data)
        console.log('===========', data)
      } catch (error) {
        console.log('=============', error)
      }

      const handleScroll = () => {
        const element = elementTitleRef.current;

          if (element) {
            const elementHeight = element.offsetHeight;
            const scrollY = window.scrollY || window.pageYOffset;

            if (scrollY >= elementHeight) {
              setIsFixed(true);
            } else {
              setIsFixed(false);
            }
        }
      };
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
      }, [courseIdFromUrl]);

      const fixedStyles = {
        position: isFixed ? 'fixed' : 'relative',
        top: isFixed ? 0 : 'auto',
        left: isFixed ? 0 : 'auto',
        width: isFixed && '100%',
        padding:isFixed &&  '16px 8px 16px 80px',
      };



    return (
        <div >
            <div className="" style={{padding:'10px 16px'}}>
                    <a
                    href={`${getConfig().LMS_BASE_URL}/dashboard`}
                    className="logo logo_img"
                    width='100%'
                > <img className="d-block" src={getConfig().LOGO_URL} alt='logo' width='60px' height='25px' /> </a>
            </div>
            <div className="container-about">
                <div className=""  style={{background:'#EEF7FF'}}>
                  {!isDesktop ?  <div className="" style={{padding:'56px'}}>
                          <div className="">
                            <img style={{borderTopRightRadius:'4px', borderTopLeftRadius:'4px'}} src={`${getConfig().LMS_BASE_URL}${data.course_image_urls?.small}`} alt='course' width='100%'/>
                          </div>
                          <div>
                            <h1>{data.display_name}</h1>
                            <span dangerouslySetInnerHTML={{ __html: data?.overview }}></span>
                          </div>
                          <div>
                            <CourseCardAbout />
                          </div>
                  </div>:  
                  <div className="">
                    <div className="">
                        <div className="about-section" style={{padding:'56px 0px'}} ref={elementTitleRef}>
                                <h1 className={`${isFixed ? 'title_fixed' : ''}`} style={fixedStyles}>{data.display_name}</h1>
                                <span dangerouslySetInnerHTML={{ __html: data?.overview }}></span>
                        </div>
                      </div>

                   
                      <div className='about-card' >
                            <div>
                                <img style={{borderTopRightRadius:'4px', borderTopLeftRadius:'4px'}} src={`${getConfig().LMS_BASE_URL}${data.course_image_urls?.small}`} alt='course' width='100%'/>
                            </div>
                            <CourseCardAbout />
                    
                        </div>
                        
                 
                      
                  </div>
                  }
                </div>
                <div className="pt-5" >

                  {!isDesktop && <div  className="about-section section-target d-flex flex-column " style={{gap:'10px'}}>
                      <InfoAbout />
                    </div>}
                   
                        <div className="about-section section-target d-flex flex-column " style={{gap:'10px'}}>
                              <TargetCourse  target={data.target} />
                          </div>
                    
                      <div className="about-section d-flex flex-column " style={{gap:'10px'}}>
                                <CourseTree lessonTree={data.block_tree} /> 
                      </div>

                      <div className="about-section d-flex flex-column " style={{gap:'10px'}}>
                            <ParticipantCourse participant={data.participant} />
                      </div>

                      <div className="about-section d-flex flex-column " style={{gap:'10px'}}>
                           <InputRequired inputRequired={data.input_required}/>
                      </div>
                    
                </div>

            </div>
        </div>
        
    )
}

export default CourseAbout