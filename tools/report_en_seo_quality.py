from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://imadtbn.github.io/Calorie-calculator/"


def meta(soup: BeautifulSoup, key: str, attr: str = "name") -> str:
    tag = soup.find("meta", attrs={attr: key})
    return str(tag.get("content", "")).strip() if tag else ""


def local_asset(url: str) -> Path | None:
    parsed = urlparse(url)
    if parsed.netloc and parsed.netloc != "imadtbn.github.io":
        return None
    if url.startswith(SITE):
        return ROOT / url[len(SITE):]
    return None


pages = sorted((ROOT / "en").rglob("*.html"))
print(f"Pages reviewed: {len(pages)}")
for page in pages:
    soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    description = meta(soup, "description")
    image = meta(soup, "og:image", "property")
    warnings = []
    if not 30 <= len(title) <= 65:
        warnings.append(f"title length {len(title)}")
    if not 70 <= len(description) <= 170:
        warnings.append(f"description length {len(description)}")
    if not image.startswith(SITE):
        warnings.append("og:image is not an absolute site URL")
    else:
        asset = local_asset(image)
        if asset and not asset.exists():
            warnings.append(f"missing og:image asset {asset.relative_to(ROOT)}")
    if warnings:
        print(f"{page.relative_to(ROOT)}: " + "; ".join(warnings))
print("Quality report complete")
