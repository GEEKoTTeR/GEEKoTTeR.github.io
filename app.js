(() => {
  const ENABLE_ANIMATIONS = true;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = ENABLE_ANIMATIONS && !prefersReduce;
  const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
  let lenis = null;
  if (canAnimate && window.Lenis) { lenis = new Lenis({ duration: 1.05, easing: t => 1 - Math.pow(1 - t, 2) });
    const raf = (t)=>{ lenis.raf(t); requestAnimationFrame(raf) }; requestAnimationFrame(raf); }
  const init = () => {
    const items = document.querySelectorAll('[data-reveal]');
    if (canAnimate && window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      items.forEach((el,i)=> gsap.fromTo(el,{opacity:0,y:12},{opacity:1,y:0,duration:0.5, ease:'power2.out', scrollTrigger:{trigger:el,start:'top 85%'}}));
    } else { items.forEach(el=>{ el.style.opacity=1; el.style.transform='none'; }); }
  };
  window.addEventListener('DOMContentLoaded', init, { once: true });
})();