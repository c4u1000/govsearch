export interface SAMSearchParams {
  keyword?: string;
  naics?: string;
  setaside?: string;
  agency?: string;
  postedFrom?: string;
  postedTo?: string;
  page?: number;
  limit?: number;
}

export interface SAMSearchResult {
  noticeId: string;
  title: string;
  department: string;
  agency: string;
  subtierAgency: string;
  naics: string;
  naicsDescription: string;
  postedDate: string;
  responseDeadLine: string;
  setAside: string;
  estimatedValue?: string;
  description?: string;
  uiLink?: string;
}

export interface SAMSearchResponse {
  totalRecords?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  searchResults?: SAMSearchResult[];
  entityData?: SAMSearchResult[];
  Content?: SAMSearchResult[];
  Message?: string;
  error?: string;
}

export interface OpportunityDetail {
  noticeId: string;
  title: string;
  department: string;
  agency: string;
  subTierAgency: string;
  officeAddress?: {
    city?: string;
    state?: string;
    country?: string;
  };
  primaryContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  description?: string;
  justification?: string;
  additionalInfoUrl?: string;
  uiLink?: string;
  postedDate?: string;
  responseDeadLine?: string;
  setAside?: string;
  naicsCode?: string;
  naicsCodes?: string[];
  estimatedValue?: string;
  baseType?: string;
  archiveType?: string;
  active?: string;
  history?: OpportunityDetail[];
}

export interface Resource {
  resourceId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  description: string;
  url: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  keyword: string;
  naics: string;
  setaside: string;
  agency: string;
  createdAt: number;
}

export interface NAICSCode {
  code: string;
  description: string;
  parentCode?: string;
}

export const SETASIDE_OPTIONS = [
  { value: '', label: 'All Set-Asides' },
  { value: 'SDVOSB', label: 'SDVOSB - Service-Disabled Veteran-Owned' },
  { value: 'HUBZone', label: 'HUBZone - Historically Underutilized Business' },
  { value: '8A', label: '8(a) - 8(a) Business Development' },
  { value: 'WOSB', label: 'WOSB - Women-Owned Small Business' },
  { value: 'VOSB', label: 'VOSB - Veteran-Owned Small Business' },
  { value: 'SDB', label: 'SDB - Small Disadvantaged Business' },
  { value: 'SBP', label: 'SBP - Small Business Program' },
  { value: 'HBCU', label: 'HBCU - Historically Black Colleges' },
];

export const API_BASE = (import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:9999/.netlify/functions');