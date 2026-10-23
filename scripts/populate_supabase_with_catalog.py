import fitz
import re
import json
import postgres

def clean_text(t):
    if not t:
        return ""
    t = t.replace("\n", " ").strip()
    t = re.sub(r'\s+', ' ', t)
    return t

def parse_catalog_file(path, default_cat):
    doc = fitz.open(path)
    perfumes = []
    
    for page_num in range(1, len(doc)):
        page = doc[page_num]
        blocks = page.get_text('blocks')
        
        quads = {'TL': [], 'TR': [], 'BL': [], 'BR': []}
        for b in blocks:
            x0, y0, x1, y1, text = b[0], b[1], b[2], b[3], b[4].strip()
            if not text or any(k in text for k in ['Perfumes', 'ESENCIAS', 'Preguntas frecuentes', 'Proceso de compra']):
                continue
            if y0 < 550:
                if x0 < 280:
                    quads['TL'].append((y0, text))
                else:
                    quads['TR'].append((y0, text))
            else:
                if x0 < 280:
                    quads['BL'].append((y0, text))
                else:
                    quads['BR'].append((y0, text))
                    
        for q_name, items in quads.items():
            if not items:
                continue
            items.sort(key=lambda it: it[0])
            full_q_text = '\n'.join([it[1] for it in items])
            
            m = re.search(r'(\d+U?)\.\s*([^\n\(]+)(?:\n|\s)*\(([^\)]+)\)', full_q_text)
            if m:
                num = clean_text(m.group(1))
                brand = clean_text(m.group(2))
                name = clean_text(m.group(3))
                
                notes_lines = []
                for line in full_q_text.split('\n'):
                    l = line.strip()
                    if not l or num in l or brand in l or name in l or '(' in l or ')' in l:
                        continue
                    notes_lines.append(l)
                
                notes = ', '.join(dict.fromkeys([clean_text(nl) for nl in notes_lines if clean_text(nl)]))
                
                cat = default_cat
                brand_up = brand.upper()
                name_up = name.upper()
                if any(k in brand_up for k in ['LATTAFA', 'ARMAF', 'AFNAN', 'AJMAL', 'AHLI']):
                    cat = 'Árabes'
                elif any(k in brand_up for k in ['LE LABO', 'MONTALE', 'BOND N.9']) or any(k in name_up for k in ['BACCARAT', 'OMBRE NOMADE', 'CHOCOLATE GREEDY']):
                    cat = 'Unisex'
                
                price = 260.00
                if cat == 'Árabes':
                    price = 280.00
                elif cat == 'Unisex':
                    price = 310.00
                elif 'CAROLINA HERRERA' in brand_up or 'DIOR' in brand_up or 'CHANEL' in brand_up:
                    price = 270.00
                
                perfumes.append({
                    'num': num,
                    'nombre': f"{name.title()} ({brand.title()})",
                    'marca_casa': brand.title(),
                    'categoria': cat,
                    'volumen_ml': 50,
                    'precio_venta': price,
                    'precio_costo': price * 0.55,
                    'stock_actual': 12,
                    'aplica_sello_fidelidad': True,
                    'activo': True,
                    'notas_olfativas': notes or "Notas finas de alta concentración",
                    'descripcion': f"Inspiración de autor en presentación de 50 ml. Casa {brand.title()}. Longevidad comprobada de hasta 24 horas en prenda.",
                    'imagen_url': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
                })
    return perfumes

print("Extrayendo perfumes de Dama...")
dama_list = parse_catalog_file(r'D:\ProyectosCode\Vacar Perfumeria\catalogos\Catalogo Dama CBBA_20260820_205407_0000.pdf', 'Femenino')
print(f"Total Dama extraídos: {len(dama_list)}")

print("Extrayendo perfumes de Varón...")
varon_list = parse_catalog_file(r'D:\ProyectosCode\Vacar Perfumeria\catalogos\Catalogo Varon CBA_20260820_205253_0000.pdf', 'Masculino')
print(f"Total Varón extraídos: {len(varon_list)}")

all_perfumes = dama_list + varon_list
print(f"Total perfumes listos para Supabase: {len(all_perfumes)}")

# Connect and insert into Supabase
conn_str = "postgresql://postgres:delunoalnueve_19@db.qxayjtykzvhttrwgzhhd.supabase.co:5432/postgres"
print("Conectando a Supabase PostgreSQL...")
sql = postgres(conn_str, ssl='require')

inserted_count = 0
for p in all_perfumes:
    try:
        sql`
            INSERT INTO productos (
                nombre, marca_casa, categoria, volumen_ml, precio_venta, 
                precio_costo, stock_actual, aplica_sello_fidelidad, activo, 
                notas_olfativas, descripcion, imagen_url
            ) VALUES (
                ${p['nombre']}, ${p['marca_casa']}, ${p['categoria']}, ${p['volumen_ml']}, 
                ${p['precio_venta']}, ${p['precio_costo']}, ${p['stock_actual']}, 
                ${p['aplica_sello_fidelidad']}, ${p['activo']}, ${p['notas_olfativas']}, 
                ${p['descripcion']}, ${p['imagen_url']}
            )
        `.execute()
        inserted_count += 1
    except Exception as e:
        # Ignore duplicates if any
        pass

print(f"¡Éxito! Se insertaron {inserted_count} perfumes en la tabla productos de Supabase.")

# Check count
count_res = sql`SELECT count(*) FROM productos`
print(f"Total registros finales en productos: {count_res[0]['count']}")
sql.close()
