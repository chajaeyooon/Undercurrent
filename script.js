/**
 * UNDERCURRENT - BAEKROKDAM STYLE CLEAN JAVASCRIPT
 * Inspired by the calm and serene aesthetic of baekrokdam.com
 */

document.addEventListener('DOMContentLoaded', () => {
    initSubtleCanvas();
    initNavbar();
    initGuestbook();
});

/* ==========================================================================
   1. Subtle Calm Canvas (Gentle Flowing Wave Particles)
   ========================================================================== */
function initSubtleCanvas() {
    const canvas = document.getElementById('subtleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const count = width < 768 ? 20 : 40;

    class CalmParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.3 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
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

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw soft connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    ctx.save();
                    ctx.strokeStyle = `rgba(203, 213, 225, ${(1 - dist / 140) * 0.25})`;
                    ctx.lineWidth = 0.6;
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

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

/* ==========================================================================
   2. Clean Header Scroll & Mobile Toggle
   ========================================================================== */
function initNavbar() {
    const header = document.getElementById('siteHeader');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('headerNav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    mobileToggle?.addEventListener('click', () => {
        if (nav) {
            if (nav.style.display === 'flex') {
                nav.style.display = '';
            } else {
                nav.style.display = 'flex';
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.backgroundColor = '#ffffff';
                nav.style.padding = '1.5rem';
                nav.style.borderBottom = '1px solid #e2e8f0';
                nav.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
            }
        }
    });

    // Smooth active link tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   3. Visitor Guestbook Form & Messages
   ========================================================================== */
function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const list = document.getElementById('commentsList');
    if (!form || !list) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('visitorName');
        const affInput = document.getElementById('visitorAffiliation');
        const msgInput = document.getElementById('visitorMessage');

        const name = nameInput.value.trim();
        const aff = affInput.value.trim();
        const msg = msgInput.value.trim();

        if (!name || !msg) return;

        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

        const card = document.createElement('div');
        card.className = 'comment-box-clean';
        card.innerHTML = `
            <div class="comment-box-top">
                <span class="comment-author-name">${escapeHtml(name)} ${aff ? `<small style="font-weight: normal; color: var(--text-muted);">(${escapeHtml(aff)})</small>` : ''}</span>
                <span class="comment-post-date">${dateStr}</span>
            </div>
            <p class="comment-message-text">${escapeHtml(msg)}</p>
        `;

        list.insertBefore(card, list.firstChild);

        nameInput.value = '';
        affInput.value = '';
        msgInput.value = '';

        alert('소중한 방명록 메시지가 등록되었습니다. 감사합니다.');
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
