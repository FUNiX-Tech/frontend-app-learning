import React, { useState, useCallback } from "react";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";

import { camelCaseObject, getConfig } from "@edx/frontend-platform";

const Feedback = ({ isShowFeedback, shouldDisplayDropdown }) => {
  //get user
  const authenticatedUser = getAuthenticatedUser();

  //file error size, content letters error
  const [showFileError, setShowFileError] = useState(false);
  const [errorFileMessage, setErrorFileMessage] = useState("");
  const [showContentError, setShowContentError] = useState(false);
  const [errorContentMessage, setErrorContentMessage] = useState("");
  const [errorSelectMessage, setErrorSelectMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //file state
  const [file, setFile] = useState(undefined);
  // value state
  const [value, setValue] = useState({
    feedbackCategory: "",
    content: "",
  });
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

    //check for empty option
    if (value.feedbackCategory === "") {
      setErrorSelectMessage("Bạn chưa lựa chọn loại phản hồi!");
      return;
    }

    const url = new URL(`${getConfig().LMS_BASE_URL}/api/feedback/create`);
    const lesson_url = window.location.href;

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
      let clearTimeOut = false;
      let timeOutId = setTimeout(() => {
        setSuccessMessage("");
        clearTimeOut = true;
      }, 4000);
      if (clearTimeOut) {
        clearTimeout(timeOutId);
      }
    } catch (error) {
      console.log(error);
    }
    const fileInput = document.querySelector(".file-input");
    fileInput.value = "";
    setValue((prevValue) => {
      return { ...prevValue, content: "" };
    });
    setErrorFileMessage("");
    setShowFileError(false);
    setFile(null);
  });
  // Handle drag/drop with feedback file
  const [dragging, setDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);
  //handle drop file
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    setErrorFileMessage("");
    setSuccessMessage("");

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
          <h3 className="feedback-question-title">Phản hồi của bạn là gì?</h3>

          <select
            onChange={(e) => {
              inputChange(e);
              setErrorSelectMessage("");
            }}
            value={value.feedbackCategory}
            name="feedbackCategory"
            className="feedback-question-select"
          >
            <option value="">Chọn phản hồi</option>
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
          {errorSelectMessage && (
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
              {errorSelectMessage}
            </p>
          )}

          <h3 className="feedback-question-title">Phản hồi của bạn là gì?</h3>
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
              <label id="file-input-label" htmlFor="file-input">
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
  );
};

export default React.memo(Feedback);
