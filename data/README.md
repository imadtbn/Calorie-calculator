# بيانات BMI للأطفال حسب العمر

يحتوي `cdc-bmi-for-age.json` على معلمات LMS المختصرة من ملف CDC الرسمي `bmiagerev.csv` لمخططات BMI-for-age للأطفال والمراهقين من عمر سنتين إلى 19 سنة. البيانات مقسمة إلى `male` و`female`، وتستخدمها `js/calculators.js` لحساب BMI الخام ثم درجة Z والمئين التقريبي والتصنيف العام.

المصدر الرسمي: [CDC Growth Charts Data Files](https://www.cdc.gov/growthcharts/cdc-data-files.htm)، وملف BMI-for-age بصيغة CSV: [bmiagerev.csv](https://www.cdc.gov/growthcharts/data/zscore/bmiagerev.csv).

هذه البيانات أداة فحص تثقيفية وليست تشخيصًا. لا تستخدم الحاسبة حدود BMI للبالغين، ولا ينبغي اتخاذ قرار غذائي أو طبي للطفل اعتمادًا على النتيجة وحدها. يجب تفسير القياسات مع طبيب الأطفال وبحسب التاريخ الصحي واتجاه النمو.

## بيانات نمو الرضع حسب WHO

يحتوي `who-infant-growth.json` على معلمات LMS ودرجات Z للطول حسب العمر والوزن حسب العمر من الولادة حتى 24 شهرًا، منفصلة حسب الجنس. حُوّلت البيانات من جداول Excel الرسمية لمنظمة الصحة العالمية، وتستخدمها `js/calculators.js` لحساب درجة Z والمئين التقريبي.

المصادر الرسمية: [WHO Child Growth Standards](https://www.who.int/tools/child-growth-standards/standards)، [Length/height-for-age](https://www.who.int/tools/child-growth-standards/standards/length-height-for-age)، و[Weight-for-age](https://www.who.int/tools/child-growth-standards/standards/weight-for-age).

تُستخدم النتيجة للتثقيف والمتابعة الأولية فقط، ولا تشخّص تأخر النمو أو سوء التغذية. ينبغي تفسير القياسات الصحيحة والمتكررة مع طبيب الأطفال.
