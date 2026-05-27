import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE, OpportunityDetail, Resource } from '../types';
import './Opportunity.css';

type Tab = 'overview' | 'requirements' | 'documents' | 'timeline';

export function Opportunity() {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      const apiKey = localStorage.getItem('sam_api_key');
      if (!apiKey) {
        setError('API key not configured. Please setup your API key first.');
        setLoading(false);
        return;
      }

      try {
        // Fetch opportunity details
        const oppRes = await fetch(`${API_BASE}/opportunity?noticeId=${id}`, {
          headers: { 'x-api-key': apiKey },
        });
        const oppData = await oppRes.json();

        if (!oppRes.ok) {
          throw new Error(oppData.error || oppData.message || 'Failed to load opportunity');
        }

        // SAM.gov returns data in various formats
        const opp = oppData.data?.[0] || oppData.notice || oppData;
        setOpportunity(opp);

        // Fetch resources
        const resRes = await fetch(`${API_BASE}/resources?noticeId=${id}`, {
          headers: { 'x-api-key': apiKey },
        });
        const resData = await resRes.json();
        if (resRes.ok) {
          const resourcesData = resData.data || resData.resources || [];
          setResources(resourcesData);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="opportunity-page page-wrapper">
        <div className="page-content">
          <div className="container">
            <div className="opp-loading">
              <div className="spinner" />
              <p>Loading opportunity details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunity-page page-wrapper">
        <div className="page-content">
          <div className="container">
            <div className="opp-error">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              <div>
                <strong>Error</strong>
                <p>{error}</p>
                <Link to="/setup" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
                  Setup API Key
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="opportunity-page page-wrapper">
        <div className="page-content">
          <div className="container">
            <div className="opp-not-found">
              <h2>Opportunity not found</h2>
              <Link to="/search" className="btn btn-primary">Back to Search</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const samUrl = opportunity.uiLink || `https://sam.gov/opp/${id}/view`;

  return (
    <div className="opportunity-page page-wrapper">
      <div className="page-content">
        <div className="container">
          <div className="opp-breadcrumb">
            <Link to="/search">← Back to Search</Link>
          </div>

          <div className="opp-header">
            <div className="opp-badges">
              {opportunity.setAside && (
                <span className="badge badge-green">{opportunity.setAside}</span>
              )}
              {opportunity.naicsCode && (
                <span className="badge badge-blue">{opportunity.naicsCode}</span>
              )}
            </div>
            <h1>{opportunity.title || 'Untitled Opportunity'}</h1>
            <div className="opp-meta">
              <span>{opportunity.agency || opportunity.department}</span>
              {opportunity.subTierAgency && (
                <>
                  <span className="meta-sep">•</span>
                  <span>{opportunity.subTierAgency}</span>
                </>
              )}
            </div>
            <div className="opp-actions">
              <a href={samUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                View on SAM.gov
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="opp-tabs">
            {(['overview', 'requirements', 'documents', 'timeline'] as Tab[]).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'documents' && resources.length > 0 && (
                  <span className="tab-count">{resources.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="opp-content">
            {activeTab === 'overview' && (
              <div className="tab-panel">
                <div className="overview-grid">
                  <div className="overview-main">
                    <div className="card">
                      <h3>Description</h3>
                      <p className="whitespace-pre-wrap">{opportunity.description || 'No description available.'}</p>
                    </div>
                    {opportunity.justification && (
                      <div className="card">
                        <h3>Justification</h3>
                        <p className="whitespace-pre-wrap">{opportunity.justification}</p>
                      </div>
                    )}
                  </div>
                  <div className="overview-sidebar">
                    <div className="card">
                      <h4>Key Information</h4>
                      <dl className="info-list">
                        <div>
                          <dt>Notice ID</dt>
                          <dd>{opportunity.noticeId || id}</dd>
                        </div>
                        {opportunity.postedDate && (
                          <div>
                            <dt>Posted Date</dt>
                            <dd>{new Date(opportunity.postedDate).toLocaleDateString()}</dd>
                          </div>
                        )}
                        {opportunity.responseDeadLine && (
                          <div>
                            <dt>Response Deadline</dt>
                            <dd>{new Date(opportunity.responseDeadLine).toLocaleDateString()}</dd>
                          </div>
                        )}
                        {opportunity.estimatedValue && (
                          <div>
                            <dt>Estimated Value</dt>
                            <dd>{opportunity.estimatedValue}</dd>
                          </div>
                        )}
                        {opportunity.setAside && (
                          <div>
                            <dt>Set-Aside</dt>
                            <dd>{opportunity.setAside}</dd>
                          </div>
                        )}
                        {opportunity.naicsCode && (
                          <div>
                            <dt>NAICS Code</dt>
                            <dd>{opportunity.naicsCode}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    {opportunity.primaryContact && (
                      <div className="card">
                        <h4>Contact</h4>
                        <dl className="info-list">
                          {opportunity.primaryContact.name && (
                            <div><dt>Name</dt><dd>{opportunity.primaryContact.name}</dd></div>
                          )}
                          {opportunity.primaryContact.email && (
                            <div><dt>Email</dt><dd><a href={`mailto:${opportunity.primaryContact.email}`}>{opportunity.primaryContact.email}</a></dd></div>
                          )}
                          {opportunity.primaryContact.phone && (
                            <div><dt>Phone</dt><dd>{opportunity.primaryContact.phone}</dd></div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="tab-panel">
                <div className="card">
                  <h3>Requirements</h3>
                  <p>Full requirements details would appear here from the SAM.gov API response.</p>
                  <p className="text-muted">{opportunity.description || 'Requirements information not available in this view.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="tab-panel">
                {resources.length === 0 ? (
                  <div className="card">
                    <p className="text-muted">No documents available for this opportunity.</p>
                  </div>
                ) : (
                  <div className="documents-list">
                    {resources.map((resource) => (
                      <div key={resource.resourceId} className="document-item card">
                        <div className="document-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                        <div className="document-info">
                          <strong>{resource.fileName}</strong>
                          <span>{resource.fileType} • {resource.fileSize}</span>
                          {resource.description && <p>{resource.description}</p>}
                        </div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="tab-panel">
                <div className="card">
                  <h3>Important Dates</h3>
                  <div className="timeline">
                    {opportunity.postedDate && (
                      <div className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                          <strong>Posted</strong>
                          <span>{new Date(opportunity.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    )}
                    {opportunity.responseDeadLine && (
                      <div className="timeline-item">
                        <div className="timeline-dot active" />
                        <div className="timeline-content">
                          <strong>Response Deadline</strong>
                          <span>{new Date(opportunity.responseDeadLine).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    )}
                    {!opportunity.postedDate && !opportunity.responseDeadLine && (
                      <p className="text-muted">Timeline information not available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}