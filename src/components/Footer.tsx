import "./footer.css";
import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="km-footer" role="contentinfo">
      <div className="km-footer__container">
        {/* Brand */}
        <div className="km-footer__brand">
          <img src={logo} alt="K-Merge logo" className="km-footer__logo" />
          <div className="km-footer__brandtext">
            <strong>K-Merge</strong>
            <span>Student Portfolio Hub</span>
          </div>
        </div>

        {/* Tagline / message */}
        <p className="km-footer__tagline">
          Showcase your work. Discover opportunities.
        </p>

        {/* Social */}
        <div className="km-footer__social" aria-label="Social links">
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            target="_blank"
            rel="noopener"
            className="km-socialbtn"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            target="_blank"
            rel="noopener"
            className="km-socialbtn"
          >
            <FaInstagram />
          </a>
          <a
            href="https://github.com"
            aria-label="GitHub"
            target="_blank"
            rel="noopener"
            className="km-socialbtn"
          >
            <FaGithub />
          </a>
        </div>
      </div>

      <div className="km-footer__copy">© {year} K-Merge. All rights reserved.</div>
    </footer>
  );
}
