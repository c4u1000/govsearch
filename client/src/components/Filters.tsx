import { SETASIDE_OPTIONS } from '../types';
import './Filters.css';

interface FiltersProps {
  filters: {
    keyword: string;
    naics: string;
    setaside: string;
    agency: string;
    postedFrom: string;
    postedTo: string;
  };
  onChange: (key: string, value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

const AGENCIES = [
  '', 'Department of Defense', 'Department of Army', 'Department of Navy',
  'Department of Air Force', 'Department of Energy', 'Department of Health and Human Services',
  'Department of Homeland Security', 'Department of Veterans Affairs',
  'General Services Administration', 'National Aeronautics and Space Administration',
  'Department of Justice', 'Department of Commerce', 'Department of Labor',
];

export function Filters({ filters, onChange, onSearch, loading }: FiltersProps) {
  return (
    <div className="filters">
      <div className="filters-grid">
        <div className="filter-group filter-group--keyword">
          <label>Keyword</label>
          <input
            type="text"
            className="input"
            placeholder="Search contracts..."
            value={filters.keyword}
            onChange={(e) => onChange('keyword', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>NAICS Code</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. 541512"
            value={filters.naics}
            onChange={(e) => onChange('naics', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Set-Aside</label>
          <select
            className="input select"
            value={filters.setaside}
            onChange={(e) => onChange('setaside', e.target.value)}
          >
            {SETASIDE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Agency</label>
          <select
            className="input select"
            value={filters.agency}
            onChange={(e) => onChange('agency', e.target.value)}
          >
            <option value="">All Agencies</option>
            {AGENCIES.slice(1).map((agency) => (
              <option key={agency} value={agency}>{agency}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Posted From</label>
          <input
            type="text"
            className="input"
            placeholder="MM/DD/YYYY"
            value={filters.postedFrom}
            onChange={(e) => onChange('postedFrom', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Posted To</label>
          <input
            type="text"
            className="input"
            placeholder="MM/DD/YYYY"
            value={filters.postedTo}
            onChange={(e) => onChange('postedTo', e.target.value)}
          />
        </div>
      </div>

      <div className="filters-actions">
        <button
          className="btn btn-primary"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Contracts'}
        </button>
      </div>
    </div>
  );
}