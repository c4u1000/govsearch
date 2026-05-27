import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters } from '../components/Filters';
import { ResultCard } from '../components/ResultCard';
import { SearchBar } from '../components/SearchBar';
import { API_BASE, SAMSearchResult, SavedSearch } from '../types';
import './Search.css';

const DEFAULT_PARAMS = {
  keyword: '',
  naics: '',
  setaside: '',
  agency: '',
  postedFrom: '01/01/2023',
  postedTo: '12/31/2030',
};

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...DEFAULT_PARAMS });
  const [results, setResults] = useState<SAMSearchResult[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const limit = 20;

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const performSearch = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    
    const apiKey = localStorage.getItem('sam_api_key');
    if (!apiKey) {
      setError('API key not configured. Please go to API Setup page.');
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        keyword: filters.keyword,
        naics: filters.naics,
        setaside: filters.setaside,
        agency: filters.agency,
        postedFrom: filters.postedFrom,
        postedTo: filters.postedTo,
        page: String(page),
        limit: String(limit),
      });

      const response = await fetch(`${API_BASE}/search?${params}`, {
        headers: { 'x-api-key': apiKey },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Search failed');
      }

      // Handle different SAM.gov response formats
      let searchResults: SAMSearchResult[] = [];
      if (data.entityData) {
        searchResults = data.entityData;
      } else if (data.searchResults) {
        searchResults = data.searchResults;
      } else if (Array.isArray(data)) {
        searchResults = data;
      }

      setResults(searchResults);
      setTotalRecords(data.totalRecords || searchResults.length);
      setTotalPages(data.totalPages || Math.ceil((data.totalRecords || searchResults.length) / limit));
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Failed to search. Check API key and try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initialize from URL params
  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    const naics = searchParams.get('naics') || '';
    const setaside = searchParams.get('setaside') || '';
    const agency = searchParams.get('agency') || '';
    const page = parseInt(searchParams.get('page') || '1');

    setFilters(prev => ({
      ...prev,
      keyword,
      naics,
      setaside,
      agency,
    }));

    if (keyword || naics || setaside || agency) {
      performSearch(page);
    }
  }, []);

  const handleSearch = () => {
    const newParams = new URLSearchParams();
    if (filters.keyword) newParams.set('keyword', filters.keyword);
    if (filters.naics) newParams.set('naics', filters.naics);
    if (filters.setaside) newParams.set('setaside', filters.setaside);
    if (filters.agency) newParams.set('agency', filters.agency);
    setSearchParams(newParams);
    performSearch(1);
  };

  const handleSaveSearch = (result: SAMSearchResult) => {
    const saved: SavedSearch[] = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const newSaved: SavedSearch = {
      id: Date.now().toString(),
      name: result.title || result.noticeId,
      keyword: filters.keyword,
      naics: filters.naics,
      setaside: filters.setaside,
      agency: filters.agency,
      createdAt: Date.now(),
    };
    saved.unshift(newSaved);
    localStorage.setItem('saved_searches', JSON.stringify(saved.slice(0, 50)));
    alert('Search saved!');
  };

  const handleSaveCurrentSearch = () => {
    if (!filters.keyword && !filters.naics && !filters.setaside && !filters.agency) {
      alert('No search criteria to save');
      return;
    }
    const saved: SavedSearch[] = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const newSaved: SavedSearch = {
      id: Date.now().toString(),
      name: filters.keyword || `NAICS ${filters.naics}` || 'Untitled Search',
      keyword: filters.keyword,
      naics: filters.naics,
      setaside: filters.setaside,
      agency: filters.agency,
      createdAt: Date.now(),
    };
    saved.unshift(newSaved);
    localStorage.setItem('saved_searches', JSON.stringify(saved.slice(0, 50)));
    alert('Search saved!');
  };

  return (
    <div className="search-page page-wrapper">
      <div className="page-content">
        <div className="container">
          <div className="search-header">
            <div>
              <h1>Federal Contract Search</h1>
              <p>Search millions of active government opportunities</p>
            </div>
            <div className="search-header-bar">
              <SearchBar initialValue={filters.keyword} onSearch={(kw) => { updateFilter('keyword', kw); }} />
              <button className="btn btn-secondary" onClick={handleSaveCurrentSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Save Search
              </button>
            </div>
          </div>

          <div className="search-filters">
            <Filters
              filters={filters}
              onChange={updateFilter}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>

          <div className="search-results">
            {loading && (
              <div className="results-loading">
                <div className="spinner" />
                <p>Searching SAM.gov...</p>
              </div>
            )}

            {error && (
              <div className="results-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
                <div>
                  <strong>Error</strong>
                  <p>{error}</p>
                  {!error.includes('API key') && (
                    <a href="/setup" className="btn btn-secondary btn-sm" style={{ marginTop: 8, display: 'inline-flex' }}>
                      Setup API Key
                    </a>
                  )}
                </div>
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="results-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <h3>No results found</h3>
                <p>Try adjusting your search filters or keywords</p>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <>
                <div className="results-header">
                  <p className="results-count">
                    Found <strong>{totalRecords.toLocaleString()}</strong> opportunities
                  </p>
                </div>

                <div className="results-list">
                  {results.map((result) => (
                    <ResultCard
                      key={result.noticeId || Math.random().toString()}
                      result={result}
                      onSave={handleSaveSearch}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-secondary"
                      disabled={currentPage <= 1}
                      onClick={() => { performSearch(currentPage - 1); }}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      disabled={currentPage >= totalPages}
                      onClick={() => { performSearch(currentPage + 1); }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}