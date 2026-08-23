from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TITLES = {
    "en/articles/anxiety-screening.html": ("Anxiety Questionnaire: What Does the Score Mean? | Calorie Calculator", "Anxiety Questionnaire Score Explained | Calorie Calculator"),
    "en/articles/bmr-vs-tdee.html": ("What's the difference between BMR and TDEE? Explaining metabolic rate and daily energy needs", "BMR vs TDEE: Daily Energy Needs Explained | Calorie Calculator"),
    "en/articles/calorie-needs-change.html": ("Why Calorie Needs Differ: BMR and TDEE Explained | Calorie Calculator", "Why Calorie Needs Differ: BMR and TDEE | Calorie Calculator"),
    "en/articles/diabetes-awareness.html": ("Daily Diabetes Awareness Without Self-Diagnosis | Calorie Calculator", "Daily Diabetes Awareness: No Self-Diagnosis | Calorie Calculator"),
    "en/articles/eating-awareness.html": ("Eating Patterns Awareness and Seeking Support | Calorie Calculator", "Eating Patterns: Awareness and Support | Calorie Calculator"),
    "en/articles/how-to-count-calories.html": ("How to calculate calories in a meal? A guide to reading servings and the nutrition label", "How to Count Calories in a Meal | Calorie Calculator"),
    "en/child-bmi-calculator.html": ("Child and Teen BMI Calculator", "Child and Teen BMI Calculator | Calorie Calculator"),
    "en/ideal-weight-calculator.html": ("Ideal weight calculator by height and gender | Approximate estimate", "Ideal Weight Calculator by Height and Gender | Calorie Calculator"),
    "en/pregnancy-calorie-calculator.html": ("Pregnancy Calorie Calculator", "Pregnancy Calorie Calculator | Calorie Calculator"),
}

for rel, (old, new) in TITLES.items():
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    if new in text:
        print(f"already optimized {rel}: {len(new)} chars")
        continue
    if old not in text:
        raise SystemExit(f"Title not found in {rel}")
    text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")
    print(f"optimized {rel}: {len(new)} chars")
