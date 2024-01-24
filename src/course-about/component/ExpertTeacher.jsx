import CollapsibleCustom from "./CollapsibleCustom"
import { Card, Image } from "@edx/paragon";

const ExpertTeacher = ({teachers})=>{


    return <div>
        <CollapsibleCustom title='Chuyên gia thiết kế và phản biện môn học'>
            <div className="d-flex flex-column" style={{gap:'8px'}}>

                {
                    teachers?.map((teacher)=>{

                        if (teacher.isExpert || teacher.isDesign) {

                            return (
                                <div  className='card-item d-flex flex-row justify-content-between align-items-center '>
                                    <div className="d-flex align-items-center" style={{gap:'24px'}}>
                                        <div>
                                            <Image  roundedCircle src={teacher.img_url ?teacher.img_url  :  'https://www.w3schools.com/howto/img_avatar.png' } alt={teacher.name} width='88px' height='88px'  />
                                        </div>
                                        <div>
                                            <h3>{teacher.sex == 'male' ? 'Mr.' : 'Mrs.'} {teacher.name}</h3>
                                            <span className="teacher-workplace">{teacher.workplace}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {teacher.isDesign && <div className="teacher-tag">
                                            <span>Chuyên gia thiết kế</span>
                                        </div>}
                                        {teacher.isExpert && <div className="teacher-tag">
                                            <span>Chuyên gia phản biện</span>
                                        </div>}
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </CollapsibleCustom>
    </div>
}

export default ExpertTeacher