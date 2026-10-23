import fitz
import re
import json

def test_samples():
    doc_d = fitz.open(r"catalogos\Catalogo Dama CBBA_20260820_205407_0000.pdf")
    doc_v = fitz.open(r"catalogos\Catalogo Varon CBA_20260820_205253_0000.pdf")
    
    def check_quadrants(doc, pno):
        page = doc[pno]
        rect = page.rect
        mid_x, mid_y = rect.width / 2.0, rect.height / 2.0
        
        q_imgs = {"TL": [], "TR": [], "BL": [], "BR": []}
        for img in page.get_images():
            xref = img[0]
            if img[2] > 1800 or img[3] > 1800 or img[2] < 80 or img[3] < 80:
                continue
            rects = page.get_image_rects(xref)
            if not rects:
                continue
            r = rects[0]
            if r.y0 < 30 or r.y1 > rect.height - 30 or r.width > rect.width * 0.7:
                continue
            cx, cy = (r.x0 + r.x1)/2.0, (r.y0 + r.y1)/2.0
            q = ("T" if cy < mid_y else "B") + ("L" if cx < mid_x else "R")
            q_imgs[q].append((xref, img[2], img[3]))
            
        blocks = page.get_text("blocks")
        q_text = {"TL": [], "TR": [], "BL": [], "BR": []}
        for b in blocks:
            if b[3] < 100 and "Perfumes" in b[4]:
                continue
            cx, cy = (b[0] + b[2])/2.0, (b[1] + b[3])/2.0
            q = ("T" if cy < mid_y else "B") + ("L" if cx < mid_x else "R")
            q_text[q].append(b[4].strip())
            
        for q in ["TL", "TR", "BL", "BR"]:
            t = " ".join(q_text[q]).replace("\n", " ")
            m_num = re.search(r"(\d+[A-Za-z]?)\s*\.", t)
            m_name = re.search(r"\(([^)]+)\)", t)
            if m_num or m_name:
                num = m_num.group(1) if m_num else "?"
                name = m_name.group(1) if m_name else "?"
                print(f"P.{pno+1} {q}: #{num} - {name} | Img xrefs: {[x[0] for x in q_imgs[q]]}")

    print("--- DAMA PAGE 13 ---")
    check_quadrants(doc_d, 12)
    print("--- DAMA PAGE 14 ---")
    check_quadrants(doc_d, 13)
    print("--- VARON PAGE 2 ---")
    check_quadrants(doc_v, 1)
    print("--- VARON PAGE 17 ---")
    check_quadrants(doc_v, 16)
    print("--- VARON PAGE 18 ---")
    check_quadrants(doc_v, 17)

test_samples()
