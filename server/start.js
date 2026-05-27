// Simple launcher that uses the pre-compiled server dist
// PORT and SAM_API_KEY are read from environment variables
process.env.PORT = '3001';

const { initDb, getDb } = require('./dist/db');
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const CLIENT_DIST = '/data/.openclaw/workspace/samsearch-app/client/dist';

const app = express();
const PORT = process.env.PORT || 3001;
const SAM_API_KEY = process.env.SAM_API_KEY || '';

app.use(cors());
app.use(express.json());

// Serve static files from client/dist in production
app.use(express.static(CLIENT_DIST));

// Initialize database
initDb();

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.type('text/html').sendFile(path.join(CLIENT_DIST, 'index.html'));
});

// Helper: build default date range (last 90 days)
function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 90);
  const fmt = d => `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`;
  return { postedFrom: fmt(from), postedTo: fmt(to) };
}

// Proxy: Search opportunities
app.get('/api/search', async (req, res) => {
  let { keyword, naics, psc, state, city, postedFrom, postedTo, limit = 25, offset = 0, typeCode, setAside, sort } = req.query;

  if (!postedFrom || !postedTo) {
    const range = defaultDateRange();
    postedFrom = range.postedFrom;
    postedTo = range.postedTo;
  }

  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (naics) params.append('naicsCode', naics);
  if (psc) params.append('psc', psc);
  if (state) params.append('state', state);
  if (city) params.append('city', city);
  if (typeCode) params.append('typeCode', typeCode);
  if (setAside) params.append('setAside', setAside);
  if (sort) params.append('sort', sort);
  params.append('postedFrom', postedFrom);
  params.append('postedTo', postedTo);
  params.append('limit', limit);
  if (offset) params.append('offset', offset);

  const url = `https://api.sam.gov/opportunities/v2/search?api_key=${SAM_API_KEY}&${params.toString()}`;

  https.get(url, { headers: { 'Content-Type': 'application/json' } }, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      res.status(apiRes.statusCode).contentType('application/json').send(data);
    });
  }).on('error', (e) => {
    console.error('Search proxy error:', e);
    res.status(500).json({ error: 'Search failed', details: String(e) });
  });
});

// Proxy: Get competition details
app.get('/api/competition/:noticeId', async (req, res) => {
  const { noticeId } = req.params;
  const { postedFrom, postedTo } = req.query;
  const range = (!postedFrom || !postedTo) ? defaultDateRange() : { postedFrom, postedTo };
  const url = `https://api.sam.gov/opportunities/v2/competitions?noticeId=${noticeId}&postedFrom=${range.postedFrom}&postedTo=${range.postedTo}&api_key=${SAM_API_KEY}`;

  https.get(url, { headers: { 'Content-Type': 'application/json' } }, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      res.status(apiRes.statusCode).contentType('application/json').send(data);
    });
  }).on('error', (e) => {
    console.error('Competition proxy error:', e);
    res.status(500).json({ error: 'Failed to get details', details: String(e) });
  });
});

// Proxy: Get resources/attachments
app.get('/api/resources/:noticeId', async (req, res) => {
  const { noticeId } = req.params;
  const { postedFrom, postedTo } = req.query;
  const range = (!postedFrom || !postedTo) ? defaultDateRange() : { postedFrom, postedTo };
  const url = `https://api.sam.gov/opportunities/v1/resources?noticeId=${noticeId}&postedFrom=${range.postedFrom}&postedTo=${range.postedTo}&api_key=${SAM_API_KEY}`;

  https.get(url, { headers: { 'Content-Type': 'application/json' } }, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      res.status(apiRes.statusCode).contentType('application/json').send(data);
    });
  }).on('error', (e) => {
    console.error('Resources proxy error:', e);
    res.status(500).json({ error: 'Failed to get resources', details: String(e) });
  });
});

// Proxy: Fetch PDF attachment (avoids CORS)
app.get('/api/attachment', async (req, res) => {
  const { url: attachmentUrl } = req.query;
  if (!attachmentUrl) return res.status(400).json({ error: 'Missing url parameter' });

  const urlObj = new URL(attachmentUrl);
  const mod = urlObj.protocol === 'https:' ? https : require('http');

  mod.get(attachmentUrl, { headers: { 'User-Agent': 'Node.js Proxy/1.0' } }, (apiRes) => {
    res.set({
      'Content-Type': apiRes.headers['content-type'] || 'application/pdf',
      'Content-Disposition': 'inline',
      'Content-Length': apiRes.headers['content-length'],
      'Access-Control-Allow-Origin': '*',
    });
    apiRes.pipe(res);
  }).on('error', (e) => {
    console.error('Attachment proxy error:', e);
    res.status(500).json({ error: 'Failed to fetch attachment', details: String(e) });
  });
});

// Save search
app.post('/api/saved-searches', (req, res) => {
  const { name, keyword, naics, email } = req.body;
  const db = getDb();
  const stmt = db.prepare(`INSERT INTO saved_searches (name, keyword, naics, email, created_at) VALUES (?, ?, ?, ?, datetime('now'))`);
  const result = stmt.run(name, keyword, naics, email);
  res.json({ id: result.lastInsertRowid, name, keyword, naics, email });
});

// Get saved searches
app.get('/api/saved-searches', (_req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM saved_searches ORDER BY created_at DESC').all());
});

// Delete saved search
app.delete('/api/saved-searches/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM saved_searches WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`SAM.gov search server running on port ${PORT}`);
  console.log(`SAM API key: ${SAM_API_KEY ? SAM_API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
});
