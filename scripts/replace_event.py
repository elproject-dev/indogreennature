import re

with open("app/(dashboard)/settings/page.tsx", "r") as f:
    content = f.read()

# Replacements to make in UI text (not code variables like 'event')
replacements = [
    ("<h2>Event</h2>", "<h2>Article</h2>"),
    (">Event<", ">Article<"),
    ("\"Cari event...\"", "\"Cari article...\""),
    (">Tambah Event<", ">Tambah Article<"),
    ("\"Edit Event\"", "\"Edit Article\""),
    ("\"Tambah Event\"", "\"Tambah Article\""),
    (">Nama Event<", ">Nama Article<"),
    ("\"Misal: Event Heboh\"", "\"Misal: Article Heboh\""),
    (">Deskripsi Event<", ">Deskripsi Article<"),
    ("\"Simpan Event\"", "\"Simpan Article\""),
    (">Foto Event<", ">Foto Article<"),
    (">Judul Event<", ">Judul Article<"),
]

for old, new in replacements:
    content = content.replace(old, new)

with open("app/(dashboard)/settings/page.tsx", "w") as f:
    f.write(content)

print("Replaced!")
