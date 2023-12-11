import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useModel } from "../../../../generic/model-store";

import UnitButton from "./UnitButton";
import SequenceNavigationDropdown from "./SequenceNavigationDropdown";
import useIndexOfLastVisibleChild from "../../../../generic/tabs/useIndexOfLastVisibleChild";
import { useSelector } from "react-redux";

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
        headerHeight + courseTagsNavHeight + instructorToolbarHeight + "px";
    } else {
      fixedElement.style.paddingTop = headerHeight + courseTagsNavHeight + "px";
    }

    // Adjust position on scroll
    const handleScroll = () => {
      if (window.scrollY >= 137.5) {
        fixedElement.style.paddingTop = courseTagsNavHeight + "px";
        return;
      } else if (window.scrollY >= 50 && window.scrollY < 85.5) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            courseTagsNavHeight - window.scrollY + "px";
          return;
        }
      } else if (window.scrollY >= 122 && window.scrollY < 137.5) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            headerHeight +
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            headerHeight + courseTagsNavHeight - window.scrollY + "px";
          return;
        }
      } else if (window.scrollY >= 85.5 && window.scrollY < 122) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            courseTagsNavHeight +
            30 +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            courseTagsNavHeight + 30 - window.scrollY + "px";
          return;
        }
      } else if (window.scrollY <= 50) {
        if (instructorToolbar) {
          fixedElement.style.paddingTop =
            headerHeight +
            courseTagsNavHeight +
            instructorToolbarHeight -
            window.scrollY +
            "px";
          return;
        } else {
          fixedElement.style.paddingTop =
            headerHeight + courseTagsNavHeight - window.scrollY + "px";
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

  return (
    <div style={{ flexBasis: "100%", minWidth: 0 }}>
      <div className="sequence-navigation-tabs-container" ref={containerRef}>
        {/* Right Menu */}

        <div
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
              onClick={onNavigate}
            />
          ))}
        </div>

        {/* Chat GPT */}

        <div
          className={`${
            isShowChatbot
              ? "sequence-navigation-tabs d-flex flex-grow-1 active"
              : "sequence-navigation-tabs d-flex flex-grow-1"
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
          <div
            className={`${
              isShowChatbot ? "input-message" : "input-message hide"
            }`}
          >
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
              : "sequence-navigation-tabs d-flex flex-grow-1"
          }`}
          style={shouldDisplayDropdown ? null : null}
        >
          <div className="feedback">
            <h2 className="feedback-title">Phản hồi</h2>
            <h3 className="feedback-question-title">Phản hồi của bạn là gì?</h3>
            <form>
              <select className="feedback-question-select">
                <option value="">Nội dung chứa thông tin lỗi thời</option>
                <option value="">Nội dung không được giải thích tốt</option>
                <option value="">Nội dung cần chi tiết hơn</option>
                <option value="">
                  Tài nguyên bị thiếu hoặc bị hỏng (liên kết, tập dữ liệu, v.v.)
                </option>
                <option value="">Lỗi dịch nội dung</option>
              </select>
              <h3 className="feedback-question-title">
                Phản hồi của bạn là gì?
              </h3>
              <textarea
                placeholder="Nhập nội dung"
                name="feedback-text"
                className="feedback-text"
              ></textarea>
              <h3 className="feedback-question-title">Tải ảnh chụp</h3>
              <p className="file-inform">
                File ảnh: jpg, jpeg, png. Kích thước tối đa 5MB
              </p>
              <input type="file" className="file-input" />
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
