import fitz
import re
import json

def analyze_catalog(pdf_path, name):
    doc = fitz.open(pdf_path)
    print(f"\n==================== {name} ({len(doc)} pages) ====================")
    
    total_perfumes = 0
    total_matched = 0
    
    for page_idx in range(1, len(doc)):
        page = doc[page_idx]
        text = page.get_text()
        
        # Check if it's an informational page
        if any(term in text for term in ["PREGUNTAS FRECUENTES", "ATENCIÓN", "CONDICIONES"]):
            continue
            
        rect = page.rect
        mid_x = rect.width / 2.0
        mid_y = rect.height / 2.0
        
        # 1. Find images in 4 quadrants
        quadrant_images = {"TL": [], "TR": [], "BL": [], "BR": []}
        for img in page.get_images():
            xref = img[0]
            width, height = img[2], img[3]
            if width > 1800 or height > 1800 or width < 80 or height < 80:
                continue
            rects = page.get_image_rects(xref)
            if not rects:
                continue
            r = rects[0]
            if r.y0 < 30 or r.y1 > rect.height - 30 or r.width > rect.width * 0.7:
                continue
            cx = (r.x0 + r.x1) / 2.0
            cy = (r.y0 + r.y1) / 2.0
            
            q = ("T" if cy < mid_y else "B") + ("L" if cx < mid_x else "R")
            base_image = doc.extract_image(xref)
            quadrant_images[q].append((xref, base_image, len(base_image["image"])))
            
        # 2. Find perfume text in 4 quadrants
        quadrant_text = {"TL": [], "TR": [], "BL": [], "BR": []}
        blocks = page.get_text("blocks")
        for b in blocks:
            bx0, by0, bx1, by1, btext = b[:5]
            # Ignore page headers
            if by1 < 100 and "Perfumes" in btext:
                continue
            cx = (bx0 + bx1) / 2.0
            cy = (by0 + by1) / 2.0
            q = ("T" if cy < mid_y else "B") + ("L" if cx < mid_x else "R")
            clean_t = btext.strip()
            if clean_t:
                quadrant_text[q].append(clean_t)
                
        # Parse perfume in each quadrant
        for q in ["TL", "TR", "BL", "BR"]:
            all_q_text = "\n".join(quadrant_text[q])
            # Look for perfume pattern: e.g. "1.", "2.", "61U." or number with dot
            match_num = re.search(r"(\d+[A-Za-z]?)\s*\.", all_q_text)
            match_name = re.search(r"\(([^)]+)\)", all_q_text)
            
            if match_num or match_name:
                total_perfumes += 1
                p_num = match_num.group(1) if match_num else "?"
                p_name = match_name.group(1) if match_name else "?"
                
                imgs = quadrant_images[q]
                if imgs:
                    imgs.sort(key=lambda x: x[2], reverse=True)
                    best_img = imgs[0]
                    total_matched += 1
                    # print(f"  Page {page_idx+1} {q}: #{p_num} {p_name} -> IMG xref={best_img[0]} ({best_img[1]['ext']})")
                else:
                    print(f"  [MISSING IMG] Page {page_idx+1} {q}: #{p_num} {p_name}")
                    
    print(f"{name}: Total perfumes identified = {total_perfumes}, Images matched = {total_matched}")

analyze_catalog(r"catalogos\Catalogo Dama CBBA_20260820_205407_0000.pdf", "DAMA")
analyze_catalog(r"catalogos\Catalogo Varon CBA_20260820_205253_0000.pdf", "VARON")
