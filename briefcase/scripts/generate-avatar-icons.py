#!/usr/bin/env python3
"""Generate site-pfp and favicon set from a GitHub avatar URL. Stdlib + Pillow."""

from __future__ import annotations

import argparse
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip3 install pillow", file=sys.stderr)
    raise


def fetch_avatar(url: str) -> Image.Image:
    with urllib.request.urlopen(url, timeout=30) as resp:
        data = resp.read()
    img = Image.open(BytesIO(data)).convert("RGBA")
    return img


def square_crop(img: Image.Image, size: int) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    cropped = img.crop((left, top, left + side, top + side))
    return cropped.resize((size, size), Image.Resampling.LANCZOS)


def write_set(img: Image.Image, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    rgb = img.convert("RGB")
    rgb.save(out_dir / "site-pfp.jpg", quality=92, optimize=True)

    for name, px in (
        ("favicon-16x16.png", 16),
        ("favicon-32x32.png", 32),
        ("apple-touch-icon.png", 180),
    ):
        square_crop(img, px).save(out_dir / name, optimize=True)

    ico_sizes = [square_crop(img, s) for s in (16, 32, 48)]
    ico_sizes[0].save(
        out_dir / "favicon.ico",
        format="ICO",
        sizes=[(s.width, s.height) for s in ico_sizes],
        append_images=ico_sizes[1:],
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("url", help="GitHub avatar URL")
    parser.add_argument("out_dir", type=Path, help="Output directory")
    args = parser.parse_args()
    img = fetch_avatar(args.url)
    write_set(img, args.out_dir)
    print(f"Wrote favicons + site-pfp.jpg to {args.out_dir.resolve()}")


if __name__ == "__main__":
    main()
