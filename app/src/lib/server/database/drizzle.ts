import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '$lib/server/database/drizzle-schemas';
import pg from 'pg';
const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

await pool.connect();
const db = drizzle(pool, { schema });

export default db;
