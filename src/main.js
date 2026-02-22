import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initHero } from './hero.js';
import { initAnimations } from './animations.js';

gsap.registerPlugin(ScrollTrigger);

// ── Native scroll ──
// Lenis smooth scroll removed based on user feedback to ensure 0ms latency scrolling.


// ── Preloader ──
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('done');
      document.querySelector('.hero')?.classList.add('loaded');
    }, 1500);
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

// ── GA4 CTA click tracking ──
// Uses beacon transport + delayed navigation to ensure events fire before page unload
function trackCTA(buttonName, buttonLocation, navigateUrl) {
  if (typeof gtag === 'function') {
    gtag('event', 'cta_click', {
      button_name: buttonName,
      button_location: buttonLocation,
      transport_type: 'beacon',
      event_callback: () => {
        if (navigateUrl) window.location.href = navigateUrl;
      },
    });
    // Safety: navigate after 150ms even if GA4 callback doesn't fire
    if (navigateUrl) {
      setTimeout(() => { window.location.href = navigateUrl; }, 150);
    }
  } else if (navigateUrl) {
    window.location.href = navigateUrl;
  }
}

// Helper: attach tracking to a link element (prevents default, tracks, then navigates)
function trackLink(selector, buttonName, buttonLocation) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  el.addEventListener('click', (e) => {
    const href = el.getAttribute('href');
    const isExternal = el.target === '_blank' || (href && href.startsWith('http'));
    if (isExternal) {
      // External links: track without blocking, browser opens new tab
      trackCTA(buttonName, buttonLocation);
    } else if (href && !href.startsWith('#')) {
      // Internal navigation links: block, track, then navigate
      e.preventDefault();
      trackCTA(buttonName, buttonLocation, href);
    } else {
      // Anchor links: just track
      trackCTA(buttonName, buttonLocation);
    }
  });
}

// 1. "Broneeri" — nav menüüs
trackLink('.btn-nav', 'Broneeri', 'nav_menu');

// 2. "Broneeri oma reis" — hero sektsioon
trackLink('.hero-ctas .btn-gold', 'Broneeri oma reis', 'hero');

// 3. "Broneeri Reis" / "E-mail" — hõljuv nupp
const floatCtaEl = document.getElementById('floating-cta');
if (floatCtaEl) {
  floatCtaEl.addEventListener('click', (e) => {
    const href = floatCtaEl.getAttribute('href');
    const docked = floatCtaEl.classList.contains('is-docked');
    const name = docked ? 'E-mail (hõljuv)' : 'Broneeri Reis (hõljuv)';
    if (href && !href.startsWith('#')) {
      e.preventDefault();
      trackCTA(name, 'floating_cta', href);
    } else {
      trackCTA(name, 'floating_cta');
    }
  });
}

// 4. "Räägi meiega" — meeskonna sektsioon
trackLink('.kapten-text .btn-gold', 'Räägi meiega', 'meeskond');

// 5. "Facebook" — kontakt sektsioon
trackLink('.btn-fb', 'Facebook', 'kontakt');

// 6. "WhatsApp" — kontakt sektsioon
trackLink('.btn-wa', 'WhatsApp', 'kontakt');

// 6. "E-mail" — kontakt sektsioon (dünaamiliselt renderdatud)
const epostObserver = new MutationObserver(() => {
  const emailBtn = document.querySelector('#epost-placeholder a');
  if (emailBtn && !emailBtn.dataset.tracked) {
    emailBtn.dataset.tracked = 'true';
    trackLink(emailBtn, 'E-mail', 'kontakt');
  }
});
const epostTarget = document.getElementById('epost-placeholder');
if (epostTarget) {
  epostObserver.observe(epostTarget, { childList: true, subtree: true });
}

// ─── LIGHTBOX LOGIC ───
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Get all gallery items
const galleryItems = Array.from(document.querySelectorAll('.bento-item'));

let currentImageIndex = 0;

function openLightbox(index) {
  if (index < 0 || index >= galleryItems.length) return;

  currentImageIndex = index;
  const item = galleryItems[index];
  const imgElement = item.querySelector('img');
  const captionElement = item.querySelector('.bento-caption');

  // Use the same image source (already WebP)
  lightboxImg.src = imgElement.src;
  lightboxImg.alt = imgElement.alt;
  lightboxCaption.textContent = captionElement ? captionElement.textContent : '';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    lightboxImg.src = ''; // Clear source to stop decoding/memory
  }, 400); // match CSS transition var(--mid)
}

function nextImage() {
  let nextIndex = currentImageIndex + 1;
  if (nextIndex >= galleryItems.length) nextIndex = 0; // Wrap around
  openLightbox(nextIndex);
}

function prevImage() {
  let prevIndex = currentImageIndex - 1;
  if (prevIndex < 0) prevIndex = galleryItems.length - 1; // Wrap around
  openLightbox(prevIndex);
}

// Event Listeners for Gallery
galleryItems.forEach((item, index) => {
  item.style.cursor = 'pointer'; // Ensure it looks clickable
  item.addEventListener('click', () => {
    openLightbox(index);
    // Track GA event for opening a photo
    if (typeof gtag === 'function') {
      const captionElement = item.querySelector('.bento-caption');
      gtag('event', 'view_photo', {
        photo_name: captionElement ? captionElement.textContent : 'unknown'
      });
    }
  });
});

// Lightbox Controls
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

// Close when clicking outside the image
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

// Touch/Swipe Support
let touchStartX = 0;
let touchEndX = 0;

if (lightbox) {
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const threshold = 50; // min distance for swipe
  if (touchEndX < touchStartX - threshold) {
    nextImage(); // Swiped left -> next
  }
  if (touchEndX > touchStartX + threshold) {
    prevImage(); // Swiped right -> prev
  }
}

// ─── VIDEO MODAL LOGIC ───
const videoBtn = document.getElementById('play-video-btn');
const videoModal = document.getElementById('video-modal');
const videoClose = document.getElementById('video-close');
const ytPlayer = document.getElementById('yt-player');
// Using the YouTube ID provided by the user
const videoId = 'ti1R68ngUDw';

function openVideoModal() {
  if (!videoModal) return;
  // Auto-play the video when the modal opens
  ytPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Track video view in Google Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'view_video', { video_name: 'Lagoon 46 Kreeka' });
  }
}

function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove('active');
  document.body.style.overflow = '';
  // Stop the video playing after the modal fade-out transition
  setTimeout(() => {
    ytPlayer.src = '';
  }, 400); // matches CSS var(--mid)
}

if (videoBtn) {
  videoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openVideoModal();
  });
}

if (videoClose) videoClose.addEventListener('click', closeVideoModal);

if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    // Close modal when clicking the dark overlay background
    if (e.target === videoModal) closeVideoModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (videoModal && videoModal.classList.contains('active') && e.key === 'Escape') {
    closeVideoModal();
  }
});
