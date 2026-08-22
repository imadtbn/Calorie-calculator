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

  initCalorie(); initBmi(); initMacros(); initWater(); initIdealWeight(); initDueDate(); initFertileWindow(); initPrediabetes();
})();
