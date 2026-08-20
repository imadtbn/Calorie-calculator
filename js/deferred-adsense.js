(() => {
  'use strict';

  const CLIENT = 'ca-pub-5656416032906373';
  const ROOT_MARGIN = '500px 0px';
  const units = {
    fluid01: { slot: '7867079394', format: 'fluid', layoutKey: '-fr+56+4k-d4+74' },
    display01: { slot: '3143411927', format: 'auto' },
    fluid02: { slot: '8546947691', format: 'fluid', layoutKey: '-h9-h+8-jr+r8' },
    display02: { slot: '1760836049', format: 'auto' },
    fluid03: { slot: '6152718642', format: 'fluid', layoutKey: '-h6-l+d-jc+qd' },
    display03: { slot: '5508509362', format: 'auto' },
    inArticle01: { slot: '6118497380', format: 'fluid', layout: 'in-article' },
    inArticle02: { slot: '7319898418', format: 'fluid', layout: 'in-article' },
    multiplex: { slot: '6528123169', format: 'autorelaxed' }
  };

  let adsensePromise;
  let observer;

  const schedule = window.requestIdleCallback
    ? (callback, timeout = 1600) => window.requestIdleCallback(callback, { timeout })
    : (callback, timeout = 900) => window.setTimeout(callback, timeout);

  const makeAd = (name, modifier = '') => {
    const unit = units[name];
    if (!unit) return null;

    const container = document.createElement('section');
    container.className = `ad-container ad-container--${unit.format} ${modifier}`.trim();
    container.dataset.adUnit = name;
    container.setAttribute('aria-label', 'إعلان');
    container.setAttribute('role', 'complementary');

    const label = document.createElement('span');
    label.className = 'ad-container__label';
    label.textContent = 'إعلان';
    container.appendChild(label);

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.dataset.adClient = CLIENT;
    ins.dataset.adSlot = unit.slot;
    ins.dataset.adFormat = unit.format;
    ins.dataset.fullWidthResponsive = 'true';
    ins.dataset.adUnitName = name;
    ins.style.display = 'block';
    if (unit.layoutKey) ins.dataset.adLayoutKey = unit.layoutKey;
    if (unit.layout) ins.dataset.adLayout = unit.layout;
    container.appendChild(ins);
    return container;
  };

  const hasUnit = name => document.querySelector(`[data-ad-unit="${name}"]`);

  const mountAfter = (anchor, name, modifier = '') => {
    if (!anchor || hasUnit(name)) return null;
    const ad = makeAd(name, modifier);
    if (!ad) return null;
    anchor.insertAdjacentElement('afterend', ad);
    return ad;
  };

  const mountBeforeFooter = (name, modifier = '') => {
    if (hasUnit(name)) return null;
    const footer = document.querySelector('[data-site-footer]');
    const ad = makeAd(name, modifier);
    if (!footer || !ad) return null;
    footer.before(ad);
    return ad;
  };

  const fillSidebar = (name) => {
    const sidebar = document.querySelector('.content-with-aside .ad-slot');
    if (!sidebar || hasUnit(name)) return null;
    const ad = makeAd(name, 'ad-container--sidebar');
    if (!ad) return null;
    sidebar.replaceWith(ad);
    return ad;
  };

  const mountInArticle = (article, name, paragraphIndex) => {
    if (!article || hasUnit(name)) return null;
    const paragraphs = [...article.querySelectorAll('p')]
      .filter(paragraph => paragraph.textContent.trim().length > 70);
    const anchor = paragraphs[Math.min(paragraphIndex, paragraphs.length - 1)];
    return mountAfter(anchor, name, 'ad-container--in-article');
  };

  const placeAds = () => {
    const page = document.body?.dataset.page || '';
    const main = document.querySelector('main');
    if (!main) return;

    if (page === 'home') {
      mountAfter(main.querySelector('.hero, .page-hero'), 'fluid01', 'ad-container--after-hero');
      mountAfter(main.querySelector('#tools'), 'display01', 'ad-container--between-sections');
      mountBeforeFooter('multiplex', 'ad-container--bottom');
      return;
    }

    if (page === 'water') {
      mountAfter(main.querySelector('.calculator-layout')?.closest('.section'), 'display01', 'ad-container--after-calculator');
      mountAfter(main.querySelector('#water-benefits'), 'fluid02', 'ad-container--between-sections');
      mountBeforeFooter('multiplex', 'ad-container--bottom');
      return;
    }

    if (['calorie', 'bmi', 'macros', 'ideal'].includes(page)) {
      mountAfter(main.querySelector('.calculator-layout')?.closest('.section'), 'display02', 'ad-container--after-calculator');
      mountBeforeFooter('fluid02', 'ad-container--bottom');
      return;
    }

    if (page === 'foods') {
      fillSidebar('display01');
      mountBeforeFooter('multiplex', 'ad-container--bottom');
      return;
    }

    if (page === 'articles') {
      const articleGrid = main.querySelector('.article-grid');
      if (articleGrid) {
        mountAfter(articleGrid.closest('.section') || articleGrid, 'fluid03', 'ad-container--between-sections');
        mountBeforeFooter('multiplex', 'ad-container--bottom');
      } else {
        const article = main.querySelector('article.prose');
        fillSidebar('display03');
        mountInArticle(article, 'inArticle01', 2);
        mountInArticle(article, 'inArticle02', 5);
      }
      return;
    }

    if (['about', 'faq', 'contact', 'privacy', 'terms', 'disclaimer'].includes(page)) {
      const content = main.querySelector('.section:last-of-type, .prose, .content-with-aside') || main.lastElementChild;
      mountAfter(content, 'display03', 'ad-container--after-content');
    }
  };

  const loadAdsense = () => {
    if (adsensePromise) return adsensePromise;
    const existing = document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    if (existing) {
      adsensePromise = Promise.resolve();
      return adsensePromise;
    }

    adsensePromise = new Promise(resolve => {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      script.dataset.adsenseLoader = 'true';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', resolve, { once: true });
      document.head.appendChild(script);
    });
    return adsensePromise;
  };

  const requestAd = ins => {
    if (!ins || ins.dataset.adRequested === 'true') return;
    ins.dataset.adRequested = 'true';
    loadAdsense().then(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {
        ins.dataset.adError = 'true';
      }
    });
  };

  const observeAds = () => {
    const ads = [...document.querySelectorAll('.adsbygoogle:not([data-ad-requested])')];
    if (!ads.length) return;

    if (!('IntersectionObserver' in window)) {
      ads.forEach(requestAd);
      return;
    }

    observer?.disconnect();
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        requestAd(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: ROOT_MARGIN, threshold: 0.01 });
    ads.forEach(ad => observer.observe(ad));
  };

  const start = () => {
    placeAds();
    schedule(observeAds);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
