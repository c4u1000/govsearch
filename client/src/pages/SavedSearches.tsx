import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SavedSearch } from '../types';
import './SavedSearches.css';

export function SavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    setSavedSearches(saved);
  }, []);

  const handleDelete = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('saved_searches', JSON.stringify(updated));
  };

  const handleRun = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.keyword) params.set('keyword', search.keyword);
    if (search.naics) params.set('naics', search.naics);
    if (search.setaside) params.set('setaside', search.setaside);
    if (search.agency) params.set('agency', search.agency);
    navigate(`/search?${params.toString()}`);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="saved-page page-wrapper">
      <div className="page-content">
        <div className="container">
          <div className="saved-header">
            <div>
              <h1>Saved Searches</h1>
              <p>Your bookmarked searches and criteria</p>
            </div>
            <Link to="/search" className="btn btn-primary">
              New Search
            </Link>
          </div>

          {savedSearches.length === 0 ? (
            <div className="saved-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <h3>No saved searches yet</h3>
              <p>Save your search criteria to quickly re-run them later</p>
              <Link to="/search" className="btn btn-primary">
                Start Searching
              </Link>
            </div>
          ) : (
            <div className="saved-list">
              {savedSearches.map((search) => (
                <div key={search.id} className="saved-card card">
                  <div className="saved-card-info">
                    <h3>{search.name}</h3>
                    <div className="saved-card-meta">
                      {search.keyword && <span className="meta-tag">{search.keyword}</span>}
                      {search.naics && <span className="meta-tag">NAICS: {search.naics}</span>}
                      {search.setaside && <span className="meta-tag">{search.setaside}</span>}
                      {search.agency && <span className="meta-tag">{search.agency}</span>}
                      {!search.keyword && !search.naics && !search.setaside && !search.agency && (
                        <span className="meta-tag">No criteria</span>
                      )}
                    </div>
                    <span className="saved-date">Saved {formatDate(search.createdAt)}</span>
                  </div>
                  <div className="saved-card-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleRun(search)}>
                      Run Search
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(search.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}