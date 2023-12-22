import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useModel } from "../../../../generic/model-store";

import UnitButton from "./UnitButton";
import SequenceNavigationDropdown from "./SequenceNavigationDropdown";
import useIndexOfLastVisibleChild from "../../../../generic/tabs/useIndexOfLastVisibleChild";
import { useSelector } from "react-redux";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { camelCaseObject, getConfig } from "@edx/frontend-platform";
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";

import sequence from "..";

export default function SequenceNavigationTabs({
  unitIds,
  unitId,
  showCompletion,
  onNavigate,
  courseId,
  title,
}) {
  const [indexOfLastVisibleChild, containerRef, invisibleStyle] =
    useIndexOfLastVisibleChild();
  const shouldDisplayDropdown = indexOfLastVisibleChild === -1;

  //get user
  const authenticatedUser = getAuthenticatedUser();

  //file error size, content letters error
  const [showFileError, setShowFileError] = useState(false);
  const [errorFileMessage, setErrorFileMessage] = useState("");
  const [showContentError, setShowContentError] = useState(false);
  const [errorContentMessage, setErrorContentMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //file state
  const [file, setFile] = useState(undefined);
  // value state
  const [value, setValue] = useState({
    feedbackCategory: "",
    content: "",
  });

  //get state
  const isShowRightMenu = useSelector(
    (state) => state.header.isShowLessonContent
  );

  const isShowChatbot = useSelector((state) => state.header.isShowChatbot);

  const isShowFeedback = useSelector((state) => state.header.isShowFeedback);
  //Right side bar scrolling hander
  useEffect(() => {
    // Get the fixed element
    const fixedElement = document.querySelector(
      "#courseware-sequenceNavigation"
    );
    const instructorToolbar = document.querySelector("#instructor-toolbar");
    const header = document.querySelector(".learning-header");
    const headerHeight = header.offsetHeight;
    const courseTagsNav = document.querySelector("#courseTabsNavigation");
    const courseTagsNavHeight = courseTagsNav.offsetHeight;
    let instructorToolbarHeight = 0;
    if (instructorToolbar) {
      instructorToolbarHeight = instructorToolbar.offsetHeight;
      fixedElement.style.paddingTop =
        (headerHeight + courseTagsNavHeight + instructorToolbarHeight) / 16 +
        "rem";
    } else {
      fixedElement.style.paddingTop =
        (headerHeight + courseTagsNavHeight) / 16 + "rem";
    }

    // Adjust position on scroll
    const handleScroll = () => {
      if (window.scrollY >= 137.5) {
        fixedElement.style.paddingTop = courseTagsNavHeight / 16 + "rem";
        return;
      } else if (
        window.scrollY > courseTagsNavHeight &&
        window.scrollY < 137.5
      ) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            (headerHeight +
              courseTagsNavHeight +
              instructorToolbarHeight -
              window.scrollY) /
              16 +
            "rem";
          return;
        } else {
          fixedElement.style.paddingTop = courseTagsNavHeight / 16 + "rem";
          return;
        }
      } else if (window.scrollY <= courseTagsNavHeight) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            (headerHeight +
              courseTagsNavHeight +
              instructorToolbarHeight -
              window.scrollY) /
              16 +
            "rem";
          return;
        } else {
          fixedElement.style.paddingTop =
            (headerHeight + courseTagsNavHeight - window.scrollY) / 16 + "rem";
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //Handle file
  const handleFile = useCallback((selectedFile) => {
    if (selectedFile) {
      const maxSizeBytes = 5 * 1024 * 1024;
      if (selectedFile.size > maxSizeBytes) {
        setShowFileError(true);
        setErrorFileMessage(
          "File ảnh lớn hơn 5mb. Bạn vui lòng giảm dung lượng dưới 5mb"
        );
        setFile(undefined);
      } else {
        setShowFileError(false);
        setErrorFileMessage("");
        setFile(selectedFile);
      }
    }
  }, []);

  //Handle feedback onchange file
  const handleFileChange = useCallback((e) => {
    setShowFileError(false);
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  });

  //input  text change
  const inputChange = useCallback((e) => {
    setShowContentError(false);
    setErrorContentMessage("");
    setSuccessMessage("");
    setValue((prevValue) => {
      return { ...prevValue, [e.target.name]: e.target.value };
    });
  });

  //hadnle submit feedback
  const handlerSubmit = useCallback(async (event) => {
    event.preventDefault();
    const url = new URL(`${getConfig().LMS_BASE_URL}/api/feedback/create`);
    const lesson_url = window.location.href;
    // const csrf_token = document.getElementById("csrf_token").value;
    // const feedbackcategory = document.getElementById("feedback-category").value;
    // const comment = document.getElementById("comments").value;
    // const email = document.getElementById("email").value;

    //check content content
    if (value.content.trim().length < 6) {
      setShowContentError(true);
      setErrorContentMessage("Nội dung phản hồi ít nhất 6 ký tự");
      return;
    }

    const formData = new FormData();

    const regex = /course-v1:([^/]+)/;
    const course_id = lesson_url.match(regex)[0];
    // const course_code = course_id.split("+")[1];
    formData.append("attachment", file);
    formData.append("category_id", value.feedbackCategory);
    formData.append("content", value.content);
    formData.append("email", authenticatedUser.email);
    formData.append("lesson_url", lesson_url);
    formData.append("course_code", course_id);

    try {
      const data = await getAuthenticatedHttpClient().post(url.href, formData, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowFileError(false);
      setErrorFileMessage("");
      setSuccessMessage("Cảm ơn đã gửi phản hồi");
    } catch (error) {
      console.log(error);
    }
    const fileInput = document.querySelector(".file-input");
    fileInput.value = "";
    setValue((prevValue) => {
      return { ...prevValue, content: "" };
    });
    setFile(null);
  });
  // Handle drag/drop with feedback file
  const [dragging, setDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);
  //handle drop file
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    setErrorFileMessage("");
    // Access the dropped files from the DataTransfer object
    const droppedFileList = e.dataTransfer.files;
    if (droppedFileList.length > 1) {
      setShowFileError(true);
      setErrorFileMessage("Bạn chỉ có thể đính kèm 1 file");
      return;
    }

    const droppedFile = e.dataTransfer.files[0];

    //Check drop file with .jpeg, .png, .jpg
    if (
      !droppedFile.name
        .substring(droppedFile.name.length - 5)
        .includes("jpg") &&
      !droppedFile.name
        .substring(droppedFile.name.length - 5)
        .includes("jpeg") &&
      !droppedFile.name.substring(droppedFile.name.length - 5).includes("png")
    ) {
      return;
    }
    //handle drop file
    handleFile(droppedFile);
  }, []);

  return (
    <div style={{ flexBasis: "100%", minWidth: 0 }}>
      <div className="sequence-navigation-tabs-container" ref={containerRef}>
        {/* Right Menu */}

        {/* <div
          className={`${
            isShowRightMenu
              ? "sequence-navigation-tabs d-flex flex-grow-1 active"
              : "sequence-navigation-tabs d-flex flex-grow-1"
          }`}
          style={shouldDisplayDropdown ? null : null}
        >
          <div className="sequence-lesson-title">
            <h2 className="lesson-title">{title}</h2>
          </div>

          {unitIds.map((buttonUnitId) => (
            <UnitButton
              key={buttonUnitId}
              unitId={buttonUnitId}
              isActive={unitId === buttonUnitId}
              showCompletion={showCompletion}
              onClick={(...params) => {
                document
                  .querySelector(`iframe[data-unit-usage-id='${buttonUnitId}'`)
                  .contentWindow.postMessage(
                    { type: "learningprojectxblock", resize: true },
                    "*"
                  );
                onNavigate(...params);
              }}
            />
          ))}
        </div> */}

        {/* Chat GPT */}

        <div
          className={`${
            isShowChatbot
              ? "sequence-navigation-tabs d-flex flex-grow-1 active chatbot"
              : "sequence-navigation-tabs  d-flex flex-grow-1 hidden"
          }`}
          style={shouldDisplayDropdown ? null : null}
        >
          <h2 className="chat-gpt-title">Chat GPT</h2>
          <div className="message">
            <div className="you">Y</div>
            <div className="your-message">Mọi người nghĩ gì về Funix?</div>
          </div>
          <div className="chat-gpt-message">
            <div className="chat-gpt-avatar">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="30" rx="2" fill="#10A37F" />
                <path
                  d="M24.141 13.052a5.347 5.347 0 0 0-.46-4.391 5.408 5.408 0 0 0-5.824-2.595 5.346 5.346 0 0 0-4.033-1.798 5.408 5.408 0 0 0-5.159 3.744 5.348 5.348 0 0 0-3.575 2.594 5.409 5.409 0 0 0 .665 6.341 5.347 5.347 0 0 0 .46 4.392 5.408 5.408 0 0 0 5.824 2.595 5.348 5.348 0 0 0 4.033 1.797 5.408 5.408 0 0 0 5.16-3.746 5.349 5.349 0 0 0 3.576-2.594 5.408 5.408 0 0 0-.667-6.339zm-8.067 11.276a4.01 4.01 0 0 1-2.575-.93l.127-.072 4.273-2.47a.694.694 0 0 0 .352-.607v-6.025l1.806 1.043a.064.064 0 0 1 .035.05v4.989a4.028 4.028 0 0 1-4.018 4.022zm-8.642-3.69a4.01 4.01 0 0 1-.48-2.696l.127.076 4.273 2.468a.696.696 0 0 0 .702 0l5.218-3.012v2.086a.065.065 0 0 1-.026.055l-4.32 2.494a4.026 4.026 0 0 1-5.494-1.472zm-1.125-9.33a4.007 4.007 0 0 1 2.094-1.764l-.002.147v4.938a.695.695 0 0 0 .35.607l5.218 3.012-1.806 1.043a.065.065 0 0 1-.061.006L7.78 16.8a4.026 4.026 0 0 1-1.473-5.492zm14.841 3.453-5.217-3.012 1.806-1.043a.064.064 0 0 1 .06-.005l4.321 2.494a4.024 4.024 0 0 1-.621 7.259v-5.085a.693.693 0 0 0-.349-.608zm1.798-2.706a5.988 5.988 0 0 0-.127-.075L18.546 9.51a.696.696 0 0 0-.702 0l-5.218 3.013v-2.086a.064.064 0 0 1 .026-.056l4.32-2.492a4.023 4.023 0 0 1 5.974 4.165zm-11.302 3.719L9.837 14.73a.065.065 0 0 1-.035-.05V9.69a4.023 4.023 0 0 1 6.597-3.088 3.72 3.72 0 0 0-.127.072l-4.274 2.468a.695.695 0 0 0-.351.608l-.003 6.023zm.981-2.116 2.324-1.342 2.324 1.341v2.683l-2.324 1.342-2.324-1.342v-2.682z"
                  fill="#fff"
                />
              </svg>
            </div>
            <div className="chat-gpt-response">
              - Trung tâm Funix chuyên giảng dạy tiếng Anh cho trẻ em, tiếng Anh
              thiếu nhi, Cambridge English: STARTERS, MOVERS, FLYERS/ KET, PET.
              <br />
              - Với nhiều hoạt động trải nghiệm miễn phí cho học viên.
              <br />
              - Tổ chức nhiều sân chơi theo dòng sự kiện hoàn toàn miễn phí.
              <br />
              - Hỗ trợ Tiếng Anh Tiểu học, THCS cho học viên miễn phí hoàn toàn
              xuyên suốt 6 tháng.
              <br />- Nơi duy nhất tại Bình Dương Ba mẹ được vào xem bé thi vấn
              đáp cuối khóa.
              <br />- Nhiều học viên đạt kết quả cao chứng chỉ Cambridge và
              trong học tập.
              <div className="chat-icon-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="17"
                  viewBox="0 0 14 17"
                  fill="none"
                >
                  <path
                    d="M2.90909 3.24286C2.71804 3.24286 2.53517 3.31741 2.40062 3.44956C2.26613 3.58165 2.19091 3.76042 2.19091 3.94643V14.125C2.19091 14.311 2.26613 14.4898 2.40062 14.6219L2.33055 14.6932L2.40062 14.6219C2.53517 14.754 2.71804 14.8286 2.90909 14.8286H11.0909C11.282 14.8286 11.4648 14.754 11.5994 14.6219C11.7339 14.4898 11.8091 14.311 11.8091 14.125V3.94643C11.8091 3.76042 11.7339 3.58165 11.5994 3.44956C11.4648 3.31741 11.282 3.24286 11.0909 3.24286H10.2487C10.1241 3.54803 9.91233 3.81166 9.63858 4.00166C9.34527 4.20524 8.99513 4.31438 8.63636 4.31429L2.90909 3.24286ZM2.90909 3.24286H3.75131C3.87592 3.54803 4.08767 3.81166 4.36142 4.00166C4.65473 4.20524 5.00487 4.31438 5.36364 4.31429C5.36365 4.31429 5.36366 4.31429 5.36366 4.31429M2.90909 3.24286L5.36366 4.31429M5.36366 4.31429H8.63634H5.36366ZM10.2487 1.97143C9.99187 1.34286 9.36595 0.9 8.63636 0.9L5.36366 0.9C5.36366 0.9 5.36365 0.9 5.36364 0.9C5.00487 0.899904 4.65473 1.00904 4.36142 1.21262C4.08767 1.40263 3.87592 1.66626 3.75131 1.97143H2.90909C2.37682 1.97143 1.866 2.17908 1.48909 2.54926C1.11212 2.9195 0.9 3.42204 0.9 3.94643V14.125C0.9 14.6494 1.11212 15.1519 1.48909 15.5222C1.866 15.8924 2.37682 16.1 2.90909 16.1H11.0909C11.6232 16.1 12.134 15.8924 12.5109 15.5222C12.8879 15.1519 13.1 14.6494 13.1 14.125V3.94643C13.1 3.42204 12.8879 2.9195 12.5109 2.54926C12.134 2.17908 11.6232 1.97143 11.0909 1.97143H10.2487ZM5.04801 2.29968C5.13142 2.21776 5.24492 2.17143 5.36364 2.17143H8.63636C8.75508 2.17143 8.86858 2.21776 8.95199 2.29968C9.03533 2.38154 9.08182 2.49217 9.08182 2.60714C9.08182 2.72211 9.03533 2.83275 8.95199 2.91461C8.86858 2.99652 8.75508 3.04286 8.63636 3.04286H5.36364C5.24492 3.04286 5.13142 2.99652 5.04801 2.91461C4.96467 2.83275 4.91818 2.72211 4.91818 2.60714C4.91818 2.49217 4.96467 2.38154 5.04801 2.29968Z"
                    stroke="#ACACBE"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4.66536 7.33301L7.33203 1.33301C7.86246 1.33301 8.37117 1.54372 8.74625 1.91879C9.12132 2.29387 9.33203 2.80257 9.33203 3.33301V5.99967H13.1054C13.2986 5.99749 13.4901 6.03734 13.6664 6.11649C13.8428 6.19563 13.9998 6.31216 14.1266 6.45802C14.2534 6.60387 14.347 6.77556 14.4009 6.96118C14.4548 7.1468 14.4677 7.34191 14.4387 7.53301L13.5187 13.533C13.4705 13.8509 13.309 14.1407 13.064 14.349C12.819 14.5573 12.5069 14.67 12.1854 14.6663H4.66536M4.66536 7.33301V14.6663M4.66536 7.33301H2.66536C2.31174 7.33301 1.9726 7.47348 1.72256 7.72353C1.47251 7.97358 1.33203 8.31272 1.33203 8.66634V13.333C1.33203 13.6866 1.47251 14.0258 1.72256 14.2758C1.9726 14.5259 2.31174 14.6663 2.66536 14.6663H4.66536"
                    stroke="#ACACBE"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M11.3314 8.66658L8.66473 14.6666C8.1343 14.6666 7.62559 14.4559 7.25052 14.0808C6.87545 13.7057 6.66473 13.197 6.66473 12.6666V9.99992H2.8914C2.69813 10.0021 2.50669 9.96225 2.33035 9.8831C2.15401 9.80396 1.99699 9.68743 1.87016 9.54157C1.74333 9.39572 1.64973 9.22403 1.59584 9.03841C1.54195 8.85279 1.52906 8.65768 1.55807 8.46658L2.47807 2.46658C2.52628 2.14864 2.68778 1.85884 2.9328 1.65058C3.17782 1.44231 3.48985 1.32961 3.8114 1.33325H11.3314M11.3314 8.66658V1.33325M11.3314 8.66658H13.1114C13.4887 8.67326 13.8553 8.54116 14.1417 8.29537C14.428 8.04958 14.6142 7.70721 14.6647 7.33325V2.66658C14.6142 2.29262 14.428 1.95025 14.1417 1.70446C13.8553 1.45867 13.4887 1.32658 13.1114 1.33325H11.3314"
                    stroke="#ACACBE"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="input-message">
            <div className="form-container">
              <div className="form-control-container">
                <input type="text" placeholder="Gửi tin nhắn" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M14.0013 0.833496L6.66797 8.16683M14.0013 0.833496L9.33464 14.1668L6.66797 8.16683M14.0013 0.833496L0.667969 5.50016L6.66797 8.16683"
                    stroke="#ACACBE"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.05919 3.46207C6.17433 2.8109 7.474 2.54811 8.75452 2.71488C10.035 2.88166 11.2241 3.46858 12.1352 4.38366C13.0463 5.29874 13.6281 6.49027 13.7894 7.7715C13.8239 8.04548 13.6297 8.29554 13.3557 8.33002C13.0818 8.36451 12.8317 8.17036 12.7972 7.89637C12.6636 6.83476 12.1815 5.84747 11.4266 5.08925C10.6716 4.33102 9.6864 3.8447 8.62537 3.70651C7.56434 3.56832 6.48744 3.78606 5.56345 4.32562C4.86218 4.73512 4.27907 5.31242 3.86336 6.0006H6.0013C6.27744 6.0006 6.5013 6.22446 6.5013 6.5006C6.5013 6.77675 6.27744 7.0006 6.0013 7.0006H2.66797C2.39183 7.0006 2.16797 6.77675 2.16797 6.5006V3.16727C2.16797 2.89113 2.39183 2.66727 2.66797 2.66727C2.94411 2.66727 3.16797 2.89113 3.16797 3.16727V5.23247C3.65486 4.51232 4.29959 3.90563 5.05919 3.46207ZM2.64651 8.67123C2.92046 8.63655 3.17066 8.83052 3.20534 9.10447C3.33969 10.1657 3.82214 11.1524 4.57718 11.9102C5.33221 12.6679 6.3172 13.1539 7.37794 13.292C8.43868 13.4302 9.51529 13.2127 10.4392 12.6736C11.1402 12.2646 11.7232 11.688 12.1392 11.0006H10.0013C9.72516 11.0006 9.5013 10.7767 9.5013 10.5006C9.5013 10.2245 9.72516 10.0006 10.0013 10.0006H13.3346C13.6108 10.0006 13.8346 10.2245 13.8346 10.5006V13.8339C13.8346 14.1101 13.6108 14.3339 13.3346 14.3339C13.0585 14.3339 12.8346 14.1101 12.8346 13.8339V11.7684C12.3475 12.488 11.7027 13.0942 10.9432 13.5373C9.82817 14.1879 8.52891 14.4504 7.2488 14.2837C5.96868 14.117 4.77999 13.5305 3.86881 12.616C2.95762 11.7016 2.37539 10.5108 2.21326 9.23007C2.17858 8.95611 2.37255 8.70591 2.64651 8.67123Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Feedback */}
        <div
          className={`${
            isShowFeedback
              ? "sequence-navigation-tabs d-flex flex-grow-1 active feedback"
              : "sequence-navigation-tabs d-flex flex-grow-1 hidden"
          }`}
          style={shouldDisplayDropdown ? null : null}
        >
          <div className="feedback">
            <h2 className="feedback-title">Phản hồi</h2>
            <form onSubmit={handlerSubmit}>
              <h3 className="feedback-question-title">
                Phản hồi của bạn là gì?
              </h3>

              <select
                onChange={inputChange}
                value={value.feedbackCategory}
                name="feedbackCategory"
                className="feedback-question-select"
              >
                <option value="" selected="selected" disabled>
                  Chọn phản hồi
                </option>
                <option value="Content contains outdated information">
                  Nội dung chứa thông tin lỗi thời
                </option>
                <option value="Content is not explained well">
                  Nội dung không được giải thích tốt
                </option>
                <option value="Content needs more detail">
                  Nội dung cần chi tiết hơn
                </option>
                <option value="Resource is missing or broken (link, dataset, etc)">
                  Tài nguyên bị thiếu hoặc bị hỏng (liên kết, tập dữ liệu, v.v.)
                </option>
                <option value="Translation Error in content">
                  Lỗi dịch nội dung
                </option>
              </select>

              <h3 className="feedback-question-title">
                Phản hồi của bạn là gì?
              </h3>
              <textarea
                placeholder="Nhập nội dung"
                name="content"
                className="feedback-text"
                value={value.content}
                onChange={inputChange}
              ></textarea>
              {showContentError && (
                <p className="show-error-content">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14.032 12.4712L8.70607 2.58062C8.32857 1.87937 7.32295 1.87937 6.94513 2.58062L1.61951 12.4712C1.53754 12.6235 1.49645 12.7944 1.50024 12.9672C1.50403 13.1401 1.55257 13.309 1.64113 13.4575C1.72969 13.606 1.85523 13.729 2.00551 13.8145C2.15579 13.9 2.32567 13.9451 2.49857 13.9453H13.1514C13.3244 13.9453 13.4945 13.9005 13.645 13.8151C13.7955 13.7297 13.9212 13.6067 14.01 13.4582C14.0987 13.3096 14.1474 13.1406 14.1513 12.9676C14.1551 12.7946 14.114 12.6236 14.032 12.4712ZM7.82576 12.4141C7.70215 12.4141 7.58131 12.3774 7.47853 12.3087C7.37575 12.2401 7.29564 12.1424 7.24833 12.0282C7.20103 11.914 7.18865 11.7884 7.21277 11.6671C7.23688 11.5459 7.29641 11.4345 7.38382 11.3471C7.47123 11.2597 7.58259 11.2002 7.70383 11.1761C7.82507 11.152 7.95073 11.1643 8.06494 11.2116C8.17914 11.2589 8.27675 11.3391 8.34543 11.4418C8.4141 11.5446 8.45076 11.6654 8.45076 11.7891C8.45076 11.9548 8.38491 12.1138 8.2677 12.231C8.15049 12.3482 7.99152 12.4141 7.82576 12.4141ZM8.50451 6.12813L8.32513 9.94063C8.32513 10.0732 8.27246 10.2004 8.17869 10.2942C8.08492 10.3879 7.95774 10.4406 7.82513 10.4406C7.69253 10.4406 7.56535 10.3879 7.47158 10.2942C7.37781 10.2004 7.32513 10.0732 7.32513 9.94063L7.14576 6.12969C7.14173 6.03862 7.15607 5.94768 7.18794 5.86227C7.2198 5.77687 7.26854 5.69875 7.33124 5.63259C7.39393 5.56642 7.46931 5.51355 7.55288 5.47713C7.63644 5.44072 7.72648 5.4215 7.81763 5.42063H7.8242C7.91597 5.42058 8.0068 5.43912 8.09121 5.47515C8.17561 5.51117 8.25185 5.56392 8.31531 5.63021C8.37877 5.6965 8.42814 5.77497 8.46044 5.86087C8.49275 5.94676 8.50731 6.03832 8.50326 6.13L8.50451 6.12813Z"
                      fill="#D82C0D"
                    />
                  </svg>
                  {errorContentMessage}
                </p>
              )}
              <h3 className="feedback-question-title">Hình ảnh đính kèm</h3>

              <div
                className="file-container"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label id="label-input-icon" htmlFor="file-input">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6.3077 19.5C5.80257 19.5 5.375 19.325 5.025 18.975C4.675 18.625 4.5 18.1974 4.5 17.6923V15.7308C4.5 15.5179 4.5718 15.3397 4.7154 15.1962C4.85898 15.0526 5.03718 14.9808 5.25 14.9808C5.46282 14.9808 5.64102 15.0526 5.7846 15.1962C5.92818 15.3397 5.99997 15.5179 5.99997 15.7308V17.6923C5.99997 17.7692 6.03202 17.8397 6.09612 17.9039C6.16024 17.968 6.23077 18 6.3077 18H17.6922C17.7692 18 17.8397 17.968 17.9038 17.9039C17.9679 17.8397 18 17.7692 18 17.6923V15.7308C18 15.5179 18.0718 15.3397 18.2154 15.1962C18.3589 15.0526 18.5371 14.9808 18.75 14.9808C18.9628 14.9808 19.141 15.0526 19.2845 15.1962C19.4281 15.3397 19.5 15.5179 19.5 15.7308V17.6923C19.5 18.1974 19.325 18.625 18.975 18.975C18.625 19.325 18.1974 19.5 17.6922 19.5H6.3077ZM11.25 7.38843L9.32692 9.3115C9.17821 9.46022 9.00161 9.53362 8.79712 9.5317C8.59264 9.52977 8.41283 9.45124 8.2577 9.29613C8.11283 9.14099 8.03784 8.96536 8.03272 8.76923C8.02759 8.57308 8.10258 8.39744 8.2577 8.2423L11.3673 5.13273C11.4609 5.03915 11.5596 4.97312 11.6634 4.93465C11.7673 4.89619 11.8795 4.87695 12 4.87695C12.1205 4.87695 12.2327 4.89619 12.3365 4.93465C12.4404 4.97312 12.5391 5.03915 12.6327 5.13273L15.7422 8.2423C15.891 8.39102 15.9644 8.56505 15.9624 8.7644C15.9605 8.96375 15.8871 9.14099 15.7422 9.29613C15.5871 9.45124 15.4089 9.53137 15.2077 9.5365C15.0064 9.54164 14.8282 9.46664 14.673 9.3115L12.7499 7.38843V15.0385C12.7499 15.2513 12.6782 15.4295 12.5346 15.5731C12.391 15.7167 12.2128 15.7885 12 15.7885C11.7872 15.7885 11.609 15.7167 11.4654 15.5731C11.3218 15.4295 11.25 15.2513 11.25 15.0385V7.38843Z"
                      fill="#576F8A"
                    />
                  </svg>
                </label>
                <div>
                  Kéo thả tệp tin hoặc
                  <label id="file-input-label" for="file-input">
                    Tải ảnh lên
                  </label>
                  <input
                    name="file"
                    accept=" .png , .jpg, .jpeg"
                    type="file"
                    className="file-input"
                    id="file-input"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="file-inform">
                  File ảnh: jpg, jpeg, png. Kích thước tối đa 5MB
                </p>
              </div>

              <button class="submit-feedback-btn">Gửi phản hồi</button>
            </form>
            {file && (
              <div className="file-upload">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5.99998 11.8327H9.99998C10.1417 11.8327 10.2604 11.7847 10.3562 11.6888C10.4521 11.593 10.5 11.4742 10.5 11.3324C10.5 11.1907 10.4521 11.072 10.3562 10.9763C10.2604 10.8805 10.1417 10.8327 9.99998 10.8327H5.99998C5.85832 10.8327 5.73957 10.8806 5.64375 10.9765C5.54792 11.0724 5.5 11.1912 5.5 11.3329C5.5 11.4746 5.54792 11.5933 5.64375 11.6891C5.73957 11.7848 5.85832 11.8327 5.99998 11.8327ZM5.99998 9.16598H9.99998C10.1417 9.16598 10.2604 9.11805 10.3562 9.02218C10.4521 8.92631 10.5 8.80751 10.5 8.66578C10.5 8.52405 10.4521 8.40532 10.3562 8.3096C10.2604 8.21388 10.1417 8.16602 9.99998 8.16602H5.99998C5.85832 8.16602 5.73957 8.21395 5.64375 8.30982C5.54792 8.40569 5.5 8.52449 5.5 8.66622C5.5 8.80795 5.54792 8.92668 5.64375 9.0224C5.73957 9.11812 5.85832 9.16598 5.99998 9.16598ZM4.20513 14.3327C3.86838 14.3327 3.58333 14.216 3.35 13.9827C3.11667 13.7493 3 13.4643 3 13.1275V2.87115C3 2.53439 3.11667 2.24935 3.35 2.01602C3.58333 1.78268 3.86838 1.66602 4.20513 1.66602H9.00128C9.16386 1.66602 9.31882 1.69722 9.46617 1.75962C9.6135 1.822 9.74187 1.9079 9.85128 2.0173L12.6487 4.8147C12.7581 4.92411 12.844 5.05248 12.9064 5.19982C12.9688 5.34716 13 5.50212 13 5.6647V13.1275C13 13.4643 12.8833 13.7493 12.65 13.9827C12.4166 14.216 12.1316 14.3327 11.7948 14.3327H4.20513ZM9 5.06598C9 5.23598 9.0575 5.37848 9.1725 5.49348C9.2875 5.60848 9.43 5.66598 9.6 5.66598H12L9 2.666V5.06598Z"
                    fill="#576F8A"
                  />
                </svg>
                {file.name.length > 29
                  ? file.name.substring(0, 26) +
                    ".." +
                    file.name.substring(file.name.length - 4)
                  : file.name}
                <svg
                  onClick={() => {
                    setFile(undefined);
                    const fileInput = document.querySelector(".file-input");
                    if (fileInput) {
                      fileInput.value = "";
                    }
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8.00052 8.93385L4.73385 12.2005C4.61163 12.3227 4.45608 12.3839 4.26719 12.3839C4.0783 12.3839 3.92274 12.3227 3.80052 12.2005C3.6783 12.0783 3.61719 11.9227 3.61719 11.7339C3.61719 11.545 3.6783 11.3894 3.80052 11.2672L7.06719 8.00052L3.80052 4.73385C3.6783 4.61163 3.61719 4.45608 3.61719 4.26719C3.61719 4.0783 3.6783 3.92274 3.80052 3.80052C3.92274 3.6783 4.0783 3.61719 4.26719 3.61719C4.45608 3.61719 4.61163 3.6783 4.73385 3.80052L8.00052 7.06719L11.2672 3.80052C11.3894 3.6783 11.545 3.61719 11.7339 3.61719C11.9227 3.61719 12.0783 3.6783 12.2005 3.80052C12.3227 3.92274 12.3839 4.0783 12.3839 4.26719C12.3839 4.45608 12.3227 4.61163 12.2005 4.73385L8.93385 8.00052L12.2005 11.2672C12.3227 11.3894 12.3839 11.545 12.3839 11.7339C12.3839 11.9227 12.3227 12.0783 12.2005 12.2005C12.0783 12.3227 11.9227 12.3839 11.7339 12.3839C11.545 12.3839 11.3894 12.3227 11.2672 12.2005L8.00052 8.93385Z"
                    fill="#2C3744"
                  />
                </svg>
              </div>
            )}
            {showFileError && (
              <p className="show-error-file">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M14.032 12.4712L8.70607 2.58062C8.32857 1.87937 7.32295 1.87937 6.94513 2.58062L1.61951 12.4712C1.53754 12.6235 1.49645 12.7944 1.50024 12.9672C1.50403 13.1401 1.55257 13.309 1.64113 13.4575C1.72969 13.606 1.85523 13.729 2.00551 13.8145C2.15579 13.9 2.32567 13.9451 2.49857 13.9453H13.1514C13.3244 13.9453 13.4945 13.9005 13.645 13.8151C13.7955 13.7297 13.9212 13.6067 14.01 13.4582C14.0987 13.3096 14.1474 13.1406 14.1513 12.9676C14.1551 12.7946 14.114 12.6236 14.032 12.4712ZM7.82576 12.4141C7.70215 12.4141 7.58131 12.3774 7.47853 12.3087C7.37575 12.2401 7.29564 12.1424 7.24833 12.0282C7.20103 11.914 7.18865 11.7884 7.21277 11.6671C7.23688 11.5459 7.29641 11.4345 7.38382 11.3471C7.47123 11.2597 7.58259 11.2002 7.70383 11.1761C7.82507 11.152 7.95073 11.1643 8.06494 11.2116C8.17914 11.2589 8.27675 11.3391 8.34543 11.4418C8.4141 11.5446 8.45076 11.6654 8.45076 11.7891C8.45076 11.9548 8.38491 12.1138 8.2677 12.231C8.15049 12.3482 7.99152 12.4141 7.82576 12.4141ZM8.50451 6.12813L8.32513 9.94063C8.32513 10.0732 8.27246 10.2004 8.17869 10.2942C8.08492 10.3879 7.95774 10.4406 7.82513 10.4406C7.69253 10.4406 7.56535 10.3879 7.47158 10.2942C7.37781 10.2004 7.32513 10.0732 7.32513 9.94063L7.14576 6.12969C7.14173 6.03862 7.15607 5.94768 7.18794 5.86227C7.2198 5.77687 7.26854 5.69875 7.33124 5.63259C7.39393 5.56642 7.46931 5.51355 7.55288 5.47713C7.63644 5.44072 7.72648 5.4215 7.81763 5.42063H7.8242C7.91597 5.42058 8.0068 5.43912 8.09121 5.47515C8.17561 5.51117 8.25185 5.56392 8.31531 5.63021C8.37877 5.6965 8.42814 5.77497 8.46044 5.86087C8.49275 5.94676 8.50731 6.03832 8.50326 6.13L8.50451 6.12813Z"
                    fill="#D82C0D"
                  />
                </svg>
                {errorFileMessage}
              </p>
            )}
            {successMessage && (
              <p className="show-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M7.06927 9.20065L5.63594 7.76732C5.51372 7.6451 5.35816 7.58398 5.16927 7.58398C4.98038 7.58398 4.82483 7.6451 4.7026 7.76732C4.58038 7.88954 4.51927 8.0451 4.51927 8.23398C4.51927 8.42287 4.58038 8.57843 4.7026 8.70065L6.6026 10.6007C6.73594 10.734 6.89149 10.8007 7.06927 10.8007C7.24705 10.8007 7.4026 10.734 7.53594 10.6007L11.3026 6.83398C11.4248 6.71176 11.4859 6.55621 11.4859 6.36732C11.4859 6.17843 11.4248 6.02287 11.3026 5.90065C11.1804 5.77843 11.0248 5.71732 10.8359 5.71732C10.647 5.71732 10.4915 5.77843 10.3693 5.90065L7.06927 9.20065ZM8.0026 14.6673C7.08038 14.6673 6.21372 14.4923 5.4026 14.1423C4.59149 13.7923 3.88594 13.3173 3.28594 12.7173C2.68594 12.1173 2.21094 11.4118 1.86094 10.6007C1.51094 9.78954 1.33594 8.92287 1.33594 8.00065C1.33594 7.07843 1.51094 6.21176 1.86094 5.40065C2.21094 4.58954 2.68594 3.88398 3.28594 3.28398C3.88594 2.68398 4.59149 2.20898 5.4026 1.85898C6.21372 1.50898 7.08038 1.33398 8.0026 1.33398C8.92483 1.33398 9.79149 1.50898 10.6026 1.85898C11.4137 2.20898 12.1193 2.68398 12.7193 3.28398C13.3193 3.88398 13.7943 4.58954 14.1443 5.40065C14.4943 6.21176 14.6693 7.07843 14.6693 8.00065C14.6693 8.92287 14.4943 9.78954 14.1443 10.6007C13.7943 11.4118 13.3193 12.1173 12.7193 12.7173C12.1193 13.3173 11.4137 13.7923 10.6026 14.1423C9.79149 14.4923 8.92483 14.6673 8.0026 14.6673Z"
                    fill="#5AA447"
                  />
                </svg>
                {successMessage}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* {shouldDisplayDropdown && (
        <SequenceNavigationDropdown
          unitId={unitId}
          onNavigate={onNavigate}
          showCompletion={showCompletion}
          unitIds={unitIds}
        />
      )} */}
    </div>
  );
}

SequenceNavigationTabs.propTypes = {
  unitId: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  showCompletion: PropTypes.bool.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
