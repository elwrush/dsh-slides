from PIL import Image
import glob, os

d = os.path.dirname(os.path.abspath(__file__))
files = sorted(glob.glob(os.path.join(d, "screenshots", "out_*_1280x720.png")),
               key=lambda p: int(p.split("out_")[1].split("_")[0]))
cols, w, h = 3, 420, 236
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h), "white")
for i, f in enumerate(files):
    sheet.paste(Image.open(f).convert("RGB").resize((w, h)), ((i % cols) * w, (i // cols) * h))
out = os.path.join(d, "_contact-sheet.png")
sheet.save(out)
print(out, sheet.size, len(files))
