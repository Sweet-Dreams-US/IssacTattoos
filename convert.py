"""one-shot: PNGs in assets/img/ -> webp at sensible web sizes."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent / "assets" / "img"

# target longest edge per file (longest side in px)
TARGETS = {
    "hero":     1800,
    "studio":   1800,
    "artist":   1400,
    "relic-":   1600,  # prefix match
}

def target_for(name: str) -> int:
    if name in TARGETS:
        return TARGETS[name]
    for k, v in TARGETS.items():
        if name.startswith(k):
            return v
    return 1600

def convert(p: Path):
    name = p.stem
    edge = target_for(name)
    img = Image.open(p).convert("RGB")
    w, h = img.size
    if max(w, h) > edge:
        scale = edge / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    out = p.with_suffix(".webp")
    img.save(out, "WEBP", quality=82, method=6)
    p.unlink()
    return out, out.stat().st_size

for p in sorted(ROOT.glob("*.png")):
    out, size = convert(p)
    print(f"{out.name:24s} {size/1024:7.1f} KB")
