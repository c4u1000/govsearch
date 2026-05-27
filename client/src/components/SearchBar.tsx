import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

interface SearchBarProps {
  initialValue?: string;
  size?: 'default' | 'large';
  onSearch?: (keyword: string) => void;
}

export function SearchBar({ initialValue = '', size = 'default', onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword);
    } else {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <form className={`search-bar search-bar--${size}`} onSubmit={handleSubmit}>
      <div className="search-bar-inner">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search contracts by keyword, NAICS, or agency..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary search-btn">
          Search
        </button>
      </div>
    </form>
  );
}