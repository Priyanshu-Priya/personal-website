import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

if (!connectionString) {
    console.error('🔴 Error: POSTGRES_URL_NON_POOLING or DATABASE_URL is not defined in .env.local');
    console.error('👉 Please ensure you have the Direct Connection string from Supabase settings (Port 5432).');
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Required for Supabase connection
});

async function resetDb() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        const sqlPath = path.join(process.cwd(), 'db', 'init_supabase.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🔄 Executing reset script...');
        await client.query(sql);

        console.log('✅ Database reset complete! site_config table re-initialized.');
    } catch (err) {
        console.error('❌ Database reset failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

resetDb();
