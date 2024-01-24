import '../courseAbout.scss'
import {  getConfig } from '@edx/frontend-platform';
import labIcon from '../assets/Lab.svg';
import projectIcon from '../assets/Project.svg';
import quizIcon from '../assets/Quiz.svg';
import timeIcon from '../assets/Time.svg';
import videoIcon from '../assets/Video.svg'
import { useMediaQuery } from 'react-responsive';



export const InfoAbout = ()=>{

    return <div className='d-flex flex-column ' style={{gap:'8px'}}>
    <span className='about-card-title'>Khoá học này bao gồm:</span>
   <div  className='row'>
    <div className='col'>
            <div className='card-text-item'>
                <img src={timeIcon} alt='time' />
                <span>Học trong 6 tuần</span>
            </div>
            <div className='card-text-item'>
                <img src={videoIcon} alt='time' />
                <span>12 Video cần học</span>
            </div>                    
            <div className='card-text-item'>
                <img src={labIcon} alt='time' />
                <span>3 Bài Lab</span>
            </div>         
        </div>           
        <div className='col'>
            <div className='card-text-item'>
                <img src={quizIcon} alt='time' />
                <span>6 Bài trắc nghiệm Quiz</span>
            </div>
            <div className='card-text-item'>
                <img src={projectIcon} alt='time' />
                <span>3 Dự án phải nộp</span>
            </div>
        </div>

    </div>
    
</div> 
}


const CourseCardAbout = ({imgs})=>{
    // console.log('=====', imgs)

    //responsive
    const isDesktop =useMediaQuery({ minWidth: 1134 });
    const mobile = useMediaQuery({minWidth: 744})
    return (
        <div className='about-card-body'>
        <button  className='primary-btn-large  btn-modify custom-btn-default w-100'>
            <span>Bắt đầu học</span>
        </button>
        {isDesktop ?         <div className='d-flex flex-column ' style={{gap:'8px'}}>
            <span className='about-card-title'>Khoá học này bao gồm:</span>
            <div className='card-text-item'>
                <img src={timeIcon} alt='time' />
                <span>Học trong 6 tuần</span>
            </div>
            <div className='card-text-item'>
                <img src={videoIcon} alt='time' />
                <span>12 Video cần học</span>
            </div>                    
            <div className='card-text-item'>
                <img src={labIcon} alt='time' />
                <span>3 Bài Lab</span>
            </div>                    
            <div className='card-text-item'>
                <img src={quizIcon} alt='time' />
                <span>6 Bài trắc nghiệm Quiz</span>
            </div>
            <div className='card-text-item'>
                <img src={projectIcon} alt='time' />
                <span>3 Dự án phải nộp</span>
            </div>
            
        </div> : <div></div>}
    </div>
       
    )
}

export default CourseCardAbout