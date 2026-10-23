import fitz
import os
import json

def test():
    doc = fitz.open(r"catalogos\Catalogo Dama CBBA_20260820_205407_0000.pdf")
    page = doc[1]
    for xref in [1860, 1863, 1866, 1869]:
        img = doc.extract_image(xref)
        print("xref:", xref, "ext:", img["ext"], "size:", img["width"], img["height"], "bytes:", len(img["image"]))

if __name__ == "__main__":
    test()
