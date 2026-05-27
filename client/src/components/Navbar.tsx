import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/naics', label: 'NAICS Explorer' },
  { to: '/saved', label: 'Saved Searches' },
  { to: '/setup', label: 'API Setup' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#0a0a0f"/>
            <path d="M8 10h16M8 16h12M8 22h8" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="24" cy="22" r="3" fill="#10b981"/>
          </svg>
          <span className="logo-text">SAMSpy</span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <Link to="/search" className="btn btn-primary btn-sm">
            Search Contracts
          </Link>
        </div>
      </div>
    </nav>
  );
}