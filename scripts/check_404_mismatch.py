import os
import json

with open('catalogos/parsed_perfumes.json', encoding='utf-8') as f:
    perfumes = json.load(f)

err_list = [
    'dama_30', 'dama_31', 'dama_32', 'dama_17', 'varon_110', 'varon_115',
    'dama_11', 'varon_114', 'dama_14', 'dama_23', 'varon_111', 'dama_18',
    'dama_20', 'varon_108', 'varon_109', 'dama_51', 'dama_46'
]

cat_files = set(os.listdir('public/perfumes/catalog'))

for err in err_list:
    matches = [f for f in cat_files if f.startswith(err + '.')]
    # find in perfumes
    matched_p = [p for p in perfumes if err in p['imagen_url']]
    p_url = matched_p[0]['imagen_url'] if matched_p else 'NOT FOUND IN JSON'
    p_name = matched_p[0]['nombre'] if matched_p else 'N/A'
    print(f"ERROR KEY: {err}")
    print(f"  Files on disk: {matches}")
    print(f"  URL in parsed_perfumes: {p_url}")
    print(f"  Perfume: {p_name}")
    print()
