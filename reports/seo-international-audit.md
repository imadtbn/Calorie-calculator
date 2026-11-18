# International SEO audit — 2026-11-18

## Scope
- Sitemap inventory: 107 URLs (54 Arabic and 53 English entries).
- Localized pairs: 53 Arabic/English pairs (106 URLs); `nutrition-planner.html` is intentionally unpaired in the current sitemap.
- Search Console baseline: 20 Aug–16 Nov 2026, from the supplied export.

## Changes in this branch
- Added `en/data/foods.json`, translated from the existing 35 USDA FoodData Central records. Nutrient values, FDC IDs, source descriptions and source URLs are preserved.
- Changed `js/foods.js` to resolve the shared dataset relative to its own script URL, so it works from both root and `/en/` pages.
- Added reciprocal HTML hreflang links based on the existing sitemap alternates across the sitemap-backed language pairs.
- Bumped the service-worker cache from `calorie-calculator-v24` to `calorie-calculator-v25`.
- Added `tools/audit_site_seo.py` and a GitHub Actions workflow to validate sitemap targets, HTML hreflang, canonical, title, description and JSON-LD.

## Search Console pages prioritized
| Page | Baseline | Action |
|---|---:|---|
| `food-calories.html` | 8,106 impressions, 9 clicks, 0.11% CTR | Restore full English dataset parity; improve CTR content separately after review |
| `child-bmi-calculator.html` | 2,910 impressions, 108 clicks | Preserve high-performing page; validate language alternates |
| `pregnancy-calorie-calculator.html` | 770 impressions, 26 clicks | Preserve current content; validate language alternates |
| `calorie-calculator.html` | 888 impressions, 3 clicks | Flag for later content/internal-link optimization |
| `macros-calculator.html` | 537 impressions, 3 clicks | Flag for later content/internal-link optimization |
| `en/articles/how-to-count-calories.html` | 2,881 impressions, 4 clicks | Flag for title/snippet review |

## Validation notes
- The automated audit runs in GitHub Actions and uploads a JSON report as an artifact.
- Warnings for pre-existing title/description/canonical issues are reported separately from hard errors.
- This branch does not change the main branch and does not make live Search Console or URL Inspection API requests.
