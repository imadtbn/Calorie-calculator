from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlparse

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://imadtbn.github.io/Calorie-calculator/"
REQUIRED_META = ["description", "robots", "twitter:card", "twitter:title", "twitter:description", "twitter:image"]
REQUIRED_OG = ["og:type", "og:title", "og:description", "og:url", "og:locale", "og:image"]


def content(soup: BeautifulSoup, key: str, attr: str = "name") -> str:
    tag = soup.find("meta", attrs={attr: key})
    return str(tag.get("content", "")).strip() if tag else ""


def abs_url(value: str) -> str:
    if value.startswith("http://") or value.startswith("https://"):
        return value
    return SITE + value.lstrip("/")


def expected_url(path: Path) -> str:
    return SITE + str(path.relative_to(ROOT)).replace("\\", "/")


def main() -> None:
    pages = sorted((ROOT / "en").rglob("*.html"))
    issues: list[str] = []
    print(f"English pages: {len(pages)}")
    for page in pages:
        soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
        rel = page.relative_to(ROOT)
        expected = expected_url(page)
        title = soup.title.get_text(" ", strip=True) if soup.title else ""
        if not title:
            issues.append(f"{rel}: missing title")
        for key in REQUIRED_META:
            if not content(soup, key):
                issues.append(f"{rel}: missing meta {key}")
        for key in REQUIRED_OG:
            if not content(soup, key, "property"):
                issues.append(f"{rel}: missing {key}")
        canonical = soup.find("link", rel="canonical")
        canonical_url = canonical.get("href", "") if canonical else ""
        if canonical_url != expected:
            issues.append(f"{rel}: canonical={canonical_url!r}, expected={expected!r}")
        for lang, expected_alt in (("ar", expected.replace("/en/", "/")), ("en", expected), ("x-default", expected.replace("/en/", "/"))):
            tag = soup.find("link", rel="alternate", hreflang=lang)
            actual = tag.get("href", "") if tag else ""
            if actual != expected_alt:
                issues.append(f"{rel}: hreflang {lang}={actual!r}, expected={expected_alt!r}")
        if soup.html and soup.html.get("lang") != "en":
            issues.append(f"{rel}: html lang is not en")
        if soup.html and soup.html.get("dir") != "ltr":
            issues.append(f"{rel}: html dir is not ltr")
        for key in ("og:title", "og:description", "twitter:title", "twitter:description"):
            value = content(soup, key, "property" if key.startswith("og:") else "name")
            if any(marker in value for marker in ("Arabic", "العربية", "Arabic Guide")):
                issues.append(f"{rel}: English metadata contains Arabic marker in {key}: {value!r}")
        for key in ("og:url",):
            value = content(soup, key, "property")
            if value != expected:
                issues.append(f"{rel}: {key}={value!r}, expected={expected!r}")
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or script.get_text())
            except json.JSONDecodeError:
                issues.append(f"{rel}: invalid JSON-LD")
                continue
            blobs = data.get("@graph", [data]) if isinstance(data, dict) else []
            for blob in blobs:
                if isinstance(blob, dict) and blob.get("inLanguage") not in (None, "en"):
                    issues.append(f"{rel}: JSON-LD inLanguage={blob.get('inLanguage')!r}")
    if issues:
        print("ISSUES")
        print("\n".join(issues))
        raise SystemExit(1)
    print("SEO audit passed")


if __name__ == "__main__":
    main()
