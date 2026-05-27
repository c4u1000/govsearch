import { Link } from 'react-router-dom';
import './Footer.css';

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/naics', label: 'NAICS Explorer' },
  { to: '/saved', label: 'Saved Searches' },
  { to: '/setup', label: 'API Setup' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#0a0a0f"/>
              <path d="M8 10h16M8 16h12M8 22h8" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="22" r="3" fill="#10b981"/>
            </svg>
            <span>SAMSpy</span>
          </Link>
          <p className="footer-tagline">
            Turn months of manual work into minutes of strategic action.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </div>

        <div className="footer-links">
          <h4>Resources</h4>
          <a href="https://sam.gov" target="_blank" rel="noopener noreferrer">SAM.gov</a>
          <a href="https://openkiosk.org/sam-gov-api-key/" target="_blank" rel="noopener noreferrer">API Key Setup</a>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <span>Not affiliated with SAM.gov</span>
          <span>For demonstration purposes</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SAMSpy. Government contract search powered by SAM.gov API.</p>
      </div>
    </footer>
  );
}