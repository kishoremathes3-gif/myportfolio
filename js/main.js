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

  // --- Gallery Modal Logic ---
  const galleryData = {
    branding: {
      title: "Visual Identity Systems",
      subtitle: "A collection of logos and brand guidelines for various startups.",
      items: [
        { img: "images/projects/branding/Logo Works/EV HUB Logo - Mockup.png", label: "EV HUB Tech Identity" },
        { img: "images/projects/branding/Logo Works/Adler Logo - Mockup.png", label: "Adler Luxury Branding" },
        { img: "images/projects/branding/Logo Works/Grand Interiors Logo - Mockup.png", label: "Grand Interiors Identity" },
        { img: "images/projects/branding/Logo Works/SP Studio Logo - Mockup.png", label: "SP Studio Logo" },
        { img: "images/projects/branding/Logo Works/RedMind Traders - Mockup.png", label: "RedMind Traders" },
        { img: "images/projects/branding/Logo Works/V jewelry Logo - Mockup.png", label: "V Jewelry" },
        { img: "images/projects/branding/Logo Works/Kalam Vision Logo - Mockup.png", label: "Kalam Vision" },
        { img: "images/projects/branding/Logo Works/ES LOGO - Mockup.png", label: "ES Identity" }
      ]
    },
    packaging: {
      title: "Product Packaging Design",
      subtitle: "Shelf-ready packaging solutions for retail and F&B brands.",
      items: [
        { img: "images/projects/branding/Package designs/Mockup - Bhimsain Bajinath Masala package design.jpg", label: "Bhimsain Bajinath Masala" },
        { img: "images/projects/branding/Package designs/Mockup - Bhimsain Bajinath Pickle package design.jpg", label: "Bhimsain Bajinath Pickle" },
        { img: "images/projects/branding/Package designs/Mockup - Eitto Package Design.jpg", label: "Eitto Package" },
        { img: "images/projects/branding/Package designs/Slim Belt-Box Packaging Design.jpg", label: "Slim Belt Box" }
      ]
    },
    staticWeb: {
      title: "Static Web Collection",
      subtitle: "A showcase of 5–6 high-performance startup & portfolio websites.",
      items: [
        // { img: "images/projects/web/project1.jpg", label: "Startup Landing Page" },
      ]
    },
    ecommerce: {
      title: "WooCommerce Ecosystems",
      subtitle: "Full-stack e-commerce solutions with custom checkout flows.",
      items: [
        // { img: "images/projects/ecommerce/store1.jpg", label: "Retail Fashion Store" },
      ]
    }
  };

  const gModal = document.getElementById('galleryModal');
  const gGrid = document.getElementById('galleryGrid');
  const gTitle = document.getElementById('galleryTitle');
  const gSubtitle = document.getElementById('gallerySubtitle');
  const gClose = document.getElementById('galleryClose');
  const fsViewer = document.getElementById('fsViewer');
  const fsImage = document.getElementById('fsImage');
  const fsClose = document.getElementById('fsClose');

  document.querySelectorAll('[data-gallery]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const type = trigger.getAttribute('data-gallery');
      const data = galleryData[type];
      if (!data) return;

      gTitle.innerText = data.title;
      gSubtitle.innerText = data.subtitle;
      gGrid.innerHTML = data.items.map(item => `
        <div class="gallery-item reveal" data-full="${item.img}">
          <img src="${item.img}" alt="${item.label}">
          <div class="gallery-item-info"><span>${item.label}</span></div>
        </div>
      `).join('');

      gModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      lenis.stop(); // Stop background smooth scroll

      // Attach click listeners to new gallery items
      gGrid.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
          fsImage.src = item.getAttribute('data-full');
          fsViewer.classList.add('active');
        });
      });
    });
  });

  const closeGModal = () => { 
    gModal.classList.remove('active'); 
    document.body.style.overflow = ''; 
    lenis.start(); // Restart background smooth scroll
  };
  gClose.addEventListener('click', closeGModal);
  gModal.addEventListener('click', (e) => { if (e.target === gModal) closeGModal(); });

  const closeFS = () => fsViewer.classList.remove('active');
  fsClose.addEventListener('click', closeFS);
  fsViewer.addEventListener('click', (e) => { if (e.target === fsViewer) closeFS(); });

  // --- Case Study Modal Logic ---
  const csModal = document.getElementById('caseStudyModal');
  const csClose = document.getElementById('caseStudyClose');
  const csBackdrop = document.getElementById('caseStudyBackdrop');
  const openCsBtn = document.getElementById('openIrisCaseStudy');

  if (openCsBtn && csModal) {
    const openCS = () => {
      csModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      else if (typeof lenis !== 'undefined') lenis.stop();
    };

    const closeCS = () => {
      csModal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
      else if (typeof lenis !== 'undefined') lenis.start();
    };

    openCsBtn.addEventListener('click', openCS);
    if (csClose) csClose.addEventListener('click', closeCS);
    if (csBackdrop) csBackdrop.addEventListener('click', closeCS);
    
    const csCloseBottom = document.getElementById('closeCaseStudyBottom');
    if (csCloseBottom) csCloseBottom.addEventListener('click', closeCS);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && csModal.classList.contains('active')) {
        closeCS();
      }
    });
  }

  // --- Project Filtering Logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons and add to this one
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategories = card.getAttribute('data-categories') || '';
          const categoryList = cardCategories.split(' ').map(c => c.trim().toLowerCase());

          if (filterValue === 'all' || categoryList.includes(filterValue.toLowerCase())) {
            card.style.display = '';
            if (typeof gsap !== 'undefined') {
              gsap.killTweensOf(card);
              gsap.fromTo(card, 
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
              );
            }
          } else {
            if (typeof gsap !== 'undefined') {
              gsap.killTweensOf(card);
              gsap.to(card, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                  card.style.display = 'none';
                }
              });
            } else {
              card.style.display = 'none';
            }
          }
        });

        // Refresh GSAP ScrollTrigger after filter layout shifts
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 400);
        }
      });
    });
  }
});
