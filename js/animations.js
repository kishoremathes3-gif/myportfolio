/* ===========================
   ANIMATIONS.JS — GSAP ScrollTrigger
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- Initial States ---
  // Only hide items that will be revealed by ScrollTrigger later.
  // Hero items are handled directly by heroTL.from() to prevent "0 to 0" animation issues.
  gsap.set('.reveal', { y: 40, opacity: 0 });

  // --- Hero Reveal Timeline ---
  const heroTL = gsap.timeline({ delay: 0.2 });
  
  heroTL.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title span', { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }, '-=0.4')
    .from('.hero-description', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-social', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.profile-container', { scale: 0.8, opacity: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=1')
    .from('.profile-floating-badge', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.5')
    .from('.ring', { scale: 0.5, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, '-=1')
    .to('.profile-container, .hero-content', { opacity: 1, visibility: 'visible', duration: 0.1 }); // Safety visibility

  // Profile floating motion
  gsap.to('.profile-container', { y: -15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // --- Scroll Reveal for all .reveal elements ---
  document.querySelectorAll('.reveal').forEach(el => {
    // Skip skill categories as they have their own timeline below
    if (el.classList.contains('skill-category')) return;

    gsap.to(el, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { 
        trigger: el, 
        start: 'top 90%', 
        toggleActions: 'play none none none' 
      }
    });
  });
  // --- Skill Categories Reveal ---
  document.querySelectorAll('.skill-category').forEach(cat => {
    gsap.to(cat, {
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cat,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  // --- Stats Counter Animation ---
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.count) || 0;
    const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : '';
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => {
        gsap.to(el, {
          duration: 2, ease: 'power2.out',
          onUpdate: function() { el.textContent = Math.ceil(this.progress() * target) + suffix; }
        });
      }, once: true
    });
  });

  // --- Process Steps Stagger ---
  gsap.from('.process-step', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.process-steps',
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });

  // --- Timeline Animation ---
  gsap.from('.timeline-line', {
    scaleY: 0, duration: 1.5, ease: 'power2.inOut',
    scrollTrigger: { trigger: '.timeline', start: 'top 80%' }
  });

  // Refresh ScrollTrigger to ensure all markers and positions are correct
  ScrollTrigger.refresh();
});
