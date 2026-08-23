from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = {
    "Arabic Guide": "English Guide",
    "simplified Arabic articles": "simplified English articles",
    "easy Arabic BMI, macros, and water calculators": "easy BMI, macros, and water calculators",
    "free Arabic calculator": "free calculator",
    "An Arabic guide": "A practical guide",
    "an Arabic guide": "a practical guide",
    "A simple Arabic guide": "A simple guide",
    "Arabic guide": "practical guide",
    "Arabic awareness test": "Awareness test",
    "Simplified Arabic Nutrition Tools": "Simplified Nutrition Tools",
    "seven-question Arabic survey": "seven-question survey",
}


def patch_page(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    head_match = re.search(r"<head>(.*?)</head>", html, flags=re.IGNORECASE | re.DOTALL)
    if not head_match:
        return False
    head = head_match.group(1)
    original = head
    for old, new in REPLACEMENTS.items():
        head = head.replace(old, new)
    is_article = "/articles/" in path.as_posix()
    if not re.search(r'<meta[^>]+property=["\']og:type["\']', head):
        insertion = f'<meta content="{"article" if is_article else "website"}" property="og:type"/>'
        marker = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]*>', head)
        head = head[: marker.end()] + insertion + head[marker.end():] if marker else insertion + head
    if not re.search(r'<meta[^>]+property=["\']og:locale["\']', head):
        insertion = '<meta content="en_US" property="og:locale"/>'
        marker = re.search(r'<meta[^>]+property=["\']og:url["\'][^>]*>', head)
        head = head[: marker.end()] + insertion + head[marker.end():] if marker else insertion + head
    if head == original:
        return False
    path.write_text(html[: head_match.start(1)] + head + html[head_match.end(1):], encoding="utf-8")
    return True


if __name__ == "__main__":
    changed = 0
    for page in sorted((ROOT / "en").rglob("*.html")):
        if patch_page(page):
            changed += 1
    print(f"Patched {changed} English page heads")
