import { Dropdown , Modal, Button , ModalLayer , useToggle, ModalCloseButton } from '@edx/paragon';
import { useEffect, useState } from 'react';
import { fetchSearchCourse } from './data/thunks';
import { useParams , useHistory } from 'react-router-dom';


const SearchCourse = ()=>{

    const [isOpen, open, close] = useToggle(false);
    const { courseId: courseIdFromUrl } = useParams();
    const [resultSearch, setResultSearch] = useState([])
    const [pageIndex, setPageIndex] = useState(0)
    const history = useHistory()
    const handlerSearch = async()=>{
        try {
            const search_string = 'a'
            const page_index = 0
           const {data , total} = await fetchSearchCourse(courseIdFromUrl, search_string, page_index)
           setResultSearch(data)
           console.log(resultSearch)
        } catch (error) {
           console.log(error) 
        }
    }
    const handlerLoadMore = async()=>{
        try {
            const search_string = 'a'
            const newPageIndex = pageIndex + 1;
            setPageIndex(prevPageIndex => prevPageIndex + 1 )
            const {data, total} = await fetchSearchCourse(courseIdFromUrl, search_string, newPageIndex);
            setResultSearch(prevResult => [...prevResult, ...data]);
            setPageIndex(newPageIndex);
            console.log(resultSearch)
        } catch (error) {
            console.log(error)
        }
    }
    const handlerNavigate = (e)=>{
        console.log(e)
        history.push(e.data.url)
    }
    return (
    <div className='search-course-custom'>
      <div className="d-flex">
        <button className='btn-search'  onClick={open}>
            <i class="bi bi-search"></i>
        </button>
      </div>
      <ModalLayer isOpen={isOpen} onClose={close}>
        <div role="dialog" aria-label="My dialog" className="modal-search mw-sm p-4 bg-white mx-auto my-5 rounded ">
            <div className='modal-header-search d-flex justify-content-between align-items-center' >
                <span className='search-title'>Search</span>
                <span onClick={close} className='search-close rounded'><i class="bi bi-x-lg"></i></span>
            </div>
            <div className='modal-body-search'>
                <div className='input-search rounded'>
                    <input type='text' className='' name='search' />
                    <i class="bi bi-search" onClick={handlerSearch}></i>
                </div>
            </div>
            <span className='search-title' style={{fontSize:'1.2rem'}}>Results :</span>
            <div className='search-results'>
             {resultSearch && resultSearch.map(e =>{
                        console.log(e)
                           return ( <div className='p-2' onClick={(e)=>handlerNavigate(e)} >
                           <div className='result-item rounded border p-4'>
                                   <div className='d-flex justify-content-between'>
                                       <span className='search-title' style={{fontSize:'1.3rem', fontWeight:'bold'}} >
                                        {e.data.location[1]}
                                         </span>
                                       <div>
                                            <span className='search-lesson   px-3'>Lesson</span>
                                        </div>
                                   </div>
                                   <div className='excerpt' dangerouslySetInnerHTML={{ __html: e.data.excerpt }} />
                                          
                                          
                           </div>
                       </div>)
                    })}
                <div>
                    <button onClick={handlerLoadMore}>loadmore</button>
                </div>
            </div>
        </div>
      </ModalLayer>

    </div>
    )
}

export default SearchCourse