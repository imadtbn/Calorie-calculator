(() => {
  const fallbackFoods = [
    { name: 'صدر دجاج مشوي', category: 'بروتين', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'أرز أبيض مطبوخ', category: 'حبوب', calories: 130, protein: 2.7, carbs: 28, fat: .3 },
    { name: 'بيضة مسلوقة', category: 'بروتين', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: 'شوفان جاف', category: 'حبوب', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
    { name: 'موز', category: 'فواكه', calories: 89, protein: 1.1, carbs: 22.8, fat: .3 },
    { name: 'تفاحة', category: 'فواكه', calories: 52, protein: .3, carbs: 13.8, fat: .2 },
    { name: 'عدس مطبوخ', category: 'بقوليات', calories: 116, protein: 9, carbs: 20, fat: .4 },
    { name: 'زبادي يوناني', category: 'ألبان', calories: 59, protein: 10, carbs: 3.6, fat: .4 },
    { name: 'لوز', category: 'مكسرات', calories: 579, protein: 21, carbs: 22, fat: 49 },
    { name: 'بطاطا حلوة مشوية', category: 'خضروات', calories: 90, protein: 2, carbs: 20.7, fat: .2 },
    { name: 'أفوكادو', category: 'فواكه', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
    { name: 'تونة بالماء', category: 'بروتين', calories: 116, protein: 26, carbs: 0, fat: .8 }
  ];
  const body = document.getElementById('food-table-body'); if (!body) return;
  const search = document.getElementById('food-search'), filter = document.getElementById('food-category');
  let foods = fallbackFoods;
  function render() {
    const term = (search.value || '').trim().toLowerCase(), category = filter.value;
    const rows = foods.filter(food => (!term || food.name.toLowerCase().includes(term)) && (!category || food.category === category));
    body.innerHTML = rows.length ? rows.map(food => `<tr><td><strong>${food.name}</strong></td><td>${food.category}</td><td>${food.calories}</td><td>${food.protein} g</td><td>${food.carbs} g</td><td>${food.fat} g</td></tr>`).join('') : '<tr><td colspan="6" class="empty-state">لم نعثر على طعام مطابق للبحث.</td></tr>';
    document.getElementById('food-count').textContent = `${rows.length} من ${foods.length} أطعمة معروضة`;
  }
  search.addEventListener('input', render); filter.addEventListener('change', render); render();
  fetch('data/foods.json').then(response => response.ok ? response.json() : Promise.reject()).then(data => { if (Array.isArray(data) && data.length) { foods = data; render(); } }).catch(() => {});
})();
