(() => {
  'use strict';

  const WHATSAPP_NUMBER = '94720123910'; // 072 012 3910 in international format
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isFine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- PRELOADER ---------- */
  document.body.classList.add('loading');
  const logMsgs = [
    '> initializing core...',
    '> loading modules...',
    '> compiling logic engine...',
    '> securing connection...',
    '> removing luck.exe ... done',
    '> system ready'
  ];
  const bar = $('#loaderBar'), pct = $('#loaderPercent'), log = $('#loaderLog');
  let progress = 0, lastMsg = -1;
  let pageLoaded = document.readyState === 'complete';
  window.addEventListener('load', () => (pageLoaded = true));

  const loadTimer = setInterval(() => {
    const step = pageLoaded ? 4 + Math.random() * 6 : Math.random() * 2.2;
    progress = Math.min(progress + step, pageLoaded ? 100 : 88);
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress);
    const idx = Math.min(Math.floor((progress / 100) * logMsgs.length), logMsgs.length - 1);
    if (idx !== lastMsg) { log.textContent = logMsgs[idx]; lastMsg = idx; }
    if (progress >= 100) {
      clearInterval(loadTimer);
      setTimeout(() => {
        $('#loader').classList.add('done');
        document.body.classList.remove('loading');
        startHero();
      }, 450);
    }
  }, 60);

  /* ---------- HERO ANIMATIONS ---------- */
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    $$('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), 150 + i * 160));
    typeWords();
    typeCode();
  }

  // rotating typed words
  function typeWords() {
    const words = ['websites', 'web apps', 'automations', 'smart systems'];
    const el = $('#typed');
    if (!el) return;
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      el.textContent = word.slice(0, del ? --c : ++c);
      let delay = del ? 45 : 95;
      if (!del && c === word.length) { del = true; delay = 1600; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  // code block typing
  function typeCode() {
    const lines = [
      ['cm', '// luckzero.js'],
      ['', '<span class="k">const</span> company = {'],
      ['', '  name: <span class="s">"LuckZero"</span>,'],
      ['', '  motto: <span class="s">"Driven by logic, not luck"</span>,'],
      ['', '  luck: <span class="k">0</span>,'],
      ['', '  logic: <span class="k">Infinity</span>'],
      ['', '};'],
      ['', '<span class="f">build</span>(company.logic); <span class="cm">// ✔ deployed</span>']
    ];
    const pre = $('#codeBlock');
    if (!pre) return;
    let html = '';
    let i = 0;
    (function next() {
      if (i >= lines.length) { pre.innerHTML = html + '<span class="caret" style="height:1em;width:8px;margin-left:2px"></span>'; return; }
      const [cls, text] = lines[i++];
      html += (cls ? `<span class="${cls}">${text}</span>` : text) + '\n';
      pre.innerHTML = html + '<span class="caret" style="height:1em;width:8px;margin-left:2px"></span>';
      setTimeout(next, 380);
    })();
  }

  /* ---------- BACKGROUND CANVAS (particles + mouse interaction) ---------- */
  const cv = $('#bgCanvas'), ctx = cv.getContext('2d');
  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };
  function resize() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    const count = Math.min(Math.floor((W * H) / 14000), 110);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.6 + .6
    }));
  }
  resize();
  addEventListener('resize', resize);

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dxm = p.x - mouse.x, dym = p.y - mouse.y, dm = Math.hypot(dxm, dym);
      if (dm < 140) { p.x += dxm / dm * 1.6; p.y += dym / dm * 1.6; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = 'rgba(0,255,213,.8)';
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(0,255,213,${.16 * (1 - d / 120)})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      if (dm < 190) {
        ctx.strokeStyle = `rgba(168,85,247,${.4 * (1 - dm / 190)})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();

  /* ---------- TECH CURSOR ---------- */
  const dot = $('#cursorDot'), ring = $('#cursorRing'), hud = $('#cursorHud');
  let rx = 0, ry = 0, mx = 0, my = 0, lastTrail = 0;
  const pad = n => String(Math.round(n)).padStart(4, '0');

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    mouse.x = mx; mouse.y = my;
    document.body.classList.add('cursor-on');
    dot.style.transform = `translate(${mx}px,${my}px)`;
    hud.style.transform = `translate(${mx}px,${my}px)`;
    hud.textContent = `X:${pad(mx)} Y:${pad(my)}`;
    const now = performance.now();
    if (isFine && now - lastTrail > 35) {
      lastTrail = now;
      const t = document.createElement('div');
      t.className = 'trail';
      t.style.left = mx - 2.5 + 'px'; t.style.top = my - 2.5 + 'px';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 600);
    }
  });
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
  addEventListener('mousedown', () => document.body.classList.add('cursor-down'));
  addEventListener('mouseup', () => document.body.classList.remove('cursor-down'));
  if (isFine) {
    (function follow() {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a,button,input,textarea,select,.card,.step,.pillar'))
        document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a,button,input,textarea,select,.card,.step,.pillar'))
        document.body.classList.remove('cursor-hover');
    });
  }

  /* ---------- NAV ---------- */
  const nav = $('#nav'), progressBar = $('#scrollProgress');
  const links = $$('.nav-links a[href^="#"]'), sections = links.map(a => $(a.getAttribute('href')));
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = (scrollY / max) * 100 + '%';
    const y = scrollY + 200;
    sections.forEach((s, i) => {
      if (s && s.offsetTop <= y && s.offsetTop + s.offsetHeight > y) {
        links.forEach(l => l.classList.remove('active'));
        links[i].classList.add('active');
      }
    });
  }, { passive: true });
  $('#menuToggle').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(el => { if (!el.closest('.hero')) io.observe(el); });
  // stagger siblings in grids
  $$('.cards,.timeline').forEach(g => $$('.reveal', g).forEach((el, i) => (el.style.transitionDelay = i * 90 + 'ms')));

  /* ---------- 3D TILT + SPOTLIGHT ---------- */
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
      const rotY = ((x / r.width) - .5) * 14, rotX = ((y / r.height) - .5) * -14;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => (card.style.transform = ''));
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (isFine) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      b.addEventListener('mouseleave', () => (b.style.transform = ''));
    });
  }

  /* ---------- CONTACT FORM -> WHATSAPP ---------- */
  const toast = $('#toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  $('#contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name'), phone = $('#phone'), msg = $('#message'), service = $('#service');
    let ok = true;
    [name, phone, msg].forEach(f => {
      const bad = !f.value.trim();
      f.parentElement.classList.toggle('err', bad);
      if (bad) ok = false;
    });
    if (!ok) { showToast('> error: please fill all fields'); return; }

    const text =
`*New Inquiry - LuckZero.com*

*Name:* ${name.value.trim()}
*Contact:* ${phone.value.trim()}
*Service:* ${service.value}

*Message:*
${msg.value.trim()}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    $('#formNote').textContent = '> opening WhatsApp...';
    showToast('> message ready, opening WhatsApp');
    window.open(url, '_blank', 'noopener');
    setTimeout(() => { e.target.reset(); $('#formNote').textContent = ''; }, 1500);
  });
  $$('.field input,.field textarea').forEach(f =>
    f.addEventListener('input', () => f.parentElement.classList.remove('err')));

  /* ---------- BACK TO TOP ---------- */
  const toTop = $('#toTop'), toTopRing = $('#toTopRing');
  addEventListener('scroll', () => {
    toTop.classList.toggle('show', scrollY > 500);
    const max = document.documentElement.scrollHeight - innerHeight;
    toTopRing.style.strokeDashoffset = 132 - (scrollY / max) * 132;
  }, { passive: true });
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- ABOUT: NETWORK AROUND LOGO ---------- */
  (function network() {
    const box = $('.about-visual'), c = $('#netCanvas');
    if (!box || !c) return;
    const g = c.getContext('2d');
    let w, h, cx, cy, nodes = [], packets = [], visible = false;
    const COLORS = ['#00ffd5', '#0a84ff', '#a855f7'];

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = box.clientWidth; h = box.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2; cy = h / 2;
      const maxR = Math.min(w, h) / 2 - 14;
      const minR = Math.min(w, h) * .26;
      nodes = Array.from({ length: 18 }, (_, i) => ({
        a: (i / 18) * Math.PI * 2 + Math.random() * .3,
        r: minR + Math.random() * (maxR - minR),
        sp: (Math.random() * .0035 + .0008) * (Math.random() < .5 ? -1 : 1),
        ph: Math.random() * 6.28,
        s: Math.random() * 2.5 + 2.5,
        col: COLORS[i % 3]
      }));
    }
    size();
    addEventListener('resize', size);
    new IntersectionObserver(e => (visible = e[0].isIntersecting)).observe(box);

    const pos = n => ({
      x: cx + Math.cos(n.a) * n.r,
      y: cy + Math.sin(n.a) * n.r * .92 + Math.sin(n.ph) * 6
    });

    function frame(t) {
      requestAnimationFrame(frame);
      if (!visible) return;
      g.clearRect(0, 0, w, h);
      const P = nodes.map(n => { n.a += n.sp; n.ph += .02; return pos(n); });

      // links between nodes
      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
          if (d < 110) {
            g.strokeStyle = `rgba(0,255,213,${.28 * (1 - d / 110)})`;
            g.lineWidth = 1;
            g.beginPath(); g.moveTo(P[i].x, P[i].y); g.lineTo(P[j].x, P[j].y); g.stroke();
          }
        }
        // spoke to logo
        g.strokeStyle = 'rgba(0,255,213,.13)';
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(P[i].x, P[i].y); g.stroke();
      }

      // data packets travelling to/from the logo
      if (Math.random() < .06) packets.push({ i: Math.floor(Math.random() * nodes.length), p: 0, out: Math.random() < .5 });
      packets = packets.filter(k => k.p < 1);
      packets.forEach(k => {
        k.p += .014;
        const n = P[k.i], f = k.out ? k.p : 1 - k.p;
        const x = cx + (n.x - cx) * f, y = cy + (n.y - cy) * f;
        g.fillStyle = '#fff'; g.shadowColor = '#00ffd5'; g.shadowBlur = 14;
        g.beginPath(); g.arc(x, y, 2.6, 0, 6.283); g.fill();
        g.shadowBlur = 0;
      });

      // nodes
      nodes.forEach((n, i) => {
        const p = P[i], pulse = 1 + Math.sin(t / 500 + i) * .25;
        g.fillStyle = n.col; g.shadowColor = n.col; g.shadowBlur = 16;
        g.beginPath(); g.arc(p.x, p.y, n.s * pulse, 0, 6.283); g.fill();
        g.shadowBlur = 0;
        g.strokeStyle = n.col + '55'; g.lineWidth = 1;
        g.beginPath(); g.arc(p.x, p.y, n.s * pulse + 5, 0, 6.283); g.stroke();
      });
    }
    requestAnimationFrame(frame);
  })();

  $('#year').textContent = new Date().getFullYear();
})();
