const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../catalogos/parsed_perfumes.json');
const perfumes = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const mappedProducts = perfumes.map((p, idx) => ({
  id: p.id || `vecar-${p.categoria === 'Femenino' ? 'dam' : (p.categoria === 'Masculino' ? 'var' : 'uni')}-${(p.num || (idx + 1)).toString().toLowerCase()}`,
  nombre: p.nombre,
  marca_casa: p.marca_casa,
  categoria: p.categoria,
  volumen_ml: p.volumen_ml || 50,
  precio_venta: p.precio_venta || 90.0,
  precio_costo: p.precio_costo || 45.0,
  stock_actual: p.stock_actual || 15,
  stock_minimo: 2,
  aplica_sello_fidelidad: true,
  activo: true,
  destacado: p.destacado || idx < 8,
  imagen_url: p.imagen_url,
  notas_olfativas: p.notas_olfativas || "Notas de alta fijación con 40% de esencia pura",
  familia_olfativa: p.familia_principal || (p.familias_olfativas && p.familias_olfativas[0]) || "Elegante / Versátil",
  familias_olfativas: p.familias_olfativas || ["Elegante / Versátil"],
  descripcion: p.descripcion || `Inspiración de autor con 40% de esencia pura y duración garantizada de 8 a 12 horas en piel. Frascos de lujo disponibles: 10 ml (Bs. 40), 30 ml (Bs. 70), 50 ml (Bs. 90) y 100 ml (Bs. 145).`
}));

const initialClients = [
  {
    id: "cli-1",
    nombre_completo: "Alejandro Montaño",
    telefono: "75462800",
    email: "vecarperfumeria@gmail.com",
    fecha_nacimiento: "1992-06-15",
    sellos_acumulados: 7,
    sellos_por_tamano: {
      ml20: 0,
      ml50: 5,
      ml100: 2
    },
    total_compras_bob: 630.00,
    activo: true,
    creado_en: "2026-01-10T14:30:00Z"
  },
  {
    id: "cli-2",
    nombre_completo: "Valeria Quiroga",
    telefono: "70712345",
    email: "valeria.q@gmail.com",
    fecha_nacimiento: "1996-11-20",
    sellos_acumulados: 4,
    sellos_por_tamano: {
      ml20: 1,
      ml50: 3,
      ml100: 0
    },
    total_compras_bob: 310.00,
    activo: true,
    creado_en: "2026-02-04T11:15:00Z"
  },
  {
    id: "cli-3",
    nombre_completo: "Carlos Fernández",
    telefono: "71789456",
    email: "carlos.f@hotmail.com",
    fecha_nacimiento: "1988-03-08",
    sellos_acumulados: 10,
    sellos_por_tamano: {
      ml20: 0,
      ml50: 3,
      ml100: 7
    },
    total_compras_bob: 1285.00,
    activo: true,
    creado_en: "2025-11-18T16:00:00Z"
  }
];

const content = `import { Producto, Cliente } from "@/types/database";

export const INITIAL_PRODUCTS: Producto[] = ${JSON.stringify(mappedProducts, null, 2)};

export const INITIAL_CLIENTS: Cliente[] = ${JSON.stringify(initialClients, null, 2)};
`;

const targetPath = path.join(__dirname, '../src/lib/initialData.ts');
fs.writeFileSync(targetPath, content, 'utf8');
console.log(`Actualizado src/lib/initialData.ts con ${mappedProducts.length} perfumes oficiales, fotos del catalogo y precios reales.`);
