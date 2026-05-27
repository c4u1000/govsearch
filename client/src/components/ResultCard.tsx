import { Link } from 'react-router-dom';
import { SAMSearchResult } from '../types';
import './ResultCard.css';

interface ResultCardProps {
  result: SAMSearchResult;
  onSave?: (result: SAMSearchResult) => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatValue(value?: string): string {
  if (!value) return 'N/A';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

export function ResultCard({ result, onSave }: ResultCardProps) {
  const samUrl = result.uiLink || `https://sam.gov/opp/${result.noticeId}/view`;

  return (
    <article className="result-card">
      <div className="result-card-header">
        <div className="result-card-badges">
          {result.setAside && (
            <span className="badge badge-green">{result.setAside}</span>
          )}
          {result.naics && (
            <span className="badge badge-blue">{result.naics}</span>
          )}
        </div>
        <div className="result-card-actions">
          {onSave && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onSave(result)}
              title="Save search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <Link to={`/opportunity/${result.noticeId}`} className="result-card-title">
        {result.title || 'Untitled Opportunity'}
      </Link>

      <p className="result-card-meta">
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {result.agency || result.department || 'N/A'}
        </span>
        {result.subtierAgency && result.subtierAgency !== result.agency && (
          <span className="meta-item">{result.subtierAgency}</span>
        )}
      </p>

      {result.description && (
        <p className="result-card-description">
          {result.description.slice(0, 200)}
          {result.description.length > 200 ? '...' : ''}
        </p>
      )}

      <div className="result-card-footer">
        <div className="result-card-info">
          <div className="info-item">
            <span className="info-label">Posted</span>
            <span className="info-value">{formatDate(result.postedDate)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Deadline</span>
            <span className="info-value">{formatDate(result.responseDeadLine)}</span>
          </div>
          {result.estimatedValue && (
            <div className="info-item">
              <span className="info-label">Est. Value</span>
              <span className="info-value">{formatValue(result.estimatedValue)}</span>
            </div>
          )}
        </div>

        <div className="result-card-links">
          <Link to={`/opportunity/${result.noticeId}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          <a
            href={samUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            View on SAM.gov
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}