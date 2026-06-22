import { Pool } from 'pg';

// Verificar que estamos en el servidor
const isServer = typeof window === 'undefined';

if (!isServer) {
  throw new Error('Este módulo solo puede ser usado en el servidor');
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'tu_usuario',
  password: process.env.DB_PASSWORD || 'tu_contraseña',
  database: process.env.DB_NAME || 'tu_base_datos',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Query executed', { text, duration, rows: res.rowCount });
  return res;
}

export default pool;