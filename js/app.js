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
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    language: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21M12 3c-2.3 2.5-3.5 5.5-3.5 9S9.7 18.5 12 21"/>'
  };
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.leaf}</svg>`;
};

function getCurrentLanguage() {
  const code = (document.documentElement.lang || 'ar').toLowerCase().split('-')[0];
  return code === 'en' ? { code: 'en', label: 'English', currentLabel: 'Current' } : { code: 'ar', label: 'العربية', currentLabel: 'الحالية' };
}

function mountLanguageSwitcher(header) {
  const switcher = header.querySelector('[data-language-switcher]');
  const trigger = switcher?.querySelector('[data-language-trigger]');
  const menu = switcher?.querySelector('[data-language-menu]');
  if (!switcher || !trigger || !menu) return;

  const setOpen = (open) => {
    trigger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };

  trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', (event) => {
    if (!switcher.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      trigger.focus();
    }
  });
}

function renderShell() {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  const active = document.body.dataset.page || '';
  const currentLanguage = getCurrentLanguage();
  if (header) {
    header.innerHTML = `<div class="container navbar">
      <a class="brand" href="${links.home}" aria-label="العودة إلى الصفحة الرئيسية"><span class="brand-mark"><img class="brand-logo" src="${rootPath}assets/calorie-mark-512.png" alt="" width="38" height="38" decoding="async"></span><span class="brand-name">حاسبة السعرات</span></a>
      <div class="nav-actions">
        <div class="language-switcher" data-language-switcher>
          <button class="language-trigger" type="button" data-language-trigger aria-expanded="false" aria-controls="language-menu" aria-haspopup="true" aria-label="اختيار لغة الموقع">
            ${icon('language', 19)}<span class="language-current">${currentLanguage.label}</span><span class="language-chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="language-menu" id="language-menu" data-language-menu hidden>
            <a class="language-option is-current" href="${window.location.href}" lang="ar" aria-current="page"><span>العربية</span><small>${currentLanguage.code === 'ar' ? currentLanguage.currentLabel : 'Arabic'}</small></a>
            <button class="language-option language-option--disabled" type="button" disabled lang="en"><span>English</span><small>قريبًا</small></button>
          </div>
        </div>
        <button class="nav-toggle" aria-label="فتح قائمة التنقل" aria-expanded="false">${icon('menu', 25)}</button>
      </div>
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
    mountLanguageSwitcher(header);
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

const LOCAL_SEARCH_INDEX = [
  ['أداة','حاسبة السعرات اليومية','احسب BMR وTDEE والسعرات حسب هدفك ونشاطك.','calorie-calculator.html','سعرات bmr tdee تغذية'],
  ['أداة','حاسبة مؤشر كتلة الجسم BMI','اعرف مؤشر BMI للبالغين بالطول والوزن.','bmi-calculator.html','bmi وزن طول'],
  ['أداة','حاسبة الماكروز','حوّل السعرات إلى بروتين وكربوهيدرات ودهون.','macros-calculator.html','ماكروز بروتين دهون كربوهيدرات'],
  ['أداة','حاسبة الماء اليومية','قدّر احتياجك من الماء حسب الوزن والنشاط.','water-calculator.html','ماء ترطيب hydration'],
  ['أداة','حاسبة الوزن التقريبي','تقدير إرشادي لنطاق الوزن حسب الطول والجنس.','ideal-weight-calculator.html','وزن طول'],
  ['أداة','السعرات في الأطعمة','ابحث في قاعدة الأطعمة والسعرات.','food-calories.html','أطعمة غذاء سعرات'],
  ['أداة','نمو الرضع والطول','قارن الطول والوزن بمخططات WHO حسب العمر والجنس.','infant-growth-calculator.html','رضيع طفل نمو طول who'],
  ['أداة','سعرات الحمل','قدّر السعرات العامة حسب ثلث الحمل وخط الأساس.','pregnancy-calorie-calculator.html','حمل سعرات تغذية'],
  ['أداة','BMI للأطفال والمراهقين','احسب المئين التقريبي حسب العمر والجنس.','child-bmi-calculator.html','طفل مراهق bmi نمو'],
  ['أداة','حاسبة موعد الولادة','تقدير أولي لموعد الولادة من آخر دورة.','pregnancy-due-date.html','حمل ولادة موعد'],
  ['أداة','نافذة الخصوبة والإباضة','تقدير تقويمي للأيام الأكثر احتمالًا للخصوبة.','fertile-window.html','خصوبة إباضة دورة'],
  ['أداة','اختبار خطر ما قبل السكري','استبيان توعوي لعوامل خطر ما قبل السكري.','prediabetes-risk.html','سكري سكر خطر'],
  ['أداة','اختبار التحكم بالربو','فحص توعوي للتحكم بالأعراض.','asthma-control.html','ربو تنفس'],
  ['أداة','استبيان القلق التوعوي','أسئلة توعوية عن مشاعر القلق.','anxiety-screening.html','قلق صحة نفسية'],
  ['أداة','الوعي بأنماط الأكل','مراجعة ذاتية للعلاقة بالطعام وطلب الدعم.','eating-awareness.html','أكل تغذية اضطراب'],
  ['أداة','تقييم النوم التوعوي','أسئلة عن جودة النوم وتأثيره.','sleep-assessment.html','نوم أرق'],
  ['أداة','استبيان المزاج والاكتئاب','فحص توعوي للمزاج دون تشخيص.','depression-screening.html','مزاج اكتئاب صحة نفسية'],
  ['أداة','اختبار حدة البصر التقريبي','قراءة شاشة تقريبية مع تنبيه محدودية الدقة.','visual-acuity-screening.html','نظر عيون بصر'],
  ['أداة','استبيان التوازن مع الهاتف','ملاحظة أثر الهاتف في النوم والمهام.','phone-balance.html','هاتف توازن رقمي'],
  ['أداة','قائمة الاستعداد الصحي للحج','قائمة محلية لتجهيزات السفر الصحية.','pilgrim-health-checklist.html','حج سفر صحة'],
  ['أداة','التوعية اليومية بالسكري','قائمة متابعة للعادات الصحية دون تشخيص.','diabetes-awareness.html','سكري متابعة'],
  ['مقال','ما الفرق بين BMR وTDEE؟','فهم الأيض الأساسي وإجمالي الإنفاق اليومي قبل تفسير النتيجة.','articles/bmr-vs-tdee.html','bmr tdee أيض'],
  ['مقال','كيف تبني عجزًا حراريًا معتدلًا؟','لماذا تكون الخطوات الصغيرة أكثر قابلية للاستمرار من الحلول القاسية.','articles/calorie-deficit.html','عجز سعرات وزن'],
  ['مقال','دليل مبسط للماكروز','دور البروتين والكربوهيدرات والدهون في بناء وجبة متوازنة.','articles/macros-guide.html','ماكروز بروتين'],
  ['مقال','كم يحتاج الجسم من الماء يوميًا؟','كيف تقدّر احتياجك من الماء دون التعلق برقم جامد.','articles/how-much-water.html','ماء ترطيب'],
  ['مقال','ما هو الوزن الصحي؟','لماذا لا يوجد وزن مثالي واحد يناسب جميع الأجسام.','articles/healthy-weight.html','وزن صحي مؤشرات'],
  ['مقال','كيف تحسب السعرات في الوجبة؟','افهم حجم الحصة وعدد الحصص والسعرات في الطعام المعبأ.','articles/how-to-count-calories.html','حساب سعرات ملصق'],
  ['مقال','لماذا تختلف احتياجات السعرات؟','شرح BMR وTDEE والعوامل التي تغير احتياجك للطاقة.','articles/calorie-needs-change.html','سعرات احتياج طاقة'],
  ['مقال','الماء والرياضة: كيف تحافظ على الترطيب؟','إرشادات عامة للشرب قبل وأثناء وبعد النشاط البدني.','articles/water-and-exercise.html','ماء رياضة ترطيب'],
  ['مقال','كيف يُحسب موعد الولادة المتوقع؟','افهم قاعدة 40 أسبوعًا وحدود التقدير التقويمي.','articles/pregnancy-due-date.html','حمل ولادة موعد'],
  ['مقال','نافذة الخصوبة والإباضة: كيف نقرأ التقدير؟','لماذا تعرض الحاسبة نطاقًا تقريبيًا لا يومًا مضمونًا.','articles/fertile-window.html','خصوبة إباضة دورة'],
  ['مقال','اختبار خطر ما قبل السكري: ماذا تعني النتيجة؟','افهم دلالة النقاط ولماذا لا يغني الاختبار عن تحليل الدم.','articles/prediabetes-risk.html','سكري سكر خطر'],
  ['مقال','BMI للأطفال: لماذا نستخدم المئينات؟','افهم الفرق بين BMI للبالغين ومؤشر BMI حسب العمر والجنس.','articles/child-bmi.html','طفل bmi مئين'],
  ['مقال','السعرات أثناء الحمل: كيف نقرأ التقدير؟','شرح الزيادة التقريبية حسب الثلث وحدود استخدام الرقم.','articles/pregnancy-calories.html','حمل سعرات'],
  ['مقال','كيف نقرأ طول الرضيع على مخطط WHO؟','شرح الطول المستلقي والمئين ودرجة Z وحدود القراءة المنزلية.','articles/infant-growth.html','رضيع who نمو'],
  ['مقال','كيف نقرأ نتيجة اختبار التحكم بالربو؟','فهم نتيجة ACT وحدود استخدامها مع خطة الطبيب.','articles/asthma-control.html','ربو اختبار'],
  ['مقال','استبيان القلق: ماذا تعني الدرجة؟','طريقة قراءة الإجابات ومتى تطلب دعمًا متخصصًا.','articles/anxiety-screening.html','قلق صحة نفسية'],
  ['مقال','الوعي بأنماط الأكل وطلب الدعم','إشارات تستحق الحديث مع مختص دون وصمة أو تشخيص ذاتي.','articles/eating-awareness.html','أكل تغذية اضطراب'],
  ['مقال','كيف نقرأ تقييم النوم؟','ثمانية أسئلة تساعدك على ملاحظة نمط النوم خلال الشهر.','articles/sleep-assessment.html','نوم أرق صحة نفسية'],
  ['مقال','استبيان المزاج: متى أطلب المساعدة؟','شرح فحص المزاج والتنبيه المهم عند وجود أفكار إيذاء النفس.','articles/depression-screening.html','مزاج اكتئاب صحة نفسية'],
  ['مقال','هل اختبار النظر على الهاتف دقيق؟','حدود اختبارات الشاشة ومتى تحتاج فحص عيون مهنيًا.','articles/visual-acuity-screening.html','نظر عيون بصر'],
  ['مقال','التوازن مع الهاتف: مراجعة ذاتية قصيرة','أسئلة تساعدك على ملاحظة أثر الهاتف على النوم والمهام.','articles/phone-balance.html','هاتف توازن رقمي'],
  ['مقال','قائمة الاستعداد الصحي للحج','تجهيزات عملية للأدوية والماء والملابس والمشي الآمن.','articles/pilgrim-health-checklist.html','حج سفر صحة'],
  ['مقال','التوعية اليومية بالسكري دون تشخيص ذاتي','كيف تجعل المتابعة والعادات الصحية جزءًا من يومك.','articles/diabetes-awareness.html','سكري متابعة']
];
function normalizeSearch(value) { return String(value || '').toLocaleLowerCase('ar').normalize('NFKD').replace(/[\\u064B-\\u065F\\u0670]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ـ/g, '').replace(/\\s+/g, ' ').trim(); }
function matchesSearchText(text, query) { const normalizedText = normalizeSearch(text); const normalizedQuery = normalizeSearch(query); if (!normalizedQuery) return false; const tokens = normalizedText.split(/[^\p{L}\p{N}%+#.-]+/u).filter(Boolean); return tokens.some(word => word === normalizedQuery || word.startsWith(normalizedQuery) || word.endsWith(normalizedQuery)); }
function searchResultElement(item) { const [kind,title,description,href,tags] = item; const link = document.createElement('a'); link.className = 'local-search-result'; link.href = `${rootPath}${href}`; link.innerHTML = `<span class="local-search-kind">${kind}</span><span class="local-search-result-copy"><strong></strong><small></small></span><span class="local-search-arrow" aria-hidden="true">←</span>`; link.querySelector('strong').textContent = title; link.querySelector('small').textContent = description; link.dataset.searchText = normalizeSearch(`${kind} ${title} ${description} ${tags}`); return link; }
function mountHomeSearch() { if (document.body.dataset.page !== 'home') return; const form = document.querySelector('[data-home-search-form]'); if (!form) return; const input = form.querySelector('input'); const results = form.querySelector('[data-home-search-results]'); const status = form.querySelector('[data-home-search-status]'); const clear = form.querySelector('[data-home-search-clear]'); const render = () => { const query = normalizeSearch(input.value); const matches = query ? LOCAL_SEARCH_INDEX.filter(item => matchesSearchText(`${item[0]} ${item[1]} ${item[2]} ${item[4]}`, query)).slice(0, 8) : []; results.replaceChildren(...matches.map(searchResultElement)); results.hidden = !query; status.textContent = query ? `${formatNumber(matches.length)} نتيجة مطابقة` : 'ابحث عن أداة أو مقال من الموقع'; clear.hidden = !query; }; input.addEventListener('input', render); form.addEventListener('submit', event => { event.preventDefault(); render(); if (results.querySelector('a')) results.querySelector('a').focus(); }); clear.addEventListener('click', () => { input.value = ''; input.focus(); render(); }); render(); }
const TOOL_GROUPS = { 'infant-growth-calculator':'الأطفال', 'child-bmi-calculator':'الأطفال', 'pregnancy-calorie-calculator':'الحمل والخصوبة', 'pregnancy-due-date':'الحمل والخصوبة', 'fertile-window':'الحمل والخصوبة', 'anxiety-screening':'الصحة النفسية والنوم', 'eating-awareness':'الصحة النفسية والنوم', 'sleep-assessment':'الصحة النفسية والنوم', 'depression-screening':'الصحة النفسية والنوم', 'phone-balance':'الصحة النفسية والنوم', 'asthma-control':'فحوصات', 'visual-acuity-screening':'فحوصات', 'prediabetes-risk':'فحوصات' };
function mountDirectorySearch() { const page = document.body.dataset.page; const isArticleIndex = page === 'articles' && !window.location.pathname.includes('/articles/'); const isToolIndex = page === 'health-tools'; if (!isArticleIndex && !isToolIndex) return; const toolbar = document.querySelector('[data-directory-search]'); const grid = document.querySelector(isToolIndex ? '.health-tools-grid' : '.article-grid'); if (!toolbar || !grid) return; const cards = [...grid.children]; const input = toolbar.querySelector('input'); const status = toolbar.querySelector('[data-directory-status]'); const empty = toolbar.querySelector('[data-directory-empty]'); const clear = toolbar.querySelector('[data-directory-clear]'); const buttons = [...toolbar.querySelectorAll('[data-filter]')]; cards.forEach(card => { const href = card.getAttribute('href') || ''; const slug = href.split('/').pop().replace(/\.html$/, ''); const category = isToolIndex ? (TOOL_GROUPS[slug] || 'الصحة العامة') : (card.querySelector('.article-art span')?.textContent || 'مقالات'); card.dataset.searchText = normalizeSearch(card.textContent); card.dataset.category = normalizeSearch(category); }); let active = 'all'; const render = () => { const query = normalizeSearch(input.value); let count = 0; cards.forEach(card => { const matchesText = !query || matchesSearchText(card.dataset.searchText, query); const matchesFilter = active === 'all' || card.dataset.category.includes(normalizeSearch(active)); const visible = matchesText && matchesFilter; card.hidden = !visible; if (visible) count += 1; }); status.textContent = query || active !== 'all' ? `${formatNumber(count)} نتيجة ظاهرة` : `${formatNumber(count)} أداة أو مقال متاح`; empty.hidden = count !== 0; clear.hidden = !query; buttons.forEach(button => button.classList.toggle('active', button.dataset.filter === active)); }; input.addEventListener('input', render); clear.addEventListener('click', () => { input.value = ''; input.focus(); render(); }); buttons.forEach(button => button.addEventListener('click', () => { active = button.dataset.filter; render(); })); render(); }
window.CalorieApp = { links, icon, formatNumber, getNumber, showError, clearError, validRange, shareResult, LOCAL_SEARCH_INDEX, normalizeSearch, matchesSearchText };
renderShell();
mountHomeSearch();
mountDirectorySearch();
observeReveals();
mountArticleShare();
mountRelatedArticles();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`${rootPath}sw.js`).catch(() => {}));
}
