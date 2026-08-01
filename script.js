/**
 * UNDERCURRENT - Exhibition Leaflet Web Application JavaScript
 * Author: Antigravity AI & The Hecabe Art & Sports
 */

document.addEventListener('DOMContentLoaded', () => {
    initMotionCanvas();
    initNavbar();
    initGalleryFilter();
    initModals();
    initGuestbook();
    initScrollAnimations();
});

/* ----------------------------------------------------
 * 1. Background Interactive Motion Canvas (Fluid Wave / Body Motion)
 * ---------------------------------------------------- */
function initMotionCanvas() {
    const canvas = document.getElementById('motionCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, radius: 180 };
    let particles = [];
    const particleCount = Math.min(width < 768 ? 45 : 90, 100);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2.5 + 1;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
            this.alpha = this.baseAlpha;
            this.color = Math.random() > 0.3 ? '#d4af37' : '#38bdf8';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Interaction with mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                let angle = Math.atan2(dy, dx);
                let force = (mouse.radius - dist) / mouse.radius;
                this.x -= Math.cos(angle) * force * 3;
                this.y -= Math.sin(angle) * force * 3;
                this.alpha = Math.min(1, this.baseAlpha + force);
            } else {
                this.alpha = this.baseAlpha;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections between nearby particles (Fluid Net Effect)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(212, 175, 55, ' + (1 - dist / 130) * 0.15 + ')';
                    ctx.lineWidth = 0.8;
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

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });
}

/* ----------------------------------------------------
 * 2. Navbar Scrolling & Mobile Menu Toggle
 * ---------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link scroll spy
        let current = '';
        const sections = document.querySelectorAll('section');
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

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }
}

/* ----------------------------------------------------
 * 3. Works Gallery Filter
 * ---------------------------------------------------- */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            workCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'flex';
                    card.classList.add('animate-fade-up');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ----------------------------------------------------
 * 4. Modals (Bio, QR, Media, Digital Leaflet)
 * ---------------------------------------------------- */
function initModals() {
    // Bio Modal
    const bioModal = document.getElementById('bioModal');
    const viewBioBtn = document.getElementById('viewBioDetailBtn');
    const closeBioBtn = document.getElementById('closeBioModal');

    if (viewBioBtn && bioModal) {
        viewBioBtn.addEventListener('click', () => bioModal.classList.add('active'));
    }
    if (closeBioBtn && bioModal) {
        closeBioBtn.addEventListener('click', () => bioModal.classList.remove('active'));
    }

    // QR Modal
    const qrModal = document.getElementById('qrModal');
    const openQrBtn = document.getElementById('openQrBtn');
    const closeQrBtn = document.getElementById('closeQrModal');

    if (openQrBtn && qrModal) {
        openQrBtn.addEventListener('click', () => qrModal.classList.add('active'));
    }
    if (closeQrBtn && qrModal) {
        closeQrBtn.addEventListener('click', () => qrModal.classList.remove('active'));
    }

    // Digital Leaflet Modal
    const leafletModal = document.getElementById('leafletModal');
    const openLeafletBtn = document.getElementById('openLeafletBtn');
    const closeLeafletBtn = document.getElementById('closeLeafletModal');

    if (openLeafletBtn && leafletModal) {
        openLeafletBtn.addEventListener('click', () => leafletModal.classList.add('active'));
    }
    if (closeLeafletBtn && leafletModal) {
        closeLeafletBtn.addEventListener('click', () => leafletModal.classList.remove('active'));
    }

    // Media Preview Modal Close
    const mediaModal = document.getElementById('mediaModal');
    const closeMediaBtn = document.getElementById('closeMediaModal');
    if (closeMediaBtn && mediaModal) {
        closeMediaBtn.addEventListener('click', () => mediaModal.classList.remove('active'));
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Leaflet Download Simulation
    const downloadBtn = document.getElementById('leafletDownloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert("전시 모바일 리플렛 저장: 이미지를 다운로드하거나 브라우저에서 인쇄할 수 있습니다.");
            window.print();
        });
    }
}

// Media Lightbox Trigger
function openMediaModal(title, description, imageSrc) {
    const mediaModal = document.getElementById('mediaModal');
    const mediaModalBody = document.getElementById('mediaModalBody');
    if (!mediaModal || !mediaModalBody) return;

    mediaModalBody.innerHTML = `
        <div class="media-preview-container">
            <img src="${imageSrc}" alt="${title}" style="width:100%; max-height:480px; object-fit:cover; border-radius:12px; margin-bottom:20px; border:1px solid rgba(212,175,55,0.3);">
            <h3 style="font-size:1.5rem; margin-bottom:8px; color:#f8fafc;">${title}</h3>
            <p style="color:#94a3b8; font-size:0.95rem; line-height:1.6;">${description}</p>
        </div>
    `;
    mediaModal.classList.add('active');
}

// Copy URL function
function copyLeafletUrl() {
    const url = "https://jung-eunjoo-undercurrent.leaflet.art";
    navigator.clipboard.writeText(url).then(() => {
        alert("전시 모바일 리플렛 주소가 클립보드에 복사되었습니다!");
    }).catch(() => {
        alert("복사에 실패했습니다: " + url);
    });
}

/* ----------------------------------------------------
 * 5. Guestbook Form Handler
 * ---------------------------------------------------- */
function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const list = document.getElementById('guestbookList');
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

        const authorDisplay = aff ? `${name} (${aff})` : name;
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

        const newComment = document.createElement('div');
        newComment.className = 'comment-item animate-fade-up';
        newComment.innerHTML = `
            <div class="comment-header">
                <strong class="comment-author">${escapeHtml(authorDisplay)}</strong>
                <span class="comment-date">${today}</span>
            </div>
            <p class="comment-body">${escapeHtml(msg)}</p>
        `;

        list.prepend(newComment);

        nameInput.value = '';
        affInput.value = '';
        msgInput.value = '';

        alert('소중한 감상평이 등록되었습니다. 감사합니다!');
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

/* ----------------------------------------------------
 * 6. Scroll Intersection Observer Animations
 * ---------------------------------------------------- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.concept-card, .pillar-item, .work-card, .research-card, .info-box').forEach(el => {
        observer.observe(el);
    });
}
