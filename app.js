(() => {
  const ENABLE_ANIMATIONS = true;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = ENABLE_ANIMATIONS && !prefersReduce;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const placeholderSVG = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'>
      <rect width='100%' height='100%' fill='#13151a'/>
      <rect x='20' y='20' width='760' height='960' fill='none' stroke='#2a2e36'/>
      <text x='50%' y='50%' fill='#a1a6ad' text-anchor='middle' font-family='Inter, system-ui' font-size='22'>Фото-плейсхолдер</text>
    </svg>
  `);
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = `data:image/svg+xml;charset=utf-8,${placeholderSVG}`;
      img.removeAttribute('srcset');
    }, { once: true });
  });

  let lenis = null;
  if (canAnimate && window.Lenis) {
    lenis = new Lenis({ duration: 1.05, easing: t => 1 - Math.pow(1 - t, 2) });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -12 });
      } else {
        target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
      }
      history.pushState(null, '', id);
    });
  });

  const initReveals = () => {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (canAnimate && window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      items.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 12 },
          {
            opacity: 1, y: 0,
            ease: 'power2.out',
            duration: 0.45 + Math.min(0.15, i * 0.02),
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      });
    } else {
      items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  };

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!form.getAttribute('action')) {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get('name') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim();
        const message = (data.get('message') || '').toString().trim();
        const subject = encodeURIComponent('Визитка — сообщение с сайта');
        const body = encodeURIComponent(`Имя: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:syomkin001work@gmail.com?subject=${subject}&body=${body}`;
      }
    });
  }

  window.addEventListener('DOMContentLoaded', initReveals, { once: true });
})();
