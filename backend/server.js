const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'uleman_v3.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create Config Table
    db.run(`CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      couple_names TEXT,
      wedding_date TEXT,
      theme TEXT,
      akad_address TEXT,
      akad_maps TEXT,
      resepsi_address TEXT,
      resepsi_maps TEXT,
      bank_name TEXT,
      bank_account TEXT,
      gift_address TEXT,
      admin_username TEXT,
      admin_password TEXT,
      admin_name TEXT,
      admin_email TEXT
    )`, () => {
      // Ensure schema is fully healed from legacy or interrupted creations
      const requiredColumns = {
        'akad_address': 'TEXT', 'akad_maps': 'TEXT',
        'resepsi_address': 'TEXT', 'resepsi_maps': 'TEXT',
        'bank_name': 'TEXT', 'bank_account': 'TEXT', 'gift_address': 'TEXT',
        'admin_username': 'TEXT DEFAULT "admin"', 'admin_password': 'TEXT DEFAULT "admin"',
        'admin_name': 'TEXT DEFAULT "Administrator"', 'admin_email': 'TEXT DEFAULT "admin@uleman.com"'
      };
      
      db.all("PRAGMA table_info(config)", (err, cols) => {
        if (!err && cols) {
          const existingColNames = cols.map(c => c.name);
          for (const [colName, colDef] of Object.entries(requiredColumns)) {
            if (!existingColNames.includes(colName)) {
              console.log(`Auto-healing database: Adding missing column ${colName}`);
              db.run(`ALTER TABLE config ADD COLUMN ${colName} ${colDef}`, () => {});
            }
          }
        }
        
        // Seed default config if entirely empty
        db.get(`SELECT * FROM config WHERE id = 1`, (err, row) => {
          if (!row) {
            db.run(`INSERT INTO config (id, couple_names, wedding_date, theme, akad_address, akad_maps, resepsi_address, resepsi_maps, bank_name, bank_account, gift_address, admin_username, admin_password, admin_name, admin_email) 
                    VALUES (1, 'Romeo & Juliet', '2026-12-12', 'elegant', 
                    'Masjid Raya Al-Jabar\\nJl. Cimincrang No.14\\nKota Bandung', 'https://maps.app.goo.gl/some-link', 
                    'The Trans Luxury Hotel\\nJl. Gatot Subroto No.289\\nKota Bandung', 'https://maps.app.goo.gl/some-link', 
                    'BCA - Romeo', '1234567890',
                    'Jl. Ir. H. Juanda No. 123\\nKel. Dago, Kec. Coblong\\nBandung',
                    'admin', 'admin', 'Administrator', 'admin@uleman.com')`);
          }
        });
      });
    });

    // Create RSVPs Table
    db.run(`CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      guests INTEGER NOT NULL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// ==========================================
// ROUTES
// ==========================================

// --- Root Status WebUI ---
app.get('/', (req, res) => {
  const start_time = new Date(Date.now() - process.uptime() * 1000).toLocaleString();
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Uleman Backend Status</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; background-image: radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%); }
        .card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; width: 100%; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: center; position: relative; }
        .pulse { position: absolute; top: 32px; right: 32px; width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; box-shadow: 0 0 0 rgba(16, 185, 129, 0.7); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 32px; }
        .info-grid { display: grid; gap: 16px; text-align: left; }
        .info-item { background: rgba(255, 255, 255, 0.03); padding: 16px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05); }
        .label { color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .value { font-weight: 600; color: #f8fafc; }
        .success { color: #10b981; display: flex; align-items: center; gap: 6px; }
        .success::before { content: ''; width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
        .endpoints { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: left; }
        .endpoint { display: inline-block; background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 12px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; margin-right: 8px; margin-bottom: 8px; border: 1px solid rgba(59, 130, 246, 0.2); }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="pulse"></div>
        <h1>Uleman Digital</h1>
        <p>Backend API Services & Database Engine</p>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="label">System Status</span>
            <span class="value success">Online & Healthy</span>
          </div>
          <div class="info-item">
            <span class="label">Database Engine</span>
            <span class="value success">SQLite Connected</span>
          </div>
          <div class="info-item">
            <span class="label">Port Binding</span>
            <span class="value">${process.env.PORT || 5000}</span>
          </div>
          <div class="info-item">
            <span class="label">Uptime Since</span>
            <span class="value" style="font-size: 0.9rem">${start_time}</span>
          </div>
        </div>

        <div class="endpoints">
          <div class="label" style="margin-bottom: 12px">Available REST API Endpoints:</div>
          <span class="endpoint">GET /api/config</span>
          <span class="endpoint">POST /api/config</span>
          <span class="endpoint">GET /api/rsvps</span>
          <span class="endpoint">POST /api/rsvps</span>
        </div>
      </div>
    </body>
    </html>
  `);
});

// --- Config API ---
app.get('/api/config', (req, res) => {
  db.get(`SELECT * FROM config WHERE id = 1`, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

app.post('/api/config', (req, res) => {
  const { couple_names, wedding_date, theme, akad_address, akad_maps, resepsi_address, resepsi_maps, bank_name, bank_account, gift_address, admin_username, admin_password, admin_name, admin_email } = req.body;

  // Update configuration logic
  let query = `UPDATE config SET `;
  const params = [];
  const fields = [];

  if (couple_names !== undefined) { fields.push(`couple_names = ?`); params.push(couple_names); }
  if (wedding_date !== undefined) { fields.push(`wedding_date = ?`); params.push(wedding_date); }
  if (theme !== undefined) { fields.push(`theme = ?`); params.push(theme); }
  if (akad_address !== undefined) { fields.push(`akad_address = ?`); params.push(akad_address); }
  if (akad_maps !== undefined) { fields.push(`akad_maps = ?`); params.push(akad_maps); }
  if (resepsi_address !== undefined) { fields.push(`resepsi_address = ?`); params.push(resepsi_address); }
  if (resepsi_maps !== undefined) { fields.push(`resepsi_maps = ?`); params.push(resepsi_maps); }
  if (bank_name !== undefined) { fields.push(`bank_name = ?`); params.push(bank_name); }
  if (bank_account !== undefined) { fields.push(`bank_account = ?`); params.push(bank_account); }
  if (gift_address !== undefined) { fields.push(`gift_address = ?`); params.push(gift_address); }
  if (admin_username !== undefined) { fields.push(`admin_username = ?`); params.push(admin_username); }
  if (admin_password !== undefined) { fields.push(`admin_password = ?`); params.push(admin_password); }
  if (admin_name !== undefined) { fields.push(`admin_name = ?`); params.push(admin_name); }
  if (admin_email !== undefined) { fields.push(`admin_email = ?`); params.push(admin_email); }
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  query += fields.join(', ') + ` WHERE id = 1`;

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Configuration updated successfully!" });
  });
});

// --- RSVPs API ---
app.get('/api/rsvps', (req, res) => {
  db.all(`SELECT * FROM rsvps ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/rsvps', (req, res) => {
  const { name, status, guests, message } = req.body;

  if (!name || !status || guests === undefined) {
    return res.status(400).json({ error: "Missing required fields: name, status, guests" });
  }

  const query = `INSERT INTO rsvps (name, status, guests, message) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, status, guests, message || ''], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      name,
      status,
      guests,
      message,
      message: "RSVP submitted successfully!"
    });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
