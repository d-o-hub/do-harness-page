"""Crop the #how section out of full-page screenshots."""
from PIL import Image

BASE = "/home/z/my-project/scripts"
SHOTS = [
    ("shot-how-desktop-light-full.png", 1440, "how-desktop-light.png"),
    ("shot-how-desktop-dark-full.png", 1440, "how-desktop-dark.png"),
    ("shot-how-tablet-light-full.png", 768, "how-tablet-light.png"),
    ("shot-how-mobile-light-full.png", 390, "how-mobile-light.png"),
    ("shot-how-mobile-dark-full.png", 390, "how-mobile-dark.png"),
]

# #how starts at y=1581.97 (document coords, pre-scroll) per eval.
# Instead of trusting one number, re-derive per shot: the section top is
# measured on the live page at viewport width; crop generously around it.
START = 1560  # slightly above #how top
PAD_BOTTOM = 40

for src, vw, dst in SHOTS:
    im = Image.open(f"{BASE}/{src}")
    w, h = im.size
    # bottom crop: everything below #how belongs to bento; cut at first
    # bento heading is hard to detect -> keep up to 2600px of section height
    end = min(h, START + 2900 if vw >= 1024 else START + 3600)
    crop = im.crop((0, START, w, end))
    crop.save(f"{BASE}/{dst}")
    print(dst, crop.size)
