from __future__ import annotations

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {"google4e08a8803a39e9f9.html"}
NO_AD_PAGES = {"about", "contact", "privacy", "terms", "disclaimer", "faq"}
GA4_SCRIPT = re.compile(
    r"\s*<script\b[^>]*src=[\"']https://www\.googletagmanager\.com/gtag/js\?id=[^\"']+[\"'][^>]*>\s*</script>\s*"
    r"<script\b[^>]*>[\s\S]*?gtag\s*\(\s*['\"]config['\"][\s\S]*?</script>\s*",
    re.IGNORECASE,
)
CENTRAL_SCRIPT = re.compile(r'<script\b[^>]*src=["\'][^"\']*js/site-tags\.js[^"\']*["\'][^>]*>\s*</script>', re.IGNORECASE)
AD_MARKER = '<div class="ad-container" data-ad-container="content-ad" data-ad-placement="content">'
AD_BLOCK = '''\n<!-- ضع هنا معرف الوحدة الإعلانية: xxxxxxxx -->
<div class="ad-container" data-ad-container="content-ad" data-ad-placement="content">
  <ins class="adsbygoogle" style="display:block" data-ad-slot="xxxxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>
</div>
'''


def page_name(text: str) -> str:
    match = re.search(r'<body\b[^>]*data-page=["\']([^"\']+)', text, re.IGNORECASE)
    return match.group(1).strip().lower() if match else ""


def relative_loader(page: Path) -> str:
    rel = os.path.relpath(ROOT / "js/site-tags.js", page.parent).replace(os.sep, "/")
    return f'<script defer src="{rel}"></script>'


def transform(path: Path, apply: bool) -> tuple[bool, bool, bool]:
    if path.name in EXCLUDED:
        return False, False, False
    text = path.read_text(encoding="utf-8")
    if "</head>" not in text.lower() or "<body" not in text.lower():
        return False, False, False
    updated = GA4_SCRIPT.sub("\n", text)
    loader_added = False
    if not CENTRAL_SCRIPT.search(updated):
        marker = re.search(r"</head>", updated, re.IGNORECASE)
        updated = updated[: marker.start()] + relative_loader(path) + "\n" + updated[marker.start():]
        loader_added = True
    ad_added = False
    current_page = page_name(updated)
    if current_page and current_page not in NO_AD_PAGES and AD_MARKER not in updated and "<ins class=\"adsbygoogle\"" not in updated:
        marker = re.search(r"</main>", updated, re.IGNORECASE)
        if marker:
            updated = updated[: marker.start()] + AD_BLOCK + updated[marker.start():]
            ad_added = True
    changed = updated != text
    if apply and changed:
        path.write_text(updated, encoding="utf-8")
    return changed, loader_added, ad_added


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    changed = loaders = ads = 0
    for page in sorted(ROOT.rglob("*.html")):
        did_change, loader_added, ad_added = transform(page, args.apply)
        changed += int(did_change)
        loaders += int(loader_added)
        ads += int(ad_added)
    mode = "Applied" if args.apply else "Preview"
    print(f"{mode}: files={changed}, central_loaders={loaders}, ad_blocks={ads}")


if __name__ == "__main__":
    main()
