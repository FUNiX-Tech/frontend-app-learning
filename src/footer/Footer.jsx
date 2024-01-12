import React from "react";
import "./Footer.scss";
import logo from "./assets/logo.png";

export default function Footer() {
  return (
    <footer id="custom-footer" className="border-top">
      <div className="footer-container">
        <div className="footer-section-logo">
          <img src={logo} alt="footer-logo" />
        </div>
        <p className="footer-bottom">
          ©2023. Đã đăng ký Bản quyền. FUNiX - Thành viên của Công ty Cổ phần
          Galaxy Education
        </p>
      </div>
    </footer>
  );
}
