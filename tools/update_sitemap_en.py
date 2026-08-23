#!/usr/bin/env python3
from __future__ import annotations

import posixpath
from datetime import date
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
BASE = "https://imadtbn.github.io/Calorie-calculator/"
NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
XHTML = "http://www.w3.org/1999/xhtml"
ET.register_namespace("", NS)
ET.register_namespace("xhtml", XHTML)


def tag(name: str) -> str:
    return f"{{{NS}}}{name}"


def path_from_url(url: str) -> str:
    return url.removeprefix(BASE).lstrip("/") or "index.html"


def url_for(path: str) -> str:
    return BASE + ("" if path == "index.html" else path)


def relative_path_for_source(path: str) -> str:
    return "en/" + path


def add_hreflang(entry: ET.Element, source_path: str) -> None:
    loc = entry.find(tag("loc"))
    if loc is None:
        return
    current_path = path_from_url(loc.text or "")
    english_path = relative_path_for_source(source_path)
    alternatives = {
        "ar": url_for(source_path),
        "en": url_for(english_path),
        "x-default": BASE,
    }
    for link in list(entry.findall(f"{{{XHTML}}}link")):
        entry.remove(link)
    for language, href in alternatives.items():
        ET.SubElement(entry, f"{{{XHTML}}}link", {"rel": "alternate", "hreflang": language, "href": href})


def main() -> None:
    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    entries = root.findall(tag("url"))
    by_path: dict[str, ET.Element] = {}
    for entry in entries:
        loc = entry.find(tag("loc"))
        if loc is not None and loc.text:
            by_path[path_from_url(loc.text)] = entry

    for source_path, arabic_entry in list(by_path.items()):
        if source_path.startswith("en/") or source_path == "google4e08a8803a39e9f9.html":
            continue
        if source_path == "index.html":
            english_path = "en/index.html"
        else:
            english_path = "en/" + source_path
        english_file = ROOT / english_path
        if not english_file.exists():
            continue
        english_entry = by_path.get(english_path)
        if english_entry is None:
            english_entry = ET.SubElement(root, tag("url"))
            ET.SubElement(english_entry, tag("loc")).text = url_for(english_path)
            ET.SubElement(english_entry, tag("lastmod")).text = str(date.today())
            ET.SubElement(english_entry, tag("changefreq")).text = "weekly"
            ET.SubElement(english_entry, tag("priority")).text = "0.6"
            by_path[english_path] = english_entry
        add_hreflang(arabic_entry, source_path)
        add_hreflang(english_entry, source_path)

    tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)
    print(f"Updated sitemap with {sum(1 for path in by_path if path.startswith('en/'))} English URLs")


if __name__ == "__main__":
    main()
