import json
import re
import os

with open(r"catalogos\extracted_quadrant_perfumes.json", encoding="utf-8") as f:
    raw_perfumes = json.load(f)

real = [p for p in raw_perfumes if not p["num"].startswith("EXTRA_")]

def detect_olfactory_families(notes_text):
    text = (notes_text or "").lower()
    families = []
    
    if any(k in text for k in ["dulce", "avainillad", "vainilla", "caramel", "cacao", "chocolat", "caf", "tonka", "coco", "miel", "lact"]):
        families.append("Dulce / Gourmand")
        
    if any(k in text for k in ["amaderad", "pachul", "cedro", "sndalo", "sandalo", "vetiver", "oud", "terros"]):
        families.append("Amaderada")
        
    if any(k in text for k in ["floral", "rosas", "jazm", "nardos", "iris", "flor", "blanco", "violeta", "lavanda"]):
        families.append("Floral")
        
    if any(k in text for k in ["ctric", "citric", "fresco", "acutic", "acuatic", "marina", "verde", "oznic", "ozonic", "lim", "bergamot", "mandarina"]):
        families.append("Cítrica / Fresca")
        
    if any(k in text for k in ["mbar", "ambar", "especiad", "canela", "clido", "calido", "incienso", "oriental", "balsmic", "balsamic"]):
        families.append("Ámbar / Oriental")
        
    if any(k in text for k in ["cuero", "tabaco", "humo", "animal"]):
        families.append("Cuero / Intenso")
        
    if any(k in text for k in ["aromtic", "aromatic", "menta", "ans", "anis", "musg"]):
        families.append("Aromática")
        
    if not families:
        families.append("Elegante / Versátil")
        
    return families

final_perfumes = []
seen_ids = set()

for idx, p in enumerate(real, 1):
    num = p["num"]
    perfume_puro = p["perfume_puro"].strip()
    brand = p["marca_casa"].strip()
    
    # Clean brand special cases
    if num == "1" and p["categoria"] == "Masculino" and ("Inspiraci" in brand or brand == ""):
        brand = "Azzaro"
    elif brand in ["Victoria Secret", "Victoria´S Secret"]:
        brand = "Victoria's Secret"
    elif brand == "Dior":
        brand = "Christian Dior"
    elif brand == "Gilles Armani":
        brand = "Giorgio Armani"
        
    # Clean perfume name
    clean_nombre = f"{perfume_puro} ({brand})"
    
    # Detect olfactory families
    familias = detect_olfactory_families(p["notas_olfativas"])
    
    # Ensure ID uniqueness
    cat_code = "DAM" if p["categoria"] == "Femenino" else ("VAR" if p["categoria"] == "Masculino" else "UNI")
    clean_id = f"{cat_code}-{num.lower()}"
    
    # Clean image url check
    img_url = p["imagen_url"]
    
    perfume_obj = {
        "id": clean_id,
        "num": num,
        "nombre": clean_nombre,
        "perfume_puro": perfume_puro,
        "marca_casa": brand,
        "categoria": p["categoria"],
        "familias_olfativas": familias,
        "familia_principal": familias[0],
        "volumen_ml": 50,
        "precio_venta": 90.0,
        "precio_costo": 45.0,
        "stock_actual": 15,
        "aplica_sello_fidelidad": True,
        "activo": True,
        "notas_olfativas": p["notas_olfativas"],
        "descripcion": f"Inspiración de autor de {perfume_puro} de la casa {brand}. Formulado con 40% de esencia pura con duración certificada de 8 a 12 horas en piel. Frascos de autor con atomizador premium: 10 ml (Bs. 40), 30 ml (Bs. 70), 50 ml (Bs. 90) y 100 ml (Bs. 145).",
        "imagen_url": img_url,
        "destacado": num in ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "45", "61U"]
    }
    
    final_perfumes.append(perfume_obj)

print(f"Total finalized perfumes: {len(final_perfumes)}")

# Save to catalogos/parsed_perfumes.json
with open(r"catalogos\parsed_perfumes.json", "w", encoding="utf-8") as f:
    json.dump(final_perfumes, f, ensure_ascii=False, indent=2)

print("Saved to catalogos/parsed_perfumes.json successfully.")
