import fitz
import os
import json

def extract_images_from_catalog(pdf_path, prefix, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    
    extracted_images = {}
    perfume_counter = 1
    
    for page_idx in range(1, len(doc)):
        page = doc[page_idx]
        text = page.get_text()
        
        if "PREGUNTAS FRECUENTES" in text or "ATENCIÓN" in text or "CONDICIONES" in text:
            continue
            
        rect = page.rect
        mid_x = rect.width / 2.0
        mid_y = rect.height / 2.0
        
        # Quadrants:
        quadrants = {
            "TL": [],
            "TR": [],
            "BL": [],
            "BR": []
        }
        
        for img_info in page.get_images():
            xref = img_info[0]
            width, height = img_info[2], img_info[3]
            
            # Skip massive backgrounds or tiny icons
            if width > 1800 or height > 1800 or width < 100 or height < 100:
                continue
                
            rects = page.get_image_rects(xref)
            if not rects:
                continue
            r = rects[0]
            
            if r.y0 < 30 or r.y1 > rect.height - 30:
                continue
            if r.width > rect.width * 0.7:
                continue
                
            center_x = (r.x0 + r.x1) / 2.0
            center_y = (r.y0 + r.y1) / 2.0
            
            q_key = ""
            if center_x < mid_x and center_y < mid_y:
                q_key = "TL"
            elif center_x >= mid_x and center_y < mid_y:
                q_key = "TR"
            elif center_x < mid_x and center_y >= mid_y:
                q_key = "BL"
            else:
                q_key = "BR"
                
            # Store image candidate with its byte size
            base_image = doc.extract_image(xref)
            img_len = len(base_image["image"])
            quadrants[q_key].append((xref, base_image, img_len))
        
        order = ["TL", "TR", "BL", "BR"]
        for q in order:
            candidates = quadrants[q]
            if candidates:
                # Pick the candidate with largest byte size (the actual photo, not the mask)
                candidates.sort(key=lambda x: x[2], reverse=True)
                best = candidates[0]
                xref, base_image, _ = best
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                filename = f"{prefix}_{perfume_counter}.{image_ext}"
                filepath = os.path.join(output_dir, filename)
                
                with open(filepath, "wb") as f_out:
                    f_out.write(image_bytes)
                
                rel_url = f"/perfumes/catalog/{filename}"
                extracted_images[perfume_counter] = rel_url
                perfume_counter += 1
                
    print(f"[{prefix}] Extraídas {len(extracted_images)} imágenes de perfumes nítidas.")
    return extracted_images

output_dir = r"D:\ProyectosCode\Vacar Perfumeria\public\perfumes\catalog"
dama_pdf = r"D:\ProyectosCode\Vacar Perfumeria\public\catalogos\Catalogo_Dama_Vecar_Perfumeria.pdf"
varon_pdf = r"D:\ProyectosCode\Vacar Perfumeria\public\catalogos\Catalogo_Varon_Vecar_Perfumeria.pdf"

dama_imgs = extract_images_from_catalog(dama_pdf, "dama", output_dir)
varon_imgs = extract_images_from_catalog(varon_pdf, "varon", output_dir)

image_map = {
    "dama": dama_imgs,
    "varon": varon_imgs
}
with open(r"D:\ProyectosCode\Vacar Perfumeria\catalogos\extracted_image_map.json", "w", encoding="utf-8") as f:
    json.dump(image_map, f, indent=2)

print("¡Listo! Mapeo de fotos nítidas guardado en catalogos/extracted_image_map.json")
