import { Dropdown , Modal, Button , ModalLayer , useToggle, ModalCloseButton } from '@edx/paragon';
import { useEffect, useState } from 'react';
import { fetchSearchCourse } from './data/thunks';
import { useParams } from 'react-router-dom';


const SearchCourse = ()=>{

    const [isOpen, open, close] = useToggle(false);
    const { courseId: courseIdFromUrl } = useParams();
    const [resultSearch, setResultSearch] = useState([])
    const [pageIndex, setPageIndex] = useState(0)
   
    const handlerSearch = async()=>{
        try {
            const search_string = 'a'
            const page_index = 0
           const data = await fetchSearchCourse(courseIdFromUrl, search_string, page_index)
           setResultSearch(data)
        } catch (error) {
           console.log(error) 
        }
    }
    const handlerLoadMore = async()=>{
        try {
            const search_string = 'a'
            const newPageIndex = pageIndex + 1;
            setPageIndex(prevPageIndex => prevPageIndex + 1 )
            const data = await fetchSearchCourse(courseIdFromUrl, search_string, newPageIndex);
            setResultSearch(prevResult => [...prevResult, ...data]);
            setPageIndex(newPageIndex);
            console.log(resultSearch)
        } catch (error) {
            console.log(error)
        }
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
{/*               
                <div className='p-2'>
                    <div className='result-item rounded border p-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='search-title' style={{fontSize:'1.3rem', fontWeight:'bold'}} >Program Receipt and invoice</span>
                                <span className='search-lesson   px-3'>Lesson</span>
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio culpa maxime odio placeat ea labore quidem quasi consectetur alias tempora eum eligendi
                            </div>
                    </div>
                </div>
                <div className='p-2'>
                    <div className='result-item rounded border p-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='search-title' style={{fontSize:'1.3rem', fontWeight:'bold'}} >Program Receipt and invoice</span>
                                <span className='search-lesson   px-3'>Lesson</span>
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio culpa maxime odio placeat ea labore quidem quasi consectetur alias tempora eum eligendi
                            </div>
                    </div>
                </div>
                <div className='p-2'>
                    <div className='result-item rounded border p-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='search-title' style={{fontSize:'1.3rem', fontWeight:'bold'}} >Program Receipt and invoice</span>
                                <span className='search-lesson   px-3'>Lesson</span>
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio culpa maxime odio placeat ea labore quidem quasi consectetur alias tempora eum eligendi
                            </div>
                    </div>
                </div>
                <div className='p-2'>
                    <div className='result-item rounded border p-4'>
                            <div className='d-flex justify-content-between'>
                                <span className='search-title' style={{fontSize:'1.3rem', fontWeight:'bold'}} >Program Receipt and invoice</span>
                                <span className='search-lesson   px-3'>Lesson</span>
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio culpa maxime odio placeat ea labore quidem quasi consectetur alias tempora eum eligendi
                            </div>
                    </div>
                </div> */}
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