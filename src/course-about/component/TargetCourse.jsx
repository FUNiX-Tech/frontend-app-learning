import { useEffect, useState } from "react"
import CollapsibleCustom from "./CollapsibleCustom"
import '../courseAbout.scss'

const TargetCourse = ({target})=>{
    const [liElements, setLilements] = useState([])
    useEffect(()=>{
        const parser = new DOMParser()
        const doc = parser.parseFromString(target, 'text/html')
        const liElement = Array.from(doc.querySelectorAll('li'))
        
        const halfLength = Math.ceil(liElement.length / 2);
        const firstHalf = liElement.slice(0, halfLength);
        const secondHalf = liElement.slice(halfLength);

        setLilements([firstHalf, secondHalf]);

    },[target])


    return (
            <div className="target-course-container">  
              
                 {/* <div dangerouslySetInnerHTML={{ __html: target }}></div> */}
                 <h2 className="title-target">Mục tiêu môn học</h2>
                 <div className="row target-course-about " >
                    {liElements.map((half, index) => (
                    <ul className="col" key={index} >
                        {half.map((li, liIndex) => (
                        <li key={liIndex} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                        ))}
                    </ul>
                    ))}
                </div>
            </div>
            
  
       
    )
}

export default  TargetCourse