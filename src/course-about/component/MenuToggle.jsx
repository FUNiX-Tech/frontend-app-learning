import {Dropdown} from '@edx/paragon'
import '../courseAbout.scss'
import '../../header/HeaderLearning.scss'
import '../../header/HeaderLearningResponsive.scss'
import loginIcon from '../assets/login.svg'
import { getConfig } from "@edx/frontend-platform";

const MenuToggle = ()=>{

    return (
       <Dropdown className="user-dropdown position-relative z-index-100000">
            <Dropdown.Toggle  
            variant="outline-primary "
          className="toggle-mobile-icon-1 btn-toggle">
     
        <button className="action-button">

            <p data-hj-suppress className="d-inline d-lg-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g clip-path="url(#clip0_5308_15453)">
                  <path
                    d="M20 18C20.2549 18.0003 20.5 18.0979 20.6854 18.2728C20.8707 18.4478 20.9822 18.687 20.9972 18.9414C21.0121 19.1958 20.9293 19.4464 20.7657 19.6418C20.6021 19.8373 20.3701 19.9629 20.117 19.993L20 20H4C3.74512 19.9997 3.49997 19.9021 3.31463 19.7272C3.1293 19.5522 3.01777 19.313 3.00283 19.0586C2.98789 18.8042 3.07067 18.5536 3.23426 18.3582C3.39786 18.1627 3.6299 18.0371 3.883 18.007L4 18H20ZM20 11C20.2652 11 20.5196 11.1054 20.7071 11.2929C20.8946 11.4804 21 11.7348 21 12C21 12.2652 20.8946 12.5196 20.7071 12.7071C20.5196 12.8946 20.2652 13 20 13H4C3.73478 13 3.48043 12.8946 3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929C3.48043 11.1054 3.73478 11 4 11H20ZM20 4C20.2652 4 20.5196 4.10536 20.7071 4.29289C20.8946 4.48043 21 4.73478 21 5C21 5.26522 20.8946 5.51957 20.7071 5.70711C20.5196 5.89464 20.2652 6 20 6H4C3.73478 6 3.48043 5.89464 3.29289 5.70711C3.10536 5.51957 3 5.26522 3 5C3 4.73478 3.10536 4.48043 3.29289 4.29289C3.48043 4.10536 3.73478 4 4 4H20Z"
                    fill="#576F8A"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5308_15453">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </p>
          </button>
          </Dropdown.Toggle>
          <Dropdown.Menu className='dropdown-menu-right'>
          <Dropdown.Toggle
            className="toggle-mobile-icon-2 btn-toggle"
            variant="outline-primary"
           
          >
            <p data-hj-suppress className="d-block d-lg-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12.0008 13.4008L7.10078 18.3008C6.91745 18.4841 6.68411 18.5758 6.40078 18.5758C6.11745 18.5758 5.88411 18.4841 5.70078 18.3008C5.51745 18.1174 5.42578 17.8841 5.42578 17.6008C5.42578 17.3174 5.51745 17.0841 5.70078 16.9008L10.6008 12.0008L5.70078 7.10078C5.51745 6.91745 5.42578 6.68411 5.42578 6.40078C5.42578 6.11745 5.51745 5.88411 5.70078 5.70078C5.88411 5.51745 6.11745 5.42578 6.40078 5.42578C6.68411 5.42578 6.91745 5.51745 7.10078 5.70078L12.0008 10.6008L16.9008 5.70078C17.0841 5.51745 17.3174 5.42578 17.6008 5.42578C17.8841 5.42578 18.1174 5.51745 18.3008 5.70078C18.4841 5.88411 18.5758 6.11745 18.5758 6.40078C18.5758 6.68411 18.4841 6.91745 18.3008 7.10078L13.4008 12.0008L18.3008 16.9008C18.4841 17.0841 18.5758 17.3174 18.5758 17.6008C18.5758 17.8841 18.4841 18.1174 18.3008 18.3008C18.1174 18.4841 17.8841 18.5758 17.6008 18.5758C17.3174 18.5758 17.0841 18.4841 16.9008 18.3008L12.0008 13.4008Z"
                  fill="#576F8A"
                />
              </svg>
            </p>
          </Dropdown.Toggle>
          <div class="menu-user memu-toggle">

          </div>
           <Dropdown.Item
            className="menu-login"
            href={getConfig().LOGIN_URL}
          >
            <img src={loginIcon} alt='login-icon' />
            <span>Đăng nhập</span>
          </Dropdown.Item>
          </Dropdown.Menu>
       </Dropdown>
    )
}

export default MenuToggle