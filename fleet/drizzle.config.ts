import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: './fleet/src/Infra/Database/schema.ts',
  out: './fleet/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    ssl: false,
  },
  verbose: true,
  strict: true,
});
