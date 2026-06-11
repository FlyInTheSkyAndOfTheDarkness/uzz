/**
 * Shaqyru — "Ерке сылқым" · Қыз ұзату
 * Audio player · Countdown · RSVP · Scroll animations
 */
(function(){
  'use strict';

  /* ═══════════ НАСТРОЙКА ═══════════ */
  // Сюда вставить URL веб-приложения Google Apps Script (см. инструкцию).
  // Пока пусто — форма просто показывает «Рақмет!» без отправки.
  const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyuchYMxUxQ3MTkLAOt2E2L0fvAGE72cFZuP5UANr0FIdfWU0_97B9Ez89wK00LhZE/exec';

  /* ═══════════ AUDIO PLAYER ═══════════ */
  const audioBtn = document.getElementById('audio-btn');
  const audio = document.getElementById('bg-audio');
  if(audioBtn && audio){
    let playing = false;
    audioBtn.addEventListener('click',()=>{
      if(playing){
        audio.pause();
        audioBtn.classList.remove('playing');
      } else {
        audio.play().catch(()=>{});
        audioBtn.classList.add('playing');
      }
      playing = !playing;
    });
  }

  /* ═══════════ COUNTDOWN ═══════════ */
  const cd={
    d:document.getElementById('cd-days'),
    h:document.getElementById('cd-hours'),
    m:document.getElementById('cd-minutes'),
    s:document.getElementById('cd-seconds')
  };
  if(cd.d){
    // Countdown to 17 August 2026, 19:00 Atyrau/Almaty (UTC+5)
    const target=new Date('2026-08-17T19:00:00+05:00');
    function tick(){
      const diff=target-new Date();
      if(diff<=0){cd.d.textContent=cd.h.textContent=cd.m.textContent=cd.s.textContent='0';return}
      cd.d.textContent=Math.floor(diff/86400000);
      cd.h.textContent=Math.floor((diff%86400000)/3600000);
      cd.m.textContent=Math.floor((diff%3600000)/60000);
      cd.s.textContent=Math.floor((diff%60000)/1000);
    }
    tick();setInterval(tick,1000);
  }

  /* ═══════════ INTERSECTION OBSERVER ═══════════ */
  const reveals=document.querySelectorAll('.reveal');
  function revealAll(){reveals.forEach(el=>el.classList.add('visible'));}
  if('IntersectionObserver' in window){
    const obs=new IntersectionObserver((entries,o)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target);}
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:0.05});
    reveals.forEach(el=>obs.observe(el));
    // Страховка: если что-то осталось скрытым после загрузки — показать
    window.addEventListener('load',()=>setTimeout(revealAll,1200));
  } else {
    revealAll();
  }

  /* ═══════════ RSVP FORM ═══════════ */
  const form=document.getElementById('rsvp-form');
  const fb=document.getElementById('rsvp-feedback');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name=document.getElementById('rsvp-name').value.trim();
      if(!name){showFb('Есіміңізді жазыңыз','error');return}

      const att=document.querySelector('input[name="attending"]:checked');
      const data=new FormData();
      data.append('name',name);
      data.append('attending', att && att.value==='no' ? 'Келмеймін' : 'Келемін');
      data.append('guests', document.getElementById('rsvp-guests').value);

      const btn=form.querySelector('.btn-submit');
      if(!RSVP_ENDPOINT){
        showFb('Рақмет! Сіздің жауабыңыз қабылданды.','success');
        fb.scrollIntoView({behavior:'smooth',block:'center'});
        return;
      }
      if(btn){btn.disabled=true;btn.textContent='ЖІБЕРІЛУДЕ…';}
      fetch(RSVP_ENDPOINT,{method:'POST',mode:'no-cors',body:data})
        .then(()=>{showFb('Рақмет! Сіздің жауабыңыз қабылданды.','success');form.reset();})
        .catch(()=>{showFb('Қате болды. Кейінірек қайталап көріңіз.','error');})
        .finally(()=>{if(btn){btn.disabled=false;btn.textContent='ЖІБЕРУ';}
          fb.scrollIntoView({behavior:'smooth',block:'center'});});
    });
  }
  function showFb(msg,type){if(!fb)return;fb.textContent=msg;fb.className='form-feedback '+type}

  /* ═══════════ CONTACT FORM ═══════════ */
  const cForm=document.getElementById('contact-form');
  const cFb=document.getElementById('contact-feedback');
  if(cForm){
    cForm.addEventListener('submit',e=>{
      e.preventDefault();
      const name=document.getElementById('contact-name').value.trim();
      const phone=document.getElementById('contact-phone').value.trim();
      if(!name||!phone){if(cFb){cFb.textContent='Барлық өрістерді толтырыңыз';cFb.className='form-feedback error';cFb.style.display='block'}return}
      if(cFb){cFb.textContent='Өтініміңіз қабылданды! Жақында хабарласамыз.';cFb.className='form-feedback success';cFb.style.display='block'}
    });
  }

})();
