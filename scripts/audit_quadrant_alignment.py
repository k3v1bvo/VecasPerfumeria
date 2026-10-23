import fitz
import re
import os
import json

def verify_all_pages(pdf_path, name):
    doc = fitz.open(pdf_path)
    print(f"\n==================== AUDITING {name} ({len(doc)} pages) ====================")
    
    anomalies = []
    total_perfumes = 0
    
    for page_idx in range(1, len(doc)):
        page = doc[page_idx]
        text = page.get_text()
        
        if any(term in text for term in ["PREGUNTAS FRECUENTES", "ATENCIÓN", "CONDICIONES", "CONTACTO"]):
            continue
            
        rect = page.rect
        mid_x = rect.width / 2.0
        mid_y = rect.height / 2.0
        
        # 1. Images
        images_on_page = []
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
            images_on_page.append({
                "xref": xref,
                "rect": r,
                "cx": cx,
                "cy": cy,
                "quadrant": q,
                "bytes": len(base_image["image"]),
                "ext": base_image["ext"]
            })
            
        # 2. Text blocks with perfume names
        blocks = page.get_text("blocks")
        perfumes_on_page = []
        for b in blocks:
            bx0, by0, bx1, by1, btext = b[:5]
            if by1 < 90 and "Perfumes" in btext:
                continue
            clean = btext.strip()
            # Find perfume name like (GOOD GIRL)
            m_name = re.search(r"\(([^)]+)\)", clean)
            m_num = re.search(r"(\d+[A-Za-z]?)\s*\.", clean)
            if m_name or m_num:
                cx = (bx0 + bx1) / 2.0
                cy = (by0 + by1) / 2.0
                q = ("T" if cy < mid_y else "B") + ("L" if cx < mid_x else "R")
                perfumes_on_page.append({
                    "text": clean.replace("\n", " "),
                    "name": m_name.group(1) if m_name else "N/A",
                    "num": m_num.group(1) if m_num else "?",
                    "rect": (bx0, by0, bx1, by1),
                    "cx": cx,
                    "cy": cy,
                    "quadrant": q
                })
                
        # Group by quadrant
        for q in ["TL", "TR", "BL", "BR"]:
            q_perfs = [p for p in perfumes_on_page if p["quadrant"] == q]
            q_imgs = [img for img in images_on_page if img["quadrant"] == q]
            
            if q_perfs:
                total_perfumes += 1
                p = q_perfs[0]
                if not q_imgs:
                    print(f"ANOMALY: No image in quadrant {q} for page {page_idx+1}: #{p['num']} {p['name']}")
                    anomalies.append((page_idx+1, q, p['num'], p['name'], "NO_IMAGE"))
                elif len(q_imgs) > 1:
                    # multiple images
                    pass
            elif q_imgs:
                print(f"EXTRA IMAGE: Quadrant {q} has {len(q_imgs)} image(s) but no perfume on page {page_idx+1}")
                anomalies.append((page_idx+1, q, None, None, "EXTRA_IMAGE"))
                
    print(f"Finished {name}: {total_perfumes} perfumes checked, {len(anomalies)} anomalies found.")
    return anomalies

anom_d = verify_all_pages(r"catalogos\Catalogo Dama CBBA_20260820_205407_0000.pdf", "DAMA")
anom_v = verify_all_pages(r"catalogos\Catalogo Varon CBA_20260820_205253_0000.pdf", "VARON")
