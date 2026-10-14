/* Nutrition planner: adapted from the supplied smart meal calculator.
   Deliberately isolated from the basic calorie calculator and existing site scripts. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('nutrition-form');
  if (!form) return;
  const presets = {
    balanced: {p:30,c:40,f:30},
    high_protein: {p:40,c:35,f:25},
    low_carb: {p:30,c:10,f:60}
  };
  const mealTemplates = {
    3:[
      {title:'الفطور',time:'08:00',part:.30,example:'بيض، شوفان أو خبز كامل الحبوب، خضروات'},
      {title:'الغداء',time:'14:30',part:.40,example:'دجاج أو سمك، أرز أو بطاطا، سلطة'},
      {title:'العشاء',time:'20:30',part:.30,example:'بقوليات أو تونة، خضروات ومكسرات'}
    ],
    4:[
      {title:'الفطور',time:'08:00',part:.25,example:'بيض، شوفان، فواكه أو مكسرات'},
      {title:'الغداء',time:'14:00',part:.35,example:'بروتين مشوي مع أرز أو كسكس وخضروات'},
      {title:'وجبة خفيفة',time:'17:30',part:.15,example:'زبادي مع فاكهة أو مكسرات'},
      {title:'العشاء',time:'20:30',part:.25,example:'سمك أو عدس مع خضروات وبطاطا'}
    ],
    5:[
      {title:'الفطور',time:'07:30',part:.25,example:'شوفان بالحليب والبيض'},
      {title:'وجبة ثانية',time:'11:30',part:.20,example:'خبز كامل الحبوب مع تونة أو حمص'},
      {title:'الغداء',time:'15:30',part:.30,example:'دجاج أو بقوليات، أرز وخضروات'},
      {title:'وجبة خفيفة',time:'18:30',part:.10,example:'فاكهة مع زبادي أو مكسرات'},
      {title:'العشاء',time:'21:00',part:.15,example:'خضروات مع مصدر للبروتين والدهون'}
    ]
  };
  const ids = ['calories','bmr','tdee','bmi','water','p-g','c-g','f-g','p-cal','c-cal','f-cal'];
  let current = null;
  const pretty = n => Math.round(n).toLocaleString('ar-DZ');
  const number = id => Number($(id).value);
  const write = (id,text) => {$(id).textContent=String(text);};
  const error = message => {
    $('np-error').hidden = !message;
    $('np-error').textContent=message||'';
  };
  // Distribute whole-number targets without losing a unit to rounding.
  function apportion(total, parts) {
    const raw=parts.map(part=>total*part);
    const units=raw.map(Math.floor);
    let remainder=total-units.reduce((a,b)=>a+b,0);
    const order=raw.map((x,i)=>({i,fract:x-units[i]})).sort((a,b)=>b.fract-a.fract);
    for(let j=0;j<remainder;j++) units[order[j%order.length].i]++;
    return units;
  }
  function clearResults(){
    current=null;
    ids.forEach(id=>write('np-'+id,'—'));
    write('np-goal-note','أدخل قيمًا صحيحة لعرض الخطة.');
    $('np-meal-list').replaceChildren();
    $('np-tips').replaceChildren();
    $('np-share').disabled=true;
    $('np-print').disabled=true;
  }
  function buildMeal(meal,index,totals){
    const article=document.createElement('article');
    article.className='nutrition-meal';
    const head=document.createElement('div');head.className='nutrition-meal-head';
    const text=document.createElement('div');
    const h=document.createElement('h3');h.className='nutrition-meal-title';h.textContent=meal.title;
    const subtitle=document.createElement('span');subtitle.className='nutrition-meal-percent';
    subtitle.textContent=meal.time+' · '+Math.round(meal.part*100)+'% من الاحتياج';
    text.append(h,subtitle);
    const calories=document.createElement('strong');calories.className='nutrition-meal-energy';calories.textContent=pretty(totals.k[index])+' سعرة';
    head.append(text,calories);
    const example=document.createElement('p');example.className='nutrition-meal-description';example.textContent='مثال: '+meal.example;
    const grams=document.createElement('div');grams.className='nutrition-meal-macros';
    [['بروتين',totals.p[index]],['كربوهيدرات',totals.c[index]],['دهون',totals.f[index]]].forEach(([name,value])=>{
      const tag=document.createElement('span');tag.textContent=name+': '+pretty(value)+' جم';grams.appendChild(tag);
    });
    article.append(head,example,grams);
    return article;
  }
  function renderMeals(calc){
    const template=mealTemplates[calc.count];
    const weights=template.map(meal=>meal.part);
    const totals={k:apportion(calc.target,weights),p:apportion(calc.grams.p,weights),c:apportion(calc.grams.c,weights),f:apportion(calc.grams.f,weights)};
    $('np-meal-list').replaceChildren(...template.map((meal,i)=>buildMeal(meal,i,totals)));
    write('np-meal-badge',calc.count+' وجبات');
  }
  function renderTips(calc){
    const tips=calc.goal==='cut'
      ? ['يمكن توزيع العجز الحراري تدريجيًا مع متابعة الشبع والطاقة ونشاطك.','حاول إدراج مصدر بروتين وخضروات ضمن الوجبات حسب تفضيلاتك.']
      : calc.goal==='bulk'
      ? ['زيادة السعرات ليست ضمانًا لبناء العضلات؛ تمارين المقاومة والنوم الجيد عنصران مهمان.','وزّع البروتين على وجباتك بما يلائم احتياجاتك وتفضيلاتك.']
      : ['للمحافظة على الوزن، راقب الاتجاه العام للتغيرات عبر أسابيع بدل التركيز على نتيجة يوم واحد.'];
    tips.push('كمية الألياف الإرشادية وفق الطاقة: نحو '+pretty(calc.fiber)+' جم يوميًا (14 جم لكل 1000 سعرة).');
    tips.push('ماء الشرب المعروض مؤشر أولي فقط؛ قد تختلف احتياجاتك وفق الحرارة والعرق والغذاء والحالة الصحية.');
    if(calc.proteinPerKg>2.5) tips.push('توزيع البروتين المختار مرتفع بالنسبة لوزنك؛ راجع مدى ملاءمته مع اختصاصي تغذية.');
    if(calc.minApplied) tips.push('تم تطبيق حد أدنى برمجي على السعرات المستهدفة؛ هذا ليس ضمانًا لسلامة الخطة الشخصية.');
    if(calc.bmi<18.5) tips.push('مؤشر BMI لديك أقل من 18.5؛ تجنب عجز السعرات دون استشارة مختص.');
    const elements=tips.map(t=>{const li=document.createElement('li');li.textContent=t;return li});
    $('np-tips').replaceChildren(...elements);
  }
  function calculate(){
    const gender=form.querySelector('input[name="np-gender"]:checked')?.value;
    const goal=document.querySelector('input[name="np-goal"]:checked')?.value;
    const age=number('np-age'),weight=number('np-weight'),height=number('np-height');
    const activity=number('np-activity'),intensity=number('np-intensity'),count=number('np-meals');
    const preset=$('np-preset').value;
    const pct=preset==='custom'
      ?{p:number('np-protein-pct'),c:number('np-carb-pct'),f:number('np-fat-pct')}
      :{...presets[preset]};
    $('np-intensity-wrap').hidden=goal==='maintain';
    $('np-custom').hidden=preset!=='custom';
    const total=pct.p+pct.c+pct.f;
    $('np-pct-total').textContent='المجموع: '+(Number.isFinite(total)?total:'—')+'%';
    $('np-pct-total').classList.toggle('invalid',total!==100);
    const validBase=age>=18&&age<=90&&Number.isInteger(age)&&weight>=35&&weight<=220&&height>=120&&height<=230&&[1.2,1.375,1.55,1.725,1.9].includes(activity);
    const validPcts=Object.values(pct).every(Number.isFinite)&&pct.p>=10&&pct.p<=70&&pct.c>=5&&pct.c<=75&&pct.f>=10&&pct.f<=75&&total===100;
    if(!validBase || !validPcts || ![3,4,5].includes(count) || !gender || !goal){
      error(!validBase?'تحقق من القياسات: العمر بين 18 و90 سنة، والوزن بين 35 و220 كجم، والطول بين 120 و230 سم.':'اضبط نسب الماكروز بين الحدود المحددة بحيث يصبح المجموع 100%.');
      clearResults();return;
    }
    error('');
    const bmr=Math.round(10*weight+6.25*height-5*age+(gender==='male'?5:-161));
    const tdee=Math.round(bmr*activity);
    let target=goal==='cut'?Math.round(tdee*(1-intensity)):goal==='bulk'?Math.round(tdee*(1+intensity)):tdee;
    const safeFloor=gender==='male'?1400:1200;
    const minApplied=goal==='cut'&&target<safeFloor;
    if(minApplied) target=safeFloor;
    const bmi=weight/((height/100)**2);
    const water=(weight*.035+(activity>=1.725?.5:activity>=1.55?.25:0)).toFixed(1);
    const macroCals=apportion(target,[pct.p/100,pct.c/100,pct.f/100]);
    const grams={p:Math.round(macroCals[0]/4),c:Math.round(macroCals[1]/4),f:Math.round(macroCals[2]/9)};
    const calc={gender,goal,age,weight,height,activity,count,pct,bmr,tdee,target,bmi,water,macroCals,grams,fiber:Math.round(target/1000*14),proteinPerKg:grams.p/weight,minApplied};
    current=calc;
    write('np-calories',pretty(target));
    write('np-bmr',pretty(bmr));
    write('np-tdee',pretty(tdee));
    write('np-bmi',bmi.toFixed(1));
    write('np-water',water+' لتر');
    const titles={cut:'خطة خسارة الوزن',maintain:'خطة الحفاظ على الوزن',bulk:'خطة زيادة الوزن'};
    write('np-goal-label',titles[goal]);
    write('np-goal-note',goal==='maintain'?'السعرات المقدرة للمحافظة على الوزن.': 'الفارق عن الثبات: '+pretty(Math.abs(target-tdee))+' سعرة/يوم ('+(goal==='cut'?'عجز':'فائض')+' تقريبي).');
    ['p','c','f'].forEach((k,i)=>{
      write('np-'+k+'-label',pct[k]+'%');
      write('np-'+k+'-g',pretty(grams[k]));
      write('np-'+k+'-cal',pretty(macroCals[i]));
    });
    $('np-donut').style.background='conic-gradient(#3b82f6 0% '+pct.p+'%, #d39a25 '+pct.p+'% '+(pct.p+pct.c)+'%, #e67272 '+(pct.p+pct.c)+'% 100%)';
    $('np-donut').setAttribute('aria-label','بروتين '+pct.p+' بالمئة، كربوهيدرات '+pct.c+' بالمئة، دهون '+pct.f+' بالمئة');
    write('np-protein-weight','البروتين: '+(calc.proteinPerKg).toFixed(1)+' جم لكل كجم من وزنك. النسب قابلة للتعديل وليست توصية شخصية.');
    renderMeals(calc);
    renderTips(calc);
    $('np-share').disabled=false;
    $('np-print').disabled=false;
  }
  function summary(c){
    const names={cut:'خسارة الوزن',maintain:'المحافظة على الوزن',bulk:'زيادة الوزن'};
    return ['ملخص حاسبة التغذية والوجبات الذكية','الهدف: '+names[c.goal],
      'السعرات المقدرة: '+pretty(c.target)+' سعرة / يوم',
      'BMR: '+pretty(c.bmr)+' | TDEE: '+pretty(c.tdee),
      'بروتين: '+pretty(c.grams.p)+' جم ('+c.pct.p+'%)',
      'كربوهيدرات: '+pretty(c.grams.c)+' جم ('+c.pct.c+'%)',
      'دهون: '+pretty(c.grams.f)+' جم ('+c.pct.f+'%)',
      'عدد الوجبات: '+c.count,
      'ماء: نحو '+c.water+' لتر (تقدير أولي)',
      'الأرقام للتثقيف فقط وليست بديلًا عن اختصاصي التغذية.',
      location.href.split('?')[0]].join('\n');
  }
  async function copyOrShare(){
    if(!current) return;
    const msg=summary(current);
    if(navigator.share){
      try {await navigator.share({title:'خطتي الغذائية',text:msg});return}
      catch(e){if(e.name==='AbortError')return}
    }
    try{
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(msg)}
      else{
        const input=document.createElement('textarea');input.value=msg;input.style.position='fixed';input.style.top='-1000px';document.body.appendChild(input);
        input.select();const copied=document.execCommand('copy');input.remove();if(!copied) throw Error('copy unsupported');
      }
      $('np-share').textContent='تم نسخ الخطة ✓';
      setTimeout(()=>$('np-share').textContent='نسخ / مشاركة الخطة',2500);
    }catch(e){error('تعذر النسخ تلقائيًا. جرّب الطباعة أو منح إذن النسخ للمتصفح.')}
  }
  form.addEventListener('input',calculate);
  form.addEventListener('change',calculate);
  ['np-intensity','np-preset','np-protein-pct','np-carb-pct','np-fat-pct','np-meals'].forEach(id=>{
    $(id).addEventListener('input',calculate);$(id).addEventListener('change',calculate);
  });
  document.querySelectorAll('input[name="np-goal"]').forEach(el=>el.addEventListener('change',calculate));
  form.addEventListener('submit',e=>e.preventDefault());
  $('np-reset').addEventListener('click',()=>{
    form.reset();
    document.querySelector('input[name="np-goal"][value="maintain"]').checked=true;
    $('np-intensity').value='0.15';$('np-preset').value='balanced';$('np-meals').value='4';
    $('np-protein-pct').value=30;$('np-carb-pct').value=40;$('np-fat-pct').value=30;
    calculate();
  });
  $('np-share').addEventListener('click',copyOrShare);
  $('np-print').addEventListener('click',()=>{if(current)window.print()});
  const dialog=$('np-food-dialog');
  $('np-food-open').addEventListener('click',()=>dialog.showModal());
  $('np-food-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  calculate();
})();
