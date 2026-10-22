const WebSocket = require('ws');
global.WebSocket = WebSocket;

const { createClient } = require('@supabase/supabase-js');

async function testClient() {
  const supabaseUrl = "https://qxayjtykzvhttrwgzhhd.supabase.co";
  const supabaseAnonKey = "sb_publishable_kNc2w17u0fExipEBuo-TbA_CieQ6duE";

  const client = createClient(supabaseUrl, supabaseAnonKey);

  console.log("Probando consulta pública vía Supabase REST API (anon key)...");
  const { data: prods, error: prodErr } = await client
    .from('productos')
    .select('id, nombre, precio_venta, categoria');

  if (prodErr) {
    console.error("Error consultando productos:", prodErr);
  } else {
    console.log(`✅ Conexión cliente exitosa. Se obtuvieron ${prods.length} productos desde Supabase.`);
    console.table(prods);
  }

  console.log("Probando búsqueda de cliente por teléfono...");
  const { data: cliente, error: cliErr } = await client
    .from('clientes')
    .select('*')
    .eq('telefono', '75462800')
    .single();

  if (cliErr) {
    console.error("Error consultando cliente:", cliErr);
  } else {
    console.log(`✅ Cliente encontrado con éxito: ${cliente.nombre_completo} (Sellos: ${cliente.sellos_acumulados})`);
  }
}

testClient();
