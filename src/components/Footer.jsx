import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="pathora-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">P</span>
            <span>PATHORA</span>
          </Link>

          <p>
            Your journey to the right opportunity starts here.
          </p>
        </div>

        <div className="footer-developer">
          <span className="footer-label">
            DESIGNED & DEVELOPED BY
          </span>

          <h3>Shaik Mahammad Rehan</h3>

          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/in/shaik-mahammad-rehan-b919b5331"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>

            <a
              href="https://github.com/Shaik9779"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>

            <a
              href="https://www.instagram.com/hxxp_r07/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} PATHORA. All rights reserved.
        </span>

        <span>Built with care by Rehan.</span>
      </div>
    </footer>
  );
}

export default Footer;
