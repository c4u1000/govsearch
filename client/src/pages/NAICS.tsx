import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NAICSCode } from '../types';
import './NAICS.css';

// Common NAICS codes with descriptions
const NAICS_DATA: NAICSCode[] = [
  { code: '541512', description: 'Computer Systems Design and Related Services' },
  { code: '541511', description: 'Custom Computer Programming Services' },
  { code: '541519', description: 'Other Computer Related Services' },
  { code: '541330', description: 'Engineering Services' },
  { code: '541690', description: 'Other Scientific and Technical Consulting Services' },
  { code: '541715', description: 'Research and Development in the Physical, Engineering, and Life Sciences' },
  { code: '518210', description: 'Data Processing, Hosting, and Related Services' },
  { code: '541611', description: 'Administrative Management and General Management Consulting Services' },
  { code: '541613', description: 'Marketing Consulting Services' },
  { code: '541810', description: 'Advertising Agencies' },
  { code: '561110', description: 'Office Administrative Services' },
  { code: '561210', description: 'Facilities Support Services' },
  { code: '561720', description: 'Janitorial Services' },
  { code: '561730', description: 'Landscaping Services' },
  { code: '611430', description: 'Professional and Management Development Training' },
  { code: '541920', description: 'Photographic Services' },
  { code: '541930', description: 'Translation and Interpretation Services' },
  { code: '541990', description: 'All Other Professional, Scientific, and Technical Services' },
  { code: '238210', description: 'Electrical Contractors and Other Wiring Installation Contractors' },
  { code: '236220', description: 'Commercial and Institutional Building Construction' },
  { code: '334111', description: 'Electronic Computer Manufacturing' },
  { code: '334419', description: 'Other Electronic Component Manufacturing' },
  { code: '511210', description: 'Software Publishers' },
  { code: '518111', description: 'Internet Service Providers' },
  { code: '541370', description: 'Surveying and Mapping (except Geophysical) Services' },
  { code: '624110', description: 'Child and Youth Services' },
  { code: '624120', description: 'Services for the Elderly and Persons with Disabilities' },
  { code: '921190', description: 'Other General Government Support' },
  { code: '922120', description: 'Police Protection' },
  { code: '923130', description: 'Regulation and Administration of Human Resource Programs' },
];

const NAICS_SUBCODES: Record<string, NAICSCode[]> = {
  '5415': [
    { code: '541511', description: 'Custom Computer Programming Services', parentCode: '5415' },
    { code: '541512', description: 'Computer Systems Design and Related Services', parentCode: '5415' },
    { code: '541519', description: 'Other Computer Related Services', parentCode: '5415' },
  ],
  '5413': [
    { code: '541310', description: 'Architectural Services', parentCode: '5413' },
    { code: '541320', description: 'Landscape Architectural Services', parentCode: '5413' },
    { code: '541330', description: 'Engineering Services', parentCode: '5413' },
    { code: '541340', description: 'Drafting Services', parentCode: '5413' },
    { code: '541350', description: 'Building Inspection Services', parentCode: '5413' },
  ],
  '5611': [
    { code: '561110', description: 'Office Administrative Services', parentCode: '5611' },
    { code: '561120', description: 'Facilities Support Services', parentCode: '5611' },
    { code: '561130', description: 'Employment Placement Services', parentCode: '5611' },
  ],
};

function findRelated(code: string): NAICSCode[] {
  const prefix = code.slice(0, 4);
  const related: NAICSCode[] = [];
  
  // Find all codes with same 4-digit prefix
  NAICS_DATA.forEach(n => {
    if (n.code.startsWith(prefix) && n.code !== code) {
      related.push(n);
    }
  });
  
  return related.slice(0, 5);
}

export function NAICS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<NAICSCode | null>(null);

  const filteredCodes = NAICS_DATA.filter(n => {
    const term = searchTerm.toLowerCase();
    return n.code.includes(term) || n.description.toLowerCase().includes(term);
  });

  const relatedCodes = selected ? findRelated(selected.code) : [];

  return (
    <div className="naics-page page-wrapper">
      <div className="page-content">
        <div className="container">
          <div className="naics-header">
            <div>
              <h1>NAICS Code Explorer</h1>
              <p>Search and browse NAICS codes for government contracting</p>
            </div>
          </div>

          <div className="naics-search-bar">
            <div className="search-bar-inner">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="naics-layout">
            <div className="naics-list">
              {filteredCodes.length === 0 ? (
                <p className="naics-empty">No matching NAICS codes found</p>
              ) : (
                filteredCodes.map((code) => (
                  <button
                    key={code.code}
                    className={`naics-item ${selected?.code === code.code ? 'active' : ''}`}
                    onClick={() => setSelected(code)}
                  >
                    <span className="naics-code">{code.code}</span>
                    <span className="naics-desc">{code.description}</span>
                  </button>
                ))
              )}
            </div>

            <div className="naics-detail">
              {selected ? (
                <div className="naics-detail-card card">
                  <div className="detail-header">
                    <span className="detail-code">{selected.code}</span>
                    <Link
                      to={`/search?naics=${selected.code}`}
                      className="btn btn-primary btn-sm"
                    >
                      Search Contracts
                    </Link>
                  </div>
                  <h3>{selected.description}</h3>

                  {relatedCodes.length > 0 && (
                    <div className="related-codes">
                      <h4>Related Codes</h4>
                      <div className="related-list">
                        {relatedCodes.map((rel) => (
                          <button
                            key={rel.code}
                            className="related-item"
                            onClick={() => setSelected(rel)}
                          >
                            <span>{rel.code}</span>
                            <span>{rel.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="naics-detail-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <p>Select a NAICS code to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}