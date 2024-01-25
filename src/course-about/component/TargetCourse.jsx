import { useEffect, useState } from "react"
import CollapsibleCustom from "./CollapsibleCustom"
import { Skeleton} from '@edx/paragon'
import { useMediaQuery } from "react-responsive";
import '../courseAbout.scss'

const TargetCourse = ({target, loading})=>{
    const [liElementsMobile, setLilementsMobile] = useState([])
    const [liElementsDesktop, setLilementsDesktop] = useState([])
    const mobile = useMediaQuery({ minWidth: 744 });
    const isDesktop = useMediaQuery({ minWidth: 1134 });

    useEffect(()=>{
        const parser = new DOMParser()
        const doc = parser.parseFromString(target, 'text/html')
        const liElement = Array.from(doc.querySelectorAll('li'))
        
        const halfLength = Math.ceil(liElement.length / 2);
        const firstHalf = liElement.slice(0, halfLength);
        const secondHalf = liElement.slice(halfLength);
        setLilementsMobile(liElement);
        setLilementsDesktop([firstHalf, secondHalf])
        

    },[target, mobile , isDesktop])

    // console.log(liElements)

    return (
            <div className="target-course-container">  
              
                 {/* <div dangerouslySetInnerHTML={{ __html: target }}></div> */}
                 <h2 className="title-target">Mục tiêu môn học</h2>
                {loading ? <Skeleton count={5} /> :  <div className="row target-course-about " >
                    { mobile ? liElementsDesktop?.map((half, index) => (
                    <ul className="col" key={index} >
                        {half?.map((li, liIndex) => (
                        <li key={liIndex} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                        ))}
                    </ul>
                    ))  : <ul className="col" >
                            {liElementsMobile.map((li, index) =>(
                                <li key={index} dangerouslySetInnerHTML={{__html: li.innerHTML}} />
                            ))}
                            </ul>}
                </div>}
            </div>
            
  
       
    )
}

export default  TargetCourse