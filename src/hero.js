// Hero — no more Three.js, just clean image reveal
export function initHero() {
  // The hero now uses a real photo with CSS Ken Burns effect
  // No Three.js needed — simpler, faster, more elegant
  const hero = document.querySelector('.hero');
  if (hero) {
    // Trigger loaded state for Ken Burns
    setTimeout(() => hero.classList.add('loaded'), 100);
  }
}
