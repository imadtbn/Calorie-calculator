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
      document.getElementById('water-result').hidden = false; document.getElementById('water-empty').hidden = true; document.getElementById('water-result').classList.add('show');
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
  initCalorie(); initBmi(); initMacros(); initWater(); initIdealWeight();
})();
