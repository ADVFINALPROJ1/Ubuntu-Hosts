import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  drizzle as neonDrizzle,
  NeonHttpDatabase,
} from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import WebSocket from 'ws';

// ws's default export is the WebSocket constructor; cast to any to satisfy
// neonConfig's WebSocketConstructor type
neonConfig.webSocketConstructor = WebSocket as any;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

let dbClient:
  | (NodePgDatabase<Record<string, never>> & { $client: Pool })
  | NeonHttpDatabase<Record<string, never>>;

const getDbConn = () => {
  if (!process.env.DATABASE_URL)
    throw new Error('No database connection string specified.');

  if (!dbClient && process.env.APP_ENV === 'development') {
    dbClient = drizzle(process.env.DATABASE_URL);
  }

  if (!dbClient && process.env.APP_ENV === 'production') {
    const sql = neon(process.env.DATABASE_URL);
    dbClient = neonDrizzle({ client: sql });
  }

  return dbClient;
};

export const db = getDbConn();