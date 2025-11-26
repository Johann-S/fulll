import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export function getDatabase() {
  if (!db) {
    db = drizzle({
      connection: {
        host: process.env.POSTGRES_HOST!,
        port: parseInt(process.env.POSTGRES_PORT!),
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!,
        ssl: false,
      },
      schema,
    });
  }

  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.$client.end();

    db = null;
  }
}
