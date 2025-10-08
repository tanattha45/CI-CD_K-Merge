import "./footer.css";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="km-footer">
      <div className="km-footer__container">
        {/* Logo / Brand */}
        <div className="km-footer__brand">
          <img
            src={logo}
            alt="K-Merge Logo"
            className="km-footer__logo"
          />
        </div>

        {/* Navigation */}
        <nav className="km-footer__nav">
          <a href="/">Home</a>
          <a href="/browse">Browse</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>

        {/* Social icons */}
        <div className="km-footer__social">
          <a href="https://facebook.com" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://github.com" aria-label="GitHub">
            <FaGithub />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="km-footer__copy">
        © {year} K-Merge. All rights reserved.
      </div>
    </footer>
  );
}
