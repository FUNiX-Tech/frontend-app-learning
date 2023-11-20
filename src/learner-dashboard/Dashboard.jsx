import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import HeaderLearning from "../header/HeaderLearning"
import Footer from '@edx/frontend-component-footer';
import { fetchDashboard } from "../course-home/data";
import CourseList from "./CourseList";

const Dashboard = ({intl})=>{
    const [listCourse , setListCourse] = useState([])
    useEffect(async ()=>{
      const {courses} =  await  fetchDashboard()
      setListCourse(courses)
    },[])
    
    return <>
        <HeaderLearning/>
           <CourseList courses={listCourse} />
        <Footer />
    </>
}

Dashboard.propTypes = {
   
  };
  

export default Dashboard
