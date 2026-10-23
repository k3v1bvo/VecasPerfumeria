import json
from collections import Counter

with open(r"catalogos\extracted_quadrant_perfumes.json", encoding="utf-8") as f:
    perfumes = json.load(f)

real = [p for p in perfumes if not p["num"].startswith("EXTRA_")]

brands = Counter([p["marca_casa"] for p in real])
print("Distinct brands found:", len(brands))
for b, count in brands.most_common(30):
    print(f"  {b}: {count}")

print("\nPerfumes with generic brand:")
for p in real:
    if "Inspiraci" in p["marca_casa"] or len(p["marca_casa"]) < 3:
        print(f"  #{p['num']} {p['nombre']} (Page {p['page']} {p['quadrant']})")
