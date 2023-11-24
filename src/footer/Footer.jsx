import React from "react";
import "./Footer.scss";
import logo from "./assets/logo.png";

import location_icon from "./assets/location_icon.svg";
import phone_icon from "./assets/phone_icon.svg";
import email_icon from "./assets/mail_icon.svg";

export default function Footer() {
  return (
    <footer id="custom-footer" className="border-top">
      <div className="footer-container">
        {/* Logo, address, phone */}
        <div className="footer-section">
          <div className="footer-section-logo">
            <img src={logo} alt="logo" />
          </div>
          <p className="footer-section-location">
            <img src={location_icon} alt="location_icon" />
            Tầng 0, tòa nhà FPT, 17 Duy Tân, Cầu Giấy, Hà Nội
          </p>
          <p className="footer-section-email">
            <img src={email_icon} alt="email_icon" />
            info@funix.edu.vn
          </p>
          <p className="footer-section-phone">
            <img src={phone_icon} alt="phone_icon" />
            0987654321
          </p>
        </div>

        {/* About us */}
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <ul>
            <li>Giới thiệu FUNiX</li>
            <li>Đội ngũ Mentor</li>
            <li>Hợp tác</li>
            <li>Liên hệ</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* information */}
        <div className="footer-section">
          <h3>Học gì ở FUNiX</h3>
          <ul>
            <li>Chương trình học</li>
            <li>Học phí</li>
            <li>Cách Học</li>
            <li>Đời sống sinh viên</li>
          </ul>
        </div>

        {/* News */}
        <div className="footer-section">
          <h3>Tin tức</h3>
          <ul>
            <li>Học đường</li>
            <li>Sự kiện</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          @2023. All rights reserved. FUNIX-A member of FPT Corporation
          funix.edu.vn
        </p>
      </div>
    </footer>
  );
}
