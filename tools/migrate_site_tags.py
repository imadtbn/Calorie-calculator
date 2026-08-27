from __future__ import annotations

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {"google4e08a8803a39e9f9.html"}
GTM_ID = "GTM-TKLTZ5T3"
GTM_NOSCRIPT = f'''<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={GTM_ID}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
'''
# Ads are intentionally placed once per content page; verification-only files are excluded above.
NO_AD_PAGES: set[str] = set()
GA4_SCRIPT = re.compile(
    r"\s*<script\b[^>]*src=[\"']https://www\.googletagmanager\.com/gtag/js\?id=[^\"']+[\"'][^>]*>\s*</script>\s*"
    r"<script\b[^>]*>[\s\S]*?gtag\s*\(\s*['\"]config['\"][\s\S]*?</script>\s*",
    re.IGNORECASE,
)
CENTRAL_SCRIPT = re.compile(r'<script\b[^>]*src=["\'][^"\']*js/site-tags\.js[^"\']*["\'][^>]*>\s*</script>', re.IGNORECASE)
GTM_NOSCRIPT_MARKER = 'https://www.googletagmanager.com/ns.html?id='
AD_MARKER = 'data-ad-container="content-ad"'
AD_BLOCK_TEMPLATE = '''\n<!-- AdSense unit is centrally configured in js/site-tags.js -->
<div class="ad-container" data-ad-container="content-ad" data-ad-placement="content" data-ad-key="{key}">
  <ins class="adsbygoogle" style="display:block" data-ad-slot="xxxxxxxx" data-ad-key="{key}" data-ad-format="auto" data-full-width-responsive="true"></ins>
</div>
'''
ARTICLE_SECOND_BLOCK = '''\n<!-- Second in-article AdSense unit is centrally configured in js/site-tags.js -->
<div class="ad-container" data-ad-container="content-ad-secondary" data-ad-placement="article-secondary" data-ad-key="inArticle02">
  <ins class="adsbygoogle" style="display:block;text-align:center" data-ad-slot="xxxxxxxx" data-ad-key="inArticle02" data-ad-layout="in-article" data-ad-format="fluid"></ins>
</div>
'''
MULTIPLEX_BLOCK = '''\n<!-- Multiplex AdSense unit is centrally configured in js/site-tags.js -->
<div class="ad-container" data-ad-container="multiplex-ad" data-ad-placement="related-content" data-ad-key="multiplex">
  <ins class="adsbygoogle" style="display:block" data-ad-slot="xxxxxxxx" data-ad-key="multiplex" data-ad-format="autorelaxed"></ins>
</div>
'''


def page_name(text: str) -> str:
    match = re.search(r'<body\b[^>]*data-page=["\']([^"\']+)', text, re.IGNORECASE)
    return match.group(1).strip().lower() if match else ""


def relative_loader(page: Path) -> str:
    rel = os.path.relpath(ROOT / "js/site-tags.js", page.parent).replace(os.sep, "/")
    return f'<script defer src="{rel}"></script>'


def ad_key(path: Path, page: str) -> str:
    if page == "home":
        return "fluid01"
    if page == "water":
        return "fluid02"
    if page in {"calorie", "bmi", "macros", "ideal"}:
        return "display02"
    if page == "foods":
        return "display01"
    if page == "articles":
        return "fluid03" if path.name == "articles.html" else "inArticle01"
    return "display03"


def transform(path: Path, apply: bool) -> tuple[bool, bool, bool]:
    if path.name in EXCLUDED:
        return False, False, False
    text = path.read_text(encoding="utf-8")
    if "</head>" not in text.lower() or "<body" not in text.lower():
        return False, False, False
    updated = GA4_SCRIPT.sub("\n", text)
    noscript_added = False
    if GTM_NOSCRIPT_MARKER not in updated:
        body_open = re.search(r"<body\b[^>]*>", updated, re.IGNORECASE)
        if body_open:
            insert_at = body_open.end()
            updated = updated[:insert_at] + "\n" + GTM_NOSCRIPT + updated[insert_at:]
            noscript_added = True
    loader_added = False
    if not CENTRAL_SCRIPT.search(updated):
        marker = re.search(r"</head>", updated, re.IGNORECASE)
        updated = updated[: marker.start()] + relative_loader(path) + "\n" + updated[marker.start():]
        loader_added = True
    ad_added = False
    current_page = page_name(updated)
    key = ad_key(path, current_page)
    if current_page and current_page not in NO_AD_PAGES:
        if AD_MARKER in updated:
            updated = re.sub(r'(data-ad-container="content-ad" data-ad-placement="content")(?! data-ad-key=)', rf'\1 data-ad-key="{key}"', updated, count=1)
            updated = re.sub(r'(<ins\b[^>]*class="adsbygoogle"[^>]*)(data-ad-slot="xxxxxxxx")', rf'\1 data-ad-key="{key}" \2', updated, count=1)
        elif "<ins class=\"adsbygoogle\"" not in updated:
            marker = re.search(r"</main>", updated, re.IGNORECASE)
            if marker:
                updated = updated[: marker.start()] + AD_BLOCK_TEMPLATE.format(key=key) + updated[marker.start():]
                ad_added = True
        if current_page == "articles" and path.parent.name == "articles" and 'data-ad-key="inArticle02"' not in updated:
            marker = re.search(r"</main>", updated, re.IGNORECASE)
            if marker:
                updated = updated[: marker.start()] + ARTICLE_SECOND_BLOCK + updated[marker.start():]
                ad_added = True
        if current_page == "articles" and path.name == "articles.html" and 'data-ad-key="multiplex"' not in updated:
            marker = re.search(r"</main>", updated, re.IGNORECASE)
            if marker:
                updated = updated[: marker.start()] + MULTIPLEX_BLOCK + updated[marker.start():]
                ad_added = True
    changed = updated != text
    if apply and changed:
        path.write_text(updated, encoding="utf-8")
    return changed, loader_added or noscript_added, ad_added


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
