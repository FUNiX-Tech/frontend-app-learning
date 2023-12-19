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
import AIChatbot from "./AIChatbot/AIChatbot";

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

  //file error size
  const [showFileError, setShowFileError] = useState(false);
  //file state
  const [file, setFile] = useState(undefined);
  // value state
  const [value, setValue] = useState({
    feedbackCategory: "Content contains outdated information",
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
      console.log(window.scrollY);
      if (window.scrollY >= 137.5) {
        fixedElement.style.paddingTop = courseTagsNavHeight / 16 + "rem";
        return;
      } else if (window.scrollY >= 122 && window.scrollY < 137.5) {
        if (instructorToolbar) {
          (fixedElement.style.paddingTop =
            headerHeight +
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY) /
            16 +
            "rem";
          return;
        } else {
          fixedElement.style.paddingTop =
            headerHeight + courseTagsNavHeight - window.scrollY + "rem";
          return;
        }
      } else if (window.scrollY >= 50 && window.scrollY < 122) {
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
      } else if (window.scrollY <= 50) {
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

  //Handle feedback onchange file
  const handleFileChange = useCallback((e) => {
    setShowFileError(false);

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSizeBytes = 5 * 1024 * 1024;
      if (selectedFile.size > maxSizeBytes) {
        setShowFileError(true);
        setFile(undefined);
      } else {
        setShowFileError(false);
        setFile(selectedFile);
      }
    }
  });

  //input  text change
  const inputChange = useCallback((e) => {
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
      alert("Vui lòng nhập nội dung phản hồi ít nhất 6 ký tự");
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

      alert("Cám ơn bạn đã gửi phản hồi lỗi!");
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

        <AIChatbot
          isShowChatbot={isShowChatbot}
          shouldDisplayDropdown={shouldDisplayDropdown}
        />
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
            <h3 className="feedback-question-title">Phản hồi của bạn là gì?</h3>
            <form onSubmit={handlerSubmit}>
              <select
                onChange={inputChange}
                value={value.feedbackCategory}
                name="feedbackCategory"
                className="feedback-question-select"
              >
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
              <h3 className="feedback-question-title">Tải ảnh chụp</h3>
              <p className="file-inform">
                File ảnh: jpg, jpeg, png. Kích thước tối đa 5MB
              </p>

              <input
                name="file"
                accept=" .png , .jpg, .jpeg"
                type="file"
                className="file-input"
                onChange={handleFileChange}
              />
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
                  File ảnh lớn hơn 5mb. Bạn vui lòng giảm dung lượng dưới 5mb
                </p>
              )}
              <button class="submit-feedback-btn">Gửi phản hồi</button>
            </form>
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
