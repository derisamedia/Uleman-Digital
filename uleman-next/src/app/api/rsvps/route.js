import { NextResponse } from 'next/server';
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
