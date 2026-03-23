import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { eventIdSchema, updateEventSchema } from '@/lib/validations/event';
import { Event } from '@/types/event';

interface EventRouteContext {
  params: { id: string };
}

// GET /api/events/[id] - Get a single event by ID
export async function GET(req: Request, context: EventRouteContext) {
  try {
    const id = context.params.id;
    eventIdSchema.parse(id);

    const result = await query<Event>(
      'SELECT id, title, description, date, location, "createdAt", "updatedAt" FROM events WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(`Error fetching event ${context.params.id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/events/[id] - Update an event by ID
export async function PUT(req: Request, context: EventRouteContext) {
  try {
    const id = context.params.id;
    eventIdSchema.parse(id);

    const body = await req.json();
    const validatedData = updateEventSchema.parse(body);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validatedData.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(validatedData.title);
    }
    if (validatedData.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(validatedData.description || null);
    }
    if (validatedData.date !== undefined) {
      fields.push(`date = $${paramIndex++}`);
      values.push(new Date(validatedData.date));
    }
    if (validatedData.location !== undefined) {
      fields.push(`location = $${paramIndex++}`);
      values.push(validatedData.location || null);
    }

    if (fields.length === 0) {
      return NextResponse.json({ message: 'No valid fields provided for update' }, { status: 400 });
    }

    values.push(id); // Add ID as the last parameter

    const updateQuery = `UPDATE events SET ${fields.join(', ')}, "updatedAt" = NOW() WHERE id = $${paramIndex} RETURNING id, title, description, date, location, "createdAt", "updatedAt"`;

    const result = await query<Event>(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Event not found or failed to update' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(`Error updating event ${context.params.id}:`, error);
    return NextResponse.json({ message: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete an event by ID
export async function DELETE(req: Request, context: EventRouteContext) {
  try {
    const id = context.params.id;
    eventIdSchema.parse(id);

    const result = await query(
      'DELETE FROM events WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Event not found or failed to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error(`Error deleting event ${context.params.id}:`, error);
    return NextResponse.json({ message: 'Failed to delete event' }, { status: 500 });
  }
}
