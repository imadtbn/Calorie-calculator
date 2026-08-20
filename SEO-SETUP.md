# دليل تشغيل SEO للموقع

تم تجهيز الموقع تقنيًا للفهرسة، لكن **زيادة الزيارات تحتاج أيضًا إلى نشر الموقع على نطاق فعلي ومتابعة بيانات البحث**. لا يمكن إرسال sitemap إلى Search Console أو طلب الفهرسة دون امتلاك الموقع أو خاصية النطاق.

## خطوات الإطلاق

| الخطوة | الإجراء |
|---|---|
| 1 | فعّل GitHub Pages من إعدادات المستودع، واختر الفرع `main` ومجلد الجذر `/`. |
| 2 | استخدم النطاق المنشور الفعلي في canonical وOpen Graph وsitemap إذا لم يكن عنوان GitHub Pages هو العنوان النهائي. |
| 3 | أضف الموقع إلى [Google Search Console](https://search.google.com/search-console) وأكمل إثبات الملكية. |
| 4 | أرسل `https://YOUR-DOMAIN/sitemap.xml` من تقرير Sitemaps. |
| 5 | افحص الصفحة الرئيسية وصفحات الحاسبات والمقالات عبر URL Inspection واطلب الفهرسة بعد النشر. |
| 6 | راقب تقارير الأداء وCore Web Vitals وأصلح الصفحات التي لديها نقرات قليلة أو ظهور مرتفع ونسبة نقر منخفضة. |

## استراتيجية المحتوى

ابدأ بالكلمات التي تعبّر عن نية واضحة، مثل «حاسبة السعرات الحرارية اليومية»، «حاسبة BMI»، «حاسبة الماء اليومية»، «السعرات في الأطعمة»، و«ما الفرق بين BMR وTDEE؟». لكل نية صفحة مستقلة بعنوان ووصف ومحتوى وروابط داخلية مناسبة، بدل إنشاء صفحات مكررة مع تغيير كلمة واحدة.

انشر مقالًا تعليميًا أصليًا كل أسبوع أو أسبوعين، واربطه بأداة عملية. حدّث المقالات القديمة عندما تتغير الأداة أو تظهر أسئلة شائعة جديدة، وسجّل تاريخ التحديث الظاهر في الصفحة وفي البيانات المنظمة.

## ما يجب تجنبه

لا تستخدم حشو الكلمات المفتاحية، ولا تنشئ صفحات رقيقة أو مكررة، ولا تعد الزائر بنتيجة طبية مؤكدة. المحتوى الصحي يجب أن يوضح حدوده ويشجع على استشارة المختص عند وجود حالة أو هدف علاجي.

## المصادر

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
