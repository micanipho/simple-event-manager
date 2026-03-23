import { Pool, QueryResult } from 'pg';

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Create a new PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Executes a SQL query against the database.
 * @param text The SQL query string.
 * @param params Optional parameters for the query.
 * @returns A Promise that resolves to the query result.
 */
export async function query<T>(text: string, params?: any[]): Promise<QueryResult<T>> {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query<T>(text, params);
      return result;
    } finally {
      client.release(); // Release the client back to the pool
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to execute database query.');
  }
}
