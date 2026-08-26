/*
 * Central site tags loader.
 * Replace each xxxxxxxx value when the corresponding service identifier is available.
 */
(() => {
  'use strict';

  if (window.__calorieSiteTagsInitialized) return;
  window.__calorieSiteTagsInitialized = true;

  const PLACEHOLDER = 'xxxxxxxx';
  const CONFIG = Object.freeze({
    // Google Analytics 4: existing site measurement ID.
    ga4Id: 'G-V7E7218802',
    // ضع هنا معرف حاوية Google Tag Manager: GTM-xxxxxxxx
    gtmId: 'xxxxxxxx',
    // ضع هنا معرف عميل Google AdSense: ca-pub-xxxxxxxx
    adsenseClient: 'ca-pub-5656416032906373',
    // معرفات وحدات AdSense المرفقة، موزعة حسب نوع الموضع.
    adsenseSlots: Object.freeze({
      fluid01: '7867079394',
      display01: '3143411927',
      fluid02: '8546947691',
      display02: '1760836049',
      fluid03: '6152718642',
      display03: '5508509362',
      inArticle01: '6118497380',
      inArticle02: '7319898418',
      multiplex: '6528123169'
    }),
    // ضع هنا معرف Microsoft Clarity: xxxxxxxx
    clarityId: 'xxxxxxxx'
  });

  const loadedScripts = new Set();
  const isConfigured = value => Boolean(value && value !== PLACEHOLDER && !value.includes('xxxxxxxx'));

  const loadScriptOnce = (src, attributes = {}) => {
    if (!src || loadedScripts.has(src)) return Promise.resolve();
    const existing = [...document.scripts].find(script => script.src === src);
    if (existing) {
      loadedScripts.add(src);
      return Promise.resolve();
    }
    loadedScripts.add(src);
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'crossorigin') script.crossOrigin = value;
        else script.setAttribute(key, value);
      });
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', resolve, { once: true });
      document.head.appendChild(script);
    });
  };

  const loadGoogleTagManager = id => {
    if (!isConfigured(id)) return false;
    window.dataLayer = window.dataLayer || [];
    if (!window.dataLayer.some(item => item && item['gtm.start'])) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    }
    loadScriptOnce(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`);
    return true;
  };

  const loadGoogleAnalytics = id => {
    if (!isConfigured(id)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
    loadScriptOnce(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  };

  const loadClarity = id => {
    if (!isConfigured(id)) return;
    const src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
    if (window.clarity || document.querySelector('script[src*="clarity.ms/tag/"]')) return;
    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    loadScriptOnce(src);
  };

  const markAdDisabled = container => {
    if (!container) return;
    container.dataset.adDisabled = 'true';
    container.setAttribute('aria-hidden', 'true');
  };

  const loadAdSense = () => {
    const ads = [...document.querySelectorAll('ins.adsbygoogle')];
    if (!ads.length) return;
    if (!isConfigured(CONFIG.adsenseClient)) {
      ads.forEach(ad => markAdDisabled(ad.closest('[data-ad-container]')));
      return;
    }
    const readyAds = ads.filter(ad => {
      ad.dataset.adClient = CONFIG.adsenseClient;
      const configuredSlot = CONFIG.adsenseSlots[ad.dataset.adKey] || '';
      const slot = isConfigured(ad.dataset.adSlot) ? ad.dataset.adSlot : configuredSlot;
      if (isConfigured(slot)) ad.dataset.adSlot = slot;
      return isConfigured(slot);
    });
    if (!readyAds.length) {
      ads.forEach(ad => markAdDisabled(ad.closest('[data-ad-container]')));
      return;
    }
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CONFIG.adsenseClient)}`;
    loadScriptOnce(src, { crossorigin: 'anonymous' }).then(() => {
      readyAds.forEach(ad => {
        if (ad.dataset.adRequested === 'true') return;
        ad.dataset.adRequested = 'true';
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (_) {
          ad.dataset.adError = 'true';
        }
      });
    });
  };

  const scheduleAds = () => {
    const run = () => loadAdSense();
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1800 });
    else window.setTimeout(run, 700);
  };

  const start = () => {
    const gtmLoaded = loadGoogleTagManager(CONFIG.gtmId);
    if (!gtmLoaded) loadGoogleAnalytics(CONFIG.ga4Id);
    loadClarity(CONFIG.clarityId);
    scheduleAds();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
