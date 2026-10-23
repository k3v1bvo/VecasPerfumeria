import fitz
import re
import json

def extract_dama():
    doc = fitz.open(r'D:\ProyectosCode\Vacar Perfumeria\catalogos\Catalogo Dama CBBA_20260820_205407_0000.pdf')
    pages_data = []
    for i, p in enumerate(doc):
        text = p.get_text()
        pages_data.append({'page': i + 1, 'text': text})
    return pages_data

def extract_varon():
    doc = fitz.open(r'D:\ProyectosCode\Vacar Perfumeria\catalogos\Catalogo Varon CBA_20260820_205253_0000.pdf')
    pages_data = []
    for i, p in enumerate(doc):
        text = p.get_text()
        pages_data.append({'page': i + 1, 'text': text})
    return pages_data

dama = extract_dama()
varon = extract_varon()

with open(r'D:\ProyectosCode\Vacar Perfumeria\catalogos\dama_dump.json', 'w', encoding='utf-8') as f:
    json.dump(dama, f, ensure_ascii=False, indent=2)

with open(r'D:\ProyectosCode\Vacar Perfumeria\catalogos\varon_dump.json', 'w', encoding='utf-8') as f:
    json.dump(varon, f, ensure_ascii=False, indent=2)

print('Dumped dama (28 pages) and varon (33 pages) to JSON.')
