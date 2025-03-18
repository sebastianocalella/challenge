import pkg from 'pg';
const { Pool } = pkg;
import { env } from '$env/dynamic/private';

const initQuery = `
CREATE DATABASE IF NOT EXISTS content_manager;

USE DATABASE content_manager;

CREATE TABLE IF NOT EXISTS content_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    category VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    file_name VARCHAR(255),
    file_data BYTEA,
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
let db: pkg.PoolClient | undefined = undefined;

export async function initializeDb (){
  if (db!=undefined) {
    return db;
  }
  console.log('Attempting to connect to database with:', {
  connectionString: env.DATABASE_URL,
  // Don't log the full URL as it contains credentials
  // Instead log the components
  host: 'localhost',
  database: env.POSTGRES_DB,
});

// Create a database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL.replace("/content_manager","")
});

// Test the connection
const client = await pool.connect()
const res = await client.query('SELECT version()')
console.log('PostgreSQL version:', res.rows[0].version);
await client.query(initQuery)
console.log("DB initialized correctly")
db = client;
return db;
}