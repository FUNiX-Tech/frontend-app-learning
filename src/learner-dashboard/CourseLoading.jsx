import './dashboard.scss'

const CourseLoading = ()=>{

    return (
        <div className='d-flex w-100 course-loading' >
        <div className='bg-loading' >
            <img  width="346px" height='193px'/>
        </div>
        <div className='p-3 w-100 d-flex  border flex-column justify-content-around'>
            <div className='course-title-loading' >
            </div>
            <div>
            </div>
            <div className=' d-flex  align-self-end' style={{gap:'10px'}} >
                <div className='btn-loading' ></div>
                <div  className='btn-loading'  ></div>
            </div>
        </div>
        
    </div>
    )
}

export default CourseLoading