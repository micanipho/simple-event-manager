export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewEventInput {
  title: string;
  description?: string | null;
  date: string; // ISO 8601 string for input
  location?: string | null;
}

export interface UpdateEventInput {
  title?: string;
  description?: string | null;
  date?: string; // ISO 8601 string for input
  location?: string | null;
}
