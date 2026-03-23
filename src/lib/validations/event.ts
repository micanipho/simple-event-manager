import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot exceed 255 characters'),
  description: z.string().nullable().optional(),
  date: z.string().datetime('Invalid date format. Expected ISO 8601 string.'), // Expects ISO 8601 format
  location: z.string().max(255, 'Location cannot exceed 255 characters').nullable().optional(),
});

export const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot exceed 255 characters').optional(),
  description: z.string().nullable().optional(),
  date: z.string().datetime('Invalid date format. Expected ISO 8601 string.').optional(),
  location: z.string().max(255, 'Location cannot exceed 255 characters').nullable().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided for update.' });

export const eventIdSchema = z.string().uuid('Invalid event ID format. Expected a UUID.');
