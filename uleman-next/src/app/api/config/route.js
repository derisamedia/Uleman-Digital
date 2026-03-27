import { NextResponse } from 'next/server';
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
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (fields.length === 0) return NextResponse.json({ error: 'No fields' }, { status: 400 });
    
    await dbRun(`UPDATE config SET ${fields.join(', ')} WHERE id = 1`, params);
    return NextResponse.json({ message: 'Success' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
