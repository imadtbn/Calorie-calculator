#!/usr/bin/env python3
"""Audit sitemap-backed HTML pages for international SEO consistency."""
from __future__ import annotations
import argparse, json, re, sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
BASE = "https://imadtbn.github.io/Calorie-calculator/"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "xhtml": "http://www.w3.org/1999/xhtml"}

def attr(tag: str, name: str) -> str:
    m = re.search(r"\b" + re.escape(name) + r"\s*=\s*(['\"])(.*?)\1", tag, re.I | re.S)
    return m.group(2).strip() if m else ""

def inspect_html(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    html_tag = re.search(r"<html\b[^>]*>", text, re.I)
    title = re.search(r"<title\b[^>]*>(.*?)</title\s*>", text, re.I | re.S)
    desc = next((attr(t, "content") for t in re.findall(r"<meta\b[^>]*>", text, re.I)
                 if attr(t, "name").lower() == "description"), "")
    canonical = next((attr(t, "href") for t in re.findall(r"<link\b[^>]*>", text, re.I)
                      if attr(t, "rel").lower() == "canonical"), "")
    alternates = {(attr(t, "hreflang").lower(), attr(t, "href"))
                  for t in re.findall(r"<link\b[^>]*>", text, re.I)
                  if attr(t, "rel").lower() == "alternate" and attr(t, "hreflang")}
    schemas = re.findall(r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script\s*>',
                         text, re.I | re.S)
    invalid_schema = 0
    for raw in schemas:
        try: json.loads(raw.strip())
        except (ValueError, TypeError): invalid_schema += 1
    lang = attr(html_tag.group(0), "lang").lower() if html_tag else ""
    return {"title": bool(title and title.group(1).strip()),
            "description": bool(desc), "canonical": canonical, "lang": lang,
            "alternates": alternates, "invalid_schema": invalid_schema}

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true", help="fail on warnings too")
    parser.add_argument("--json", dest="json_path", help="write machine-readable report")
    args = parser.parse_args()
    errors, warnings, results = [], [], []
    if not SITEMAP.is_file():
        print("ERROR: sitemap.xml not found"); return 2
    try: root = ET.parse(SITEMAP).getroot()
    except ET.ParseError as exc:
        print(f"ERROR: invalid sitemap XML: {exc}"); return 2
    urls = root.findall("sm:url", NS)
    locs = [node.findtext("sm:loc", default="", namespaces=NS).strip() for node in urls]
    duplicates = [u for u, n in Counter(locs).items() if n > 1]
    if duplicates: errors.append(f"Duplicate sitemap locations: {len(duplicates)}")
    loc_set = set(locs)
    for node, loc in zip(urls, locs):
        if not loc.startswith(BASE):
            errors.append(f"URL outside configured site base: {loc}"); continue
        rel = urlparse(loc).path.removeprefix(urlparse(BASE).path).lstrip("/")
        if not rel or loc.endswith("/"): rel = (rel.rstrip("/") + "/index.html").lstrip("/")
        target = ROOT / rel
        if not target.is_file():
            errors.append(f"Sitemap target missing: {rel}"); continue
        if target.suffix.lower() != ".html": continue
        info = inspect_html(target)
        row = {"path": rel, "url": loc, "language": info["lang"],
               "title": info["title"], "description": info["description"],
               "canonical": info["canonical"], "invalid_jsonld": info["invalid_schema"]}
        results.append(row)
        if not info["title"]: warnings.append(f"Missing title: {rel}")
        if not info["description"]: warnings.append(f"Missing meta description: {rel}")
        if not info["lang"].startswith(("ar", "en")): warnings.append(f"Missing/unsupported html lang: {rel}")
        if info["canonical"] != loc: warnings.append(f"Canonical mismatch: {rel} -> {info['canonical'] or '(missing)'}")
        if info["invalid_schema"]: errors.append(f"Invalid JSON-LD ({info['invalid_schema']} block(s)): {rel}")
        for alt in node.findall("xhtml:link", NS):
            lang, href = alt.attrib.get("hreflang", "").lower(), alt.attrib.get("href", "")
            if href not in loc_set: errors.append(f"Sitemap alternate target missing: {rel} -> {href}")
            if (lang, href) not in info["alternates"]:
                errors.append(f"HTML hreflang missing: {rel} -> {lang} {href}")
    summary = {"sitemap_urls": len(urls), "html_pages": len(results),
               "arabic_pages": sum(1 for x in results if x["language"].startswith("ar")),
               "english_pages": sum(1 for x in results if x["language"].startswith("en")),
               "errors": len(errors), "warnings": len(warnings),
               "error_details": errors, "warning_details": warnings, "pages": results}
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    if args.json_path: Path(args.json_path).write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if errors or (args.strict and warnings): return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
