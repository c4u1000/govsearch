import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import './Home.css';

const stats = [
  { value: '$1B+', label: 'Won by SAMSpy Users' },
  { value: '$1T+', label: 'Contracts Tracked' },
  { value: '90%', label: 'Time Saved' },
  { value: '3x', label: 'Higher Win Rate' },
];

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    title: 'Federal Contract Search',
    description: 'Search millions of active government contracts with advanced filters including NAICS codes, set-aside types, agencies, and date ranges.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    title: 'AI-Powered Summaries',
    description: 'Get instant AI-generated summaries of contract requirements, obligations, and key dates. Understand opportunities in seconds.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    title: 'Smart Alerts',
    description: 'Set up custom alerts for new contract opportunities matching your criteria. Never miss a relevant opportunity again.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Saved Searches',
    description: 'Save your search criteria and run them anytime. Build a library of searches for different markets and clients.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Enter Your Search Criteria',
    description: 'Input keywords, NAICS codes, set-aside preferences, and agency filters.',
  },
  {
    num: '02',
    title: 'Browse & Filter Results',
    description: 'Review thousands of contracts with detailed information and smart filtering.',
  },
  {
    num: '03',
    title: 'Save Opportunities',
    description: 'Bookmark contracts and save your search criteria for quick access.',
  },
  {
    num: '04',
    title: 'Win More Contracts',
    description: 'Access full details on SAM.gov and submit winning proposals.',
  },
];

const testimonials = [
  {
    quote: 'SAMSpy cut our contract research time by 90%. We found opportunities we would have missed with manual searches.',
    name: 'Maria Chen',
    title: 'CEO, Federal Solutions LLC',
  },
  {
    quote: 'The set-aside filters are incredibly precise. We identified SDVOSB opportunities we qualified for immediately.',
    name: 'James Williams',
    title: 'Contracts Director, VetBiz Inc',
  },
  {
    quote: 'This tool pays for itself with just one win. The NAICS explorer helped us expand into new markets.',
    name: 'Sarah Thompson',
    title: 'Business Development, TechStart',
  },
];

export function Home() {
  const [savedKey, setSavedKey] = useState(localStorage.getItem('sam_api_key') || '');

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            SAM.gov API Powered Search
          </div>
          <h1 className="hero-title">
            Turn months of manual work<br />
            into <span className="hero-highlight">minutes</span> of strategic action
          </h1>
          <p className="hero-subtitle">
            Search millions of active government contracts with AI-powered insights.
            Find the right opportunities and win more business.
          </p>
          <div className="hero-search">
            <SearchBar size="large" />
          </div>
          {!savedKey && (
            <p className="hero-note">
              <Link to="/setup">Configure your SAM.gov API key</Link> to enable live search
            </p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to win government contracts</h2>
            <p>Powerful search tools and insights to find and win more business</p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How it works</h2>
            <p>Find and win contracts in four simple steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <div key={step.num} className="step-item">
                <span className="step-num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by contractors nationwide</h2>
            <p>See what our users have to say</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="testimonial-card card">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to find your next contract?</h2>
            <p>Start searching millions of government opportunities today</p>
            <div className="cta-actions">
              <Link to="/search" className="btn btn-primary btn-lg">
                Start Searching
              </Link>
              <Link to="/setup" className="btn btn-secondary btn-lg">
                Setup API Key
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}