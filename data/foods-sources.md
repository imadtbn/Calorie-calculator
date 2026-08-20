# مصدر قاعدة الأطعمة

تم تحديث `foods.json` اعتمادًا على بيانات **USDA FoodData Central** الرسمية، وهي قاعدة بيانات تابعة لخدمة البحوث الزراعية في وزارة الزراعة الأمريكية. القيم في الملف معروضة لكل 100 غرام، وتشمل السعرات والبروتين والكربوهيدرات والدهون.

استُخدمت بيانات **Foundation Foods – إصدار أبريل 2026** للعناصر التي تتوفر فيها قيم تحليلية مناسبة، وبيانات **SR Legacy – إصدار أبريل 2018** لاستكمال الأطعمة العامة والمطبوخة. يتضمن كل عنصر في JSON اسم الوصف الأصلي، ونوع البيانات، و`fdcId`، ورابط `sourceUrl` إلى صفحة المغذيات في USDA.

> القيم الغذائية تقريبية على مستوى نوع الطعام وطريقة التحضير. لا تمثل بطاقة منتج تجاري محددًا، وقد تختلف حسب الصنف والحجم والطهي. ينبغي الرجوع إلى بطاقة المنتج عند الحاجة إلى قيمة دقيقة.

## المراجع الرسمية

- [USDA FoodData Central](https://fdc.nal.usda.gov/)
- [USDA FoodData Central: Download Datasets](https://fdc.nal.usda.gov/download-datasets/)
- [USDA FoodData Central: Data Type Documentation](https://fdc.nal.usda.gov/data-documentation)
- [USDA FoodData Central: API Guide and Licensing](https://fdc.nal.usda.gov/api-guide)

تذكر USDA أن بيانات FoodData Central متاحة في الملكية العامة CC0، وتطلب ذكر FoodData Central كمصدر عند استخدامها. تم الاحتفاظ بحقوق المصدر في الحقول المصدرية داخل كل عنصر وفي هذا الملف.
