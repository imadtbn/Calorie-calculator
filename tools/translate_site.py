#!/usr/bin/env python3
"""Create English static copies while preserving calculator logic and data files."""
from __future__ import annotations

import argparse
import json
import os
import posixpath
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup, Comment, NavigableString
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "en"
CACHE_PATH = ROOT / "tools" / ".translation-cache.json"
MODEL = "gpt-5-mini"
SKIP_NAMES = {"google4e08a8803a39e9f9.html"}
BATCHES = {
    1: ["index.html", "calorie-calculator.html", "bmi-calculator.html", "water-calculator.html", "macros-calculator.html", "food-calories.html"],
    2: ["health-tools.html", "articles.html", "faq.html", "about.html", "contact.html", "privacy.html", "terms.html", "disclaimer.html"],
    3: ["ideal-weight-calculator.html", "pregnancy-due-date.html", "fertile-window.html", "prediabetes-risk.html", "child-bmi-calculator.html", "pregnancy-calorie-calculator.html", "infant-growth-calculator.html"],
    4: ["asthma-control.html", "anxiety-screening.html", "eating-awareness.html", "sleep-assessment.html", "depression-screening.html", "visual-acuity-screening.html", "phone-balance.html", "pilgrim-health-checklist.html", "diabetes-awareness.html"],
    5: [f"articles/{name}" for name in [
        "bmr-vs-tdee.html", "calorie-deficit.html", "calorie-needs-change.html", "child-bmi.html", "depression-screening.html", "diabetes-awareness.html", "eating-awareness.html", "fertile-window.html", "healthy-weight.html", "how-much-water.html", "how-to-count-calories.html", "infant-growth.html", "macros-guide.html", "phone-balance.html", "pilgrim-health-checklist.html", "prediabetes-risk.html", "pregnancy-calories.html", "pregnancy-due-date.html", "sleep-assessment.html", "visual-acuity-screening.html", "water-and-exercise.html", "asthma-control.html", "anxiety-screening.html"
    ]],
}


def load_cache() -> dict[str, dict[str, str]]:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict[str, dict[str, str]]) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


def is_translatable_node(node: NavigableString) -> bool:
    if isinstance(node, Comment):
        return False
    text = str(node).strip()
    if not text or len(text) < 2:
        return False
    parent = node.parent
    if not parent or parent.name in {"script", "style", "noscript", "template"}:
        return False
    if re.fullmatch(r"[\d\s.,%+\-–—:/()]+", text):
        return False
    return True


def collect_strings(soup: BeautifulSoup) -> list[str]:
    values: list[str] = []
    for node in soup.find_all(string=True):
        if is_translatable_node(node):
            values.append(str(node).strip())
    for tag in soup.find_all(True):
        for attr in ("title", "alt", "placeholder", "aria-label", "content"):
            if tag.has_attr(attr) and isinstance(tag.get(attr), str):
                value = tag.get(attr).strip()
                if value and re.search(r"[\u0600-\u06ff]", value):
                    values.append(value)
    return list(dict.fromkeys(values))


def translate_strings(values: list[str], cache: dict[str, str]) -> dict[str, str]:
    missing = [value for value in values if value not in cache]
    if not missing:
        return {value: cache[value] for value in values}
    client = OpenAI(timeout=180, max_retries=2)
    prompt = {
        "role": "user",
        "content": f"Translate each Arabic website string into concise, natural English. Return exactly {len(missing)} translations, one for each input, in exactly the same order. Never merge, split, omit, or add items. Preserve placeholders, numbers, units, acronyms (BMI, BMR, TDEE, WHO), punctuation where useful, and educational non-diagnostic meaning. Do not add explanations.\\n\\n" + json.dumps(missing, ensure_ascii=False),
    }
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a careful Arabic-to-English translator for a nutrition and health education website. Output JSON only."},
            prompt,
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "translations",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {"translations": {"type": "array", "items": {"type": "string"}}},
                    "required": ["translations"],
                    "additionalProperties": False,
                },
            },
        },
        max_completion_tokens=12000,
    )
    result = json.loads(response.choices[0].message.content).get("translations", [])
    if len(result) != len(missing):
        raise RuntimeError(f"Translation count mismatch: expected {len(missing)}, got {len(result)}")
    for source, translated in zip(missing, result):
        cache[source] = translated.strip() or source
    return {value: cache[value] for value in values}


def local_target(source_path: Path, value: str, destination: Path) -> str:
    if not value or value.startswith(("#", "/", "//", "http:", "https:", "mailto:", "tel:", "javascript:", "data:")):
        return value
    clean, fragment = (value.split("#", 1) + [""])[:2] if "#" in value else (value, "")
    source_dir = source_path.parent.relative_to(ROOT).as_posix()
    dest_dir = destination.parent.relative_to(ROOT).as_posix()
    target = posixpath.normpath(posixpath.join(source_dir, clean))
    if target.endswith(".html") and not target.startswith(("assets/", "css/", "js/", "data/")):
        target = posixpath.join("en", target)
    relative = posixpath.relpath(target, dest_dir)
    return relative + (f"#{fragment}" if fragment else "")


def update_seo(soup: BeautifulSoup, source: Path, destination: Path) -> None:
    root_url = "https://imadtbn.github.io/Calorie-calculator/"
    source_url = root_url + source.relative_to(ROOT).as_posix()
    english_url = root_url + destination.relative_to(ROOT).as_posix()
    html = soup.find("html")
    if html:
        html["lang"] = "en"
        html["dir"] = "ltr"
    body = soup.find("body")
    if body:
        depth = len(destination.parent.relative_to(OUT).parts)
        body["data-root"] = "../" * max(1, depth + 1)
    canonical = soup.find("link", rel="canonical")
    if canonical:
        canonical["href"] = english_url
    else:
        head = soup.find("head")
        if head:
            canonical = soup.new_tag("link", rel="canonical", href=english_url)
            head.append(canonical)
    head = soup.find("head")
    if head:
        for link in head.find_all("link", rel="alternate"):
            link.decompose()
        for lang, href in (("ar", source_url), ("en", english_url), ("x-default", source_url)):
            tag = soup.new_tag("link", rel="alternate", hreflang=lang, href=href)
            head.append(tag)
        locale = head.find("meta", attrs={"property": "og:locale"})
        if locale:
            locale["content"] = "en_US"
        og_url = head.find("meta", attrs={"property": "og:url"})
        if og_url:
            og_url["content"] = english_url
        for script in head.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or script.get_text())
                def walk(obj):
                    if isinstance(obj, dict):
                        for key, value in obj.items():
                            if key == "inLanguage": obj[key] = "en"
                            elif key == "url" and isinstance(value, str) and value.startswith(root_url): obj[key] = english_url
                            else: walk(value)
                    elif isinstance(obj, list):
                        for item in obj: walk(item)
                walk(data)
                script.string = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
            except (TypeError, json.JSONDecodeError):
                pass


def translate_file(relative: str, cache: dict[str, str]) -> tuple[str, int]:
    source = ROOT / relative
    destination = OUT / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    soup = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
    values = collect_strings(soup)
    mapping = translate_strings(values, cache)
    for node in soup.find_all(string=True):
        if is_translatable_node(node):
            stripped = str(node).strip()
            translated = mapping.get(stripped)
            if translated:
                node.replace_with(str(node).replace(stripped, translated))
    for tag in soup.find_all(True):
        for attr in ("title", "alt", "placeholder", "aria-label", "content"):
            if tag.has_attr(attr) and isinstance(tag.get(attr), str):
                original = tag.get(attr).strip()
                if original in mapping:
                    tag[attr] = mapping[original]
        for attr in ("href", "src", "action", "poster"):
            if tag.has_attr(attr):
                tag[attr] = local_target(source, tag.get(attr), destination)
    update_seo(soup, source, destination)
    serialized = str(soup).replace("\nhtml\n<html", "\n<html")
    destination.write_text("<!doctype html>\n" + serialized, encoding="utf-8")
    return relative, len(values)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", type=int, choices=range(1, 6), required=True)
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()
    cache = load_cache()
    files = [name for name in BATCHES[args.batch] if (ROOT / name).exists() and Path(name).name not in SKIP_NAMES]
    errors: list[str] = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(translate_file, name, cache): name for name in files}
        for future in as_completed(futures):
            name = futures[future]
            try:
                relative, count = future.result()
                print(f"translated {relative}: {count} strings")
            except Exception as exc:
                errors.append(f"{name}: {exc}")
                print(f"ERROR {name}: {exc}")
    save_cache(cache)
    if errors:
        raise SystemExit("\n".join(errors))


if __name__ == "__main__":
    main()

