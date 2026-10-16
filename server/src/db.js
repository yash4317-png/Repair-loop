import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3307),
  user: process.env.MYSQL_USER || 'repairloop',
  password: process.env.MYSQL_PASSWORD || 'repairloop',
  database: process.env.MYSQL_DATABASE || 'repairloop'
};

let pool;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForMysql() {
  let lastError;
  for (let i = 0; i < 40; i += 1) {
    try {
      const conn = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password
      });
      await conn.query(
        `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      await conn.end();
      return;
    } catch (err) {
      lastError = err;
      await sleep(1500);
    }
  }
  throw lastError || new Error('Could not connect to MySQL');
}

export async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: false,
      multipleStatements: true
    });
  }
  return pool;
}

export async function initDatabase() {
  await waitForMysql();
  const db = await getPool();
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.query(schemaSql);
  return db;
}

export function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
