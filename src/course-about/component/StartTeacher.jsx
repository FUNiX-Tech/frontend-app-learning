import CollapsibleCustom from "./CollapsibleCustom";
import { useState } from "react";
import { Card } from "@edx/paragon";

const StartTeacher = ({ teachers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentList, setCurrentList] = useState([0, 1]);

  const nextSlide = () => {
    setCurrentSlide(
      currentSlide + 1 === teachers.length ? 0 : currentSlide + 1
    );
    setCurrentList(
      currentList.map((cur) => (cur + 1 === teachers.length ? 0 : cur + 1))
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      currentSlide === 0 ? teachers.length - 1 : currentSlide - 1
    );
    setCurrentList(
      currentList.map((cur) => (cur === 0 ? teachers.length - 1 : cur - 1))
    );
  };
  console.log(teachers)
  return (
    <>
      <CollapsibleCustom title="Đội ngũ Star Teachers và Domain Experts của khoá học">
        <div className="row">
          {teachers?.map((teacher, index) => {
            return (
              <div
                key={index}
                className={`col slide ${
                  currentList.includes(index) ? "active" : ""
                }`}
              >
                <Card>
                <Card.ImageCap
                    src={teacher.img_url ? teacher.img_url : 'https://www.w3schools.com/howto/img_avatar.png'}
                    srcAlt={teacher.name}
                />

                </Card>
              </div>
            );
          })}
        </div>

        <button onClick={prevSlide}>Previous</button>
        <button onClick={nextSlide}>Next</button>
      </CollapsibleCustom>
    </>
  );
};

export default StartTeacher;
