import urllib.request

urls = [
    'http://localhost:3000/perfumes/catalog/dama_1.jpeg',
    'http://localhost:3000/perfumes/catalog/dama_2.png',
    'http://localhost:3000/perfumes/catalog/dama_3.jpeg',
    'http://localhost:3000/perfumes/catalog/dama_30.jpeg',
    'http://localhost:3000/dama_30.jpeg'
]

for u in urls:
    try:
        req = urllib.request.urlopen(u)
        content = req.read()
        print(f"{u} -> STATUS {req.status}, Content-Type: {req.headers.get('Content-Type')}, Length: {len(content)}")
    except Exception as e:
        print(f"{u} -> ERROR: {e}")
