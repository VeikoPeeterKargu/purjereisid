import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initHero } from './hero.js';
import { initAnimations } from './animations.js';

gsap.registerPlugin(ScrollTrigger);

// ── Smooth scroll ──
const lenis = new Lenis({
  lerp: 0.08,             // Linear interpolation for snappy, even scroll
  wheelMultiplier: 1.2,   // Make mouse wheel a bit more responsive
  smoothWheel: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ── Preloader ──
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('done');
      document.querySelector('.hero')?.classList.add('loaded');
    }, 3500);
  }
});

// ── Nav scroll & Floating CTA ──
const nav = document.getElementById('nav');
const floatCta = document.getElementById('floating-cta');
const placeholder = document.getElementById('epost-placeholder');
const kontaktSection = document.getElementById('kontakt');

let isDocked = false;
let isAnimating = false;

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);

  if (!floatCta || !kontaktSection || !placeholder) return;
  if (isAnimating) return;

  const pastHero = window.scrollY > 600;
  const kRect = kontaktSection.getBoundingClientRect();
  const shouldDock = kRect.top < window.innerHeight - 100;

  if (shouldDock && !isDocked) {
    isDocked = true;
    isAnimating = true;

    const firstRect = floatCta.getBoundingClientRect();

    floatCta.classList.add('is-docked');
    floatCta.classList.remove('is-fixed');
    placeholder.appendChild(floatCta);

    const lastRect = floatCta.getBoundingClientRect();

    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;

    floatCta.style.transition = 'none';
    floatCta.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    requestAnimationFrame(() => {
      floatCta.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.6s ease';
      floatCta.style.transform = 'translate3d(0, 0, 0)';

      setTimeout(() => {
        isAnimating = false;
        floatCta.style.transition = '';
      }, 600);
    });

  } else if (!shouldDock && isDocked) {
    isDocked = false;
    isAnimating = true;

    const firstRect = floatCta.getBoundingClientRect();

    floatCta.classList.remove('is-docked');
    floatCta.classList.add('is-fixed');
    document.body.appendChild(floatCta);

    const lastRect = floatCta.getBoundingClientRect();

    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;

    floatCta.style.transition = 'none';
    floatCta.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    requestAnimationFrame(() => {
      floatCta.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.6s ease';
      floatCta.style.transform = 'translate3d(0, 0, 0)';

      setTimeout(() => {
        isAnimating = false;
        floatCta.style.transition = '';
      }, 600);
    });
  }

  if (!isDocked) {
    if (pastHero) {
      floatCta.classList.add('visible');
    } else {
      floatCta.classList.remove('visible');
    }
  }
});

// ── Mobile nav ──
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle?.addEventListener('click', () => {
  links?.classList.toggle('open');
});
links?.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => links?.classList.remove('open'));
});

// ── Smooth anchor scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href === '#') {
      lenis.scrollTo(0);
      return;
    }
    const t = document.querySelector(href);
    if (t) lenis.scrollTo(t, { offset: -60 });
  });
});

// ── Init modules ──
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initAnimations();
});
