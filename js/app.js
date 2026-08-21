const rootPath = document.body.dataset.root || './';

const links = {
  home: rootPath + 'index.html',
  calorie: rootPath + 'calorie-calculator.html',
  bmi: rootPath + 'bmi-calculator.html',
  macros: rootPath + 'macros-calculator.html',
  water: rootPath + 'water-calculator.html',
  ideal: rootPath + 'ideal-weight-calculator.html',
  foods: rootPath + 'food-calories.html',
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
        <a class="${active === 'articles' ? 'active' : ''}" href="${links.articles}">المقالات</a>
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
        <div><div class="footer-title">الأدوات</div><div class="footer-links"><a href="${links.calorie}">حاسبة السعرات اليومية</a><a href="${links.bmi}">حاسبة مؤشر BMI</a><a href="${links.macros}">حاسبة الماكروز</a><a href="${links.water}">حاسبة الماء اليومية</a><a href="${links.ideal}">حاسبة الوزن التقريبي</a><a href="${links.foods}">السعرات في الأطعمة</a></div></div>
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

window.CalorieApp = { links, icon, formatNumber, getNumber, showError, clearError, validRange, shareResult };
renderShell();
observeReveals();
mountArticleShare();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`${rootPath}sw.js`).catch(() => {}));
}
