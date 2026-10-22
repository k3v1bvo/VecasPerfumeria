const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

async function runMigration() {
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:delunoalnueve_19@db.qxayjtykzvhttrwgzhhd.supabase.co:5432/postgres";
  console.log("Conectando a Supabase PostgreSQL...");

  const sql = postgres(connectionString, {
    ssl: 'require',
    connect_timeout: 15,
  });

  try {
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log("Ejecutando schema.sql en Supabase...");
    await sql.unsafe(schemaSql);
    console.log("¡Migración ejecutada con éxito!");

    // Verificar productos
    const prods = await sql`SELECT count(*) FROM productos`;
    console.log(`Total productos en Supabase: ${prods[0].count}`);

    // Verificar clientes
    const clis = await sql`SELECT count(*) FROM clientes`;
    console.log(`Total clientes en Supabase: ${clis[0].count}`);

    // Imprimir productos
    const sampleProds = await sql`SELECT id, nombre, marca_casa, precio_venta, categoria FROM productos LIMIT 5`;
    console.log("Muestra de productos creados:");
    console.table(sampleProds);

    // Imprimir clientes
    const sampleClis = await sql`SELECT id, nombre_completo, telefono, sellos_acumulados FROM clientes`;
    console.log("Clientes creados en Vecar Club:");
    console.table(sampleClis);

  } catch (err) {
    console.error("Error durante la migración:", err);
  } finally {
    await sql.end();
  }
}

runMigration();
