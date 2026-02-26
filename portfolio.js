/* =============================================================
   RAHUL MAURYA — SOC PORTFOLIO  |  portfolio2.js
   Features:
   ▸ SPA navigation (no page reloads)
   ▸ Custom cursor tracking
   ▸ Matrix rain canvas background
   ▸ Typewriter hero text
   ▸ Live clock + glitch name effect
   ▸ Animated stat counters
   ▸ Terminal typing animation (re-runnable)
   ▸ Career timeline slider
   ▸ Radar chart canvas
   ▸ Skill card filter + animated progress bars
   ▸ Project modals
   ▸ Cert progress bars on enter
   ▸ Dynamic contact form (validation, custom dropdown, char count)
   ▸ Toast notification system
   ▸ Real-time alert count ticker
   ▸ Theme toggle (dark ↔ light)
   ▸ Hamburger sidebar on mobile
   ▸ Back-to-top
============================================================= */

'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ─── 1. CUSTOM CURSOR ──────────────────────────────── */
(function initCursor() {
  const outer = $('cursorOuter');
  const inner = $('cursorInner');
  if (!outer || !inner) return;
  let mx = 0, my = 0, ox = 0, oy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    inner.style.left = mx + 'px'; inner.style.top = my + 'px';
  });
  (function animOuter() {
    ox += (mx - ox) * 0.15; oy += (my - oy) * 0.15;
    outer.style.left = ox + 'px'; outer.style.top = oy + 'px';
    requestAnimationFrame(animOuter);
  })();
  document.addEventListener('mouseover', e => {
    if (e.target.matches('a,button,.nav-link,.skill-card,.project-card,.cert-card,.contact-card,.select-option,.tl-btn')) {
      outer.style.transform = 'translate(-50%,-50%) scale(1.8)';
      outer.style.borderColor = 'var(--amber)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches('a,button,.nav-link,.skill-card,.project-card,.cert-card,.contact-card,.select-option,.tl-btn')) {
      outer.style.transform = 'translate(-50%,-50%) scale(1)';
      outer.style.borderColor = 'var(--green)';
    }
  });
})();

/* ─── 2. LIVE CLOCK ─────────────────────────────────── */
(function initClock() {
  const el = $('liveTime');
  if (!el) return;
  function tick() { el.textContent = new Date().toUTCString().replace('GMT','UTC'); }
  tick(); setInterval(tick, 1000);
})();

/* ─── 3. MATRIX CANVAS ──────────────────────────────── */
(function initMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = 'ABCDEF0123456789@#$%^&*!<>{}[]ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  let cols, drops, fontSize = 13;
  function resize() {
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    cols = Math.floor(canvas.width / fontSize); drops = Array(cols).fill(1);
  }
  resize(); window.addEventListener('resize', resize);
  setInterval(function drawMatrix() {
    ctx.fillStyle = 'rgba(5,5,8,0.05)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#39ff14'; ctx.font = fontSize + 'px Share Tech Mono';
    drops.forEach((y,i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 50);
})();

/* ─── 4. GLITCH NAME ────────────────────────────────── */
(function initGlitch() {
  const el = $('glitchName');
  if (!el) return;
  const original = el.textContent;
  const glitchChars = 'X#@!$%&*?';
  function glitch() {
    let count = 0;
    const iv = setInterval(() => {
      el.textContent = original.split('').map(c => Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c).join('');
      if (++count > 10) { el.textContent = original; clearInterval(iv); }
    }, 60);
  }
  setInterval(glitch, 4000);
})();

/* ─── 5. TYPEWRITER ─────────────────────────────────── */
(function initTypewriter() {
  const el = $('typewriter');
  if (!el) return;
  const phrases = ['SOC Analyst & Threat Hunter','MITRE ATT&CK Practitioner','Incident Response Specialist','Security Automation Engineer','Digital Defender'];
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  setTimeout(type, 1200);
})();

/* ─── 6. ALERT COUNTER ──────────────────────────────── */
(function initAlerts() {
  const el = $('alertCount'); const tl = $('threatLevel');
  if (!el) return;
  const levels = ['LOW','MODERATE','ELEVATED','HIGH','CRITICAL'];
  const colors = ['var(--green)','var(--green)','var(--amber)','var(--amber)','var(--red)'];
  let count = 0;
  function inc() {
    count++;
    el.textContent = count;
    const li = Math.min(Math.floor(count / 3), 4);
    if (tl) { tl.textContent = levels[li]; tl.style.color = colors[li]; }
    if (count % 5 === 0) showToast('⚠ ' + count + ' active alerts — threat level updated', 'amber');
    setTimeout(inc, 3000 + Math.random() * 7000);
  }
  setTimeout(inc, 3500);
})();

/* ─── 7. STAT COUNTERS ──────────────────────────────── */
function animateCounters() {
  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0; const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target); el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 28);
  });
}

/* ─── 8. SPA NAVIGATION ─────────────────────────────── */
(function initSPA() {
  const sections = $$('.spa-section');
  const navLinks = $$('.nav-link');
  const gotoButtons = $$('[data-goto]');

  function navigate(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if (target) { target.classList.add('active'); }
    const mc = document.querySelector('.main-content');
    if (mc) mc.scrollTop = 0;
    navLinks.forEach(l => { if (l.dataset.section === sectionId) l.classList.add('active'); });
    if (sectionId === 'hero') animateCounters();
    if (sectionId === 'about') { runTerminal(); animateRadar(); }
    if (sectionId === 'skills') animateSkillBars();
    if (sectionId === 'certs') animateCertBars();
    closeSidebar();
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); navigate(link.dataset.section); });
  });
  gotoButtons.forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.goto)));
  navigate('hero');
  animateCounters();
})();

/* ─── 9. TERMINAL ANIMATION ─────────────────────────── */
function runTerminal() {
  const body = $('terminalBody');
  if (!body) return;
  body.innerHTML = '';
  const lines = [
    { type: 'cmd', text: '$ whoami' },
    { type: 'out', text: 'rahul_maurya — SOC Analyst' },
    { type: 'blank' },
    { type: 'cmd', text: '$ cat profile.txt' },
    { type: 'out', text: 'SOC Analyst with expertise in monitoring, detecting,\nanalyzing, and responding to cybersecurity incidents.' },
    { type: 'blank' },
    { type: 'cmd', text: '$ echo $MISSION' },
    { type: 'out', text: 'Continuously improve detection & incident response.' },
    { type: 'blank' },
    { type: 'cmd', text: '$ skills --list' },
    { type: 'out', text: '✓ Threat Hunting  ✓ SIEM/Splunk  ✓ Python\n✓ EDR/CrowdStrike  ✓ NIST IR  ✓ SOAR' },
    { type: 'prompt' }
  ];
  let li = 0;
  function printLine() {
    if (li >= lines.length) return;
    const line = lines[li++];
    const row = document.createElement('p');
    if (line.type === 'blank') { row.innerHTML = '&nbsp;'; }
    else if (line.type === 'prompt') { row.innerHTML = '<span class="prompt">$</span> <span class="cursor-blink">▋</span>'; }
    else if (line.type === 'cmd') { row.innerHTML = '<span class="prompt">$ </span>' + line.text.slice(2); row.style.color = 'var(--green)'; }
    else { row.className = 'output'; row.style.whiteSpace = 'pre-line'; row.textContent = line.text; }
    body.appendChild(row); body.scrollTop = body.scrollHeight;
    setTimeout(printLine, line.type === 'cmd' ? 260 : 90);
  }
  printLine();
}
(function() { const btn = $('rerunTerminal'); if (btn) btn.addEventListener('click', runTerminal); })();

/* ─── 10. RADAR CHART ───────────────────────────────── */
function animateRadar() {
  const canvas = $('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 100, cy = 100, r = 75;
  const labels = ['Threat\nAnalysis','SIEM','IR','Network','Coding','EDR'];
  const values = [0.95,0.92,0.88,0.85,0.80,0.89];
  const n = labels.length;
  const angles = labels.map((_,i) => (i / n) * Math.PI * 2 - Math.PI / 2);
  let progress = 0;
  function draw(t) {
    ctx.clearRect(0,0,200,200);
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      angles.forEach((a,i) => { const x=cx+(r*ring/4)*Math.cos(a); const y=cy+(r*ring/4)*Math.sin(a); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
      ctx.closePath(); ctx.strokeStyle='rgba(57,255,20,0.12)'; ctx.lineWidth=1; ctx.stroke();
    }
    angles.forEach(a => { ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a)); ctx.strokeStyle='rgba(57,255,20,0.1)'; ctx.stroke(); });
    ctx.beginPath();
    angles.forEach((a,i) => { const v=values[i]*t; const x=cx+r*v*Math.cos(a); const y=cy+r*v*Math.sin(a); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
    ctx.closePath(); ctx.fillStyle='rgba(57,255,20,0.12)'; ctx.fill(); ctx.strokeStyle='#39ff14'; ctx.lineWidth=1.5; ctx.stroke();
    angles.forEach((a,i) => { const v=values[i]*t; ctx.beginPath(); ctx.arc(cx+r*v*Math.cos(a),cy+r*v*Math.sin(a),3,0,Math.PI*2); ctx.fillStyle='#39ff14'; ctx.fill(); });
    ctx.font='8px Share Tech Mono'; ctx.fillStyle='rgba(200,208,192,0.7)'; ctx.textAlign='center';
    angles.forEach((a,i) => { const lx=cx+(r+18)*Math.cos(a); const ly=cy+(r+18)*Math.sin(a); ctx.fillText(labels[i].split('\n')[0],lx,ly); });
  }
  function animate() { progress=Math.min(progress+0.03,1); draw(progress); if(progress<1) requestAnimationFrame(animate); }
  animate();
}

/* ─── 11. TIMELINE SLIDER ───────────────────────────── */
(function initTimeline() {
  const slides = $$('.tl-slide');
  const indexEl = $('tlIndex'); const prevBtn = $('tlPrev'); const nextBtn = $('tlNext');
  if (!slides.length) return;
  let current = 0;
  function goTo(i) {
    slides[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (indexEl) indexEl.textContent = (current + 1) + ' / ' + slides.length;
  }
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  document.addEventListener('keydown', e => {
    if (!document.getElementById('about')?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });
  setInterval(() => goTo(current + 1), 6000);
})();

/* ─── 12. SKILL FILTER + BARS ───────────────────────── */
function animateSkillBars() {
  $$('.skill-fill').forEach(bar => {
    bar.style.width = '0';
    const val = bar.dataset.w || bar.style.getPropertyValue('--w') || '80';
    setTimeout(() => { bar.style.width = (isNaN(val) ? val : val + '%'); }, 120);
  });
}
(function initSkillFilter() {
  const filterBtns = $$('.filter-btn');
  const cards = $$('.skill-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = match ? '1' : '0.2';
        card.style.transform = match ? '' : 'scale(0.97)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
})();

/* ─── 13. CERT BARS ─────────────────────────────────── */
function animateCertBars() {
  $$('.cert-fill').forEach(bar => {
    bar.style.width = '0';
    const val = bar.dataset.width || bar.style.getPropertyValue('--w') || '100%';
    setTimeout(() => { bar.style.width = val; }, 250);
  });
}

/* ─── 14. PROJECT MODALS ────────────────────────────── */
(function initModals() {
  $$('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => { const m = $(trigger.dataset.modal); if (m) m.classList.add('active'); });
  });
  $$('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => { const m = $(btn.dataset.close); if (m) m.classList.remove('active'); });
  });
  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') $$('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  });
})();

/* ─── 15. CUSTOM DROPDOWN ───────────────────────────── */
(function initDropdown() {
  const select = $('customSelect'); const trigger = $('selectTrigger');
  const options = $$('.select-option'); const hidden = $('inp-subject'); const text = $('selectText');
  if (!select) return;
  trigger.addEventListener('click', e => { e.stopPropagation(); select.classList.toggle('open'); });
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected')); opt.classList.add('selected');
      text.textContent = opt.textContent; text.style.color = 'var(--text)';
      hidden.value = opt.dataset.value; select.classList.remove('open');
      clearFieldError('grp-subject','err-subject');
    });
  });
  document.addEventListener('click', () => select.classList.remove('open'));
})();

/* ─── 16. CONTACT FORM ──────────────────────────────── */
(function initContactForm() {
  const form = $('contactForm'); const msgEl = $('inp-msg'); const charEl = $('charCount');
  const statusEl = $('formStatus'); const submitBtn = $('submitBtn'); const submitText = $('submitText');
  const loader = $('submitLoader');
  if (!form) return;
  if (msgEl && charEl) {
    msgEl.addEventListener('input', () => {
      const len = msgEl.value.length; charEl.textContent = len;
      charEl.parentElement.style.color = len > 480 ? 'var(--amber)' : '';
      if (len > 500) msgEl.value = msgEl.value.slice(0, 500);
    });
  }
  $('inp-name')?.addEventListener('blur', () => validateField('inp-name','grp-name','err-name','Name is required'));
  $('inp-email')?.addEventListener('blur', validateEmail);
  msgEl?.addEventListener('blur', () => validateField('inp-msg','grp-msg','err-msg','Message cannot be empty'));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;
    submitBtn.disabled = true; submitText.textContent = 'TRANSMITTING...'; loader.classList.remove('hidden');
    if (statusEl) { statusEl.textContent = 'SENDING'; statusEl.style.color = 'var(--amber)'; }
    await sleep(2000);
    loader.classList.add('hidden'); submitText.textContent = 'MESSAGE SENT ✓'; submitBtn.style.background = 'var(--green-dim)';
    if (statusEl) { statusEl.textContent = 'SUCCESS'; statusEl.style.color = 'var(--green)'; }
    showToast('✓ Message transmitted successfully!', 'green');
    showToast('📬 Rahul will respond within 24h', 'green');
    setTimeout(() => {
      form.reset(); $('selectText').textContent = 'Select inquiry type...'; $('selectText').style.color = '';
      $('inp-subject').value = ''; if (charEl) charEl.textContent = '0';
      submitBtn.disabled = false; submitText.textContent = 'TRANSMIT MESSAGE'; submitBtn.style.background = '';
      if (statusEl) statusEl.textContent = '';
    }, 3500);
  });
})();

function validateField(inputId, groupId, errId, msg) {
  const input = $(inputId); const grp = $(groupId); const err = $(errId);
  if (!input) return true;
  if (!input.value.trim()) { grp?.classList.add('error'); if (err) err.textContent = msg; return false; }
  clearFieldError(groupId, errId); return true;
}
function validateEmail() {
  const input = $('inp-email'); const grp = $('grp-email'); const err = $('err-email');
  if (!input) return true;
  if (!input.value.trim()) { grp?.classList.add('error'); if (err) err.textContent = 'Email is required'; return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { grp?.classList.add('error'); if (err) err.textContent = 'Enter a valid email address'; return false; }
  clearFieldError('grp-email','err-email'); return true;
}
function validateAll() {
  const n = validateField('inp-name','grp-name','err-name','Name is required');
  const e = validateEmail();
  const s = $('inp-subject')?.value ? (clearFieldError('grp-subject','err-subject'), true) :
    (() => { $('grp-subject')?.classList.add('error'); const el=$('err-subject'); if(el) el.textContent='Please select a subject'; return false; })();
  const m = validateField('inp-msg','grp-msg','err-msg','Message cannot be empty');
  const c = $('inp-consent')?.checked ? true :
    (() => { const el=$('err-consent'); if(el) el.textContent='You must consent to proceed'; return false; })();
  if (!n || !e || !s || !m || !c) showToast('⚠ Please fix the errors in the form', 'red');
  return n && e && s && m && c;
}
function clearFieldError(groupId, errId) {
  $(groupId)?.classList.remove('error');
  const err = $(errId); if (err) err.textContent = '';
}

/* ─── 17. TOAST ─────────────────────────────────────── */
function showToast(message, type) {
  type = type || 'green';
  const container = $('toast-container'); if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type; toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s,transform 0.4s'; toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ─── 18. THEME TOGGLE ──────────────────────────────── */
(function initTheme() {
  const btn = $('themeToggle'); if (!btn) return;
  let light = false;
  btn.addEventListener('click', () => {
    light = !light; document.body.classList.toggle('light-mode', light);
    btn.textContent = light ? '[DARK]' : '[LIGHT]';
    showToast(light ? '☀ Light mode activated' : '🌑 Dark mode activated', 'green');
  });
})();

/* ─── 19. HAMBURGER ─────────────────────────────────── */
(function initHamburger() {
  const btn = $('hamburger'); const sidebar = $('sidebar'); if (!btn || !sidebar) return;
  btn.addEventListener('click', () => { btn.classList.toggle('open'); sidebar.classList.toggle('open'); });
  document.addEventListener('click', e => { if (!sidebar.contains(e.target) && !btn.contains(e.target)) closeSidebar(); });
})();
function closeSidebar() {
  $('hamburger')?.classList.remove('open'); $('sidebar')?.classList.remove('open');
}

/* ─── 20. BACK TO TOP ───────────────────────────────── */
(function initBackTop() {
  const btn = $('backTop'); if (!btn) return;
  btn.addEventListener('click', () => { const mc = document.querySelector('.main-content'); if (mc) mc.scrollTo({top:0,behavior:'smooth'}); });
  const mc = document.querySelector('.main-content');
  if (mc) mc.addEventListener('scroll', () => { btn.style.opacity = mc.scrollTop > 200 ? '1' : '0.3'; });
})();

/* ─── 21. TICKER DUPLICATION ────────────────────────── */
(function initTicker() {
  const track = $('tickerTrack'); if (!track) return; track.innerHTML += track.innerHTML;
})();

/* ─── 22. REAL-TIME NOTIFICATIONS ───────────────────── */
(function initNotifications() {
  const events = [
    { msg:'🔴 New IOC matched in threat feed', type:'red', delay:8000 },
    { msg:'🟡 Unusual outbound traffic — 10.0.0.42', type:'amber', delay:15000 },
    { msg:'✓ SIEM rule updated — RansomDetect v2.1', type:'green', delay:22000 },
    { msg:'🔴 Failed login spike — 89 attempts in 60s', type:'red', delay:31000 },
    { msg:'🟡 Certificate expiring in 7 days — vpn.corp', type:'amber', delay:42000 },
    { msg:'✓ EDR quarantined suspicious process', type:'green', delay:55000 },
  ];
  events.forEach(function(ev) { setTimeout(function() { showToast(ev.msg, ev.type); }, ev.delay); });
})();

/* ─── HELPERS ───────────────────────────────────────── */
function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

/* ─── GREETING ──────────────────────────────────────── */
(function greeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  setTimeout(function() { showToast(greet + ' — Welcome to Rahul\'s Portfolio', 'green'); }, 1500);
})();
