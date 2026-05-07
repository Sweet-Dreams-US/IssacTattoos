"""one-shot: take Isaac's source PNGs and produce gallery-sized WebP."""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).parent / "assets" / "img" / "source"
OUT = Path(__file__).parent / "assets" / "img"

ORDER = [
    ("example1.png", "isaac-01.webp"),
    ("example2.png", "isaac-02.webp"),
    ("example3.png", "isaac-03.webp"),
    ("example4.png", "isaac-04.webp"),
    ("example5.png", "isaac-05.webp"),
    ("example6.png", "isaac-06.webp"),
    ("example7.png", "isaac-07.webp"),
    ("example8.png", "isaac-08.webp"),
    ("example9.png", "isaac-09.webp"),
    ("example10.png", "isaac-10.webp"),
    ("example11.png", "isaac-11.webp"),
    ("example12.png", "isaac-12.webp"),
    ("example13.png", "isaac-13.webp"),
    ("example14.png", "isaac-14.webp"),
    ("example15.png", "isaac-15.webp"),
    ("example16.png", "isaac-16.webp"),
    ("example17.png", "isaac-17.webp"),
    ("example18.png", "isaac-18.webp"),
]

LONGEST = 1400  # target longest edge for gallery

for src_name, out_name in ORDER:
    src = SRC / src_name
    if not src.exists():
        print(f"missing: {src_name}")
        continue
    img = Image.open(src).convert("RGB")
    w, h = img.size
    if max(w, h) > LONGEST:
        s = LONGEST / max(w, h)
        img = img.resize((int(w * s), int(h * s)), Image.LANCZOS)
    out = OUT / out_name
    img.save(out, "WEBP", quality=85, method=6)
    print(f"{out.name:18s} {out.stat().st_size/1024:7.1f} KB  ({img.size[0]}x{img.size[1]})")
