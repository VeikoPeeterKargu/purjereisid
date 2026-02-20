import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // ── Hero entrance ──
    const heroTl = gsap.timeline({ delay: 1 });
    heroTl
        .to('.hero-eyebrow', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' })
        .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=.4')
        .to('.hero-sub', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.4')
        .to('.hero-ctas', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.3');

    // ── Section intros ──
    gsap.utils.toArray('.section-intro').forEach(el => {
        const label = el.querySelector('.label');
        const title = el.querySelector('.section-title');
        const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' }
        });
        if (label) tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 });
        if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8 }, '-=.3');
    });

    // ── Bento items ──
    gsap.utils.toArray('.bento-item').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 50, scale: .95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: .8, delay: i * .08, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
            }
        );
    });

    // ── Destination cards ──
    gsap.utils.toArray('.dest-card').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, x: 60 },
            {
                opacity: 1, x: 0,
                duration: .8, delay: i * .1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
            }
        );
    });

    // ── Features ──
    gsap.utils.toArray('.feature').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: .7, delay: i * .1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
            }
        );
    });

    // ── Trip cards ──
    gsap.utils.toArray('.trip-card').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40, scale: .95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: .7, delay: i * .12, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
            }
        );
    });

    // ── Kapten section ──
    gsap.fromTo('.kapten-img-wrap',
        { opacity: 0, x: -50 },
        {
            opacity: 1, x: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.kapten-section', start: 'top 75%', toggleActions: 'play none none reverse' }
        }
    );
    gsap.fromTo('.kapten-text',
        { opacity: 0, x: 50 },
        {
            opacity: 1, x: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.kapten-section', start: 'top 75%', toggleActions: 'play none none reverse' }
        }
    );

    // ── Contact ──
    gsap.fromTo('.contact-text',
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0, duration: .8, ease: 'power3.out',
            scrollTrigger: { trigger: '.section-contact', start: 'top 80%', toggleActions: 'play none none reverse' }
        }
    );
    gsap.fromTo('.contact-img-wrap',
        { opacity: 0, scale: .92 },
        {
            opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.section-contact', start: 'top 80%', toggleActions: 'play none none reverse' }
        }
    );

    // ── Hero parallax ──
    gsap.to('.hero-img', {
        y: 80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
}
