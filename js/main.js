/* ===========================
   MAIN.JS — Core Interactions
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Lenis Smooth Scroll ---
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // --- Navbar scroll state ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 600);
  });

  // --- Mobile Menu ---
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  function closeMenu() { toggle.classList.remove('active'); menu.classList.remove('active'); overlay.classList.remove('active'); }
  toggle.addEventListener('click', () => { toggle.classList.toggle('active'); menu.classList.toggle('active'); overlay.classList.toggle('active'); });
  overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
    });
  });

  // --- Back to Top ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) backToTop.addEventListener('click', () => lenis.scrollTo(0));

  // --- Cursor Glow (desktop only) ---
  const glow = document.getElementById('cursorGlow');
  if (glow && window.innerWidth > 768) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    (function moveGlow() {
      cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
      glow.style.left = cx + 'px'; glow.style.top = cy + 'px';
      requestAnimationFrame(moveGlow);
    })();
  }

  // --- Magnetic Buttons ---
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
});
