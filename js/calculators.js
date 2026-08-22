(() => {
  const { formatNumber, getNumber, showError, clearError, validRange, shareResult } = window.CalorieApp;

  function initCalorie() {
    const form = document.getElementById('calorie-form'); if (!form) return;
    const result = document.getElementById('calorie-result'); const empty = document.getElementById('calorie-empty');
    form.addEventListener('submit', event => {
      event.preventDefault(); clearError('calorie-error');
      const age = getNumber('age'), weight = getNumber('weight'), height = getNumber('height');
      const gender = form.querySelector('input[name="gender"]:checked')?.value || 'male';
      const activity = Number(document.getElementById('activity')?.value || 1.2);
      const goal = document.getElementById('goal')?.value || 'maintain';
      if (!validRange(age, 13, 100) || !validRange(weight, 25, 350) || !validRange(height, 100, 240)) { showError('calorie-error', 'تحقق من القيم: العمر بين 13 و100 سنة، والوزن والطول ضمن نطاق منطقي.'); return; }
      const bmr = gender === 'female' ? (10 * weight + 6.25 * height - 5 * age - 161) : (10 * weight + 6.25 * height - 5 * age + 5);
      const tdee = bmr * activity;
      const multiplier = goal === 'lose' ? .8 : goal === 'gain' ? 1.12 : 1;
      const target = Math.max(1200, tdee * multiplier);
      const low = Math.max(1100, target - 150), high = target + 150;
      document.getElementById('calorie-target').textContent = formatNumber(target);
      document.getElementById('calorie-bmr').textContent = formatNumber(bmr);
      document.getElementById('calorie-tdee').textContent = formatNumber(tdee);
      document.getElementById('calorie-range').textContent = `${formatNumber(low)} – ${formatNumber(high)}`;
      document.getElementById('calorie-explanation').textContent = goal === 'lose' ? 'هذا التقدير يتضمن عجزًا معتدلًا قد يساعد على خسارة الوزن تدريجيًا.' : goal === 'gain' ? 'هذا التقدير يتضمن فائضًا بسيطًا قد يساعد على زيادة الوزن تدريجيًا.' : 'هذا التقدير قريب من احتياجك للمحافظة على وزنك الحالي.';
      empty.hidden = true; result.classList.add('show'); result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    document.getElementById('share-calorie')?.addEventListener('click', () => shareResult(`احتياجي اليومي التقديري: ${document.getElementById('calorie-target').textContent} سعرة حرارية.`));
  }

  function initBmi() {
    const form = document.getElementById('bmi-form'); if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault(); clearError('bmi-error');
      const weight = getNumber('bmi-weight'), height = getNumber('bmi-height');
      if (!validRange(weight, 25, 350) || !validRange(height, 100, 240)) { showError('bmi-error', 'أدخل وزنًا بين 25 و350 كجم وطولًا بين 100 و240 سم.'); return; }
      const bmi = weight / Math.pow(height / 100, 2); let category = 'ضمن النطاق الصحي'; let color = 'var(--teal)';
      if (bmi < 18.5) { category = 'أقل من النطاق الصحي'; color = 'var(--yellow)'; } else if (bmi >= 25 && bmi < 30) { category = 'أعلى من النطاق الصحي'; color = 'var(--coral)'; } else if (bmi >= 30) { category = 'مرتفع'; color = 'var(--coral)'; }
      document.getElementById('bmi-value').textContent = bmi.toFixed(1); document.getElementById('bmi-category').textContent = category; document.getElementById('bmi-value').style.color = color;
      document.getElementById('bmi-result').hidden = false; document.getElementById('bmi-empty').hidden = true; document.getElementById('bmi-result').classList.add('show');
    });
    document.getElementById('share-bmi')?.addEventListener('click', () => shareResult(`مؤشر كتلة الجسم التقديري لدي: ${document.getElementById('bmi-value').textContent}.`));
  }

  function initMacros() {
    const form = document.getElementById('macros-form'); if (!form) return;
    const protein = document.getElementById('protein-pct'), carbs = document.getElementById('carbs-pct'), fats = document.getElementById('fats-pct');
    function sync(source) { const values = [protein, carbs, fats]; const remainder = 100 - Number(source.value); const others = values.filter(x => x !== source); const each = Math.max(0, remainder / 2); others.forEach(x => x.value = Math.round(each)); }
    [protein, carbs, fats].forEach(input => input?.addEventListener('change', () => sync(input)));
    form.addEventListener('submit', event => {
      event.preventDefault(); clearError('macros-error'); const calories = getNumber('macro-calories'); const total = Number(protein.value) + Number(carbs.value) + Number(fats.value);
      if (!validRange(calories, 1000, 10000) || total !== 100) { showError('macros-error', 'أدخل سعرات بين 1,000 و10,000، وتأكد أن مجموع النسب يساوي 100%.'); return; }
      const p = calories * Number(protein.value) / 100 / 4, c = calories * Number(carbs.value) / 100 / 4, f = calories * Number(fats.value) / 100 / 9;
      document.getElementById('macro-protein').textContent = `${formatNumber(p)} g`; document.getElementById('macro-carbs').textContent = `${formatNumber(c)} g`; document.getElementById('macro-fats').textContent = `${formatNumber(f)} g`;
      document.getElementById('macros-result').hidden = false; document.getElementById('macros-empty').hidden = true; document.getElementById('macros-result').classList.add('show');
    });
    document.getElementById('share-macros')?.addEventListener('click', () => shareResult(`توزيع الماكروز: بروتين ${document.getElementById('macro-protein').textContent}، كربوهيدرات ${document.getElementById('macro-carbs').textContent}، دهون ${document.getElementById('macro-fats').textContent}.`));
  }
  function initWater() {
    const form = document.getElementById('water-form'); if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault(); clearError('water-error');
      const weight = getNumber('water-weight'); const activity = Number(document.getElementById('water-activity')?.value || 1);
      if (!validRange(weight, 25, 350)) { showError('water-error', 'أدخل وزنًا بين 25 و350 كجم للحصول على تقدير مناسب.'); return; }
      const liters = (weight * 30 * activity) / 1000;
      document.getElementById('water-liters').textContent = liters.toFixed(1);
      document.getElementById('water-cups').textContent = formatNumber(liters * 4.1667);
      document.getElementById('water-result').hidden = false; document.getElementById('water-empty').hidden = true; document.getElementById('water-result').classList.add('show'); document.getElementById('water-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function initIdealWeight() {
    const form = document.getElementById('ideal-form'); if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault(); clearError('ideal-error');
      const height = getNumber('ideal-height'); const gender = form.querySelector('input[name="ideal-gender"]:checked')?.value || 'male';
      if (!validRange(height, 100, 240)) { showError('ideal-error', 'أدخل طولًا بين 100 و240 سم.'); return; }
      const inches = Math.max(0, height / 2.54 - 60); const base = gender === 'female' ? 45.5 : 50; const estimate = base + (2.3 * inches);
      document.getElementById('ideal-value').textContent = formatNumber(estimate, 1);
      document.getElementById('ideal-range').textContent = `${formatNumber(estimate - 5, 1)} – ${formatNumber(estimate + 5, 1)} كجم`;
      document.getElementById('ideal-result').hidden = false; document.getElementById('ideal-empty').hidden = true; document.getElementById('ideal-result').classList.add('show');
    });
  }

function parseDateInput(id) {
  const value = document.getElementById(id)?.value || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
function addDays(date, days) { const next = new Date(date); next.setDate(next.getDate() + days); return next; }
function formatArabicDate(date) { return new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric' }).format(date); }
function initDueDate() {
  const form = document.getElementById('pregnancy-due-date-form'); if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault(); clearError('due-error'); const lmp = parseDateInput('due-lmp');
    if (!lmp || lmp > new Date()) { showError('due-error', 'أدخلي تاريخًا صحيحًا لا يتجاوز تاريخ اليوم.'); return; }
    document.getElementById('due-date').textContent = formatArabicDate(addDays(lmp, 280));
    document.getElementById('due-empty').hidden = true; document.getElementById('due-result').hidden = false; document.getElementById('due-result').classList.add('show');
  });
}
function initFertileWindow() {
  const form = document.getElementById('fertile-window-form'); if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault(); clearError('fertile-error'); const lmp = parseDateInput('fertile-lmp'); const cycle = getNumber('fertile-cycle');
    if (!lmp || lmp > new Date() || !validRange(cycle, 21, 40)) { showError('fertile-error', 'أدخلي تاريخًا صحيحًا وطول دورة بين 21 و40 يومًا.'); return; }
    const ovulation = addDays(lmp, cycle - 14); const start = addDays(ovulation, -5); const end = addDays(ovulation, 1);
    document.getElementById('fertile-ovulation').textContent = formatArabicDate(ovulation);
    document.getElementById('fertile-window').textContent = `${formatArabicDate(start)} — ${formatArabicDate(end)}`;
    document.getElementById('fertile-empty').hidden = true; document.getElementById('fertile-result').hidden = false; document.getElementById('fertile-result').classList.add('show');
  });
}
function initPrediabetes() {
  const form = document.getElementById('prediabetes-risk-form'); if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault(); clearError('pred-error'); const age = getNumber('pred-age'); const weight = getNumber('pred-weight'); const height = getNumber('pred-height');
    if (!validRange(age, 18, 120) || !validRange(weight, 25, 350) || !validRange(height, 100, 240)) { showError('pred-error', 'تحقق من العمر والطول والوزن ضمن نطاق منطقي للبالغين.'); return; }
    const gender = form.querySelector('input[name="pred-gender"]:checked')?.value || 'female'; const bmi = weight / Math.pow(height / 100, 2); let score = age >= 60 ? 3 : age >= 50 ? 2 : age >= 40 ? 1 : 0;
    if (gender === 'male') score += 1; if (gender === 'female' && form.querySelector('input[name="pred-gest"]:checked')?.value === 'yes') score += 1;
    if (form.querySelector('input[name="pred-family"]:checked')?.value === 'yes') score += 1; if (form.querySelector('input[name="pred-bp"]:checked')?.value === 'yes') score += 1; if (form.querySelector('input[name="pred-active"]:checked')?.value === 'no') score += 1;
    score += bmi >= 40 ? 3 : bmi >= 30 ? 2 : bmi >= 25 ? 1 : 0;
    const high = score >= 5; document.getElementById('pred-score').textContent = formatNumber(score); document.getElementById('pred-category').textContent = high ? 'خطر أعلى' : 'خطر أقل وفق الاستبيان'; document.getElementById('pred-note').textContent = high ? 'تحدث مع الطبيب عن فحص ما قبل السكري أو السكري، ولا تعتبر النتيجة تشخيصًا.' : 'استمر في العادات الصحية، واطلب المشورة الطبية عند وجود أعراض أو عوامل خطر.';
    document.getElementById('pred-empty').hidden = true; document.getElementById('pred-result').hidden = false; document.getElementById('pred-result').classList.add('show');
  });
  document.getElementById('share-pred')?.addEventListener('click', () => shareResult(`نتيجتي التقديرية في اختبار خطر ما قبل السكري: ${document.getElementById('pred-score').textContent} من 10 نقاط — ${document.getElementById('pred-category').textContent}.`));
}


function normalCdf(z) {
  const sign = z < 0 ? -1 : 1; const x = Math.abs(z) / Math.sqrt(2); const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * erf);
}
function initChildBmi() {
  const form = document.getElementById('child-bmi-form'); if (!form) return;
  let dataset = null;
  fetch(`${document.body.dataset.root || './'}data/cdc-bmi-for-age.json`).then(response => { if (!response.ok) throw new Error('data'); return response.json(); }).then(data => { dataset = data; }).catch(() => { showError('child-bmi-error', 'تعذر تحميل جداول النمو حاليًا. حاول مرة أخرى لاحقًا.'); });
  form.addEventListener('submit', event => {
    event.preventDefault(); clearError('child-bmi-error');
    if (!dataset) { showError('child-bmi-error', 'انتظر لحظة حتى تكتمل جداول النمو ثم حاول مرة أخرى.'); return; }
    const years = getNumber('child-age-years'), extraMonths = getNumber('child-age-months') || 0, weight = getNumber('child-weight'), height = getNumber('child-height');
    if (!validRange(years, 2, 19) || !validRange(extraMonths, 0, 11) || !validRange(weight, 5, 250) || !validRange(height, 70, 230) || (years === 19 && extraMonths > 11)) { showError('child-bmi-error', 'تحقق من العمر بين سنتين و19 سنة، والأشهر بين 0 و11، والطول والوزن ضمن نطاق منطقي.'); return; }
    const ageMonths = years * 12 + extraMonths; const gender = form.querySelector('input[name="child-gender"]:checked')?.value || 'male'; const bmi = weight / Math.pow(height / 100, 2); const rows = dataset[gender];
    const row = rows.reduce((best, item) => Math.abs(item.ageMonths - ageMonths) < Math.abs(best.ageMonths - ageMonths) ? item : best, rows[0]);
    const z = row.L === 0 ? Math.log(bmi / row.M) / row.S : (Math.pow(bmi / row.M, row.L) - 1) / (row.L * row.S); const percentile = Math.max(.1, Math.min(99.9, normalCdf(z) * 100));
    const category = percentile < 5 ? 'أقل من الوزن المتوقع' : percentile < 85 ? 'نطاق الوزن الصحي' : percentile < 95 ? 'وزن زائد' : 'سمنة';
    document.getElementById('child-bmi-value').textContent = bmi.toFixed(1); document.getElementById('child-bmi-percentile').textContent = `${percentile.toFixed(1)}%`; document.getElementById('child-bmi-category').textContent = category; document.getElementById('child-bmi-note').textContent = `تمت مقارنة القياس بجدول CDC الأقرب لعمر ${years} سنة و${extraMonths} شهرًا. النتيجة فحص أولي وليست تشخيصًا.`;
    document.getElementById('child-bmi-empty').hidden = true; document.getElementById('child-bmi-result').hidden = false; document.getElementById('child-bmi-result').classList.add('show');
  });
}
function initPregnancyCalories() {
  const form = document.getElementById('pregnancy-calorie-form'); if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault(); clearError('pregnancy-calorie-error'); const base = getNumber('pregnancy-base-calories'); const trimester = document.getElementById('pregnancy-trimester')?.value || '1';
    if (!validRange(base, 1200, 5000)) { showError('pregnancy-calorie-error', 'أدخل سعرات خط أساس بين 1,200 و5,000 سعرة يوميًا.'); return; }
    const extra = trimester === '2' ? 340 : trimester === '3' ? 450 : 0; const label = trimester === '2' ? 'الثاني' : trimester === '3' ? 'الثالث' : 'الأول';
    document.getElementById('pregnancy-calorie-total').textContent = formatNumber(base + extra); document.getElementById('pregnancy-calorie-extra').textContent = `+${formatNumber(extra)}`; document.getElementById('pregnancy-calorie-trimester').textContent = `الثلث ${label}`;
    document.getElementById('pregnancy-calorie-empty').hidden = true; document.getElementById('pregnancy-calorie-result').hidden = false; document.getElementById('pregnancy-calorie-result').classList.add('show');
  });
}


function initInfantGrowth() {
  const form = document.getElementById('infant-growth-form'); if (!form) return;
  let dataset = null;
  fetch(`${document.body.dataset.root || './'}data/who-infant-growth.json`).then(response => { if (!response.ok) throw new Error('data'); return response.json(); }).then(data => { dataset = data; }).catch(() => showError('infant-growth-error', 'تعذر تحميل جداول WHO حاليًا. حاول مرة أخرى لاحقًا.'));
  form.addEventListener('submit', event => {
    event.preventDefault(); clearError('infant-growth-error');
    if (!dataset) { showError('infant-growth-error', 'انتظر لحظة حتى تكتمل جداول WHO ثم حاول مرة أخرى.'); return; }
    const month = getNumber('infant-age-months'), length = getNumber('infant-length'), weight = getNumber('infant-weight');
    if (!validRange(month, 0, 24) || !Number.isInteger(month) || !validRange(length, 35, 110) || (Number.isFinite(weight) && weight !== 0 && !validRange(weight, 1, 25))) { showError('infant-growth-error', 'تحقق من العمر بين 0 و24 شهرًا، والطول بين 35 و110 سم، والوزن الاختياري ضمن نطاق منطقي.'); return; }
    const gender = form.querySelector('input[name="infant-gender"]:checked')?.value || 'male'; const row = dataset.length[gender].find(item => item.month === month); const weightRow = dataset.weight[gender].find(item => item.month === month);
    const zScore = (value, item) => item.L === 0 ? Math.log(value / item.M) / item.S : (Math.pow(value / item.M, item.L) - 1) / (item.L * item.S); const percentile = z => Math.max(.1, Math.min(99.9, normalCdf(z) * 100)); const lengthZ = zScore(length, row); const lengthP = percentile(lengthZ);
    document.getElementById('infant-length-z').textContent = `Z ${lengthZ.toFixed(2)}`; document.getElementById('infant-length-percentile').textContent = `المئين ${lengthP.toFixed(1)}%`;
    if (Number.isFinite(weight) && weight > 0) { const weightZ = zScore(weight, weightRow); document.getElementById('infant-weight-z').textContent = `Z ${weightZ.toFixed(2)}`; document.getElementById('infant-weight-percentile').textContent = `المئين ${percentile(weightZ).toFixed(1)}%`; } else { document.getElementById('infant-weight-z').textContent = 'غير مدخل'; document.getElementById('infant-weight-percentile').textContent = 'الوزن اختياري'; }
    document.getElementById('infant-growth-note').textContent = `تمت المقارنة بجدول WHO للشهر ${month}. درجة Z والمئين وصفان إحصائيان للتثقيف ولا يشخّصان حالة الرضيع.`; document.getElementById('infant-growth-empty').hidden = true; document.getElementById('infant-growth-result').hidden = false; document.getElementById('infant-growth-result').classList.add('show');
  });
}

  initCalorie(); initBmi(); initMacros(); initWater(); initIdealWeight(); initDueDate(); initFertileWindow(); initPrediabetes(); initChildBmi(); initPregnancyCalories(); initInfantGrowth();
})();
