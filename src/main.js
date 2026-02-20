import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initHero } from './hero.js';
import { initAnimations } from './animations.js';

gsap.registerPlugin(ScrollTrigger);

// ── Smooth scroll ──
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
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

// ── Nav scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
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
