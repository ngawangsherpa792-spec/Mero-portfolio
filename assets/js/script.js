/**
 * Ngawang Sherpa Portfolio — Full Interactivity
 */
document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1200);

    initCursor();
    initParticles();
    initTypingEffect();
    initMobileMenu();
    initMagneticButtons();
    initScrollReveal();
    initProjectFilters();
    initStatCounters();
    initHeaderScroll();
    initActiveNav();

    // ── Cursor ──
    function initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const outer = document.querySelector('.cursor-outer');
        const inner = document.querySelector('.cursor-inner');
        document.addEventListener('mousemove', e => {
            gsap.to(outer, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -50, duration: 0.15 });
            gsap.to(inner, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -50, duration: 0.05 });
        });
        document.querySelectorAll('a, button, .project-card, .expertise-card, .skill-pill, .contact-card').forEach(el => {
            el.addEventListener('mouseenter', () => outer.classList.add('hovering'));
            el.addEventListener('mouseleave', () => outer.classList.remove('hovering'));
        });
    }

    // ── Particles ──
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [], isActive = true, animId;
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class P {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.s = Math.random() * 1.8 + 0.3;
                this.sx = (Math.random() - 0.5) * 0.25;
                this.sy = (Math.random() - 0.5) * 0.25;
                this.c = Math.random() > 0.5 ? '#00d4ff' : '#8338ec';
                this.o = Math.random() * 0.35 + 0.05;
            }
            update() {
                this.x += this.sx; this.y += this.sy;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = this.c; ctx.globalAlpha = this.o;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fill();
            }
        }
        const count = window.innerWidth < 768 ? 30 : 80;
        for (let i = 0; i < count; i++) particles.push(new P());

        let fc = 0;
        function animate() {
            if (!isActive) return;
            fc++;
            if (fc % 2 === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => { p.update(); p.draw(); });
                // connections
                ctx.globalAlpha = 0.07; ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 0.5;
                for (let i = 0; i < particles.length; i++) {
                    let conn = 0;
                    for (let j = i + 1; j < particles.length && conn < 2; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke(); conn++;
                        }
                    }
                }
            }
            animId = requestAnimationFrame(animate);
        }
        animate();
        document.addEventListener('visibilitychange', () => {
            isActive = !document.hidden;
            if (isActive) animate(); else cancelAnimationFrame(animId);
        });
    }

    // ── Typing Effect ──
    function initTypingEffect() {
        const el = document.getElementById('typed-text');
        if (!el) return;
        const phrases = [
            'Cybersecurity Researcher',
            'AI/ML Developer',
            'Malware Analyst',
            'LLM Agent Builder',
            'Penetration Tester'
        ];
        let phraseIdx = 0, charIdx = 0, deleting = false;
        function type() {
            const current = phrases[phraseIdx];
            if (deleting) {
                el.textContent = current.substring(0, charIdx--);
                if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 500); return; }
                setTimeout(type, 40);
            } else {
                el.textContent = current.substring(0, charIdx++);
                if (charIdx > current.length) { deleting = true; setTimeout(type, 2000); return; }
                setTimeout(type, 80);
            }
        }
        setTimeout(type, 1500);
    }

    // ── Mobile Menu ──
    function initMobileMenu() {
        const toggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        if (!toggle || !navLinks) return;
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ── Magnetic Buttons ──
    function initMagneticButtons() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    // ── Scroll Reveal ──
    function initScrollReveal() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 1.3 })
          .from('.hero-name', { opacity: 0, y: 40, duration: 0.8 }, '-=0.4')
          .from('.hero-typing-wrapper', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3')
          .from('.hero-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
          .from('.cta-buttons', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
          .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.2');

        // Universal reveal
        document.querySelectorAll('[data-reveal]').forEach(el => {
            const d = el.dataset.reveal;
            let from = { opacity: 0 };
            if (d === 'left') from.x = -60;
            if (d === 'right') from.x = 60;
            if (d === 'bottom') from.y = 60;
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                ...from, duration: 1, ease: 'power2.out'
            });
        });
    }

    // ── Project Filters ──
    function initProjectFilters() {
        const filters = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.project-card');
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                const f = btn.dataset.filter;
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                projects.forEach(p => {
                    if (f === 'all' || p.dataset.category === f) {
                        gsap.to(p, { opacity: 1, scale: 1, duration: 0.4, display: 'grid' });
                    } else {
                        gsap.to(p, { opacity: 0, scale: 0.95, duration: 0.4, display: 'none' });
                    }
                });
            });
        });
    }

    // ── Stat Counters ──
    function initStatCounters() {
        document.querySelectorAll('.stat-num').forEach(el => {
            const target = parseInt(el.dataset.target);
            ScrollTrigger.create({
                trigger: el,
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    gsap.to(el, {
                        textContent: target,
                        duration: 1.5,
                        snap: { textContent: 1 },
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // ── Header Scroll Effect ──
    function initHeaderScroll() {
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ── Active Nav Highlight ──
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY + 200;
            sections.forEach(sec => {
                const top = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
                if (scrollY >= top && scrollY < top + h) {
                    links.forEach(l => {
                        l.classList.remove('active');
                        if (l.getAttribute('href') === '#' + id) l.classList.add('active');
                    });
                }
            });
        }, { passive: true });
    }
});
