import { useState, useEffect } from 'react';
import './Setup.css';

export function Setup() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sam_api_key') || '';
    setApiKey(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem('sam_api_key', apiKey.trim());
    alert('API key saved! You can now search contracts.');
  };

  const handleClear = () => {
    localStorage.removeItem('sam_api_key');
    setApiKey('');
    alert('API key cleared.');
  };

  return (
    <div className="setup-page page-wrapper">
      <div className="page-content">
        <div className="container">
          <div className="setup-header">
            <h1>API Key Setup</h1>
            <p>Configure your SAM.gov API key to enable live contract search</p>
          </div>

          <div className="setup-grid">
            <div className="setup-card card">
              <h2>Enter Your API Key</h2>
              <p className="setup-instructions">
                Your API key is stored locally in your browser and used to search
                SAM.gov on your behalf.
              </p>
              <div className="api-key-input">
                <input
                  type="text"
                  className="input"
                  placeholder="sam-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="api-key-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                >
                  Save API Key
                </button>
                {apiKey && (
                  <button className="btn btn-ghost" onClick={handleClear}>
                    Clear Key
                  </button>
                )}
              </div>
              <div className="api-key-status">
                {apiKey ? (
                  <span className="status-active">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    API Key configured
                  </span>
                ) : (
                  <span className="status-inactive">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    No API key configured
                  </span>
                )}
              </div>
            </div>

            <div className="setup-card card">
              <h2>How to Get Your API Key</h2>
              <ol className="setup-steps">
                <li>
                  <strong>Go to SAM.gov</strong>
                  <span>Visit <a href="https://sam.gov" target="_blank" rel="noopener noreferrer">sam.gov</a> and sign in or create an account</span>
                </li>
                <li>
                  <strong>Navigate to My SAM</strong>
                  <span>Click on your username and select "My SAM" from the dropdown</span>
                </li>
                <li>
                  <strong>Access API Key Management</strong>
                  <span>Go to "API Key Management" under the User Profile section</span>
                </li>
                <li>
                  <strong>Request an API Key</strong>
                  <span>Click "Request API Key" and fill out the required information</span>
                </li>
                <li>
                  <strong>Copy Your Key</strong>
                  <span>Copy the key (format: sam-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) and paste it above</span>
                </li>
              </ol>
            </div>

            <div className="setup-card card">
              <h2>API Usage Notes</h2>
              <ul className="setup-notes">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  SAM.gov API is free for government contractors
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  The API requires a valid API key for all requests
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  For Netlify deployment, set SAM_API_KEY as an environment variable in the dashboard
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Local development uses the key stored in your browser
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}