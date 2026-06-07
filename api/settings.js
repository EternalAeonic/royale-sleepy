import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    // 1. Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'
      );
    `);

    // 2. Insert default row if table is empty
    const checkRes = await pool.query('SELECT COUNT(*) FROM site_settings');
    if (parseInt(checkRes.rows[0].count) === 0) {
      await pool.query("INSERT INTO site_settings (id, data) VALUES (1, '{}')");
    }

    if (req.method === 'GET') {
      const result = await pool.query('SELECT data FROM site_settings WHERE id = 1');
      return res.status(200).json(result.rows[0].data);
    } 
    
    if (req.method === 'POST') {
      const newData = req.body;
      await pool.query('UPDATE site_settings SET data = $1 WHERE id = 1', [newData]);
      return res.status(200).json({ success: true, data: newData });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}
