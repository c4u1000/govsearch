"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from client/dist in production
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
// Initialize database
(0, db_1.initDb)();
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Search opportunities from SAM.gov API
app.get('/api/search', async (req, res) => {
    const { keyword, naics, postedFrom, postedTo, limit = 20 } = req.query;
    try {
        const params = new URLSearchParams();
        if (keyword)
            params.append('keyword', keyword);
        if (naics)
            params.append('naicsCode', naics);
        if (postedFrom)
            params.append('postedFrom', postedFrom);
        if (postedTo)
            params.append('postedTo', postedTo);
        params.append('limit', limit);
        params.append('status', 'active');
        const response = await fetch(`https://api.sam.gov/entity-information/v3/activedatas?${params.toString()}`, {
            headers: {
                'Authorization': `ApiKey ${process.env.SAM_API_KEY || ''}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`SAM.gov API error: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed', details: String(error) });
    }
});
// Get opportunity details
app.get('/api/opportunity/:noticeId', async (req, res) => {
    const { noticeId } = req.params;
    try {
        const response = await fetch(`https://api.sam.gov/opportunities/v2/competitions?noticeId=${noticeId}`, {
            headers: {
                'Authorization': `ApiKey ${process.env.SAM_API_KEY || ''}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`SAM.gov API error: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Detail error:', error);
        res.status(500).json({ error: 'Failed to get details', details: String(error) });
    }
});
// Save search
app.post('/api/saved-searches', (req, res) => {
    const { name, keyword, naics, email } = req.body;
    const db = (0, db_1.getDb)();
    const stmt = db.prepare(`
    INSERT INTO saved_searches (name, keyword, naics, email, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
    const result = stmt.run(name, keyword, naics, email);
    res.json({ id: result.lastInsertRowid, name, keyword, naics, email });
});
// Get saved searches
app.get('/api/saved-searches', (_req, res) => {
    const db = (0, db_1.getDb)();
    const searches = db.prepare('SELECT * FROM saved_searches ORDER BY created_at DESC').all();
    res.json(searches);
});
// Delete saved search
app.delete('/api/saved-searches/:id', (req, res) => {
    const db = (0, db_1.getDb)();
    db.prepare('DELETE FROM saved_searches WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
