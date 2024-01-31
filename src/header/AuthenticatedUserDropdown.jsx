import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { getConfig } from "@edx/frontend-platform";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { Dropdown } from "@edx/paragon";
import { useSelector, useDispatch } from "react-redux";
import { Collapsible } from "@edx/paragon";
import { showGlobalChatGPT } from "./data/slice";
import messages from "./messages";
import logoChatGPT from "./assets/chatGPT.svg";
import Tabs from "../generic/tabs/Tabs";

import SelectLanguage from "./SelectLanguage";
import SearchCourse from "./SearchCourse";
import ChatGPT from "../chatGPT/ChatGPT";
import { useModel } from "../generic/model-store";
import avatar_icon from "./assets/avatar.svg";
import avatar_hover_icon from "./assets/avatar_hover.svg";
import { urlToPath } from "../utils";
import { setCourseInRun } from "../course-home/data/slice";
import { useLocation, NavLink } from "react-router-dom";
import { fetchCourseResumeUrl } from "../learner-dashboard/api";

const AuthenticatedUserDropdown = ({
  intl,
  username,
  email,
  isLoading,
  courseId,
  isDashoard,
}) => {
  const { resumeCourse } = useModel("outline", courseId);
  const courseInRun = useSelector((state) => state.courseHome.courseInRun);
  const [urlResume, setUrlResume] = useState();

  let Component = urlResume ? NavLink : "a";

  const { celebrations, org, originalUserIsStaff, tabs, title, verifiedMode } =
    useModel("courseHomeMeta", courseId);

  const location = useLocation();
  const pathname = location.pathname;

  // const dashboardMenuItem = (
  //   <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
  //     <i class="bi bi-house"></i>
  //     {intl.formatMessage(messages.dashboard)}
  //   </Dropdown.Item>
  // );

  const courseNavsTitle = (
    <React.Fragment>
      <p class="course-navs-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4.10526 22C3.52632 22 3.03088 21.7826 2.61895 21.3478C2.20702 20.913 2.0007 20.3896 2 19.7778V4.22222C2 3.61111 2.20632 3.08815 2.61895 2.65333C3.03158 2.21852 3.52702 2.00074 4.10526 2H19.8947C20.4737 2 20.9695 2.21778 21.3821 2.65333C21.7947 3.08889 22.0007 3.61185 22 4.22222V19.7778C22 20.3889 21.794 20.9122 21.3821 21.3478C20.9702 21.7833 20.4744 22.0007 19.8947 22H4.10526ZM4.10526 16.4444V19.7778H19.8947V16.4444H4.10526ZM16.7368 14.2222H19.8947V4.22222H16.7368V14.2222ZM4.10526 14.2222H7.26316V4.22222H4.10526V14.2222ZM9.36842 14.2222H14.6316V4.22222H9.36842V14.2222Z"
            fill="#576F8A"
          />
        </svg>
        Khoá học của tôi
      </p>
    </React.Fragment>
  );

  //avatar state
  const [avatarSrc, setAvatarSrc] = useState(avatar_icon);

  const isShowGlobalChatGPT = useSelector(
    (state) => state.header.isShowGlobalChatGPT
  );
  const dispatch = useDispatch();

  const handlerChatGPT = () => {
    dispatch(showGlobalChatGPT());
  };
  const [isSearch, setIsSearch] = useState(true);
  const [isChatGPT, setIsChatGPT] = useState(true);
  const { toggleFeature } = useModel("courseHomeMeta", courseId);
  useEffect(() => {
    if (!toggleFeature?.includes("search")) {
      setIsSearch(false);
    }
    if (!toggleFeature?.includes("chatGPT")) {
      setIsChatGPT(false);
    }
  }, [toggleFeature]);

  //get running course
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        // const data = await fetchDashboard();

        const url = `${
          getConfig().LMS_BASE_URL
        }/api/course_home/outline/${courseId}`;
        const response = await getAuthenticatedHttpClient().get(url);
        const data = await fetchCourseResumeUrl(
          courseId,
          response?.data?.resume_course.url.split("/jump_to/")[1]
        );

        console.log(data);

        setUrlResume(data?.data?.redirect_url);
        dispatch(setCourseInRun(response.data.resume_course));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourse();
  }, []);

  return (
    <>
      {!isLoading && (
        <div className="d-flex align-items-center ">
          {/* {isChatGPT && (
            <div className="btn-chatGPT" onClick={handlerChatGPT}>
              <span>
                <img src={logoChatGPT} alt="logo-chatGPT" />
              </span>
            </div>
          )} */}
          {/* {isSearch && <SearchCourse />} */}

          {/* <a
            className="text-gray-700"
            href="https://funix.gitbook.io/funix-documentation/"
            target="_blank"
          >
            {intl.formatMessage(messages.help)}
          </a>
          <SelectLanguage username={username} /> */}
        </div>
      )}
      <Dropdown
        onToggle={(isOpen, event, metadata) =>
          console.log("debug", "onToggle", { isOpen, event, metadata })
        }
        onScroll={(e) => e.preventDefault()}
        className="user-dropdown position-relative z-index-100000"
      >
        <Dropdown.Toggle
          variant="outline-primary "
          className="toggle-mobile-icon-1"
        >
          {/* <FontAwesomeIcon
            icon={faUserCircle}
            className="d-md-none"
            size="lg"
          /> */}
          {/* <svg
            className="d-lg-none open-mobile-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clip-path="url(#clip0_5349_2050)">
              <path
                d="M20 18C20.2549 18.0003 20.5 18.0979 20.6854 18.2728C20.8707 18.4478 20.9822 18.687 20.9972 18.9414C21.0121 19.1958 20.9293 19.4464 20.7657 19.6418C20.6021 19.8373 20.3701 19.9629 20.117 19.993L20 20H4C3.74512 19.9997 3.49997 19.9021 3.31463 19.7272C3.1293 19.5522 3.01777 19.313 3.00283 19.0586C2.98789 18.8042 3.07067 18.5536 3.23426 18.3582C3.39786 18.1627 3.6299 18.0371 3.883 18.007L4 18H20ZM20 11C20.2652 11 20.5196 11.1054 20.7071 11.2929C20.8946 11.4804 21 11.7348 21 12C21 12.2652 20.8946 12.5196 20.7071 12.7071C20.5196 12.8946 20.2652 13 20 13H4C3.73478 13 3.48043 12.8946 3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929C3.48043 11.1054 3.73478 11 4 11H20ZM20 4C20.2652 4 20.5196 4.10536 20.7071 4.29289C20.8946 4.48043 21 4.73478 21 5C21 5.26522 20.8946 5.51957 20.7071 5.70711C20.5196 5.89464 20.2652 6 20 6H4C3.73478 6 3.48043 5.89464 3.29289 5.70711C3.10536 5.51957 3 5.26522 3 5C3 4.73478 3.10536 4.48043 3.29289 4.29289C3.48043 4.10536 3.73478 4 4 4H20Z"
                fill="#576F8A"
              />
            </g>
            <defs>
              <clipPath id="clip0_5349_2050">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg> */}
          <button className="action-button">
            <span data-hj-suppress className="d-none d-lg-flex">
              {username.split(" ")[0][0].toUpperCase()}
            </span>

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
        <Dropdown.Menu className="dropdown-menu-right">
          <Dropdown.Toggle
            className="toggle-mobile-icon-2"
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

          {/* {dashboardMenuItem} */}
          <div class="menu-user">
            <p>{username.split(" ")[0][0].toUpperCase()}</p>
            <div>
              <h3>{username}</h3>
              <p>{email}</p>
            </div>
          </div>
          {!isDashoard && (
            <Collapsible
              className="course-tabs-container d-block d-lg-none"
              title={courseNavsTitle}
            >
              <div className="course-tabs d-flex flex-column">
                {tabs &&
                  tabs.map(({ url, title, slug }, index) => {
                    if (url.endsWith("/home") || url.endsWith("/dates")) {
                      const resumeUrl = courseInRun
                        ? courseInRun?.url
                        : urlToPath(url);
                      resumeCourse?.url;
                      const to =
                        index === 0
                          ? urlResume
                            ? urlToPath(urlResume)
                            : resumeUrl
                          : urlToPath(url);

                      if (index > 1) {
                        return;
                      } else {
                        if (index === 1) {
                          return (
                            <NavLink
                              key={slug}
                              className={"nav-item flex-shrink-0 nav-link"}
                              activeClassName="active"
                              to={to}
                              onClick={(e) => {
                                if (pathname.includes("/dates")) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              {title}
                            </NavLink>
                          );
                        }
                        return (
                          <Component
                            key={slug}
                            className={"nav-item flex-shrink-0 nav-link"}
                            href={Component === "a" ? to : undefined}
                            to={Component === NavLink ? to : undefined}
                            onClick={(e) => {
                              if (!pathname.includes("/dates")) {
                                e.preventDefault();
                              }
                            }}
                          >
                            {title}
                          </Component>
                        );
                      }
                    }

                    return;
                  })}
              </div>
            </Collapsible>
          )}

          <Dropdown.Item
            className="user-account"
            href={`${getConfig().LMS_BASE_URL}/account/settings`}
          >
            {/* <i class="bi bi-person"></i> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M3.8987 11.8997C4.46536 11.4663 5.0987 11.1248 5.7987 10.875C6.4987 10.6252 7.23203 10.5001 7.9987 10.4997C8.76536 10.4997 9.4987 10.6248 10.1987 10.875C10.8987 11.1252 11.532 11.4668 12.0987 11.8997C12.4876 11.4441 12.7905 10.9275 13.0074 10.3497C13.2243 9.7719 13.3325 9.15523 13.332 8.49967C13.332 7.0219 12.8127 5.76345 11.774 4.72434C10.7354 3.68523 9.47692 3.1659 7.9987 3.16634C6.52092 3.16634 5.26248 3.6859 4.22336 4.72501C3.18425 5.76412 2.66492 7.02234 2.66536 8.49967C2.66536 9.15523 2.77381 9.7719 2.9907 10.3497C3.20759 10.9275 3.51025 11.4441 3.8987 11.8997ZM7.9987 9.16634C7.34314 9.16634 6.79025 8.94145 6.34003 8.49167C5.88981 8.0419 5.66492 7.48901 5.66536 6.83301C5.66536 6.17745 5.89048 5.62456 6.3407 5.17434C6.79092 4.72412 7.34359 4.49923 7.9987 4.49967C8.65425 4.49967 9.20714 4.72479 9.65736 5.17501C10.1076 5.62523 10.3325 6.1779 10.332 6.83301C10.332 7.48856 10.1071 8.04145 9.65736 8.49167C9.20759 8.9419 8.6547 9.16679 7.9987 9.16634ZM7.9987 15.1663C7.07648 15.1663 6.20981 14.9912 5.3987 14.641C4.58759 14.2908 3.88203 13.8159 3.28203 13.2163C2.68203 12.6163 2.20714 11.9108 1.85736 11.0997C1.50759 10.2886 1.33248 9.4219 1.33203 8.49967C1.33203 7.57745 1.50714 6.71079 1.85736 5.89967C2.20759 5.08856 2.68248 4.38301 3.28203 3.78301C3.88203 3.18301 4.58759 2.70812 5.3987 2.35834C6.20981 2.00856 7.07648 1.83345 7.9987 1.83301C8.92092 1.83301 9.78759 2.00812 10.5987 2.35834C11.4098 2.70856 12.1154 3.18345 12.7154 3.78301C13.3154 4.38301 13.7905 5.08856 14.1407 5.89967C14.4909 6.71079 14.6658 7.57745 14.6654 8.49967C14.6654 9.4219 14.4903 10.2886 14.14 11.0997C13.7898 11.9108 13.3149 12.6163 12.7154 13.2163C12.1154 13.8163 11.4098 14.2915 10.5987 14.6417C9.78759 14.9919 8.92092 15.1668 7.9987 15.1663ZM7.9987 13.833C8.58759 13.833 9.14314 13.747 9.66537 13.575C10.1876 13.403 10.6654 13.1557 11.0987 12.833C10.6654 12.5108 10.1876 12.2637 9.66537 12.0917C9.14314 11.9197 8.58759 11.8335 7.9987 11.833C7.40981 11.833 6.85425 11.9192 6.33203 12.0917C5.80981 12.2641 5.33203 12.5112 4.8987 12.833C5.33203 13.1552 5.80981 13.4026 6.33203 13.575C6.85425 13.7475 7.40981 13.8335 7.9987 13.833ZM7.9987 7.83301C8.28759 7.83301 8.52648 7.73856 8.71536 7.54967C8.90425 7.36079 8.9987 7.1219 8.9987 6.83301C8.9987 6.54412 8.90425 6.30523 8.71536 6.11634C8.52648 5.92745 8.28759 5.83301 7.9987 5.83301C7.70981 5.83301 7.47092 5.92745 7.28203 6.11634C7.09314 6.30523 6.9987 6.54412 6.9987 6.83301C6.9987 7.1219 7.09314 7.36079 7.28203 7.54967C7.47092 7.73856 7.70981 7.83301 7.9987 7.83301Z"
                fill="#576F8A"
              />
            </svg>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>

          <Dropdown.Item className="user-account" href={getConfig().LOGOUT_URL}>
            {/* <i class="bi bi-box-arrow-left"></i>
             */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M15.3346 8.50033L12.668 5.83366V7.83366H6.66797V9.16699H12.668V11.167M0.667969 12.5003V4.50033C0.667969 4.1467 0.808445 3.80756 1.05849 3.55752C1.30854 3.30747 1.64768 3.16699 2.0013 3.16699H10.0013C10.3549 3.16699 10.6941 3.30747 10.9441 3.55752C11.1942 3.80756 11.3346 4.1467 11.3346 4.50033V6.50033H10.0013V4.50033H2.0013V12.5003H10.0013V10.5003H11.3346V12.5003C11.3346 12.8539 11.1942 13.1931 10.9441 13.4431C10.6941 13.6932 10.3549 13.8337 10.0013 13.8337H2.0013C1.64768 13.8337 1.30854 13.6932 1.05849 13.4431C0.808445 13.1931 0.667969 12.8539 0.667969 12.5003Z"
                fill="#576F8A"
              />
            </svg>
            {intl.formatMessage(messages.signOut)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* {!isLoading && (
        <div className={isShowGlobalChatGPT ? "css-1bljlat" : "css-16kvbm"}>
          <div className={isShowGlobalChatGPT ? "css-19dz5pz" : "css-1dntyew"}>
            <ChatGPT />
          </div>
        </div>
      )} */}
    </>
  );
};

AuthenticatedUserDropdown.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  courseId: PropTypes.string,
};

AuthenticatedUserDropdown.defaultProps = {
  isLoading: false,
};

export default injectIntl(AuthenticatedUserDropdown);
