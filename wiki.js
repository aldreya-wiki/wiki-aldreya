/* Wiki Aldreya — JS global */

(function () {
  'use strict';

  var REDUCE_MOTION = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     1. ANIMATIONS D'ENTRÉE AU CHARGEMENT
  ===================================================== */
  function initFadeIn() {
    const targets = document.querySelectorAll(
      '.page-header, .rule-block, .ville-card, .faction-card, ' +
      '.event-content, .lore-block, .legend-card, .aldreya-card, ' +
      '.stat-card, .feature-card, .cat-card, .cta-card, .info-card, ' +
      '.step-card, .fleau-block, .fleaux-card, .lock-row, ' +
      '.f-status-card, .revelation-block, .alert-rift, .alert-warn, ' +
      '.alert-danger, .quote-block, .chapter, .section-title, ' +
      '.conn-wrap, .discord-block, .update-note'
    );

    if (!targets.length) return;

    // Appliquer le style initial
    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* =====================================================
     2. PARTICULES LÉGÈRES EN FOND (ACCUEIL UNIQUEMENT)
     Petits points verts façon "failles"
  ===================================================== */
  function initParticles() {
    if (!document.querySelector('.stats-grid')) return; // seulement sur l'accueil
    if (REDUCE_MOTION) return;
    if (window.innerWidth < 768) return; // pas sur mobile (batterie)

    var canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'pointer-events:none;z-index:0;opacity:0.18;';
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 38;
    var riftColor = '#39ff6a';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.6 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.018;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        var a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = riftColor;
        ctx.globalAlpha = a;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* =====================================================
     3. SURBRILLANCE DU LIEN ACTIF AU SCROLL
  ===================================================== */
  function initScrollSpy() {
    var navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    // Ne pas interférer si un seul lien est déjà marqué actif
    var sections = [];
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var sec = document.getElementById(href.slice(1));
        if (sec) sections.push({ link: link, el: sec });
      }
    });
    if (!sections.length) return;

    function onScroll() {
      var scrollY = window.scrollY + 100;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.el.offsetTop <= scrollY) current = s;
      });
      navLinks.forEach(function (l) {
        l.classList.remove('active');
      });
      if (current) current.link.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =====================================================
     4. RIPPLE (ondulation) AU CLIC SUR LES BOUTONS/CARDS
  ===================================================== */
  function initRipple() {
    var rippleTargets = document.querySelectorAll(
      '.cat-card, .cta-card, .nav-link, .discord-btn, .video-btn'
    );
    rippleTargets.forEach(function (el) {
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.addEventListener('click', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var ripple = document.createElement('span');
        ripple.style.cssText =
          'position:absolute;border-radius:50%;' +
          'width:1px;height:1px;' +
          'left:' + x + 'px;top:' + y + 'px;' +
          'transform:scale(0);' +
          'background:rgba(57,255,106,0.18);' +
          'animation:ald-ripple 0.55s ease-out forwards;' +
          'pointer-events:none;z-index:9;';
        el.appendChild(ripple);
        setTimeout(function () {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 600);
      });
    });

    // Injection du keyframe
    if (!document.getElementById('ald-ripple-style')) {
      var style = document.createElement('style');
      style.id = 'ald-ripple-style';
      style.textContent =
        '@keyframes ald-ripple{to{transform:scale(220);opacity:0;}}';
      document.head.appendChild(style);
    }
  }

  /* =====================================================
     5. HOVER GLOW SUR LA TOPBAR (indicateur de page)
  ===================================================== */
  function initTopbarGlow() {
    var topbar = document.querySelector('.topbar');
    if (!topbar) return;
    topbar.style.transition = 'border-bottom-color 0.3s';
    topbar.addEventListener('mouseenter', function () {
      topbar.style.borderBottomColor = 'rgba(57,255,106,0.22)';
    });
    topbar.addEventListener('mouseleave', function () {
      topbar.style.borderBottomColor = '';
    });
  }

  /* =====================================================
     6. LOGO PULSE SUBTIL
  ===================================================== */
  function initLogoPulse() {
    if (REDUCE_MOTION) return;
    var logo = document.querySelector('.logo-img');
    if (!logo) return;
    var up = true;
    var glow = 4;
    setInterval(function () {
      if (up) { glow += 0.3; if (glow >= 8) up = false; }
      else { glow -= 0.3; if (glow <= 3) up = true; }
      logo.style.boxShadow = '0 0 ' + glow + 'px rgba(57,255,106,' + (glow / 40) + ')';
    }, 50);
  }

  /* =====================================================
     7. SMOOTH SCROLL pour les ancres internes
  ===================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.getElementById(a.getAttribute('href').slice(1));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* =====================================================
     8. TOOLTIP sur les badges de statut faction
  ===================================================== */
  function initTooltips() {
    var badges = document.querySelectorAll('.faction-status, .fb-badge, .status-badge');
    badges.forEach(function (badge) {
      badge.style.cursor = 'default';
    });
  }

  /* =====================================================
     9. PAGE FADE : géré en CSS pur dans le <head>, pas ici
  ===================================================== */

  /* =====================================================
     10. TIMELINE : glow dynamique sur les points majeurs
  ===================================================== */
  /* =====================================================
     11. MENU MOBILE : hamburger + sidebar en tiroir
  ===================================================== */
  function initMobileMenu() {
    var sidebar = document.querySelector('.sidebar');
    var topbar = document.querySelector('.topbar');
    if (!sidebar || !topbar) return;

    // Bouton hamburger injecté en tête de topbar
    var btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Ouvrir le menu');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24">' +
      '<line x1="3" y1="6" x2="21" y2="6"/>' +
      '<line x1="3" y1="12" x2="21" y2="12"/>' +
      '<line x1="3" y1="18" x2="21" y2="18"/>' +
      '</svg>';
    topbar.insertBefore(btn, topbar.firstChild);

    // Voile derrière la sidebar
    var backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    function openMenu() {
      sidebar.classList.add('mobile-open');
      backdrop.classList.add('visible');
      btn.setAttribute('aria-label', 'Fermer le menu');
    }
    function closeMenu() {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('visible');
      btn.setAttribute('aria-label', 'Ouvrir le menu');
    }

    btn.addEventListener('click', function () {
      if (sidebar.classList.contains('mobile-open')) closeMenu();
      else openMenu();
    });
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    sidebar.querySelectorAll('.nav-link, .nav-sub').forEach(function (l) {
      l.addEventListener('click', closeMenu);
    });
  }

  /* =====================================================
     12. BARRE DE PROGRESSION DE LECTURE
  ===================================================== */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* =====================================================
     13. COMPTEURS ANIMÉS (stats de l'accueil)
     Compte de 0 jusqu'à la valeur, en préservant le suffixe
  ===================================================== */
  function initStatCount() {
    if (REDUCE_MOTION) return;
    var nums = document.querySelectorAll('.stat-num');
    nums.forEach(function (el) {
      var raw = el.textContent.trim();
      var m = raw.match(/^(\d+)(.*)$/);
      if (!m) return;
      var target = parseInt(m[1], 10);
      var suffix = m[2] || '';
      var start = null;
      var dur = 900;
      el.textContent = '0' + suffix;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      }
      requestAnimationFrame(tick);
    });
  }

  function initTimelineGlow() {
    if (REDUCE_MOTION) return;
    var major = document.querySelectorAll('.event-dot-circle.major');
    major.forEach(function (dot) {
      var phase = Math.random() * Math.PI * 2;
      setInterval(function () {
        phase += 0.06;
        var intensity = 4 + 4 * Math.sin(phase);
        dot.style.boxShadow = '0 0 ' + intensity + 'px #39ff6a';
      }, 60);
    });
  }

  /* =====================================================
     INIT
  ===================================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    initFadeIn();
    initParticles();
    initScrollSpy();
    initRipple();
    initTopbarGlow();
    initLogoPulse();
    initSmoothScroll();
    initTooltips();
    initTimelineGlow();
    initMobileMenu();
    initScrollProgress();
    initStatCount();
  }

})();
