const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../catalogos/parsed_perfumes.json');
const perfumes = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Luxury perfume Unsplash images to rotate
const perfumeImages = [
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
];

const mappedProducts = perfumes.map((p, idx) => ({
  id: `vecar-${p.num || idx + 1}`,
  nombre: p.nombre,
  marca_casa: p.marca_casa,
  categoria: p.categoria,
  volumen_ml: p.volumen_ml || 50,
  precio_venta: p.precio_venta || 260.0,
  precio_costo: p.precio_costo || 140.0,
  stock_actual: p.stock_actual || 12,
  stock_minimo: 2,
  aplica_sello_fidelidad: true,
  activo: true,
  destacado: idx < 6, // Primeros 6 destacados
  imagen_url: perfumeImages[idx % perfumeImages.length],
  notas_olfativas: p.notas_olfativas || "Notas de alta fijación olfativa",
  descripcion: p.descripcion || `Inspiración de autor en presentación de 50 ml. Casa ${p.marca_casa}. Duración garantizada de 6 horas en piel y 1 día en prendas.`
}));

const initialClients = [
  {
    id: "cli-1",
    nombre_completo: "Alejandro Montaño",
    telefono: "75462800",
    email: "vecarperfumeria@gmail.com",
    fecha_nacimiento: "1992-06-15",
    sellos_acumulados: 7,
    total_compras_bob: 1820.00,
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
    total_compras_bob: 920.00,
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
    total_compras_bob: 2650.00,
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
console.log(`Actualizado src/lib/initialData.ts con ${mappedProducts.length} perfumes oficiales.`);
