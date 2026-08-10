/**
 * UNDERCURRENT - EXHIBITION LEAFLET WEB APP (Vite)
 * iOS & Mobile Optimized Interactions & Baekrokdam Aesthetics
 */

document.addEventListener('DOMContentLoaded', () => {
    initSubtleCanvas();
    initNavbarAndDrawer();
    initScrollSpy();
});

/* ==========================================================================
   1. Subtle Calm Ambient Canvas (Retina & Battery-Friendly Wave Particles)
   ========================================================================== */
function initSubtleCanvas() {
    const canvas = document.getElementById('subtleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }
    resize();

    let particles = [];
    const count = width < 768 ? 16 : 32;

    class CalmParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            this.radius = Math.random() * 1.5 + 1;
            this.alpha = Math.random() * 0.25 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.save();
            ctx.fillStyle = `rgba(148, 163, 184, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < count; i++) {
        particles.push(new CalmParticle());
    }

    let animationFrameId;
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Gentle connecting filaments
        const maxDist = width < 768 ? 100 : 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    ctx.save();
                    ctx.strokeStyle = `rgba(203, 213, 225, ${(1 - dist / maxDist) * 0.22})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 100);
    }, { passive: true });
}

/* ==========================================================================
   2. Clean Header & iOS Mobile Drawer Menu
   ========================================================================== */
function initNavbarAndDrawer() {
    const header = document.getElementById('siteHeader');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('mobileMenuClose');
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    // Sticky header shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 15) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }, { passive: true });

    function openDrawer() {
        drawer?.classList.add('open');
        backdrop?.classList.add('open');
        document.body.style.overflow = 'hidden';
        toggleBtn?.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
        drawer?.classList.remove('open');
        backdrop?.classList.remove('open');
        document.body.style.overflow = '';
        toggleBtn?.setAttribute('aria-expanded', 'false');
    }

    toggleBtn?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);

    // Auto close drawer when clicking any link
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer?.classList.contains('open')) {
            closeDrawer();
        }
    });
}

/* ==========================================================================
   3. Active Section ScrollSpy (Desktop Nav + Mobile Bottom Dock)
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const dockItems = document.querySelectorAll('.dock-item');

    function updateActive() {
        const scrollPosition = window.scrollY + 160;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id') || '';
            }
        });

        // If at top
        if (window.scrollY < 120) {
            currentSectionId = 'hero';
        }

        // Update Desktop Header Links
        navLinks.forEach(link => {
            const href = link.getAttribute('href')?.replace('#', '');
            if (href === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update Mobile Drawer Links
        drawerLinks.forEach(link => {
            const href = link.getAttribute('href')?.replace('#', '');
            if (href === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update Mobile Bottom Dock Items
        dockItems.forEach(item => {
            const target = item.getAttribute('data-target');
            if (target === currentSectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}
