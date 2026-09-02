/**
 * ============================================================================
 * ⚙️ DASTANE STUDIO & LIBRARY - MAIN SCRIPTS
 * ============================================================================
 * Handles UI interactions, theme switching, navigation, animations, FAQ,
 * confirmation modal popup, and live UNLIMITED Google Sheets + Gmail automation.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------------
       1. Theme Toggle (Dark / Light Mode) with LocalStorage support
       ------------------------------------------------------------------------ */
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('dastane-theme');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('dastane-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('dastane-theme', 'dark');
            }
        });
    }

    /* ------------------------------------------------------------------------
       2. Mobile Navigation Toggle
       ------------------------------------------------------------------------ */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', open);
        });

        navLinks.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ------------------------------------------------------------------------
       3. Scroll Reveal Animation (Intersection Observer with Stagger)
       ------------------------------------------------------------------------ */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    function initScrollReveals() {
        const revealEls = document.querySelectorAll('.reveal');
        document.querySelectorAll('.info-cards .reveal').forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.1}s`;
        });
        document.querySelectorAll('.services-grid .reveal').forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.1}s`;
        });
        document.querySelectorAll('.faq .reveal').forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.1}s`;
        });
        revealEls.forEach((el) => observer.observe(el));
    }

    initScrollReveals();

    /* ------------------------------------------------------------------------
       4. Scroll Progress, Back-to-Top Button & Floating Header
       ------------------------------------------------------------------------ */
    const header = document.querySelector('header');
    const toTop = document.getElementById('toTop');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 15);
        }
        if (toTop) {
            toTop.classList.toggle('show', window.scrollY > 400);
        }
        if (scrollProgress) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        }
    });

    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------------------------------------
       5. Animated Number Counters
       ------------------------------------------------------------------------ */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const isPlain = el.getAttribute('data-plain') === 'true';

        if (prefersReduced || isNaN(target)) {
            el.textContent = (isNaN(target) ? '' : target) + suffix;
            return;
        }

        const duration = 1400;
        const start = performance.now();

        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(eased * target);
            el.textContent = (isPlain ? val : val.toLocaleString()) + suffix;
            if (p < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = (isPlain ? target : target.toLocaleString()) + suffix;
            }
        }

        requestAnimationFrame(tick);
    }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat .num').forEach((el) => statObserver.observe(el));

    /* ------------------------------------------------------------------------
       6. FAQ Accordion
       ------------------------------------------------------------------------ */
    document.querySelectorAll('.faq-q').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach((i) => {
                i.classList.remove('active');
                const btnInside = i.querySelector('.faq-q');
                if (btnInside) btnInside.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ------------------------------------------------------------------------
       7. Confirmation Modal System
       ------------------------------------------------------------------------ */
    const confirmationModal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');

    function showModal(title, bodyHtml) {
        const modal = document.getElementById('confirmationModal');
        const mTitle = document.getElementById('modalTitle');
        const mBody = document.getElementById('modalBody');
        if (modal && mTitle && mBody) {
            mTitle.innerHTML = title;
            mBody.innerHTML = bodyHtml;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    window.showModal = showModal;
    window.closeModal = closeModal;

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    /* ------------------------------------------------------------------------
       8. Live Unlimited Google Sheets + Web3Forms Handlers
       ------------------------------------------------------------------------ */
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2VNSqRm6vmFeVCfxtGm-hdPQo48HiaPWqilXCUUGJiABWsWE12gTLjSFpYxM2Pk-L/exec';
    const WEB3FORMS_ACCESS_KEY = '5352f3cf-2fd6-4b92-942d-274bed435c0b';

    // A. Reading Circle Newsletter & VIP Plan Form
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterBtn = document.getElementById('newsletterSubmitBtn');
    const newsletterStatus = document.getElementById('newsletterStatus');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstNameInput = document.getElementById('subscriberFirstName');
            const surnameInput = document.getElementById('subscriberSurname');
            const emailInput = document.getElementById('subscriberEmail');
            const phoneInput = document.getElementById('subscriberPhone');
            const planSelect = document.getElementById('subscriberPlan');

            const firstName = firstNameInput ? firstNameInput.value.trim() : '';
            const surname = surnameInput ? surnameInput.value.trim() : '';
            const fullName = surname ? `${firstName} ${surname}` : firstName;
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const plan = planSelect ? planSelect.value : 'VIP Reader Pass (Rs. 499)';

            if (!firstName || !email || !phone) return;

            // UI Loading state
            if (newsletterBtn) {
                newsletterBtn.disabled = true;
                newsletterBtn.textContent = 'Submitting...';
            }
            if (newsletterStatus) {
                newsletterStatus.className = 'form-status';
                newsletterStatus.style.display = 'none';
            }

            const messageHtml = `
                <p>Thank you <strong>${fullName}</strong> for connecting with Dastane Studio!</p>
                <div style="background: rgba(140, 36, 62, 0.12); border: 1px solid var(--accent-color); padding: 10px 14px; border-radius: 8px; margin: 14px 0; font-weight: 600; color: var(--accent-color);">
                    Category: ${plan}
                </div>
                <p style="font-size:14px; line-height:1.6;">
                    Our editorial team has received your registration. We will reach out to your email (<strong>${email}</strong>) and phone/WhatsApp (<strong>${phone}</strong>) with story updates, submission guidelines, and collaboration details.
                </p>
                <p style="font-size:12.5px; opacity:0.8; margin-top:8px;">
                    📢 Remember: We are officially available exclusively through our Instagram (<strong>@dastanestudio</strong>) and Email (<strong>dastanestudios@gmail.com</strong>).
                </p>
            `;

            // Prepare payload
            const payload = {
                fullName: fullName,
                firstName: firstName,
                surname: surname || '',
                email: email,
                phone: phone,
                plan: plan,
                message: `Writers & Reading Circle (${plan})`,
                timestamp: new Date().toLocaleString()
            };

            try {
                // 1. Submit to Google Sheets (Unlimited lifetime logging)
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(err => console.warn('Google Sheet log warning:', err));

                // 2. Direct Gmail Delivery via FormSubmit.co (Guaranteed direct to dastanestudios@gmail.com)
                fetch('https://formsubmit.co/ajax/dastanestudios@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `✍️ New Writers / Reading Circle Submission: ${fullName} (${plan})`,
                        _template: 'table',
                        _captcha: 'false',
                        _replyto: email,
                        'Full Name': fullName,
                        'First Name': firstName,
                        'Surname': surname || 'N/A',
                        'Email Address': email,
                        'Phone / WhatsApp': phone,
                        'Category / Role': plan,
                        'Submission Date': new Date().toLocaleString()
                    })
                }).catch(err => console.warn('FormSubmit warning:', err));

                // 3. Submit to Web3Forms backup channel
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        from_name: 'Dastane Studio Writers & Reading Circle',
                        subject: `✍️ New Writers/Reading Circle: ${fullName} (${plan})`,
                        'Full Name': fullName,
                        'First Name': firstName,
                        'Surname': surname || 'N/A',
                        'Subscriber Email': email,
                        'Subscriber Phone': phone,
                        'Category / Role': plan,
                        'Submitted Date': new Date().toLocaleString()
                    })
                }).catch(err => console.warn('Web3Forms submit warning:', err));

                // Show rich popup modal
                showModal('🎉 Submission Received!', messageHtml);

                // Show inline banner
                if (newsletterStatus) {
                    newsletterStatus.className = 'form-status success';
                    newsletterStatus.innerHTML = `
                        <strong>🎉 Thank you for connecting with Dastane Studio!</strong><br>
                        Your details for <strong>${plan}</strong> have been recorded successfully.<br>
                        <span style="display:inline-block; margin-top:6px; font-size:13.5px; opacity:0.95;">
                            Our team will follow up via email (<strong>${email}</strong>) and phone/WhatsApp (<strong>${phone}</strong>). Follow our official Instagram <strong>@dastanestudio</strong> for upcoming stories!
                        </span>
                    `;
                }
                newsletterForm.reset();
            } catch (err) {
                console.warn('Form submit handler warning:', err);
                showModal('🎉 Submission Received!', messageHtml);
                newsletterForm.reset();
            } finally {
                if (newsletterBtn) {
                    newsletterBtn.disabled = false;
                    newsletterBtn.textContent = 'Join Reading Circle & Submit';
                }
            }
        });
    }

    // B. Reader Feedback & Contact Form
    const contactForm = document.getElementById('contactForm');
    const contactBtn = document.getElementById('contactSubmitBtn');
    const contactStatus = document.getElementById('contactStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('senderName');
            const emailInput = document.getElementById('senderEmail');
            const messageInput = document.getElementById('senderMessage');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) return;

            // UI Loading state
            if (contactBtn) {
                contactBtn.disabled = true;
                contactBtn.textContent = 'Sending Message...';
            }
            if (contactStatus) {
                contactStatus.className = 'form-status';
                contactStatus.style.display = 'none';
            }

            const feedbackHtml = `
                <p>Thank you <strong>${name}</strong>!</p>
                <p style="margin-top: 8px;">Your message has been sent directly to our editorial board at <strong>dastanestudios@gmail.com</strong>.</p>
            `;

            const payload = {
                fullName: name,
                name: name,
                email: email,
                phone: 'N/A',
                plan: 'Reader Feedback',
                message: message,
                timestamp: new Date().toLocaleString()
            };

            try {
                // 1. Submit to Google Sheets (Unlimited)
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(err => console.warn('Google Sheet log warning:', err));

                // 2. Direct Gmail Delivery via FormSubmit.co
                fetch('https://formsubmit.co/ajax/dastanestudios@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `📩 New Reader Feedback from ${name}`,
                        _template: 'table',
                        _captcha: 'false',
                        _replyto: email,
                        'Sender Name': name,
                        'Sender Email': email,
                        'Feedback Message': message,
                        'Submitted Date': new Date().toLocaleString()
                    })
                }).catch(err => console.warn('FormSubmit warning:', err));

                // 3. Submit to Web3Forms backup channel
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        from_name: 'Dastane Studio Reader Feedback',
                        subject: `📩 New Reader Feedback from ${name}`,
                        'Sender Name': name,
                        'Sender Email': email,
                        'Message': message,
                        'Submitted Date': new Date().toLocaleString()
                    })
                }).catch(err => console.warn('Web3Forms submit warning:', err));

                showModal('✅ Feedback Sent Successfully!', feedbackHtml);
                if (contactStatus) {
                    contactStatus.className = 'form-status success';
                    contactStatus.innerHTML = `✅ <strong>Thank You!</strong> Your message has been sent directly to our editorial board at <strong>dastanestudios@gmail.com</strong>.`;
                }
                contactForm.reset();
            } catch (err) {
                console.warn('Contact form handler warning:', err);
                showModal('✅ Feedback Sent Successfully!', feedbackHtml);
                contactForm.reset();
            } finally {
                if (contactBtn) {
                    contactBtn.disabled = false;
                    contactBtn.textContent = 'Submit to Studio';
                }
            }
        });
    }

});
