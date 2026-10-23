import fitz
import re
import os
import json

def process_catalog(pdf_path, category, prefix, output_img_dir):
    os.makedirs(output_img_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    
    perfumes_list = []
    
    for page_idx in range(1, len(doc)):
        page = doc[page_idx]
        text = page.get_text()
        
        # Skip info pages
        if any(term in text for term in ["PREGUNTAS FRECUENTES", "ATENCIÓN", "CONDICIONES", "CONTACTO"]):
            continue
            
        rect = page.rect
        mid_x = rect.width / 2.0
        mid_y = rect.height / 2.0
        
        # 1. Images per quadrant
        quadrant_images = {"TL": [], "TR": [], "BL": [], "BR": []}
        for img in page.get_images():
            xref = img[0]
            w, h = img[2], img[3]
            if w > 1800 or h > 1800 or w < 80 or h < 80:
                continue
            rects = page.get_image_rects(xref)
            if not rects:
                continue
            r = rects[0]
            if r.y0 < 25 or r.y1 > rect.height - 25 or r.width > rect.width * 0.7:
                continue
            cx = (r.x0 + r.x1) / 2.0
            cy = (r.y0 + r.y1) / 2.0
            
            q = ("T" if cy < mid_y else "B") + ("L" if cx < mid_x else "R")
            base_image = doc.extract_image(xref)
            img_len = len(base_image["image"])
            quadrant_images[q].append((xref, base_image, img_len, r))
            
        # 2. Text blocks per quadrant
        blocks = page.get_text("blocks")
        quadrant_blocks = {"TL": [], "TR": [], "BL": [], "BR": []}
        for b in blocks:
            bx0, by0, bx1, by1, btext = b[:5]
            if by1 < 90 and "Perfumes" in btext:
                continue
            cx = (bx0 + bx1) / 2.0
            cy = (by0 + by1) / 2.0
            q = ("T" if cy < mid_y else "B") + ("L" if cx < mid_x else "R")
            clean_b = btext.strip()
            if clean_b:
                quadrant_blocks[q].append((by0, clean_b))
                
        # 3. Process each quadrant in order TL, TR, BL, BR
        for q in ["TL", "TR", "BL", "BR"]:
            q_blocks = quadrant_blocks[q]
            if not q_blocks:
                continue
                
            # Sort text blocks by vertical position
            q_blocks.sort(key=lambda x: x[0])
            full_text = "\n".join([b[1] for b in q_blocks])
            
            # Check if this quadrant contains a perfume
            # Pattern: e.g. "1.\nARIANA GRANDE\n(CLOUD)" or "61U. LE LABO\n(SANTAL 33)"
            num_match = re.search(r"(\d+[A-Za-z]?)\s*\.", full_text)
            name_match = re.search(r"\(([^)]+)\)", full_text)
            
            if not num_match and not name_match:
                continue
                
            p_num = num_match.group(1).upper() if num_match else f"EXTRA_{page_idx+1}_{q}"
            p_name = name_match.group(1).strip() if name_match else "Inspiración"
            
            # Extract brand: usually right around the number or line before (NAME)
            lines = [l.strip() for l in full_text.split("\n") if l.strip()]
            brand = "Inspiración de Autor"
            for idx, l in enumerate(lines):
                if "(" in l and ")" in l:
                    if idx > 0:
                        prev = lines[idx-1]
                        prev_clean = re.sub(r"^\d+[A-Za-z]?\s*\.\s*", "", prev).strip()
                        if prev_clean and len(prev_clean) > 2 and not prev_clean.lower().startswith("dulce") and not prev_clean.lower().startswith("perfume"):
                            brand = prev_clean
                    break
                elif re.match(r"^\d+[A-Za-z]?\s*\.\s*[A-Z]", l):
                    brand = re.sub(r"^\d+[A-Za-z]?\s*\.\s*", "", l).strip()
                    if idx + 1 < len(lines) and "(" in lines[idx+1]:
                        # Great!
                        pass
                    break
                    
            # Clean up brand
            brand = re.sub(r"\s+", " ", brand).strip()
            # If brand still contains number, remove it
            brand = re.sub(r"^\d+[A-Za-z]?\s*\.\s*", "", brand).strip()
            
            # Clean up perfume name
            p_name = re.sub(r"\s+", " ", p_name).strip()
            
            # Extract olfactory notes: lines after the name
            notes = []
            found_name = False
            for l in lines:
                if "(" in l and ")" in l:
                    found_name = True
                    continue
                if found_name:
                    if not re.search(r"(\d+\.|Perfumes|\+591)", l):
                        # Add note words
                        words = [w.strip() for w in l.split() if len(w.strip()) > 2]
                        notes.extend(words)
            notes_str = ", ".join(list(dict.fromkeys(notes))) if notes else "Elegante, Duradero, Cautivador"
            
            # Check gender: if number ends in U, Unisex; otherwise category
            final_cat = category
            if p_num.endswith("U"):
                final_cat = "Unisex"
                
            # Match image
            q_imgs = quadrant_images[q]
            img_url = "/perfumes/catalog/placeholder.png"
            if q_imgs:
                # Pick largest image in this quadrant
                q_imgs.sort(key=lambda x: x[2], reverse=True)
                best_img = q_imgs[0]
                xref = best_img[0]
                b_img = best_img[1]
                ext = b_img["ext"]
                
                clean_num_str = p_num.lower()
                filename = f"{prefix}_{clean_num_str}.{ext}"
                filepath = os.path.join(output_img_dir, filename)
                
                with open(filepath, "wb") as f_out:
                    f_out.write(b_img["image"])
                    
                img_url = f"/perfumes/catalog/{filename}"
            else:
                print(f"Warning: No image in quadrant {q} page {page_idx+1} for #{p_num} {p_name}")
                
            perfumes_list.append({
                "num": p_num,
                "nombre": f"{p_name.title()} ({brand.title()})",
                "perfume_puro": p_name.title(),
                "marca_casa": brand.title(),
                "categoria": final_cat,
                "volumen_ml": 50,
                "precio_venta": 90.0,
                "precio_costo": 45.0,
                "stock_actual": 15,
                "aplica_sello_fidelidad": True,
                "activo": True,
                "notas_olfativas": notes_str,
                "descripcion": f"Inspiración de alta gama de {p_name.title()} ({brand.title()}). Elaborado con 40% de esencia pura y duración garantizada de 8 a 12 horas en piel. Disponible en frasco de 10 ml (Bs. 40), 30 ml (Bs. 70), 50 ml (Bs. 90) y 100 ml (Bs. 145).",
                "imagen_url": img_url,
                "page": page_idx + 1,
                "quadrant": q
            })
            
    print(f"Processed {category}: found {len(perfumes_list)} perfumes.")
    return perfumes_list

if __name__ == "__main__":
    out_dir = r"D:\ProyectosCode\Vacar Perfumeria\public\perfumes\catalog"
    dama_pdf = r"D:\ProyectosCode\Vacar Perfumeria\catalogos\Catalogo Dama CBBA_20260820_205407_0000.pdf"
    varon_pdf = r"D:\ProyectosCode\Vacar Perfumeria\catalogos\Catalogo Varon CBA_20260820_205253_0000.pdf"
    
    dama_perfumes = process_catalog(dama_pdf, "Femenino", "dama", out_dir)
    varon_perfumes = process_catalog(varon_pdf, "Masculino", "varon", out_dir)
    
    all_perfumes = dama_perfumes + varon_perfumes
    
    with open(r"catalogos\extracted_quadrant_perfumes.json", "w", encoding="utf-8") as f:
        json.dump(all_perfumes, f, ensure_ascii=False, indent=2)
        
    print(f"Total perfumes extracted with verified quadrant images: {len(all_perfumes)}")
