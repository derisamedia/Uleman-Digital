const fs = require('fs');
const path = require('path');

const srcDir = 'src/pages';
const destDir = '../uleman-next/src/app';
const destComponents = '../uleman-next/src/app/components';

if (!fs.existsSync(destComponents)) {
  fs.mkdirSync(destComponents, { recursive: true });
}

// Ensure the db exists in the right place
fs.copyFileSync('../backend/uleman_v3.db', '../uleman-next/uleman_v3.db');

// Copy global styles
fs.copyFileSync('src/index.css', '../uleman-next/src/app/globals.css');

// Read all files
const files = fs.readdirSync(srcDir);
files.forEach(f => {
  if (f.endsWith('.jsx')) {
    const raw = fs.readFileSync(path.join(srcDir, f), 'utf8');
    const content = '"use client";\n' + raw.replace(/http:\/\/localhost:5000/g, ''); 
    fs.writeFileSync(path.join(destComponents, f), content);
  } else if (f.endsWith('.css')) {
    fs.copyFileSync(path.join(srcDir, f), path.join(destComponents, f));
  }
});

// Create page.js for Root (Landing)
fs.writeFileSync(path.join(destDir, 'page.js'), 
`import LandingPage from './components/LandingPage';
export default function Home() {
  return <LandingPage />;
}
`);

// Create dashboard route
const dashDir = path.join(destDir, 'dashboard');
if (!fs.existsSync(dashDir)) fs.mkdirSync(dashDir);
fs.writeFileSync(path.join(dashDir, 'page.js'),
`import Dashboard from '../components/Dashboard';
export const metadata = { title: "Uleman Dashboard" };
export default function DashboardRoute() {
  return <Dashboard />;
}
`);

// Create lib/db.js
const libDir = path.join('../uleman-next/src', 'lib');
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir);
fs.writeFileSync(path.join(libDir, 'db.js'),
`import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'uleman_v3.db');
const db = new sqlite3.Database(dbPath);

export const dbGet = (query, params = []) => new Promise((resolve, reject) => db.get(query, params, (err, row) => err ? reject(err) : resolve(row)));
export const dbAll = (query, params = []) => new Promise((resolve, reject) => db.all(query, params, (err, rows) => err ? reject(err) : resolve(rows)));
export const dbRun = (query, params = []) => new Promise((resolve, reject) => db.run(query, params, function(err) { err ? reject(err) : resolve(this) }));
`);

// Create API Route config
const apiConfigDir = path.join(destDir, 'api/config');
fs.mkdirSync(apiConfigDir, { recursive: true });
fs.writeFileSync(path.join(apiConfigDir, 'route.js'),
`import { NextResponse } from 'next/server';
import { dbGet, dbRun } from '@/lib/db';

export async function GET() {
  try {
    const row = await dbGet('SELECT * FROM config WHERE id = 1');
    return NextResponse.json(row || {});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        fields.push(\`\${key} = ?\`);
        params.push(value);
      }
    }
    
    if (fields.length === 0) return NextResponse.json({ error: 'No fields' }, { status: 400 });
    
    await dbRun(\`UPDATE config SET \${fields.join(', ')} WHERE id = 1\`, params);
    return NextResponse.json({ message: 'Success' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
`);

// Create API Route RSVPS
const apiRsvpDir = path.join(destDir, 'api/rsvps');
fs.mkdirSync(apiRsvpDir, { recursive: true });
fs.writeFileSync(path.join(apiRsvpDir, 'route.js'),
`import { NextResponse } from 'next/server';
import { dbAll, dbRun } from '@/lib/db';

export async function GET() {
  try {
    const rows = await dbAll('SELECT * FROM rsvps ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, status, guests, message } = await req.json();
    await dbRun('INSERT INTO rsvps (name, status, guests, message) VALUES (?, ?, ?, ?)', [name, status, guests, message]);
    return NextResponse.json({ message: 'Success' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
`);

console.log('Migration scripts completed.');
