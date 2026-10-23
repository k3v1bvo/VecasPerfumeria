const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

async function populateCatalog() {
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:delunoalnueve_19@db.qxayjtykzvhttrwgzhhd.supabase.co:5432/postgres";
  console.log("Conectando a Supabase PostgreSQL...");

  const sql = postgres(connectionString, {
    ssl: 'require',
    connect_timeout: 15,
  });

  try {
    const jsonPath = path.join(__dirname, '../catalogos/parsed_perfumes.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Archivo no encontrado: ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const perfumes = JSON.parse(rawData);
    console.log(`Cargados ${perfumes.length} perfumes del catálogo oficial de Vecar Perfumería.`);

    // Verificar cantidad actual
    const current = await sql`SELECT count(*) FROM productos`;
    console.log(`Cantidad actual en la tabla productos: ${current[0].count}`);

    // Limpiar tabla productos para evitar duplicados o IDs viejos, o agregar
    console.log("Actualizando tabla productos con el catálogo oficial de 215 fragancias...");
    await sql`TRUNCATE TABLE productos CASCADE`;

    // Insertar en lotes
    let inserted = 0;
    for (const p of perfumes) {
      await sql`
        INSERT INTO productos (
          nombre,
          marca_casa,
          categoria,
          volumen_ml,
          precio_venta,
          precio_costo,
          stock_actual,
          stock_minimo,
          aplica_sello_fidelidad,
          activo,
          destacado,
          imagen_url,
          notas_olfativas,
          descripcion
        ) VALUES (
          ${p.nombre},
          ${p.marca_casa},
          ${p.categoria},
          ${p.volumen_ml || 50},
          ${p.precio_venta || 260.00},
          ${p.precio_costo || 140.00},
          ${p.stock_actual || 12},
          2,
          ${p.aplica_sello_fidelidad !== false},
          ${p.activo !== false},
          ${p.destacado || false},
          ${p.imagen_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"},
          ${p.notas_olfativas || ""},
          ${p.descripcion || ""}
        )
      `;
      inserted++;
    }

    console.log(`¡Éxito! Se han insertado ${inserted} productos en Supabase.`);

    // Resumen por categoría
    const stats = await sql`
      SELECT categoria, count(*) as total, AVG(precio_venta)::numeric(10,2) as precio_promedio
      FROM productos
      GROUP BY categoria
      ORDER BY total DESC
    `;
    console.log("Resumen del catálogo oficial en Supabase:");
    console.table(stats);

  } catch (err) {
    console.error("Error al poblar productos en Supabase:", err);
  } finally {
    await sql.end();
  }
}

populateCatalog();
