import CollapsibleCustom from "./CollapsibleCustom";
import { useState } from "react";
import { Card } from "@edx/paragon";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import arrowLeftIcon from '../assets/Arrow-left.svg'
import arrowRightIcon from '../assets/Arrow-right.svg'
import '../courseAbout.scss'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useMediaQuery } from "react-responsive";

const StartTeacher = ({ teachers }) => {
  
  const customNextButton = {
    nextEl: '.swiper-button-next', 
    prevEl: '.swiper-button-prev',
  };

  const isMobile = useMediaQuery({ minWidth: 744 });


  return (
    <>
      <CollapsibleCustom title="Đội ngũ Star Teachers và Domain Experts của khoá học">
     <div >

      <Swiper
          slidesPerView={3}
          spaceBetween={teachers?.length}
          pagination={{
            clickable: true,
            type: 'fraction',
          }}
          navigation={customNextButton}
          modules={[Navigation]}
          className="silde-teacher w-100 h-100" 
        >
          {teachers?.map((teacher, index)=>{
            if (teacher.isTeacherStart){
              return (
                <SwiperSlide>
                    <div className="slide-card">
                       <div>
                          <img src={teacher.img_url ?teacher.img_url  :  'https://www.w3schools.com/howto/img_avatar.png' } alt={teacher.name} width='100%' />
                       </div>
                       <div className="d-flex flex-column jusify-content-center align-items-center">
                          <span className=" teach-name">{teacher.sex == 'male' ? 'Mr.' : 'Mrs.'} {teacher.name}</span>
                          <span className="teacher-position">{teacher.position}</span>
                          <span className="teacher-workplace">{teacher.workplace}</span>
                       </div>
                    </div>
                </SwiperSlide>
              )
            }
          })}
            {isMobile && <>
              <div className="swiper-btn swiper-button-next">
            <img src={arrowRightIcon} alt='arrowtighticon'  width='20px' height='20px'/>
           </div>
           <div className="swiper-btn swiper-button-prev">
           <img src={arrowLeftIcon} alt='arrowLeftIcon'  width='20px' height='20px'/>

           </div>
            </>}
        </Swiper>

     </div>


      </CollapsibleCustom>
    </>
  );
};

export default StartTeacher;
