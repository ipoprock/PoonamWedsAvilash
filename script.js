gsap.registerPlugin(ScrollTrigger);

// --- 0. Deep Scroll to Top Fix ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Immediate reset
window.scrollTo(0, 0);

// Reset on window load (after all assets are ready)
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
    }, 10);
});

// --- 1. Fail-safe Curtain ---
const curtainTl = gsap.timeline();
curtainTl.to('.progress-gold', { width: '150px', duration: 1.5, ease: "power2.inOut" })
         .to('.loader-content', { opacity: 0, duration: 0.4 })
         .to('.curtain-l', { xPercent: -100, duration: 1, ease: "expo.inOut" })
         .to('.curtain-r', { xPercent: 100, duration: 1, ease: "expo.inOut" }, "<")
         .set('#loader', { display: 'none' });

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. Force Scroll to Top ---
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    const config = window.WeddingConfig;
    if (!config) return;

    // --- 2. Live Countdown ---
    const updateCountdown = () => {
        const weddingDate = new Date(config.dates.countdownDate).getTime();
        const now = new Date().getTime();
        const diff = weddingDate - now;
        if (diff > 0) {
            if(document.getElementById('days')) document.getElementById('days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            if(document.getElementById('hours')) document.getElementById('hours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            if(document.getElementById('mins')) document.getElementById('mins').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            if(document.getElementById('secs')) document.getElementById('secs').textContent = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 3. Shutter Reveal Animation (Click to Open) ---
    const doorContainer = document.querySelector('.door-container');
    if (doorContainer) {
        doorContainer.addEventListener('click', () => {
            gsap.to('.door-left', { xPercent: -100, duration: 1.5, ease: "power2.inOut" });
            gsap.to('.door-right', { xPercent: 100, duration: 1.5, ease: "power2.inOut" });
            gsap.to('.door-hint', { opacity: 0, duration: 0.5 });
        });
    }

    // --- 4. Data Injection (Safe Version) ---
    const setSafeText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const setSafeSrc = (selector, src) => {
        const el = document.querySelector(selector);
        if (el) el.src = src;
    };

    const loadData = () => {
        try {
            // Text Content
            setSafeText('shloka-text', config.shloka);
            setSafeText('shloka-desc', config.shlokaDesc);
            setSafeText('invitation-msg', config.invitationMsg);
            setSafeText('loader-monogram', `${config.couple.bride[0]} & ${config.couple.groom[0]}`);
            
            setSafeText('groom-name-hero', config.couple.bride);
            setSafeText('bride-name-hero', config.couple.groom);
            setSafeText('main-date-hero', config.dates.main);

            setSafeText('bride-tag-name', `THE BRIDE: ${config.couple.bride.split(' ')[0]}`);
            setSafeText('groom-tag-name', `THE GROOM: ${config.couple.groom.split(' ')[0]}`);
            
            setSafeText('bride-full-name', config.couple.brideFull);
            setSafeText('bride-details', config.couple.brideSub);
            setSafeText('groom-full-name', config.couple.groomFull);
            setSafeText('groom-details', config.couple.groomSub);
            
            setSafeText('kids-msg', config.kidsMessage.text);
            setSafeText('kids-names', config.kidsMessage.names);
            
            setSafeText('full-venue', config.dates.fullVenue);
            const mapLink = document.getElementById('venue-map-link');
            if (mapLink) mapLink.href = config.dates.mapLink;
            
            const audio = document.getElementById('bg-music');
            if (audio) audio.src = config.musicUrl;
            
            setSafeText('compliments-text', config.compliments);
            
            const f = config.footer;
            setSafeText('footer-text', `© ${f.year} • ${f.coupleShort} • ${f.location}`);

            // RSVP Names
            setSafeText('rsvp-names-list', config.rsvpNames);

            // Calendar Link
            const calLink = document.getElementById('cal-link');
            if (calLink) {
                const calText = encodeURIComponent(`Wedding of ${config.couple.bride} and ${config.couple.groom}`);
                const calLoc = encodeURIComponent(config.dates.fullVenue);
                calLink.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${calText}&dates=${config.dates.calendarStart}/${config.dates.calendarEnd}&location=${calLoc}`;
            }

            // Icons & Images Injection
            setSafeSrc('.ganesha-icon', config.icons.ganesha);
            setSafeSrc('.hero-image', config.images.hero);
            setSafeSrc('.profile-card:nth-child(1) .img-circle img', config.images.bride);
            setSafeSrc('.profile-card:nth-child(2) .img-circle img', config.images.groom);
            setSafeSrc('.kids-icon-img', config.icons.kids);
            
            // Venue Images - Corrected for new simplified HTML
            setSafeSrc('.venue-main-img', config.images.venue);
            setSafeSrc('.venue-icon-img', config.icons.venue);

            // Gallery Injection
            const stackContainer = document.querySelector('.gallery-stack');
            if (stackContainer) {
                stackContainer.innerHTML = '';
                config.images.gallery.forEach((item) => {
                    const card = document.createElement('div');
                    card.className = 'stack-card';
                    card.innerHTML = `
                        <div class="polaroid-inner">
                            <img src="${item.src}" alt="Gallery Image">
                            <p class="polaroid-note">${item.note}</p>
                        </div>
                    `;
                    stackContainer.appendChild(card);
                });
            }

            // Events Cards
            const eventsContainer = document.getElementById('events-container');
            if (eventsContainer) {
                eventsContainer.innerHTML = '';
                config.events.forEach((ev) => {
                    const card = document.createElement('div');
                    card.className = `event-card-pro ${ev.highlight ? 'highlight' : ''}`;
                    if(ev.highlight) card.id = 'cracker-trigger';
                    card.innerHTML = `
                        <div style="font-size:3rem; margin-bottom:15px;"><img src="${ev.icon}" class="event-icon-img"></div>
                        <h3 style="font-family:'Prata', serif; color:var(--gold);">${ev.name} ${ev.subName || ''}</h3>
                        <p style="font-weight:bold; margin:10px 0;">${ev.time}</p>
                        <p style="font-style:italic; opacity:0.8; font-size:0.9rem;">${ev.desc}</p>
                    `;
                    eventsContainer.appendChild(card);
                });
            }

            // Contacts Modern
            const contactGrid = document.getElementById('contacts-container');
            if (contactGrid) {
                contactGrid.innerHTML = '';
                config.contacts.forEach((con) => {
                    const card = document.createElement('div');
                    card.className = 'contact-card-v2 glass-card';
                    card.innerHTML = `
                        <span class="contact-name">${con.name}</span>
                        <div class="contact-actions">
                            <a href="https://wa.me/91${con.phone}" target="_blank" class="btn-wa">WhatsApp</a>
                            <a href="tel:+91${con.phone}" class="btn-call">Call Now</a>
                        </div>
                    `;
                    contactGrid.appendChild(card);
                });
            }

            // --- 7. Gallery Stack & Lightbox Logic (Re-init after injection) ---
            initGallery();

        } catch (e) { console.error("Error loading data:", e); }
    };

    const initGallery = () => {
        let stackCards = Array.from(document.querySelectorAll('.stack-card'));
        const lightbox = document.getElementById('gallery-lightbox');
        if (!lightbox) return;
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        let clickTimer;

        const updateStackPositions = () => {
            stackCards.forEach((card, index) => {
                gsap.to(card, {
                    zIndex: stackCards.length - index,
                    x: 0,
                    y: index * 10,
                    rotation: index * 2 * (index % 2 === 0 ? 1 : -1),
                    scale: 1 - (index * 0.05),
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        };

        updateStackPositions();

        stackCards.forEach(card => {
            card.addEventListener('click', () => {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    const src = card.querySelector('img').src;
                    lightboxImg.src = src;
                    lightbox.classList.add('active');
                    gsap.fromTo(lightboxImg, { scale: 0.5, opacity: 0, rotate: -10 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" });
                } else {
                    clickTimer = setTimeout(() => {
                        clickTimer = null;
                        const frontCard = stackCards[0];
                        gsap.to(frontCard, { 
                            x: 300, rotation: 25, opacity: 0, duration: 0.5, 
                            onComplete: () => {
                                stackCards.push(stackCards.shift());
                                gsap.set(frontCard, { x: -300, rotation: -25 });
                                updateStackPositions();
                            }
                        });
                    }, 250);
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                gsap.to(lightboxImg, { scale: 0.5, opacity: 0, duration: 0.3, onComplete: () => lightbox.classList.remove('active') });
            });
        }
        
        const overlay = lightbox.querySelector('.lightbox-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                gsap.to(lightboxImg, { scale: 0.5, opacity: 0, duration: 0.3, onComplete: () => lightbox.classList.remove('active') });
            });
        }
    };

    loadData();

    // --- 5. Interactivity (Entrance Animations) ---
    const heroTl = gsap.timeline({ delay: 2.2 });
    heroTl.from('.shloka-box > *', { y: 30, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out" })
          .from('.hero-inner > *', { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out" }, "-=0.5");

    document.addEventListener('mousemove', (e) => {
        const dot = document.createElement('div');
        dot.className = 'sparkle-dot';
        dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
        const layer = document.getElementById('sparkle-layer');
        if (layer) {
            layer.appendChild(dot);
            gsap.to(dot, { y: Math.random() * 80 - 40, x: Math.random() * 80 - 40, opacity: 0, scale: 0, duration: 1.2, onComplete: () => dot.remove() });
        }
    });

    const themeBtn = document.getElementById('theme-switch');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('day-mode');
        });
    }

    const musicBtn = document.getElementById('music-trigger');
    const audio = document.getElementById('bg-music');
    if (musicBtn && audio) {
        const musicText = musicBtn.querySelector('.music-btn-text');
        musicBtn.addEventListener('click', () => {
            if (audio.paused) { 
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        musicBtn.classList.add('playing');
                        if (musicText) musicText.textContent = "STOP MUSIC";
                    }).catch(error => {
                        console.error("Playback failed:", error);
                        if (musicText) musicText.textContent = "ERROR PLAYING";
                    });
                }
            }
            else { 
                audio.pause(); 
                musicBtn.classList.remove('playing');
                if (musicText) musicText.textContent = "PLAY MUSIC";
            }
        });
    }

    // --- 6. Rose Petal Shower ---
    const petalContainer = document.getElementById('petal-container');
    if (petalContainer) {
        const petalColors = ['#ff4d6d', '#ff758f', '#c9184a', '#ffb3c1']; // 4 shades: Pink, Rose, Deep Red, Blush
        const createPetal = () => {
            const petal = document.createElement('div');
            petal.className = 'rose-petal';
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
            petal.style.animationDuration = (Math.random() * 3 + 5) + 's';
            petal.style.opacity = Math.random() * 0.5 + 0.3; 
            petal.style.width = (Math.random() * 10 + 10) + 'px';
            petal.style.height = petal.style.width;
            petalContainer.appendChild(petal);
            setTimeout(() => petal.remove(), 8000);
        };
        setInterval(createPetal, 300);
    }

    gsap.utils.toArray('.std-simple-box, .profile-card, .masonry-item, .event-card-pro, .venue-showcase, .kids-box, .rsvp-elegant-card, .contact-card-pro').forEach((item) => {
        gsap.from(item, { scrollTrigger: { trigger: item, start: "top 90%" }, y: 60, opacity: 0, duration: 1.2, ease: "power3.out" });
    });

    ScrollTrigger.create({
        trigger: "#cracker-trigger",
        start: "top center",
        onEnter: () => {
            const end = Date.now() + 2000;
            const colors = ['#c5a059', '#ffffff', '#ff0000'];
            (function frame() {
                confetti({ particleCount: 1, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: colors });
                confetti({ particleCount: 1, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: colors });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    });

    const rsvpForm = document.getElementById('elegant-rsvp-form');
    if(rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = rsvpForm.querySelector('.elegant-submit');
            btn.textContent = "SENDING BLESSINGS...";
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff0000', '#ffffff'] });
            setTimeout(() => { alert("Thank you! Your blessings have been received."); btn.textContent = "BLESSED ✓"; rsvpForm.reset(); }, 2000);
        });
    }
});
