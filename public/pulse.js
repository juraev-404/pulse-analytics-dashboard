(() => {
  const data = [
    ['Анна Петрова','#PL-1048','30 окт','Оплачен',8400],['Михаил Волков','#PL-1047','29 окт','Оплачен',12900],['Екатерина Орлова','#PL-1046','28 окт','В обработке',5600],['Дмитрий Соколов','#PL-1045','27 окт','Оплачен',3200],['Мария Смирнова','#PL-1044','26 окт','Возврат',4800],['Иван Морозов','#PL-1043','25 окт','Оплачен',6750],['Алина Фролова','#PL-1042','24 окт','Оплачен',9200],['Артём Лебедев','#PL-1041','23 окт','В обработке',3900]
  ];
  const $ = (q) => document.querySelector(q), $$ = q => [...document.querySelectorAll(q)];
  const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  function rows(items) { return items.map(([name,id,date,status,amount])=>`<tr><td><span class="person">${name[0]}</span>${name}</td><td>${id}</td><td>${date}</td><td><span class="badge ${status==='В обработке'?'pending':status==='Возврат'?'refund':''}">${status}</span></td><td><b>${money(amount)}</b></td></tr>`).join(''); }
  function renderTable(){ const term=$('[data-search]').value.toLowerCase().trim(), status=$('[data-status]').value; const filtered=data.filter(x=>(x[0]+' '+x[1]).toLowerCase().includes(term)&&(status==='all'||x[3]===status)); $('[data-table="all"]').innerHTML=rows(filtered); $('[data-empty]').hidden=filtered.length>0; }
  $('[data-table="recent"]').innerHTML=rows(data.slice(0,4)); renderTable();
  $('[data-search]').addEventListener('input',renderTable); $('[data-status]').addEventListener('change',renderTable);
  const views={overview:['Обзор','Хорошего дня, Алексей 👋','Вот что происходит с вашим бизнесом.'],transactions:['Транзакции','Все транзакции','История ваших демонстрационных операций.'],audience:['Аудитория','Ваша аудитория','Кто ваши посетители и откуда они приходят.']};
  $$('[data-view]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.view; $$('[data-pane]').forEach(p=>p.hidden=p.dataset.pane!==id); $$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id)); $('[data-title]').textContent=views[id][0]; $('[data-heading]').textContent=views[id][1]; $('[data-subheading]').textContent=views[id][2]; window.scrollTo({top:0,behavior:'smooth'});}));
  const ranges={
    '7':{revenue:'518 200 ₽',orders:'267',average:'1 941 ₽',conversion:'3,44%',visitors:'2 930',new:'191',points:[190,175,184,140,128,148,80,103,69,95,55,42,22],labels:['Пн','Вт','Ср','Чт','Пт','Сб','Вс']},
    '30':{revenue:'2 480 600 ₽',orders:'1 284',average:'1 932 ₽',conversion:'3,68%',visitors:'12 840',new:'842',points:[195,171,179,155,165,135,149,102,120,95,112,68,78,45,65,29,42,19],labels:['1 окт','6 окт','11 окт','16 окт','21 окт','26 окт','30 окт']},
    '90':{revenue:'7 185 900 ₽',orders:'3 692',average:'1 946 ₽',conversion:'3,52%',visitors:'38 190',new:'2 304',points:[203,187,190,175,163,173,140,151,125,138,105,112,85,92,66,70,39,22],labels:['Авг','', 'Сен', '', 'Окт', '', 'Сейчас']}
  };
  function update(){const r=ranges[$('[data-range]').value]; for(const key of ['revenue','orders','average','conversion','visitors','new']) $('[data-'+key+']').textContent=r[key]; const path=r.points.map((y,i)=>`${i?'L':'M'} ${(i*700/(r.points.length-1)).toFixed(1)} ${y}`).join(' '); $('[data-chart-line]').setAttribute('d',path); $('[data-chart-fill]').setAttribute('d',path+' L 700 240 L 0 240 Z'); $('[data-chart-labels]').innerHTML=r.labels.map(x=>`<span>${x}</span>`).join('');}
  $('[data-range]').addEventListener('change',update);update();
  $('[data-export]').addEventListener('click',()=>{const header=['Клиент','Номер','Дата','Статус','Сумма'];const csv='\ufeff'+[header,...data].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='pulse-demo-transactions.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
