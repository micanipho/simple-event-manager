import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { eventSchema } from '@/lib/validations/event';
import { Event } from '@/types/event';

// GET /api/events - Get all events
export async function GET() {
  try {
    const result = await query<Event>('SELECT id, title, description, date, location, "createdAt", "updatedAt" FROM events ORDER BY date DESC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = eventSchema.parse(body);

    const { title, description, date, location } = validatedData;

    const result = await query<Event>(
      'INSERT INTO events (title, description, date, location) VALUES ($1, $2, $3, $4) RETURNING id, title, description, date, location, "createdAt", "updatedAt"',
      [title, description || null, new Date(date), location || null]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}
