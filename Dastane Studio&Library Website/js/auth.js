/**
 * ============================================================================
 * 🔐 DASTANE STUDIO & LIBRARY - USER AUTHENTICATION & PROFILE SYSTEM
 * ============================================================================
 * Handles Fast Username / Password Sign Up & Login, Session Persistence,
 * Bilingual Greetings Popups, Profile Customization (Name Initials Default
 * & Literary Emoji Avatars), Password Visibility Toggles, and Form Auto-fill.
 * ============================================================================
 */

(function () {
    'use strict';

    const STORAGE_KEYS = {
        USERS: 'dastane_users_db',
        CURRENT_USER: 'dastane_active_session'
    };

    // Helper: Get users database
    function getUsersDB() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USERS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading users DB:', e);
            return [];
        }
    }

    // Helper: Save users database
    function saveUsersDB(users) {
        try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        } catch (e) {
            console.error('Error saving users DB:', e);
        }
    }

    // Helper: Get currently active user
    function getCurrentUser() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    // Helper: Set active user session
    function setCurrentUser(user) {
        if (user) {
            if (!Array.isArray(user.favorites)) user.favorites = [];
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
        updateHeaderUI();
        autoFillForms();
        if (typeof window.refreshLibraryCatalog === 'function') {
            window.refreshLibraryCatalog();
        }
    }

    // Helper: Show Auth Status Message
    function setAuthStatus(elId, message, isSuccess) {
        const statusEl = document.getElementById(elId);
        if (statusEl) {
            statusEl.className = 'auth-status ' + (isSuccess ? 'success' : 'error');
            statusEl.innerHTML = message;
            statusEl.style.display = 'block';
        }
    }

    // Clear Auth Status
    function clearAuthStatus() {
        ['loginStatus', 'signupStatus', 'editProfileStatus'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    // Helper: Get user's initials
    function getUserInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    }

    // Helper: Render user avatar HTML
    function renderAvatarElement(user, customClass) {
        const cls = customClass || 'user-avatar-circle';
        if (user && user.avatar && user.avatar.trim() !== '') {
            return `<span class="${cls} is-emoji">${user.avatar}</span>`;
        }
        const initials = getUserInitials(user ? user.name : '');
        return `<span class="${cls}">${initials}</span>`;
    }

    // Direct Guaranteed Modal Trigger
    function triggerAppModal(titleHtml, bodyHtml) {
        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (modal && modalTitle && modalBody) {
            modalTitle.innerHTML = titleHtml;
            modalBody.innerHTML = bodyHtml;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        } else if (typeof window.showModal === 'function') {
            window.showModal(titleHtml, bodyHtml);
        }
    }

    // State for bilingual greeting modal
    let activeGreetingState = null;

    // Show Bilingual Greeting Popup on Login and Signup
    function showBilingualGreeting(type, name) {
        activeGreetingState = {
            type: type,
            name: name,
            currentLang: 'en'
        };

        renderGreetingContent();

        // Show and configure the Language Toggle Button
        const langToggleBtn = document.getElementById('modalLangToggleBtn');
        const langToggleText = document.getElementById('modalLangToggleText');
        const closeBtn = document.getElementById('modalCloseBtn');
        const backdrop = document.getElementById('modalBackdrop');

        if (langToggleBtn) {
            langToggleBtn.style.display = 'inline-flex';
            if (langToggleText) langToggleText.textContent = 'اردو';

            langToggleBtn.onclick = function (e) {
                e.preventDefault();
                if (!activeGreetingState) return;
                activeGreetingState.currentLang = (activeGreetingState.currentLang === 'en') ? 'ur' : 'en';
                if (langToggleText) {
                    langToggleText.textContent = (activeGreetingState.currentLang === 'en') ? 'اردو' : 'English';
                }
                renderGreetingContent();
            };
        }

        function hideLangBtn() {
            if (langToggleBtn) langToggleBtn.style.display = 'none';
            activeGreetingState = null;
        }

        if (closeBtn) closeBtn.onclick = hideLangBtn;
        if (backdrop) backdrop.onclick = hideLangBtn;
    }

    function renderGreetingContent() {
        if (!activeGreetingState) return;
        const { type, name, currentLang } = activeGreetingState;
        const safeName = escapeHtml(name || (currentLang === 'ur' ? 'عزیز قاری' : 'Reader'));

        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalTitle || !modalBody) return;

        if (currentLang === 'en') {
            // ENGLISH
            if (type === 'signup') {
                modalTitle.innerHTML = '🎉 Welcome to Dastane Studio!';
                modalBody.innerHTML = `
                    <div style="text-align: center; margin-bottom: 8px;">
                        <p style="font-size: 15.5px; line-height: 1.6; margin-bottom: 12px;">
                            Dear <strong>${safeName}</strong>, your account has been created successfully!
                        </p>
                        <div style="background: rgba(212, 175, 55, 0.12); border: 1px solid var(--accent-color); border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; font-size: 13.5px; opacity: 0.95;">
                            Welcome to our literary reading circle and digital library. Enjoy reading our curated stories!
                        </div>
                        <p style="font-size: 12.5px; opacity: 0.75;">
                            (Click <strong>"اردو"</strong> on the top right to view this in Urdu).
                        </p>
                    </div>
                `;
            } else {
                modalTitle.innerHTML = `👋 Welcome Back, ${safeName}!`;
                modalBody.innerHTML = `
                    <div style="text-align: center; margin-bottom: 8px;">
                        <p style="font-size: 15.5px; line-height: 1.6; margin-bottom: 12px;">
                            You have successfully signed in to your reading account.
                        </p>
                        <div style="background: rgba(212, 175, 55, 0.12); border: 1px solid var(--accent-color); border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; font-size: 13.5px; opacity: 0.95;">
                            Your reading session is active. Enjoy reading uninterrupted across all devices!
                        </div>
                        <p style="font-size: 12.5px; opacity: 0.75;">
                            (Click <strong>"اردو"</strong> on the top right to view this in Urdu).
                        </p>
                    </div>
                `;
            }
        } else {
            // URDU
            if (type === 'signup') {
                modalTitle.innerHTML = '✨ آداب و خوش آمدید! ✨';
                modalBody.innerHTML = `
                    <div class="urdu-greeting-wrapper" style="text-align: center;">
                        <div style="background: rgba(212, 175, 55, 0.12); border: 1px solid var(--accent-color); border-radius: 12px; padding: 18px 16px; margin-bottom: 14px;">
                            <h3 style="font-family: 'Playfair Display', serif; font-size: 24px; color: var(--accent-color); margin-bottom: 10px; font-weight: 700;">آداب و خوش آمدید!</h3>
                            <p style="font-size: 15.5px; line-height: 1.9; color: var(--text-color); margin-bottom: 0;">
                                محترم <strong>${safeName}</strong> صاحب/صاحبہ، آپ کا اکاؤنٹ کامیابی سے بن چکا ہے۔ داستان اسٹوڈیو اور لائبریری کے ادبی حلقے میں شمولیت پر آپ کا دل کی اتھاہ گہرائیوں سے شکریہ۔
                            </p>
                        </div>
                        <p style="font-size: 12.5px; opacity: 0.75;">
                            (انگریزی میں دیکھنے کے لیے اوپر <strong>"English"</strong> پر کلک کریں).
                        </p>
                    </div>
                `;
            } else {
                modalTitle.innerHTML = '✨ آداب! خوش آمدید ✨';
                modalBody.innerHTML = `
                    <div class="urdu-greeting-wrapper" style="text-align: center;">
                        <div style="background: rgba(212, 175, 55, 0.12); border: 1px solid var(--accent-color); border-radius: 12px; padding: 18px 16px; margin-bottom: 14px;">
                            <h3 style="font-family: 'Playfair Display', serif; font-size: 24px; color: var(--accent-color); margin-bottom: 10px; font-weight: 700;">آداب! خوش آمدید</h3>
                            <p style="font-size: 15.5px; line-height: 1.9; color: var(--text-color); margin-bottom: 0;">
                                محترم <strong>${safeName}</strong> صاحب/صاحبہ، آپ کا اکاؤنٹ کامیابی سے لاگ ان ہو چکا ہے۔ داستان اسٹوڈیو کے ادبی گلستان میں ہم آپ کو دل سے خوش آمدید کہتے ہیں۔
                            </p>
                        </div>
                        <p style="font-size: 12.5px; opacity: 0.75;">
                            (انگریزی میں دیکھنے کے لیے اوپر <strong>"English"</strong> پر کلک کریں).
                        </p>
                    </div>
                `;
            }
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    // Update Header UI based on login status
    function updateHeaderUI() {
        const authContainer = document.getElementById('authContainer');
        if (!authContainer) return;

        const user = getCurrentUser();

        if (user) {
            // User is LOGGED IN
            const avatarHtml = renderAvatarElement(user, 'user-avatar-circle');
            const firstName = (user.name || user.username || 'Reader').split(' ')[0];
            const handle = user.username ? `@${user.username}` : (user.email || '');

            authContainer.innerHTML = `
                <div class="user-profile-widget" id="userProfileWidget">
                    <button class="user-avatar-btn" id="userAvatarBtn" aria-label="User Account Menu" aria-expanded="false">
                        ${avatarHtml}
                        <span class="user-name-label">${escapeHtml(firstName)}</span>
                        <svg class="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <div class="profile-dropdown-menu" id="profileDropdownMenu">
                        <div class="dropdown-user-header">
                            <div class="dropdown-avatar-wrap">
                                ${renderAvatarElement(user, 'dropdown-avatar-preview')}
                                <div>
                                    <strong>${escapeHtml(user.name)}</strong>
                                    <span class="dropdown-email">${escapeHtml(handle)}</span>
                                </div>
                            </div>
                            <span class="membership-badge free">📖 Community Reader</span>
                        </div>
                        <hr class="dropdown-divider">
                        <ul class="dropdown-list">
                            <li>
                                <button class="dropdown-item" id="openEditProfileBtn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg> 
                                    Customize Profile
                                </button>
                            </li>
                            <li>
                                <a href="#library" class="dropdown-item" id="userMyLibraryLink">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #e53935;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> 
                                    My Favorite Library
                                </a>
                            </li>
                            <li>
                                <a href="#reading-circle" class="dropdown-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg> 
                                    Writers &amp; Reading Circle
                                </a>
                            </li>
                        </ul>
                        <hr class="dropdown-divider">
                        <button class="logout-btn" id="logoutBtn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Log Out
                        </button>
                    </div>
                </div>
            `;

            // Bind dropdown toggle
            const avatarBtn = document.getElementById('userAvatarBtn');
            const dropdown = document.getElementById('profileDropdownMenu');
            const logoutBtn = document.getElementById('logoutBtn');
            const editProfileBtn = document.getElementById('openEditProfileBtn');
            const myLibLink = document.getElementById('userMyLibraryLink');

            if (avatarBtn && dropdown) {
                avatarBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = dropdown.classList.toggle('show');
                    avatarBtn.setAttribute('aria-expanded', isOpen);
                });

                document.addEventListener('click', (e) => {
                    if (!avatarBtn.contains(e.target) && !dropdown.contains(e.target)) {
                        dropdown.classList.remove('show');
                        avatarBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            }

            if (myLibLink) {
                myLibLink.addEventListener('click', () => {
                    if (dropdown) dropdown.classList.remove('show');
                    if (typeof window.filterLibrary === 'function') {
                        window.filterLibrary('favorites');
                    }
                });
            }

            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', () => {
                    if (dropdown) dropdown.classList.remove('show');
                    openEditProfileModal();
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    setCurrentUser(null);
                    triggerAppModal('👋 Logged Out', '<p>You have been successfully logged out. See you soon!</p>');
                });
            }

        } else {
            // User is LOGGED OUT
            authContainer.innerHTML = `
                <button class="auth-btn" id="openAuthModalBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Sign In
                </button>
            `;

            const openBtn = document.getElementById('openAuthModalBtn');
            if (openBtn) {
                openBtn.addEventListener('click', () => openAuthModal('login'));
            }
        }
    }

    // Auto-fill forms when user is logged in
    function autoFillForms() {
        const user = getCurrentUser();
        if (!user) return;

        // Reading Circle form
        const firstNameInput = document.getElementById('subscriberFirstName');
        const surnameInput = document.getElementById('subscriberSurname');
        const emailInput = document.getElementById('subscriberEmail');
        const phoneInput = document.getElementById('subscriberPhone');

        if (firstNameInput && !firstNameInput.value) {
            const parts = (user.name || user.username || '').split(' ');
            firstNameInput.value = parts[0] || '';
            if (surnameInput && parts.length > 1) {
                surnameInput.value = parts.slice(1).join(' ');
            }
        }
        if (emailInput && !emailInput.value && user.email && !user.email.endsWith('@dastane.local')) {
            emailInput.value = user.email;
        }
        if (phoneInput && !phoneInput.value && user.phone) {
            phoneInput.value = user.phone;
        }

        // Contact form
        const senderName = document.getElementById('senderName');
        const senderEmail = document.getElementById('senderEmail');
        if (senderName && !senderName.value) senderName.value = user.name || user.username || '';
        if (senderEmail && !senderEmail.value && user.email && !user.email.endsWith('@dastane.local')) {
            senderEmail.value = user.email;
        }
    }

    // Open Auth Modal
    function openAuthModal(tab) {
        const modal = document.getElementById('authModal');
        if (!modal) return;

        clearAuthStatus();
        switchAuthTab(tab || 'login');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    // Close Auth Modal
    function closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            clearAuthStatus();
        }
    }

    // Switch Auth Tabs
    function switchAuthTab(tab) {
        const loginTabBtn = document.getElementById('tabBtnLogin');
        const signupTabBtn = document.getElementById('tabBtnSignup');
        const loginPane = document.getElementById('authPaneLogin');
        const signupPane = document.getElementById('authPaneSignup');

        if (!loginTabBtn || !signupTabBtn || !loginPane || !signupPane) return;

        clearAuthStatus();

        if (tab === 'signup') {
            loginTabBtn.classList.remove('active');
            signupTabBtn.classList.add('active');
            loginPane.style.display = 'none';
            signupPane.style.display = 'block';
        } else {
            signupTabBtn.classList.remove('active');
            loginTabBtn.classList.add('active');
            signupPane.style.display = 'none';
            loginPane.style.display = 'block';
        }
    }

    // Open Edit Profile Modal
    let selectedTempAvatar = '';

    function openEditProfileModal() {
        const modal = document.getElementById('editProfileModal');
        const user = getCurrentUser();
        if (!modal || !user) return;

        selectedTempAvatar = user.avatar || '';

        const nameInput = document.getElementById('editNameInput');
        const phoneInput = document.getElementById('editPhoneInput');
        const previewEl = document.getElementById('editAvatarPreviewContainer');

        if (nameInput) nameInput.value = user.name || '';
        if (phoneInput) phoneInput.value = user.phone || '';
        if (previewEl) previewEl.innerHTML = renderAvatarElement(user, 'custom-avatar-preview-lg');

        // Highlight currently selected avatar button
        document.querySelectorAll('.avatar-preset-btn').forEach(btn => {
            const emoji = btn.getAttribute('data-emoji');
            if (emoji === selectedTempAvatar || (emoji === '' && (!selectedTempAvatar || selectedTempAvatar === ''))) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        clearAuthStatus();
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeEditProfileModal() {
        const modal = document.getElementById('editProfileModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            clearAuthStatus();
        }
    }

    // HTML escape utility
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Setup password visibility toggle buttons
    function initPasswordToggles() {
        document.querySelectorAll('.pwd-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                if (input) {
                    const isPassword = input.getAttribute('type') === 'password';
                    input.setAttribute('type', isPassword ? 'text' : 'password');
                    btn.classList.toggle('showing', isPassword);
                }
            });
        });
    }

    // Setup Form & Profile Listeners
    function initAuthForms() {
        // 1. Tab switches
        const tabBtnLogin = document.getElementById('tabBtnLogin');
        const tabBtnSignup = document.getElementById('tabBtnSignup');
        const toSignupLink = document.getElementById('toSignupLink');
        const toLoginLink = document.getElementById('toLoginLink');

        if (tabBtnLogin) tabBtnLogin.addEventListener('click', () => switchAuthTab('login'));
        if (tabBtnSignup) tabBtnSignup.addEventListener('click', () => switchAuthTab('signup'));
        if (toSignupLink) toSignupLink.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('signup'); });
        if (toLoginLink) toLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchAuthTab('login'); });

        // Modal Close listeners
        const authModalClose = document.getElementById('authModalClose');
        const authModalBackdrop = document.getElementById('authModalBackdrop');
        if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
        if (authModalBackdrop) authModalBackdrop.addEventListener('click', closeAuthModal);

        const editModalClose = document.getElementById('editProfileModalClose');
        const editModalBackdrop = document.getElementById('editProfileModalBackdrop');
        if (editModalClose) editModalClose.addEventListener('click', closeEditProfileModal);
        if (editModalBackdrop) editModalBackdrop.addEventListener('click', closeEditProfileModal);

        // 2. SIGN UP FORM SUBMISSION (Fast Username & Password with Unique Email & Username)
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('signupName').value.trim();
                const username = document.getElementById('signupUsername').value.trim().toLowerCase().replace(/\s+/g, '_');
                const email = document.getElementById('signupEmail').value.trim().toLowerCase();
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('signupConfirmPassword').value;

                if (!name || !username || !password) {
                    setAuthStatus('signupStatus', '⚠️ Please fill in all required fields (Name, Username, Password).', false);
                    return;
                }

                if (username.length < 3) {
                    setAuthStatus('signupStatus', '⚠️ Username must be at least 3 characters long.', false);
                    return;
                }

                // If user provided email, validate format & check duplication
                if (email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        setAuthStatus('signupStatus', '⚠️ Please enter a valid Email / Gmail address.', false);
                        return;
                    }

                    const users = getUsersDB();
                    const emailExists = users.find(u => u.email && u.email.toLowerCase() === email);
                    if (emailExists) {
                        setAuthStatus('signupStatus', '❌ An account with this Email / Gmail already exists! Please Sign In.', false);
                        return;
                    }
                }

                if (password.length < 6) {
                    setAuthStatus('signupStatus', '⚠️ Password must be at least 6 characters long.', false);
                    return;
                }

                if (password !== confirmPassword) {
                    setAuthStatus('signupStatus', '⚠️ Passwords do not match. Please re-enter.', false);
                    return;
                }

                const users = getUsersDB();
                
                // 1. Strict Username Duplication Check
                const userExists = users.find(u => u.username && u.username.toLowerCase() === username);
                if (userExists) {
                    setAuthStatus('signupStatus', '❌ This Username is already taken! Please choose another username.', false);
                    return;
                }

                const newUser = {
                    id: 'usr_' + Date.now(),
                    name: name,
                    username: username,
                    email: email || `${username}@dastane.local`,
                    avatar: '', // Default Name Initials
                    favorites: [], // User-bound favorites list
                    password: password,
                    joinedDate: new Date().toLocaleDateString()
                };

                users.push(newUser);
                saveUsersDB(users);

                // Set active session
                setCurrentUser(newUser);
                signupForm.reset();
                closeAuthModal();

                // Show Bilingual Greeting Popup
                setTimeout(() => {
                    showBilingualGreeting('signup', newUser.name);
                }, 150);
            });
        }

        // 3. LOGIN FORM SUBMISSION (By Username or Email)
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const identifier = document.getElementById('loginIdentifier').value.trim().toLowerCase();
                const password = document.getElementById('loginPassword').value;

                if (!identifier || !password) {
                    setAuthStatus('loginStatus', '⚠️ Please enter both username/email and password.', false);
                    return;
                }

                const users = getUsersDB();
                const user = users.find(u => 
                    ((u.username && u.username.toLowerCase() === identifier) || 
                     (u.email && u.email.toLowerCase() === identifier)) && 
                    u.password === password
                );

                if (!user) {
                    setAuthStatus('loginStatus', '❌ Invalid username/email or password. Please try again.', false);
                    return;
                }

                if (!Array.isArray(user.favorites)) user.favorites = [];

                // Set active session
                setCurrentUser(user);
                loginForm.reset();
                closeAuthModal();

                // Show Bilingual Greeting Popup
                setTimeout(() => {
                    showBilingualGreeting('login', user.name);
                }, 150);
            });
        }

        // 4. AVATAR PRESET PICKER
        const avatarPresets = document.querySelectorAll('.avatar-preset-btn');
        const previewContainer = document.getElementById('editAvatarPreviewContainer');

        avatarPresets.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                avatarPresets.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const emoji = btn.getAttribute('data-emoji');
                selectedTempAvatar = emoji;
                
                const user = getCurrentUser() || { name: 'User' };
                const tempUser = { ...user, avatar: emoji };
                if (previewContainer) {
                    previewContainer.innerHTML = renderAvatarElement(tempUser, 'custom-avatar-preview-lg');
                }
            });
        });

        // 5. SAVE EDIT PROFILE
        const editProfileForm = document.getElementById('editProfileForm');
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = getCurrentUser();
                if (!user) return;

                const nameVal = document.getElementById('editNameInput').value.trim();
                const phoneVal = document.getElementById('editPhoneInput').value.trim();

                if (!nameVal) {
                    setAuthStatus('editProfileStatus', '⚠️ Name cannot be empty.', false);
                    return;
                }

                user.name = nameVal;
                user.phone = phoneVal;
                user.avatar = selectedTempAvatar;

                // Update in DB
                const users = getUsersDB();
                const idx = users.findIndex(u => (u.id === user.id) || (u.username === user.username));
                if (idx !== -1) {
                    users[idx] = user;
                    saveUsersDB(users);
                }

                setCurrentUser(user);
                closeEditProfileModal();

                triggerAppModal('✅ Profile Updated', `<p>Your profile has been saved successfully, <strong>${escapeHtml(user.name)}</strong>!</p>`);
            });
        }
    }

    // Expose global methods
    window.DastaneAuth = {
        getCurrentUser: getCurrentUser,
        setCurrentUser: setCurrentUser,
        openAuthModal: openAuthModal,
        closeAuthModal: closeAuthModal,
        openEditProfileModal: openEditProfileModal
    };

    // Initialize on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        updateHeaderUI();
        initPasswordToggles();
        initAuthForms();
        autoFillForms();
    });

})();
