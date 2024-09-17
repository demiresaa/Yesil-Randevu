// Footer.js
import React from "react";
import "./footer.css"; // CSS dosyasını ekliyoruz
import { Instagram, Facebook, Envelope } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <ul className="footer-links">
          <li>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </a>
          </li>
          <li>
            <a href="">
              <Envelope />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
