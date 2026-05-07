"""Optimize stencil PNGs into web-friendly WebP with PURE black/white contrast,
dropping the white background to transparent so they composite cleanly via mix-blend-mode.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).parent / "assets" / "img"

LONGEST = 1100   # plenty for parallax depth, smaller = lighter
THRESHOLD = 220  # pixels lighter than this become transparent

for src in sorted(ROOT.glob("stencil-*.png")):
    img = Image.open(src).convert("RGBA")
    # punch contrast: anything near white → transparent, anything else → black
    px = img.load()
    w, h = img.size
    # work via numpy if available, else slow PIL loop
    try:
        import numpy as np
        arr = np.array(img)
        rgb = arr[..., :3]
        # use luminance; pixels above THRESHOLD become transparent
        lum = (0.2126*rgb[..., 0] + 0.7152*rgb[..., 1] + 0.0722*rgb[..., 2])
        alpha = np.where(lum > THRESHOLD, 0, 255).astype(np.uint8)
        # boost remaining contrast — clamp dark to pure black
        new = np.zeros_like(arr)
        new[..., 3] = alpha
        # leave RGB at 0 (pure black) so any tint via filter/blend works perfectly
        img = Image.fromarray(new, mode="RGBA")
    except ImportError:
        # PIL-only fallback
        for y in range(h):
            for x in range(w):
                r, g, b, _ = px[x, y]
                lum = 0.2126*r + 0.7152*g + 0.0722*b
                if lum > THRESHOLD:
                    px[x, y] = (0, 0, 0, 0)
                else:
                    px[x, y] = (0, 0, 0, 255)

    # resize
    if max(img.size) > LONGEST:
        s = LONGEST / max(img.size)
        img = img.resize((int(img.size[0]*s), int(img.size[1]*s)), Image.LANCZOS)

    out = src.with_suffix(".webp")
    img.save(out, "WEBP", quality=88, method=6, lossless=False)
    src.unlink()
    print(f"{out.name:18s} {out.stat().st_size/1024:7.1f} KB ({img.size[0]}x{img.size[1]})")
