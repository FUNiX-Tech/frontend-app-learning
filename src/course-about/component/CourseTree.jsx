import {Collapsible} from '@edx/paragon'
import minuIcon from '../assets/minus.svg';
import pushIcon from '../assets/push.svg';
import arrowIcon from '../assets/Arrow-expand.svg'
import arrowCollapseIcon from '../assets/Arrow-collapse.svg'

const CourseTree = ({lessonTree})=>{
    // console.log('==========', lessonTree)
    return (
      <div>
            <Collapsible.Advanced className="collapsible-container">
                <Collapsible.Trigger className="collapsible-trigger d-flex">
                    <span className="flex-grow-1 collapsible-title">Cấu trúc môn học</span>
                    <Collapsible.Visible whenClosed> <img src={pushIcon} alt='push' /> </Collapsible.Visible>
                    <Collapsible.Visible whenOpen> <img src={minuIcon} alt='minu' /> </Collapsible.Visible>
                </Collapsible.Trigger>

                <Collapsible.Body className="collapsible-body">
                    {lessonTree?.map((lesson, indexLesson)=>{
                        const lessonKeys = Object.keys(lesson);
                        const lessonValue = Object.values(lesson);
                        return (
                            <div key={indexLesson}>
                                <Collapsible.Advanced className=" block-lesson collapsible-card">
                                    <Collapsible.Trigger className="collapsible-trigger d-flex">
                                        <span className="flex-grow-1 collapsible-title">{lessonKeys[0]}</span>
                                        <Collapsible.Visible whenClosed> <img src={arrowIcon} alt='arrowIcon' /> </Collapsible.Visible>
                                        <Collapsible.Visible whenOpen> <img src={arrowCollapseIcon} alt='arrowCollapseIcon' /> </Collapsible.Visible>
                                    </Collapsible.Trigger>
                                    
                                    <Collapsible.Body className="collapsible-body">
                                    {lessonValue[0].map((unit, index) => (
                                        <span key={index}>
                                            {unit}
                                        </span>
                                    ))}
                                    </Collapsible.Body>
                                </Collapsible.Advanced>

                            </div>
                        )
                    })}
                    

                </Collapsible.Body>
            </Collapsible.Advanced>

      </div>
    )
}

export default CourseTree