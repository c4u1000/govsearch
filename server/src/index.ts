import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { initDb, getDb } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from client/dist in production
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Initialize database
initDb();

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Search opportunities from SAM.gov API
app.get('/api/search', async (req: Request, res: Response) => {
  const { keyword, naics, postedFrom, postedTo, limit = 20 } = req.query;

  try {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword as string);
    if (naics) params.append('naicsCode', naics as string);
    if (postedFrom) params.append('postedFrom', postedFrom as string);
    if (postedTo) params.append('postedTo', postedTo as string);
    params.append('limit', limit as string);
    params.append('status', 'active');

    const response = await fetch(
      `https://api.sam.gov/entity-information/v3/activedatas?${params.toString()}`,
      {
        headers: {
          'Authorization': `ApiKey ${process.env.SAM_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`SAM.gov API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', details: String(error) });
  }
});

// Get opportunity details
app.get('/api/opportunity/:noticeId', async (req: Request, res: Response) => {
  const { noticeId } = req.params;

  try {
    const response = await fetch(
      `https://api.sam.gov/opportunities/v2/competitions?noticeId=${noticeId}`,
      {
        headers: {
          'Authorization': `ApiKey ${process.env.SAM_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`SAM.gov API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Detail error:', error);
    res.status(500).json({ error: 'Failed to get details', details: String(error) });
  }
});

// Save search
app.post('/api/saved-searches', (req: Request, res: Response) => {
  const { name, keyword, naics, email } = req.body;
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO saved_searches (name, keyword, naics, email, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);

  const result = stmt.run(name, keyword, naics, email);
  res.json({ id: result.lastInsertRowid, name, keyword, naics, email });
});

// Get saved searches
app.get('/api/saved-searches', (_req: Request, res: Response) => {
  const db = getDb();
  const searches = db.prepare('SELECT * FROM saved_searches ORDER BY created_at DESC').all();
  res.json(searches);
});

// Delete saved search
app.delete('/api/saved-searches/:id', (req: Request, res: Response) => {
  const db = getDb();
  db.prepare('DELETE FROM saved_searches WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});