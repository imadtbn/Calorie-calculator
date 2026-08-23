(() => {
  'use strict';

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyca6dvheW6fIaCMUoE3n_qpPrQExHOpbrz1teWWfPjHwE_1a78Iu0Cda3qNsy6eVpM4A/exec';
  const MAX_COMMENT_LENGTH = 1200;

  const escapeText = (value) => String(value ?? '').replace(/[<>]/g, '');
  const articleSlug = () => window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const articleTitle = () => document.querySelector('.article-hero-copy h1')?.textContent?.trim() || document.title;

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function renderComments(list, target) {
    target.replaceChildren();
    if (!Array.isArray(list) || list.length === 0) {
      target.append(makeElement('p', 'comments-empty', 'لا توجد تعليقات معتمدة بعد. كن أول من يشارك رأيه باحترام.'));
      return;
    }

    list.forEach((item) => {
      const card = makeElement('article', 'comment-card');
      const header = makeElement('div', 'comment-card-head');
      header.append(makeElement('strong', 'comment-author', escapeText(item.name || 'زائر')));
      if (item.created_at) {
        const date = new Date(item.created_at);
        if (!Number.isNaN(date.getTime())) header.append(makeElement('time', 'comment-date', new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(date)));
      }
      card.append(header, makeElement('p', 'comment-text', escapeText(item.comment || '')));
      target.append(card);
    });
  }

  function loadApprovedComments(slug, target) {
    const callbackName = `__calorieComments_${Date.now()}`;
    const script = document.createElement('script');
    const query = new URLSearchParams({ article: slug, callback: callbackName, _: String(Date.now()) });
    let finished = false;

    const finish = (comments) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
      renderComments(comments, target);
    };

    window[callbackName] = (payload) => finish(payload?.ok ? payload.comments : []);
    script.src = `${ENDPOINT}?${query.toString()}`;
    script.async = true;
    script.onerror = () => finish([]);
    document.head.append(script);
    const timeout = window.setTimeout(() => finish([]), 9000);
  }

  function submitComment(form, status, commentsTarget) {
    const submit = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const comment = String(formData.get('comment') || '').trim();
    if (!comment || comment.length > MAX_COMMENT_LENGTH) {
      status.textContent = `اكتب تعليقًا بين 1 و${MAX_COMMENT_LENGTH} حرف.`;
      status.className = 'comment-status error';
      return;
    }

    submit.disabled = true;
    status.textContent = 'جارٍ إرسال تعليقك للمراجعة…';
    status.className = 'comment-status';
    const payload = new URLSearchParams({
      article_slug: articleSlug(),
      article_title: articleTitle(),
      name: String(formData.get('name') || '').trim().slice(0, 80),
      email: String(formData.get('email') || '').trim().slice(0, 160),
      comment: comment.slice(0, MAX_COMMENT_LENGTH)
    });

    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload,
      keepalive: true
    }).then(() => {
      form.reset();
      status.textContent = 'تم استلام تعليقك. سيظهر بعد المراجعة والموافقة.';
      status.className = 'comment-status success';
    }).catch(() => {
      status.textContent = 'تعذر إرسال التعليق حاليًا. حاول مرة أخرى لاحقًا.';
      status.className = 'comment-status error';
    }).finally(() => {
      submit.disabled = false;
      window.setTimeout(() => loadApprovedComments(articleSlug(), commentsTarget), 700);
    });
  }

  function mountComments() {
    const isPublishedArticle = document.body.dataset.page === 'articles' && /\/articles\/[^/]+\.html$/.test(window.location.pathname);
    if (!isPublishedArticle || document.querySelector('.comments-section')) return;

    const section = makeElement('section', 'section comments-section');
    section.id = 'comments';
    const container = makeElement('div', 'container comments-container');
    const heading = makeElement('div', 'section-heading comments-heading');
    heading.append(makeElement('span', 'eyebrow', 'مساحة التفاعل'), makeElement('h2', 'comments-title', 'ما رأيك في هذا المقال؟'), makeElement('p', '', 'شارك تجربة أو سؤالًا مرتبطًا بالمقال. تُراجع التعليقات قبل ظهورها للزوار.'));

    const layout = makeElement('div', 'comments-layout');
    const formCard = makeElement('div', 'comment-form-card');
    const form = document.createElement('form');
    form.className = 'comment-form';
    form.noValidate = true;
    form.innerHTML = `<label for="comment-name">الاسم <span>(اختياري)</span></label><input id="comment-name" name="name" type="text" maxlength="80" autocomplete="name" placeholder="كيف نُناديك؟"><label for="comment-email">البريد الإلكتروني <span>(اختياري ولا يظهر للعامة)</span></label><input id="comment-email" name="email" type="email" maxlength="160" autocomplete="email" placeholder="name@example.com"><label for="comment-body">تعليقك <span aria-hidden="true">*</span></label><textarea id="comment-body" name="comment" rows="5" maxlength="${MAX_COMMENT_LENGTH}" required placeholder="اكتب تعليقًا مفيدًا ومحترمًا…"></textarea><div class="comment-form-footer"><small>لن يظهر التعليق إلا بعد المراجعة.</small><button class="btn" type="submit">إرسال التعليق</button></div><p class="comment-status" role="status" aria-live="polite"></p>`;
    const status = form.querySelector('.comment-status');
    form.addEventListener('submit', (event) => { event.preventDefault(); submitComment(form, status, list); });
    formCard.append(form);

    const listCard = makeElement('div', 'comments-list-card');
    listCard.append(makeElement('h3', '', 'تعليقات الزوار'), makeElement('p', 'comments-note', 'تظهر هنا التعليقات التي تمت مراجعتها والموافقة عليها.'));
    const list = makeElement('div', 'comments-list');
    list.append(makeElement('p', 'comments-loading', 'جارٍ تحميل التعليقات…'));
    listCard.append(list);
    layout.append(formCard, listCard);
    container.append(heading, layout);
    section.append(container);
    document.querySelector('footer.site-footer')?.before(section);
    loadApprovedComments(articleSlug(), list);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountComments, { once: true });
  else mountComments();
})();

// لا تُخزّن بيانات التعليق محليًا؛ تُرسل فقط إلى Web App بعد ضغط المستخدم على الإرسال.
