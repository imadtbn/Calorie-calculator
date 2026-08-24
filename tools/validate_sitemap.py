from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
NS = {
    "sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
    "xhtml": "http://www.w3.org/1999/xhtml",
    "image": "http://www.google.com/schemas/sitemap-image/1.1",
}
SITE = "https://imadtbn.github.io/Calorie-calculator/"

text = SITEMAP.read_text(encoding="utf-8")
root = ET.fromstring(text)
urls = root.findall("sm:url", NS)
issues: list[str] = []
if root.tag != "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset":
    issues.append(f"unexpected root {root.tag}")
if not text.startswith("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"):
    issues.append("XML declaration is not canonical UTF-8 declaration")
seen: set[str] = set()
for item in urls:
    loc = item.findtext("sm:loc", namespaces=NS) or ""
    if not loc.startswith(SITE):
        issues.append(f"non-site loc: {loc}")
    if loc in seen:
        issues.append(f"duplicate loc: {loc}")
    seen.add(loc)
    lastmod = item.findtext("sm:lastmod", namespaces=NS) or ""
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", lastmod):
        issues.append(f"invalid lastmod for {loc}: {lastmod}")
    for link in item.findall("xhtml:link", NS):
        href = link.get("href", "")
        if not href.startswith(SITE):
            issues.append(f"non-site alternate href: {href}")
    for image in item.findall("image:image", NS):
        image_loc = image.findtext("image:loc", namespaces=NS) or ""
        if not image_loc.startswith(SITE):
            issues.append(f"non-site image loc: {image_loc}")
print(f"url_count={len(urls)}")
print(f"english_url_count={sum('/en/' in (item.findtext('sm:loc', namespaces=NS) or '') for item in urls)}")
print(f"image_count={len(root.findall('.//image:image', NS))}")
print(f"hreflang_link_count={len(root.findall('.//xhtml:link', NS))}")
if issues:
    print("ISSUES")
    print("\n".join(issues))
    raise SystemExit(1)
print("sitemap validation passed")
