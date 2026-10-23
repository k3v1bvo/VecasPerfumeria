const postgres = require('postgres');
const fs = require('fs');

const sql = postgres('postgresql://postgres:delunoalnueve_19@db.qxayjtykzvhttrwgzhhd.supabase.co:5432/postgres', { ssl: 'require' });

async function check() {
  const rows = await sql`SELECT id, nombre, imagen_url FROM productos`;
  console.log(`Total productos in Supabase: ${rows.length}`);
  
  let missing = 0;
  for (const r of rows) {
    const local = 'public' + r.imagen_url;
    if (!fs.existsSync(local)) {
      console.log(`MISSING ON DISK: ${r.nombre} -> ${r.imagen_url}`);
      missing++;
    }
  }
  console.log(`Total missing on disk: ${missing}`);
  await sql.end();
}

check();
