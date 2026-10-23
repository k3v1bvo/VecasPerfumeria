import json
import os

with open(r"catalogos\extracted_quadrant_perfumes.json", encoding="utf-8") as f:
    perfumes = json.load(f)

real = [p for p in perfumes if not p["num"].startswith("EXTRA_")]
print(f"Total real perfumes: {len(real)}")

# Verify all images exist on disk and have non-zero size
missing = 0
zero_size = 0
for p in real:
    local_path = os.path.join(r"D:\ProyectosCode\Vacar Perfumeria\public", p["imagen_url"].lstrip("/").replace("/", os.sep))
    if not os.path.exists(local_path):
        print(f"Missing file: {local_path} for {p['nombre']}")
        missing += 1
    elif os.path.getsize(local_path) < 1000:
        print(f"Too small: {local_path} ({os.path.getsize(local_path)} bytes) for {p['nombre']}")
        zero_size += 1

print(f"Verification done: Missing = {missing}, Too small = {zero_size}")

# Print samples
print("\n--- SAMPLE DAMA ---")
for p in real[:8]:
    print(f"#{p['num']} {p['nombre']} | Marca: {p['marca_casa']} | Img: {p['imagen_url']}")

print("\n--- SAMPLE VARON ---")
for p in [x for x in real if x['categoria'] == 'Masculino'][:8]:
    print(f"#{p['num']} {p['nombre']} | Marca: {p['marca_casa']} | Img: {p['imagen_url']}")
