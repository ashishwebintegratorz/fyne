import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .fyne-footer {
          background: #0a0a0a;
          color: #e8e8e8;
          font-family: 'Montserrat', sans-serif;
          padding: 52px 48px 28px;
          position: relative;
          overflow: hidden;
        }

        .fyne-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 48px;
          right: 48px;
          height: 0.5px;
          background: linear-gradient(90deg, transparent, #c8a96e 30%, #c8a96e 70%, transparent);
          opacity: 0.6;
        }

        .fyne-footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 38px;
          letter-spacing: 0.04em;
          color: #fff;
          margin: 0 0 6px;
          line-height: 1;
        }

        .fyne-footer-tagline {
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #888;
          margin: 0 0 40px;
          font-weight: 400;
        }

        .fyne-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 32px;
          margin-bottom: 40px;
        }

        @media (max-width: 640px) {
          .fyne-footer-grid {
            grid-template-columns: 1fr;
          }
          .fyne-footer {
            padding: 40px 24px 24px;
          }
        }

        .fyne-footer-col-title {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c8a96e;
          font-weight: 500;
          margin: 0 0 14px;
          display: block;
        }

        .fyne-footer-col p {
          font-size: 12.5px;
          color: #999;
          margin: 0 0 8px;
          line-height: 1.65;
          font-weight: 300;
        }

        .fyne-footer-col a {
          font-size: 12.5px;
          color: #999;
          text-decoration: none;
          display: block;
          margin-bottom: 8px;
          font-weight: 300;
          transition: color 0.2s;
        }

        .fyne-footer-col a:hover {
          color: #e8e8e8;
        }

        .fyne-footer-divider {
          height: 0.5px;
          background: #2a2a2a;
          margin: 0 0 20px;
        }

        .fyne-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .fyne-footer-copy {
          font-size: 10.5px;
          color: #555;
          font-weight: 300;
          letter-spacing: 0.04em;
        }

        .fyne-footer-socials {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .fyne-social-icon {
          width: 30px;
          height: 30px;
          border: 0.5px solid #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }

        .fyne-social-icon:hover {
          border-color: #c8a96e;
          color: #c8a96e;
        }

        .fyne-gold-dot {
          display: inline-block;
          width: 3px;
          height: 3px;
          background: #c8a96e;
          border-radius: 50%;
          margin: 0 10px;
          vertical-align: middle;
          opacity: 0.7;
        }

        .fyne-powered-by {
          font-size: 10px;
          color: #444;
          font-weight: 300;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .fyne-powered-by a {
          color: #c8a96e;
          text-decoration: none;
          font-weight: 400;
          letter-spacing: 0.08em;
          transition: color 0.3s;
        }

        .fyne-powered-by a:hover {
          color: #e0c285;
        }

        .fyne-powered-by svg {
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        .fyne-powered-by a:hover svg {
          opacity: 1;
        }
      `}</style>

      <footer className="fyne-footer">
        <p className="fyne-footer-logo">Fyné</p>
        <p className="fyne-footer-tagline">Handcrafted luxury · UAE</p>

        <div className="fyne-footer-grid">
          <div className="fyne-footer-col">
            <span className="fyne-footer-col-title">About</span>
            <p>
              A luxurious vanilla-scented lip balm housed in Fyné's signature
              leather case. Designed to nourish and soften lips with everyday
              elegance.
            </p>
          </div>

          <div className="fyne-footer-col">
            <span className="fyne-footer-col-title">Shipping</span>
            <a href="#">UAE · 2–5 business days</a>
            <a href="#">GCC · 3–10 business days</a>
            <a href="#">Orders processed in 1–2 days</a>
          </div>

          <div className="fyne-footer-col">
            <span className="fyne-footer-col-title">Contact</span>
            <a href="mailto:fyneae@outlook.com">fyneae@outlook.com</a>
            <a
              href="https://instagram.com/fyne.ae"
              target="_blank"
              rel="noreferrer"
            >
              @fyne.ae
            </a>
          </div>
        </div>

        <div className="fyne-footer-divider" />

        <div className="fyne-footer-bottom">
          <span className="fyne-footer-copy">
            © 2025 Fyné
            <span className="fyne-gold-dot" />
            All rights reserved
          </span>

          <span className="fyne-powered-by">
            Crafted by
            <a href="https://webintegratorz.com/" target="_blank" rel="noreferrer">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              WebIntegratorz Technologies
            </a>
          </span>

          <div className="fyne-footer-socials">
            {/* Instagram */}
            <a
              href="https://instagram.com/fyne.ae"
              target="_blank"
              rel="noreferrer"
              className="fyne-social-icon"
              aria-label="Instagram"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:fyneae@outlook.com"
              className="fyne-social-icon"
              aria-label="Email"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
