(() => {
  'use strict';

  const client = 'ca-pub-5656416032906373';
  const units = {
    fluid01: { slot: '7867079394', format: 'fluid', layoutKey: '-fr+56+4k-d4+74' },
    display01: { slot: '3143411927', format: 'auto' },
    fluid02: { slot: '8546947691', format: 'fluid', layoutKey: '-h9-h+8-jr+r8' },
    display02: { slot: '1760836049', format: 'auto' },
    fluid03: { slot: '6152718642', format: 'fluid', layoutKey: '-h6-l+d-jc+qd' },
    multiplex: { slot: '6528123169', format: 'autorelaxed' }
  };

  const makeAd = (name, modifier = '') => {
    const unit = units[name];
    if (!unit) return null;
    const container = document.createElement('section');
    container.className = `ad-container ad-container--${unit.format} ${modifier}`.trim();
    container.setAttribute('aria-label', 'إعلان');
    container.dataset.adUnit = name;

    const label = document.createElement('span');
    label.className = 'ad-container__label';
    label.textContent = 'إعلانات';
    container.appendChild(label);

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.dataset.adClient = client;
    ins.dataset.adSlot = unit.slot;
    ins.dataset.adFormat = unit.format;
    ins.dataset.fullWidthResponsive = 'true';
    if (unit.layoutKey) ins.dataset.adLayoutKey = unit.layoutKey;
    container.appendChild(ins);
    return container;
  };

  const insertAfter = (anchor, name, modifier = '') => {
    if (!anchor || document.querySelector(`[data-ad-unit="${name}"]`)) return;
    const ad = makeAd(name, modifier);
    if (ad) anchor.insertAdjacentElement('afterend', ad);
  };

  const insertBeforeFooter = (name, modifier = '') => {
    if (document.querySelector(`[data-ad-unit="${name}"]`)) return;
    const footer = document.querySelector('[data-site-footer]');
    const ad = makeAd(name, modifier);
    if (ad && footer) footer.before(ad);
  };

  const fillSidebar = (name) => {
    const sidebar = document.querySelector('.content-with-aside .ad-slot');
    if (!sidebar || document.querySelector(`[data-ad-unit="${name}"]`)) return;
    const ad = makeAd(name, 'ad-container--sidebar');
    if (!ad) return;
    sidebar.replaceWith(ad);
  };

  const placeAds = () => {
    const page = document.body?.dataset.page || '';
    const main = document.querySelector('main');
    if (!main) return;

    if (page === 'home') {
      insertAfter(main.querySelector('.hero'), 'fluid01', 'ad-container--after-hero');
      insertAfter(main.querySelector('#tools'), 'display01', 'ad-container--between-sections');
      insertBeforeFooter('multiplex', 'ad-container--bottom');
      return;
    }

    if (page === 'water') {
      insertAfter(main.querySelector('.calculator-layout')?.closest('.section'), 'display01', 'ad-container--after-calculator');
      insertAfter(main.querySelector('#water-benefits'), 'fluid02', 'ad-container--between-sections');
      insertAfter(main.querySelector('#dehydration-signs'), 'multiplex', 'ad-container--before-faq');
      return;
    }

    if (['calorie', 'bmi', 'macros', 'ideal'].includes(page)) {
      insertAfter(main.querySelector('.calculator-layout')?.closest('.section'), 'display02', 'ad-container--after-calculator');
      insertBeforeFooter('fluid02', 'ad-container--bottom');
      return;
    }

    if (page === 'foods') {
      fillSidebar('display01');
      insertBeforeFooter('multiplex', 'ad-container--bottom');
      return;
    }

    if (page === 'articles') {
      const articleGrid = main.querySelector('.article-grid');
      if (articleGrid) insertAfter(articleGrid.closest('.section') || articleGrid, 'fluid03', 'ad-container--between-sections');
      if (document.querySelector('.content-with-aside .ad-slot')) fillSidebar('display02');
      else insertBeforeFooter('multiplex', 'ad-container--bottom');
      return;
    }

    if (['about', 'faq'].includes(page)) {
      insertAfter(main.querySelector('.page-hero')?.nextElementSibling, 'display02', 'ad-container--after-content');
    }
  };

  const loadAdsense = () => {
    if (document.querySelector('script[data-adsense-loader]')) return Promise.resolve();
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.adsenseLoader = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    document.head.appendChild(script);
    return new Promise(resolve => {
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', resolve, { once: true });
    });
  };

  const requestAds = () => {
    document.querySelectorAll('.adsbygoogle:not([data-ad-requested])').forEach(ins => {
      ins.dataset.adRequested = 'true';
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {
        ins.dataset.adError = 'true';
      }
    });
  };

  const start = () => {
    placeAds();
    loadAdsense().then(requestAds);
  };

  const schedule = window.requestIdleCallback || ((callback) => setTimeout(callback, 1100));
  if (document.readyState === 'complete') schedule(start);
  else window.addEventListener('load', () => schedule(start), { once: true });
})();
