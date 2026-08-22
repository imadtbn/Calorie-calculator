const rootPath = document.body.dataset.root || './';

const links = {
  home: rootPath + 'index.html',
  calorie: rootPath + 'calorie-calculator.html',
  bmi: rootPath + 'bmi-calculator.html',
  macros: rootPath + 'macros-calculator.html',
  water: rootPath + 'water-calculator.html',
  ideal: rootPath + 'ideal-weight-calculator.html',
  foods: rootPath + 'food-calories.html',
  healthTools: rootPath + 'health-tools.html',
  articles: rootPath + 'articles.html',
  faq: rootPath + 'faq.html',
  about: rootPath + 'about.html',
  contact: rootPath + 'contact.html',
  privacy: rootPath + 'privacy.html',
  terms: rootPath + 'terms.html',
  disclaimer: rootPath + 'disclaimer.html'
};

const icon = (name, size = 22) => {
  const paths = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    leaf: '<path d="M20 4c-8.5.2-14 3.8-14 9.5A5.5 5.5 0 0 0 11.5 19C17.2 19 19.8 12.5 20 4Z"/><path d="M5.5 18.5C8 14.7 11.2 12.2 16 10"/>',
    calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chart: '<path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-7"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>'
  };
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.leaf}</svg>`;
};

function renderShell() {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  const active = document.body.dataset.page || '';
  if (header) {
    header.innerHTML = `<div class="container navbar">
      <a class="brand" href="${links.home}" aria-label="العودة إلى الصفحة الرئيسية"><span class="brand-mark"><img class="brand-logo" src="${rootPath}assets/calorie-mark-512.png" alt="" width="38" height="38" decoding="async"></span><span class="brand-name">حاسبة السعرات</span></a>
      <button class="nav-toggle" aria-label="فتح قائمة التنقل" aria-expanded="false">${icon('menu', 25)}</button>
      <nav class="nav-links" aria-label="التنقل الرئيسي">
        <a class="${active === 'home' ? 'active' : ''}" href="${links.home}">الرئيسية</a>
        <a class="${active === 'calorie' ? 'active' : ''}" href="${links.calorie}">حاسبة السعرات</a>
        <a class="${active === 'bmi' ? 'active' : ''}" href="${links.bmi}">BMI</a>
        <a class="${active === 'macros' ? 'active' : ''}" href="${links.macros}">الماكروز</a>
        <a class="${active === 'foods' ? 'active' : ''}" href="${links.foods}">الأطعمة</a>
        <a class="${active === 'articles' ? 'active' : ''}" href="${links.articles}">المقالات</a><a class="${['health-tools', 'child-bmi', 'pregnancy-calorie', 'infant-growth'].includes(active) ? 'active' : ''}" href="${links.healthTools}">الأدوات الصحية</a>
      </nav>
    </div>`;
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.nav-links');
    toggle?.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
    nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }
  if (footer) {
    footer.innerHTML = `<div class="container">
      <div class="footer-grid">
        <div><a class="brand" href="${links.home}"><span class="brand-mark"><img class="brand-logo" src="${rootPath}assets/calorie-mark-512.png" alt="" width="38" height="38" decoding="async"></span><span class="brand-name">حاسبة السعرات</span></a><p style="color:#b5d3c5;max-width:280px;font-size:.84rem;margin-top:18px">أدوات صحية مبسطة تساعدك على فهم احتياجاتك اليومية واتخاذ قرارات أكثر وعيًا.</p></div>
        <div><div class="footer-title">الأدوات</div><div class="footer-links"><a href="${links.calorie}">حاسبة السعرات اليومية</a><a href="${links.bmi}">حاسبة مؤشر BMI</a><a href="${links.macros}">حاسبة الماكروز</a><a href="${links.water}">حاسبة الماء اليومية</a><a href="${links.ideal}">حاسبة الوزن التقريبي</a><a href="${links.foods}">السعرات في الأطعمة</a><a href="${links.healthTools}">الأدوات الصحية</a></div></div>
        <div><div class="footer-title">المحتوى</div><div class="footer-links"><a href="${links.articles}">المقالات</a><a href="${links.faq}">الأسئلة الشائعة</a><a href="${links.about}">عن الموقع</a><a href="${links.contact}">اتصل بنا</a></div></div>
        <div><div class="footer-title">معلومات قانونية</div><div class="footer-links"><a href="${links.privacy}">الخصوصية</a><a href="${links.terms}">شروط الاستخدام</a><a href="${links.disclaimer}">إخلاء المسؤولية</a></div></div>
      </div>
      <div class="footer-bottom"><span>© 2026 حاسبة السعرات. جميع الحقوق محفوظة.</span><span>هذه الأدوات للتقدير والتثقيف وليست تشخيصًا طبيًا.</span></div>
    </div>`;
  }
}

function observeReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  items.forEach(item => observer.observe(item));
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}
function getNumber(id) { return Number(document.getElementById(id)?.value); }
function showError(id, message) { const el = document.getElementById(id); if (el) { el.textContent = message; el.classList.add('show'); } }
function clearError(id) { document.getElementById(id)?.classList.remove('show'); }
function validRange(value, min, max) { return Number.isFinite(value) && value >= min && value <= max; }

async function shareResult(text) {
  if (navigator.share) { try { await navigator.share({ title: 'نتيجتي من حاسبة السعرات', text }); return; } catch (_) {} }
  try { await navigator.clipboard.writeText(text); alert('تم نسخ النتيجة. يمكنك مشاركتها الآن.'); } catch (_) { alert(text); }
}

function mountArticleShare() {
  const isPublishedArticle = document.body.dataset.page === 'articles' && /\/articles\/[^/]+\.html$/.test(window.location.pathname);
  if (!isPublishedArticle || document.querySelector('.article-share')) return;

  const title = document.querySelector('.article-hero-copy h1')?.textContent?.trim() || document.title;
  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
  const shareText = `${title} — من حاسبة السعرات`;
  const encodedUrl = encodeURIComponent(canonical);
  const encodedText = encodeURIComponent(shareText);

  const section = document.createElement('section');
  section.className = 'article-share section';
  section.setAttribute('aria-labelledby', 'article-share-title');
  section.innerHTML = `<div class="container"><div class="article-share-card"><div class="article-share-copy"><span class="eyebrow">شارك المعرفة</span><h2 id="article-share-title">هل كان المقال مفيدًا؟</h2><p>ساعد شخصًا آخر على الوصول إلى معلومات غذائية أوضح.</p></div><div class="share-actions" aria-label="خيارات مشاركة المقال"><a class="share-button share-whatsapp" href="https://wa.me/?text=${encodedText}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="مشاركة المقال عبر واتساب">واتساب</a><a class="share-button share-facebook" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="مشاركة المقال عبر فيسبوك">فيسبوك</a><a class="share-button share-x" href="https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="مشاركة المقال عبر منصة X">X</a><a class="share-button share-telegram" href="https://t.me/share/url?url=${encodedUrl}&text=${encodedText}" target="_blank" rel="noopener noreferrer" aria-label="مشاركة المقال عبر تيليجرام">تيليجرام</a><button class="share-button share-copy" type="button" aria-label="نسخ رابط المقال">نسخ الرابط</button><button class="share-button share-native" type="button" aria-label="مشاركة المقال من الجهاز">مشاركة</button></div><p class="share-status" role="status" aria-live="polite"></p></div></div>`;

  const copyButton = section.querySelector('.share-copy');
  const nativeButton = section.querySelector('.share-native');
  const status = section.querySelector('.share-status');
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonical);
      status.textContent = 'تم نسخ رابط المقال.';
    } catch (_) {
      status.textContent = canonical;
    }
  };
  copyButton.addEventListener('click', copyLink);
  nativeButton.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: shareText, url: canonical }); status.textContent = 'تم فتح خيارات المشاركة.'; return; } catch (_) {}
    }
    await copyLink();
  });
  document.querySelector('main')?.append(section);
}

function mountRelatedArticles() {
  const isPublishedArticle = document.body.dataset.page === 'articles' && /\/articles\/[^/]+\.html$/.test(window.location.pathname);
  if (!isPublishedArticle || document.querySelector('.related-articles')) return;

  const currentSlug = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const articleData = {
    'bmr-vs-tdee': [
      ['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'خطوات هادئة ومستدامة بدل الحلول السريعة.', 'calorie-deficit.webp'],
      ['macros-guide', 'دليل مبسط للماكروز', 'توازن الطبق', 'تعرّف على دور البروتين والدهون والكربوهيدرات.', 'macros-guide.webp'],
      ['how-to-count-calories', 'كيف تحسب السعرات بطريقة عملية؟', 'أساسيات التغذية', 'طريقة أبسط لفهم الأرقام دون تعقيد.', 'how-to-count-calories.webp']
    ],
    'calorie-deficit': [
      ['bmr-vs-tdee', 'ما الفرق بين BMR وTDEE؟', 'أساسيات التغذية', 'افهم الرقم الذي تبدأ منه قبل تحديد هدفك.', 'bmr-tdee.webp'],
      ['healthy-weight', 'ما معنى الوزن الصحي؟', 'وعي صحي', 'نظرة متوازنة إلى الوزن بعيدًا عن رقم واحد.', 'healthy-weight.webp'],
      ['calorie-needs-change', 'لماذا تتغير احتياجاتك من السعرات؟', 'عادات يومية', 'تعرف على العوامل التي تؤثر في احتياجك اليومي.', 'calorie-needs-change.webp']
    ],
    'calorie-needs-change': [
      ['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'خطوات هادئة ومستدامة بدل الحلول السريعة.', 'calorie-deficit.webp'],
      ['bmr-vs-tdee', 'ما الفرق بين BMR وTDEE؟', 'أساسيات التغذية', 'افهم العلاقة بين الأيض والاحتياج اليومي.', 'bmr-tdee.webp'],
      ['healthy-weight', 'ما معنى الوزن الصحي؟', 'وعي صحي', 'نظرة متوازنة إلى الوزن بعيدًا عن رقم واحد.', 'healthy-weight.webp']
    ],
    'healthy-weight': [
      ['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'تقدم تدريجي بدل الحلول السريعة.', 'calorie-deficit.webp'],
      ['calorie-needs-change', 'لماذا تتغير احتياجاتك من السعرات؟', 'عادات يومية', 'تعرف على العوامل التي تؤثر في احتياجك اليومي.', 'calorie-needs-change.webp'],
      ['bmr-vs-tdee', 'ما الفرق بين BMR وTDEE؟', 'أساسيات التغذية', 'افهم الرقم الذي تبدأ منه قبل تحديد هدفك.', 'bmr-tdee.webp']
    ],
    'how-much-water': [
      ['water-and-exercise', 'الماء والرياضة: ماذا تحتاج؟', 'الترطيب', 'كيف يتغير احتياجك للماء مع الحركة.', 'water-and-exercise.webp'],
      ['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'خطوات هادئة ومستدامة بدل الحلول السريعة.', 'calorie-deficit.webp'],
      ['macros-guide', 'دليل مبسط للماكروز', 'توازن الطبق', 'تعرّف على دور المغذيات الأساسية.', 'macros-guide.webp']
    ],
    'how-to-count-calories': [
      ['bmr-vs-tdee', 'ما الفرق بين BMR وTDEE؟', 'أساسيات التغذية', 'افهم المصطلحات التي تظهر في الحاسبات.', 'bmr-tdee.webp'],
      ['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'استخدم الأرقام كدليل لا كقاعدة جامدة.', 'calorie-deficit.webp'],
      ['calorie-needs-change', 'لماذا تتغير احتياجاتك من السعرات؟', 'عادات يومية', 'تعرف على العوامل المؤثرة في احتياجك.', 'calorie-needs-change.webp']
    ],
    'macros-guide': [
      ['bmr-vs-tdee', 'ما الفرق بين BMR وTDEE؟', 'أساسيات التغذية', 'افهم احتياجك اليومي قبل توزيع الماكروز.', 'bmr-tdee.webp'],
      ['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'خطوات هادئة ومستدامة بدل الحلول السريعة.', 'calorie-deficit.webp'],
      ['how-to-count-calories', 'كيف تحسب السعرات بطريقة عملية؟', 'أساسيات التغذية', 'طريقة أبسط لفهم الأرقام اليومية.', 'how-to-count-calories.webp']
    ],
    'pregnancy-due-date': [['fertile-window', 'نافذة الخصوبة والإباضة: كيف نقرأ التقدير؟', 'الخصوبة والتخطيط', 'فهم التقدير التقويمي وأهم حدوده.', 'water-hydration.webp']],
    'fertile-window': [['pregnancy-due-date', 'كيف يُحسب موعد الولادة المتوقع؟', 'الحمل والمتابعة', 'طريقة قراءة الموعد المتوقع وحدود الحاسبة.', 'water-hydration.webp']],
    'prediabetes-risk': [['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'خطوات تدريجية لدعم نمط حياة متوازن.', 'calorie-deficit.webp'], ['healthy-weight', 'ما معنى الوزن الصحي؟', 'وعي صحي', 'لماذا لا يكفي رقم واحد لوصف الصحة.', 'bmr-tdee.webp']],
    'child-bmi': [['pregnancy-calories', 'السعرات أثناء الحمل: كيف نقرأ التقدير؟', 'الحمل والتغذية', 'فهم الزيادة التقريبية وحدود الرقم.', 'water-hydration.webp'], ['healthy-weight', 'ما معنى الوزن الصحي؟', 'وعي صحي', 'نظرة متوازنة إلى الوزن بعيدًا عن رقم واحد.', 'bmr-tdee.webp']],
    'pregnancy-calories': [['child-bmi', 'BMI للأطفال: لماذا نستخدم المئينات؟', 'نمو الأطفال', 'لماذا يعتمد BMI للأطفال على المئينات.', 'bmr-tdee.webp'], ['bmr-vs-tdee', 'ما الفرق بين BMR وTDEE؟', 'أساسيات التغذية', 'افهم الفرق بين الأيض والاحتياج اليومي.', 'bmr-tdee.webp']],
    'infant-growth': [['child-bmi', 'BMI للأطفال: لماذا نستخدم المئينات؟', 'نمو الأطفال', 'الفرق بين BMI للبالغين ومئينات الأطفال.', 'bmr-tdee.webp'], ['healthy-weight', 'ما معنى الوزن الصحي؟', 'وعي صحي', 'قراءة متوازنة للوزن بعيدًا عن رقم واحد.', 'bmr-tdee.webp']],
    'water-and-exercise': [
      ['how-much-water', 'كم تحتاج من الماء يوميًا؟', 'الترطيب', 'تقدير بسيط لاحتياجك اليومي من الماء.', 'how-much-water.webp'],
      ['calorie-deficit', 'كيف تبني عجزًا حراريًا معتدلًا؟', 'عادات يومية', 'تقدم تدريجي بدل الحلول السريعة.', 'calorie-deficit.webp'],
      ['macros-guide', 'دليل مبسط للماكروز', 'توازن الطبق', 'تعرّف على دور البروتين والدهون والكربوهيدرات.', 'macros-guide.webp']
    ],
    'asthma-control': [['sleep-assessment', 'تقييم النوم التوعوي', 'النوم', 'كيف يؤثر النوم في الإحساس بالأعراض والطاقة.', 'sleep-assessment.jpg'], ['anxiety-screening', 'استبيان القلق التوعوي', 'الصحة النفسية', 'قراءة أولية لمشاعر القلق دون تشخيص.', 'anxiety-screening.jpg']],
    'anxiety-screening': [['depression-screening', 'استبيان المزاج والاكتئاب', 'الصحة النفسية', 'متى يصبح طلب الدعم خطوة مناسبة.', 'depression-support.jpg'], ['phone-balance', 'التوازن مع الهاتف', 'وعي رقمي', 'ملاحظة أثر الهاتف على النوم والمهام.', 'phone-balance.jpg']],
    'eating-awareness': [['diabetes-awareness', 'التوعية اليومية بالسكري', 'التوعية الصحية', 'عادات يومية تدعم المتابعة دون تشخيص ذاتي.', 'diabetes-awareness.jpg'], ['phone-balance', 'التوازن مع الهاتف', 'وعي رقمي', 'كيف نلاحظ العادة قبل أن تؤثر في يومنا.', 'phone-balance.jpg']],
    'sleep-assessment': [['anxiety-screening', 'استبيان القلق التوعوي', 'الصحة النفسية', 'العلاقة بين القلق والاسترخاء والنوم.', 'anxiety-screening.jpg'], ['phone-balance', 'التوازن مع الهاتف', 'وعي رقمي', 'أثر استخدام الهاتف على روتين النوم.', 'phone-balance.jpg']],
    'depression-screening': [['anxiety-screening', 'استبيان القلق التوعوي', 'الصحة النفسية', 'أسئلة توعوية لفهم مشاعر القلق.', 'anxiety-screening.jpg'], ['sleep-assessment', 'تقييم النوم التوعوي', 'النوم', 'مراجعة نمط النوم وتأثيره في المزاج.', 'sleep-assessment.jpg']],
    'visual-acuity-screening': [['infant-growth', 'كيف نقرأ طول الرضيع على مخطط WHO؟', 'نمو الرضع', 'مقال صحي يشرح المئين ودرجة Z.', 'water-hydration.webp'], ['healthy-weight', 'ما معنى الوزن الصحي؟', 'وعي صحي', 'قراءة متوازنة للوزن بعيدًا عن رقم واحد.', 'bmr-tdee.webp']],
    'phone-balance': [['sleep-assessment', 'تقييم النوم التوعوي', 'النوم', 'أثر الهاتف والروتين في جودة النوم.', 'sleep-assessment.jpg'], ['anxiety-screening', 'استبيان القلق التوعوي', 'الصحة النفسية', 'ملاحظة مشاعر القلق وطلب الدعم.', 'anxiety-screening.jpg']],
    'pilgrim-health-checklist': [['water-and-exercise', 'الماء والرياضة: كيف توازن بينهما؟', 'الترطيب', 'نصائح عملية للترطيب والنشاط.', 'water-hydration.webp'], ['diabetes-awareness', 'التوعية اليومية بالسكري', 'التوعية الصحية', 'قائمة متابعة بسيطة للعادات الصحية.', 'diabetes-awareness.jpg']],
    'diabetes-awareness': [['prediabetes-risk', 'اختبار خطر ما قبل السكري: ماذا تعني النتيجة؟', 'السكري', 'متى تناقش عوامل الخطر مع الطبيب.', 'bmr-tdee.webp'], ['eating-awareness', 'الوعي بأنماط الأكل وطلب الدعم', 'التغذية', 'علاقة متوازنة مع الطعام بعيدًا عن الوصمة.', 'eating-awareness.jpg']],
  };
  const related = articleData[currentSlug] || [];
  if (!related.length) return;

  const section = document.createElement('section');
  section.className = 'related-articles section';
  section.setAttribute('aria-labelledby', 'related-articles-title');
  const container = document.createElement('div');
  container.className = 'container';
  const heading = document.createElement('div');
  heading.className = 'section-heading related-heading';
  heading.innerHTML = '<span class="eyebrow">واصل القراءة</span><h2 id="related-articles-title">أحدث المقالات المرتبطة</h2><p>موضوعات إضافية تساعدك على تحويل المعرفة إلى خطوات عملية.</p>';
  const grid = document.createElement('div');
  grid.className = 'related-articles-grid';

  related.forEach(([slug, title, category, description, image]) => {
    const card = document.createElement('a');
    card.className = 'related-article-card';
    card.href = `${rootPath}articles/${slug}.html`;
    card.setAttribute('aria-label', `قراءة مقال: ${title}`);
    const imageElement = document.createElement('img');
    imageElement.src = `${rootPath}assets/articles/${image}`;
    imageElement.alt = title;
    imageElement.width = 1200;
    imageElement.height = 900;
    imageElement.loading = 'lazy';
    imageElement.decoding = 'async';
    const art = document.createElement('div');
    art.className = 'related-article-art';
    art.append(imageElement);
    const body = document.createElement('div');
    body.className = 'related-article-body';
    const categoryElement = document.createElement('span');
    categoryElement.className = 'related-article-category';
    categoryElement.textContent = category;
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    const linkElement = document.createElement('span');
    linkElement.className = 'related-article-link';
    linkElement.textContent = 'اقرأ المقال ←';
    body.append(categoryElement, titleElement, descriptionElement, linkElement);
    card.append(art, body);
    grid.append(card);
  });

  container.append(heading, grid);
  section.append(container);
  document.querySelector('main')?.append(section);
}

window.CalorieApp = { links, icon, formatNumber, getNumber, showError, clearError, validRange, shareResult };
renderShell();
observeReveals();
mountArticleShare();
mountRelatedArticles();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`${rootPath}sw.js`).catch(() => {}));
}
