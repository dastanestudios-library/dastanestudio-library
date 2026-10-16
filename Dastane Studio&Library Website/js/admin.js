/**
 * ============================================================================
 * 🎛️ DASTANE STUDIO & LIBRARY - ADMIN PANEL CONTROLLER
 * ============================================================================
 * Manages Admin Authentication, Navigation Tabs, CRUD Operations for
 * Novels, Episodes, Short Stories, Audiobooks, Announcements, and Subscribers,
 * plus 1-Click Offline Data File Backups.
 * ============================================================================
 */

(function () {
    'use strict';

    // State
    let currentAdminUser = null;
    let state = {
        novels: [],
        stories: [],
        audiobooks: [],
        news: [],
        subscribers: []
    };

    // DOM Elements
    const authGate = document.getElementById('admAuthGate');
    const adminApp = document.getElementById('admApp');
    const loginForm = document.getElementById('admLoginForm');
    const loginStatus = document.getElementById('admLoginStatus');
    const dbStatus = document.getElementById('admDbStatus');

    // --------------------------------------------------------------------------
    // 1. Initial Authentication Check
    // --------------------------------------------------------------------------
    async function checkAuth() {
        const savedSession = localStorage.getItem('dastane_admin_session');
        const sb = window.DastaneDB ? window.DastaneDB.init() : null;

        if (sb) {
            try {
                const { data } = await sb.auth.getSession();
                if (data && data.session && data.session.user) {
                    currentAdminUser = data.session.user;
                    showApp();
                    return;
                }
            } catch (e) {
                console.warn('Session check failed:', e);
            }
        }

        if (savedSession) {
            try {
                currentAdminUser = JSON.parse(savedSession);
                showApp();
                return;
            } catch (e) {}
        }

        showLogin();
    }

    function showLogin() {
        authGate.style.display = 'flex';
        adminApp.style.display = 'none';
    }

    function showApp() {
        authGate.style.display = 'none';
        adminApp.style.display = 'flex';
        const userDisplay = document.getElementById('admUserDisplay');
        if (userDisplay && currentAdminUser) {
            userDisplay.textContent = currentAdminUser.email || currentAdminUser.name || 'Studio Admin';
        }
        checkDbStatus();
        loadAllData();
    }

    // --------------------------------------------------------------------------
    // 2. Login & Logout
    // --------------------------------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('admEmail').value.trim();
            const password = document.getElementById('admPassword').value;
            const submitBtn = document.getElementById('admLoginBtn');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying...';
            loginStatus.style.display = 'none';

            const sb = window.DastaneDB ? window.DastaneDB.init() : null;

            if (sb) {
                try {
                    const { data, error } = await sb.auth.signInWithPassword({ email, password });
                    if (!error && data && data.user) {
                        currentAdminUser = data.user;
                        localStorage.setItem('dastane_admin_session', JSON.stringify({ email: data.user.email }));
                        showApp();
                        return;
                    }
                } catch (err) {
                    console.warn('Supabase auth failed:', err);
                }
            }

            // Fallback Admin Master Key (for easy initial setup)
            if ((email.toLowerCase() === 'dastanestudios@gmail.com' || email.includes('admin')) && 
                (password === 'dastane2026' || password === 'dastane@admin')) {
                currentAdminUser = { email: email, name: 'Dastane Studio Owner' };
                localStorage.setItem('dastane_admin_session', JSON.stringify(currentAdminUser));
                showApp();
            } else {
                loginStatus.className = 'adm-status-box error';
                loginStatus.textContent = '❌ Invalid credentials. (Default passcode: dastane2026)';
                loginStatus.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In to Studio';
            }
        });
    }

    const logoutBtn = document.getElementById('admLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const sb = window.DastaneDB ? window.DastaneDB.init() : null;
            if (sb) {
                try { await sb.auth.signOut(); } catch (e) {}
            }
            localStorage.removeItem('dastane_admin_session');
            currentAdminUser = null;
            showLogin();
        });
    }

    // --------------------------------------------------------------------------
    // 3. Database Connection Status Checker
    // --------------------------------------------------------------------------
    function checkDbStatus() {
        if (!dbStatus) return;
        if (window.DastaneDB && window.DastaneDB.isReady()) {
            dbStatus.className = 'adm-db-status-pill';
            dbStatus.innerHTML = '● Connected to Cloud DB';
        } else {
            dbStatus.className = 'adm-db-status-pill offline';
            dbStatus.innerHTML = '○ Local / Static Mode';
        }
    }

    // --------------------------------------------------------------------------
    // 4. Navigation Tab Switching
    // --------------------------------------------------------------------------
    const navButtons = document.querySelectorAll('.adm-nav-btn');
    const panes = document.querySelectorAll('.adm-pane');
    const currentTitle = document.getElementById('admCurrentTitle');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panes.forEach(pane => {
                pane.classList.toggle('active', pane.id === `pane-${tabId}`);
            });

            if (currentTitle) {
                const label = btn.querySelector('span') ? btn.querySelector('span').textContent.replace(/^[^\w\s]+/, '').trim() : tabId;
                currentTitle.textContent = label;
            }

            // Mobile sidebar auto-close
            const sidebar = document.getElementById('admSidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    const menuToggle = document.getElementById('admMenuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const sidebar = document.getElementById('admSidebar');
            if (sidebar) sidebar.classList.toggle('open');
        });
    }

    // Quick action buttons on Overview
    function setupQuickActions() {
        const bind = (id, tabName, modalId) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    const targetNav = document.querySelector(`.adm-nav-btn[data-tab="${tabName}"]`);
                    if (targetNav) targetNav.click();
                    if (modalId) openModal(modalId);
                });
            }
        };
        bind('quickAddNovelBtn', 'novels', 'novelModal');
        bind('quickAddStoryBtn', 'stories', 'storyModal');
        bind('quickAddAudioBtn', 'audiobooks', 'audioModal');
        bind('quickAddNewsBtn', 'announcements', 'newsModal');
    }
    setupQuickActions();

    // --------------------------------------------------------------------------
    // 5. Data Loading & Rendering
    // --------------------------------------------------------------------------
    async function loadAllData() {
        const isDb = window.DastaneDB && window.DastaneDB.isReady();

        // 1. Novels
        let novels = isDb ? await window.DastaneDB.fetchNovels() : null;
        if (!novels && window.novelsList) novels = window.novelsList;
        state.novels = novels || [];
        renderNovelsTable();

        // 2. Stories
        let stories = isDb ? await window.DastaneDB.fetchStories() : null;
        if (!stories && window.storiesList) stories = window.storiesList;
        state.stories = stories || [];
        renderStoriesTable();

        // 3. Audiobooks
        let audio = isDb ? await window.DastaneDB.fetchAudiobooks() : null;
        if (!audio && window.audiobooksList) audio = window.audiobooksList;
        state.audiobooks = audio || [];
        renderAudiobooksTable();

        // 4. News
        let news = isDb ? await window.DastaneDB.fetchNews() : null;
        if (!news && window.newsList) news = window.newsList;
        state.news = news || [];
        renderNewsTable();

        // 5. Subscribers
        renderSubscribersTable();

        // Update Stats Counters
        updateStatsCounters();
    }

    function updateStatsCounters() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setVal('statNovels', state.novels.length);
        setVal('badgeNovels', state.novels.length);
        setVal('statStories', state.stories.length);
        setVal('badgeStories', state.stories.length);
        setVal('statAudiobooks', state.audiobooks.length);
        setVal('badgeAudiobooks', state.audiobooks.length);
        setVal('statNews', state.news.length);
        setVal('badgeNews', state.news.length);
    }

    // --------------------------------------------------------------------------
    // 6. Novels Table & Modals
    // --------------------------------------------------------------------------
    function renderNovelsTable() {
        const tbody = document.getElementById('novelsTableBody');
        if (!tbody) return;

        if (state.novels.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--adm-text-muted); padding: 30px;">No novels found. Click "+ Add New Novel" to publish one!</td></tr>`;
            return;
        }

        tbody.innerHTML = state.novels.map(novel => {
            const urduEpisodes = (novel.languages && novel.languages.urdu && novel.languages.urdu.episodes) ? novel.languages.urdu.episodes.length : 0;
            const englishEpisodes = (novel.languages && novel.languages.english && novel.languages.english.episodes) ? novel.languages.english.episodes.length : 0;
            const totalEpisodes = urduEpisodes + englishEpisodes;
            const statusClass = novel.isAvailable ? 'available' : 'coming-soon';
            const statusText = novel.isAvailable ? 'Available' : 'Coming Soon';
            const cover = novel.coverImage || 'favicon-512x512.png';

            return `
                <tr>
                    <td><img src="${cover}" alt="${novel.title}" class="adm-thumb" onerror="this.src='favicon-512x512.png'"></td>
                    <td>
                        <strong>${novel.title}</strong>
                        <div style="font-size: 11.5px; color: var(--adm-text-muted);">${novel.tag || 'Novel'}</div>
                    </td>
                    <td><span class="adm-badge-pill ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="adm-btn-sm" style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--adm-gold); color: var(--adm-gold); font-weight: 600; padding: 6px 12px; cursor: pointer;" onclick="window.admManageEpisodes(${novel.id})">
                            📖 Episodes (${totalEpisodes})
                        </button>
                    </td>
                    <td>
                        <div class="adm-actions-cell">
                            <button class="adm-btn-sm" onclick="window.admEditNovel(${novel.id})">Edit</button>
                            <button class="adm-btn-sm delete" onclick="window.admDeleteNovel(${novel.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Episode Manager State & Handlers
    let currentManagingNovelId = null;
    let currentEpLangFilter = 'urdu';

    window.admManageEpisodes = function(novelId, activeLang) {
        currentManagingNovelId = novelId;
        if (activeLang) currentEpLangFilter = activeLang;

        const novel = state.novels.find(n => n.id === novelId);
        if (!novel) return;

        const modalTitle = document.getElementById('manageEpModalTitle');
        if (modalTitle) modalTitle.textContent = `Manage Episodes: ${novel.title}`;

        // Setup filter button active styles
        const urduBtn = document.getElementById('epFilterUrduBtn');
        const engBtn = document.getElementById('epFilterEnglishBtn');
        if (urduBtn && engBtn) {
            urduBtn.style.background = (currentEpLangFilter === 'urdu') ? 'var(--adm-accent)' : 'transparent';
            urduBtn.style.color = (currentEpLangFilter === 'urdu') ? '#fff' : 'var(--adm-text)';
            engBtn.style.background = (currentEpLangFilter === 'english') ? 'var(--adm-accent)' : 'transparent';
            engBtn.style.color = (currentEpLangFilter === 'english') ? '#fff' : 'var(--adm-text)';

            urduBtn.onclick = () => window.admManageEpisodes(novelId, 'urdu');
            engBtn.onclick = () => window.admManageEpisodes(novelId, 'english');
        }

        renderEpisodesListTbody(novel, currentEpLangFilter);
        resetEpisodeForm(novel, currentEpLangFilter);
        openModal('manageEpisodesModal');
    };

    function renderEpisodesListTbody(novel, lang) {
        const tbody = document.getElementById('episodesListTbody');
        if (!tbody) return;

        const episodes = (novel.languages && novel.languages[lang] && Array.isArray(novel.languages[lang].episodes))
            ? novel.languages[lang].episodes
            : [];

        if (episodes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--adm-text-muted); padding: 24px;">No ${lang} episodes added yet. Use the form below to add Episode 1!</td></tr>`;
            return;
        }

        tbody.innerHTML = episodes.map((ep, idx) => {
            const statusClass = ep.isAvailable ? 'available' : 'coming-soon';
            const statusText = ep.isAvailable ? 'Live' : 'Coming Soon';
            return `
                <tr>
                    <td><strong>#${ep.episodeNumber || (idx + 1)}</strong></td>
                    <td>
                        <div><strong>${ep.title}</strong></div>
                        ${ep.nativeTitle ? `<div style="font-size: 12px; color: var(--adm-gold);">${ep.nativeTitle}</div>` : ''}
                    </td>
                    <td>
                        <span class="adm-badge-pill ${statusClass}">${statusText}</span>
                        <div style="font-size: 11px; color: var(--adm-text-muted); margin-top: 2px;">${ep.releaseDate || ''}</div>
                    </td>
                    <td>
                        <a href="${ep.link}" target="_blank" style="color: var(--adm-gold); font-size: 12px; text-decoration: underline;" title="${ep.link}">View Link ↗</a>
                    </td>
                    <td>
                        <div class="adm-actions-cell">
                            <button class="adm-btn-sm" onclick="window.admEditEpisodeInModal(${novel.id}, '${lang}', ${idx})">Edit</button>
                            <button class="adm-btn-sm delete" onclick="window.admDeleteEpisodeInModal(${novel.id}, '${lang}', ${idx})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function resetEpisodeForm(novel, lang) {
        const form = document.getElementById('episodeForm');
        if (!form) return;

        form.reset();
        document.getElementById('epNovelId').value = novel.id;
        document.getElementById('epEditingIndex').value = '-1';
        document.getElementById('epLanguage').value = lang;

        const episodes = (novel.languages && novel.languages[lang] && Array.isArray(novel.languages[lang].episodes))
            ? novel.languages[lang].episodes
            : [];
        const nextNum = episodes.length + 1;

        document.getElementById('epNumber').value = nextNum;
        document.getElementById('epTitle').value = `Episode ${nextNum}: `;
        document.getElementById('epNativeTitle').value = `قسط نمبر ${nextNum}: `;
        document.getElementById('epReleaseDate').value = 'Released';
        document.getElementById('epLink').value = '';
        document.getElementById('epIsAvailable').value = 'true';

        document.getElementById('epFormHeader').textContent = `➕ Add New Episode (${lang === 'urdu' ? 'Urdu Edition' : 'English Edition'})`;
        document.getElementById('saveEpSubmitBtn').textContent = 'Save Episode';
        const cancelBtn = document.getElementById('cancelEpEditBtn');
        if (cancelBtn) cancelBtn.style.display = 'none';
    }

    window.admEditEpisodeInModal = function(novelId, lang, idx) {
        const novel = state.novels.find(n => n.id === novelId);
        if (!novel || !novel.languages || !novel.languages[lang] || !novel.languages[lang].episodes[idx]) return;

        const ep = novel.languages[lang].episodes[idx];
        document.getElementById('epNovelId').value = novelId;
        document.getElementById('epEditingIndex').value = idx;
        document.getElementById('epNumber').value = ep.episodeNumber;
        document.getElementById('epLanguage').value = lang;
        document.getElementById('epTitle').value = ep.title || '';
        document.getElementById('epNativeTitle').value = ep.nativeTitle || '';
        document.getElementById('epReleaseDate').value = ep.releaseDate || '';
        document.getElementById('epLink').value = ep.link || '';
        document.getElementById('epIsAvailable').value = ep.isAvailable ? 'true' : 'false';

        document.getElementById('epFormHeader').textContent = `✏️ Edit Episode #${ep.episodeNumber}`;
        document.getElementById('saveEpSubmitBtn').textContent = 'Update Episode';

        const cancelBtn = document.getElementById('cancelEpEditBtn');
        if (cancelBtn) {
            cancelBtn.style.display = 'inline-block';
            cancelBtn.onclick = () => resetEpisodeForm(novel, lang);
        }
    };

    window.admDeleteEpisodeInModal = async function(novelId, lang, idx) {
        if (!confirm('Are you sure you want to delete this episode?')) return;

        const novel = state.novels.find(n => n.id === novelId);
        if (!novel || !novel.languages || !novel.languages[lang]) return;

        const deletedEp = novel.languages[lang].episodes[idx];
        novel.languages[lang].episodes.splice(idx, 1);

        const sb = window.DastaneDB ? window.DastaneDB.init() : null;
        if (sb && deletedEp) {
            try {
                await sb.from('episodes').delete().match({
                    novel_id: novelId,
                    language: lang,
                    episode_number: deletedEp.episodeNumber
                });
            } catch (e) {
                console.error('Delete episode from DB error:', e);
            }
        }

        renderEpisodesListTbody(novel, lang);
        renderNovelsTable();
    };

    // Save Novel Form
    const novelForm = document.getElementById('novelForm');
    if (novelForm) {
        novelForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idVal = document.getElementById('novelId').value;
            const id = idVal ? Number(idVal) : Date.now();
            const title = document.getElementById('novelTitle').value.trim();
            const tag = document.getElementById('novelTag').value.trim() || 'Novel';
            const categoryName = document.getElementById('novelCategory').value.trim() || 'Novel';
            const description = document.getElementById('novelDesc').value.trim();
            const coverImage = document.getElementById('novelCover').value.trim();
            const link = document.getElementById('novelLink').value.trim();
            const buttonText = document.getElementById('novelButtonText').value.trim() || 'Read Online';
            const isAvailable = document.getElementById('novelIsAvailable').value === 'true';
            const hasLanguageSelection = document.getElementById('novelHasLanguage').value === 'true';

            const sb = window.DastaneDB ? window.DastaneDB.init() : null;

            if (sb) {
                try {
                    const payload = {
                        title, tag, category_name: categoryName, description,
                        cover_image: coverImage, link, button_text: buttonText,
                        is_available: isAvailable, has_language_selection: hasLanguageSelection
                    };
                    if (idVal) {
                        await sb.from('novels').update(payload).eq('id', id);
                    } else {
                        await sb.from('novels').insert([payload]);
                    }
                } catch (err) {
                    console.error('Save to Supabase error:', err);
                }
            }

            // Local state update
            const existingIndex = state.novels.findIndex(n => n.id === id);
            const novelObj = {
                id, title, tag, categoryName, description, coverImage, link, buttonText,
                isAvailable, hasLanguageSelection,
                languages: (existingIndex >= 0 && state.novels[existingIndex].languages) ? state.novels[existingIndex].languages : {
                    urdu: { name: "Urdu Edition", isAvailable: true, episodes: [] },
                    english: { name: "English Edition", isAvailable: false, episodes: [] }
                }
            };

            if (existingIndex >= 0) {
                state.novels[existingIndex] = { ...state.novels[existingIndex], ...novelObj };
            } else {
                state.novels.push(novelObj);
            }

            renderNovelsTable();
            updateStatsCounters();
            closeModal('novelModal');
            novelForm.reset();
        });
    }

    // Save Episode Form (Handles Add & Edit)
    const episodeForm = document.getElementById('episodeForm');
    if (episodeForm) {
        episodeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const novelId = Number(document.getElementById('epNovelId').value);
            const editingIdx = Number(document.getElementById('epEditingIndex').value);
            const episodeNumber = Number(document.getElementById('epNumber').value);
            const language = document.getElementById('epLanguage').value;
            const title = document.getElementById('epTitle').value.trim();
            const nativeTitle = document.getElementById('epNativeTitle').value.trim();
            const releaseDate = document.getElementById('epReleaseDate').value.trim();
            const link = document.getElementById('epLink').value.trim();
            const isAvailable = document.getElementById('epIsAvailable').value === 'true';

            const epPayload = {
                episodeNumber, title, nativeTitle, releaseDate, isAvailable, link
            };

            const novel = state.novels.find(n => n.id === novelId);
            if (!novel) return;

            if (!novel.languages) novel.languages = {};
            if (!novel.languages[language]) novel.languages[language] = { episodes: [] };
            if (!Array.isArray(novel.languages[language].episodes)) novel.languages[language].episodes = [];

            const sb = window.DastaneDB ? window.DastaneDB.init() : null;

            if (editingIdx >= 0) {
                // UPDATE existing episode
                novel.languages[language].episodes[editingIdx] = epPayload;

                if (sb) {
                    try {
                        await sb.from('episodes').update({
                            title, native_title: nativeTitle, release_date: releaseDate,
                            link, is_available: isAvailable
                        }).match({ novel_id: novelId, language, episode_number: episodeNumber });
                    } catch (err) {
                        console.error('Update episode error:', err);
                    }
                }
            } else {
                // INSERT new episode
                novel.languages[language].episodes.push(epPayload);

                if (sb) {
                    try {
                        await sb.from('episodes').insert([{
                            novel_id: novelId,
                            episode_number: episodeNumber,
                            language, title, native_title: nativeTitle,
                            release_date: releaseDate, link, is_available: isAvailable
                        }]);
                    } catch (err) {
                        console.error('Save episode error:', err);
                    }
                }
            }

            // Automatically ensure multi-episode pop-up is active
            novel.hasLanguageSelection = true;

            // Re-render episode list and main novels table
            renderEpisodesListTbody(novel, language);
            resetEpisodeForm(novel, language);
            renderNovelsTable();
        });
    }

    // --------------------------------------------------------------------------
    // 7. Short Stories Table & Modals
    // --------------------------------------------------------------------------
    function renderStoriesTable() {
        const tbody = document.getElementById('storiesTableBody');
        if (!tbody) return;

        if (state.stories.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--adm-text-muted); padding: 30px;">No stories found.</td></tr>`;
            return;
        }

        tbody.innerHTML = state.stories.map(story => {
            const statusClass = story.isAvailable ? 'available' : 'coming-soon';
            const statusText = story.isAvailable ? 'Available' : 'Coming Soon';
            const cover = story.coverImage || 'favicon-512x512.png';

            return `
                <tr>
                    <td><img src="${cover}" alt="${story.title}" class="adm-thumb" onerror="this.src='favicon-512x512.png'"></td>
                    <td><strong>${story.title}</strong></td>
                    <td><span style="font-size: 12px; color: var(--adm-text-muted);">${story.tag || 'Short Story'}</span></td>
                    <td><span class="adm-badge-pill ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="adm-actions-cell">
                            <button class="adm-btn-sm" onclick="window.admEditStory(${story.id})">Edit</button>
                            <button class="adm-btn-sm delete" onclick="window.admDeleteStory(${story.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.admEditStory = function(id) {
        const story = state.stories.find(s => s.id === id);
        if (!story) return;

        document.getElementById('storyId').value = story.id;
        document.getElementById('storyTitle').value = story.title || '';
        document.getElementById('storyTag').value = story.tag || 'Short Story';
        document.getElementById('storyStatus').value = story.isAvailable ? 'true' : 'false';
        document.getElementById('storyDesc').value = story.description || '';
        document.getElementById('storyCover').value = story.coverImage || '';
        document.getElementById('storyLink').value = story.link || '';

        document.getElementById('storyModalTitle').textContent = 'Edit Short Story';
        openModal('storyModal');
    };

    window.admDeleteStory = async function(id) {
        if (!confirm('Delete this story?')) return;
        const sb = window.DastaneDB ? window.DastaneDB.init() : null;
        if (sb) {
            try { await sb.from('stories').delete().eq('id', id); } catch (e) {}
        }
        state.stories = state.stories.filter(s => s.id !== id);
        renderStoriesTable();
        updateStatsCounters();
    };

    const storyForm = document.getElementById('storyForm');
    if (storyForm) {
        storyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idVal = document.getElementById('storyId').value;
            const id = idVal ? Number(idVal) : Date.now();
            const title = document.getElementById('storyTitle').value.trim();
            const tag = document.getElementById('storyTag').value.trim() || 'Short Story';
            const isAvailable = document.getElementById('storyStatus').value === 'true';
            const description = document.getElementById('storyDesc').value.trim();
            const coverImage = document.getElementById('storyCover').value.trim();
            const link = document.getElementById('storyLink').value.trim() || '#';

            const sb = window.DastaneDB ? window.DastaneDB.init() : null;
            if (sb) {
                try {
                    const payload = { title, tag, is_available: isAvailable, description, cover_image: coverImage, link };
                    if (idVal) {
                        await sb.from('stories').update(payload).eq('id', id);
                    } else {
                        await sb.from('stories').insert([payload]);
                    }
                } catch (e) {}
            }

            const storyObj = { id, title, tag, type: 'story', isAvailable, description, coverImage, link, buttonText: isAvailable ? 'Read Online' : 'Coming Soon' };
            const idx = state.stories.findIndex(s => s.id === id);
            if (idx >= 0) state.stories[idx] = storyObj;
            else state.stories.push(storyObj);

            renderStoriesTable();
            updateStatsCounters();
            closeModal('storyModal');
            storyForm.reset();
        });
    }

    // --------------------------------------------------------------------------
    // 8. Audiobooks Table & Modals
    // --------------------------------------------------------------------------
    function renderAudiobooksTable() {
        const tbody = document.getElementById('audiobooksTableBody');
        if (!tbody) return;

        if (state.audiobooks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--adm-text-muted); padding: 30px;">No audiobooks found.</td></tr>`;
            return;
        }

        tbody.innerHTML = state.audiobooks.map(audio => {
            const statusClass = audio.isAvailable ? 'available' : 'coming-soon';
            const statusText = audio.isAvailable ? 'Live' : 'Coming Soon';
            const cover = audio.coverImage || 'favicon-512x512.png';

            return `
                <tr>
                    <td><img src="${cover}" alt="${audio.title}" class="adm-thumb" onerror="this.src='favicon-512x512.png'"></td>
                    <td><strong>${audio.title}</strong></td>
                    <td>
                        <div style="font-size: 13px;">${audio.narrator || 'Dastane Studio'}</div>
                        <div style="font-size: 11.5px; color: var(--adm-text-muted);">⏱️ ${audio.duration || 'N/A'}</div>
                    </td>
                    <td><span class="adm-badge-pill ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="adm-actions-cell">
                            <button class="adm-btn-sm" onclick="window.admEditAudio(${audio.id})">Edit</button>
                            <button class="adm-btn-sm delete" onclick="window.admDeleteAudio(${audio.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.admEditAudio = function(id) {
        const audio = state.audiobooks.find(a => a.id === id);
        if (!audio) return;

        document.getElementById('audioId').value = audio.id;
        document.getElementById('audioTitle').value = audio.title || '';
        document.getElementById('audioNarrator').value = audio.narrator || '';
        document.getElementById('audioDuration').value = audio.duration || '';
        document.getElementById('audioSrc').value = audio.audioSrc || '';
        document.getElementById('audioCover').value = audio.coverImage || '';
        document.getElementById('audioDesc').value = audio.description || '';
        document.getElementById('audioIsAvailable').value = audio.isAvailable ? 'true' : 'false';

        document.getElementById('audioModalTitle').textContent = 'Edit Audiobook';
        openModal('audioModal');
    };

    window.admDeleteAudio = async function(id) {
        if (!confirm('Delete this audiobook?')) return;
        const sb = window.DastaneDB ? window.DastaneDB.init() : null;
        if (sb) {
            try { await sb.from('audiobooks').delete().eq('id', id); } catch (e) {}
        }
        state.audiobooks = state.audiobooks.filter(a => a.id !== id);
        renderAudiobooksTable();
        updateStatsCounters();
    };

    const audioForm = document.getElementById('audioForm');
    if (audioForm) {
        audioForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idVal = document.getElementById('audioId').value;
            const id = idVal ? Number(idVal) : Date.now();
            const title = document.getElementById('audioTitle').value.trim();
            const narrator = document.getElementById('audioNarrator').value.trim();
            const duration = document.getElementById('audioDuration').value.trim() || 'Available Soon';
            const audioSrc = document.getElementById('audioSrc').value.trim();
            const coverImage = document.getElementById('audioCover').value.trim();
            const description = document.getElementById('audioDesc').value.trim();
            const isAvailable = document.getElementById('audioIsAvailable').value === 'true';

            const sb = window.DastaneDB ? window.DastaneDB.init() : null;
            if (sb) {
                try {
                    const payload = { title, narrator, duration, audio_src: audioSrc, cover_image: coverImage, description, is_available: isAvailable };
                    if (idVal) {
                        await sb.from('audiobooks').update(payload).eq('id', id);
                    } else {
                        await sb.from('audiobooks').insert([payload]);
                    }
                } catch (e) {}
            }

            const audioObj = { id, title, type: 'audiobook', tag: 'Audio Drama', categoryName: 'Audiobook', narrator, duration, audioSrc, coverImage, description, isAvailable, buttonText: 'Listen Audio' };
            const idx = state.audiobooks.findIndex(a => a.id === id);
            if (idx >= 0) state.audiobooks[idx] = audioObj;
            else state.audiobooks.push(audioObj);

            renderAudiobooksTable();
            updateStatsCounters();
            closeModal('audioModal');
            audioForm.reset();
        });
    }

    // --------------------------------------------------------------------------
    // 9. Announcements / News Slider Table & Modals
    // --------------------------------------------------------------------------
    function renderNewsTable() {
        const tbody = document.getElementById('newsTableBody');
        if (!tbody) return;

        if (state.news.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--adm-text-muted); padding: 30px;">No announcements found.</td></tr>`;
            return;
        }

        tbody.innerHTML = state.news.map(item => {
            const cover = item.coverImage || 'favicon-512x512.png';
            return `
                <tr>
                    <td><img src="${cover}" alt="${item.title}" class="adm-thumb" onerror="this.src='favicon-512x512.png'"></td>
                    <td>
                        <strong>${item.title}</strong>
                        <div style="font-size: 11.5px; color: var(--adm-gold);">${item.highlightBadge || ''}</div>
                    </td>
                    <td><span style="font-size: 12px; color: var(--adm-text-muted);">${item.tag || 'News'}</span></td>
                    <td>${item.displayDuration || 8}s</td>
                    <td>
                        <div class="adm-actions-cell">
                            <button class="adm-btn-sm" onclick="window.admEditNews(${item.id})">Edit</button>
                            <button class="adm-btn-sm delete" onclick="window.admDeleteNews(${item.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.admEditNews = function(id) {
        const item = state.news.find(n => n.id === id);
        if (!item) return;

        document.getElementById('newsId').value = item.id;
        document.getElementById('newsTitle').value = item.title || '';
        document.getElementById('newsTag').value = item.tag || '';
        document.getElementById('newsTagType').value = item.tagType || 'urgent';
        document.getElementById('newsDuration').value = item.displayDuration || 8;
        document.getElementById('newsHighlight').value = item.highlightBadge || '';
        document.getElementById('newsUrdu').value = item.messageUrdu || '';
        document.getElementById('newsEnglish').value = item.messageEnglish || '';
        document.getElementById('newsActionText').value = item.actionText || 'Read Online';
        document.getElementById('newsActionLink').value = item.actionLink || '#library';
        document.getElementById('newsCover').value = item.coverImage || '';

        document.getElementById('newsModalTitle').textContent = 'Edit Announcement';
        openModal('newsModal');
    };

    window.admDeleteNews = async function(id) {
        if (!confirm('Delete this announcement?')) return;
        const sb = window.DastaneDB ? window.DastaneDB.init() : null;
        if (sb) {
            try { await sb.from('news_announcements').delete().eq('id', id); } catch (e) {}
        }
        state.news = state.news.filter(n => n.id !== id);
        renderNewsTable();
        updateStatsCounters();
    };

    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idVal = document.getElementById('newsId').value;
            const id = idVal ? Number(idVal) : Date.now();
            const title = document.getElementById('newsTitle').value.trim();
            const tag = document.getElementById('newsTag').value.trim();
            const tagType = document.getElementById('newsTagType').value;
            const displayDuration = Number(document.getElementById('newsDuration').value) || 8;
            const highlightBadge = document.getElementById('newsHighlight').value.trim();
            const messageUrdu = document.getElementById('newsUrdu').value.trim();
            const messageEnglish = document.getElementById('newsEnglish').value.trim();
            const actionText = document.getElementById('newsActionText').value.trim();
            const actionLink = document.getElementById('newsActionLink').value.trim();
            const coverImage = document.getElementById('newsCover').value.trim();

            const sb = window.DastaneDB ? window.DastaneDB.init() : null;
            if (sb) {
                try {
                    const payload = {
                        title, tag, tag_type: tagType, display_duration: displayDuration,
                        highlight_badge: highlightBadge, message_urdu: messageUrdu,
                        message_english: messageEnglish, action_text: actionText, action_link: actionLink,
                        cover_image: coverImage, is_active: true
                    };
                    if (idVal) {
                        await sb.from('news_announcements').update(payload).eq('id', id);
                    } else {
                        await sb.from('news_announcements').insert([payload]);
                    }
                } catch (e) {}
            }

            const newsObj = { id, title, tag, tagType, displayDuration, highlightBadge, messageUrdu, messageEnglish, actionText, actionLink, coverImage };
            const idx = state.news.findIndex(n => n.id === id);
            if (idx >= 0) state.news[idx] = newsObj;
            else state.news.push(newsObj);

            renderNewsTable();
            updateStatsCounters();
            closeModal('newsModal');
            newsForm.reset();
        });
    }

    // --------------------------------------------------------------------------
    // 10. Subscribers & Reading Circle Table
    // --------------------------------------------------------------------------
    async function renderSubscribersTable() {
        const tbody = document.getElementById('subscribersTableBody');
        if (!tbody) return;

        let subscribers = [];
        const sb = window.DastaneDB ? window.DastaneDB.init() : null;
        if (sb) {
            try {
                const { data } = await sb.from('subscribers').select('*').order('created_at', { ascending: false });
                if (data) subscribers = data;
            } catch (e) {}
        }

        const badge = document.getElementById('badgeSubscribers');
        if (badge) badge.textContent = subscribers.length;

        if (subscribers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--adm-text-muted); padding: 30px;">No submissions found yet. As readers fill the Reading Circle form, they appear here.</td></tr>`;
            return;
        }

        tbody.innerHTML = subscribers.map(s => `
            <tr>
                <td><strong>${s.first_name} ${s.surname || ''}</strong></td>
                <td><a href="mailto:${s.email}" style="color: var(--adm-gold);">${s.email}</a></td>
                <td>${s.phone || 'N/A'}</td>
                <td><span class="adm-badge-pill available">${s.role_plan || 'Reader'}</span></td>
                <td style="font-size: 12px; color: var(--adm-text-muted);">${new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }

    // --------------------------------------------------------------------------
    // 11. Database Settings Form
    // --------------------------------------------------------------------------
    const settingsForm = document.getElementById('admSettingsForm');
    const settingsStatus = document.getElementById('settingsStatus');

    if (settingsForm) {
        // Pre-fill current config
        const creds = window.DastaneDB ? window.DastaneDB.getCredentials() : { url: '', anonKey: '' };
        const urlInput = document.getElementById('settingSupabaseUrl');
        const keyInput = document.getElementById('settingSupabaseAnonKey');
        if (urlInput) urlInput.value = creds.url;
        if (keyInput) keyInput.value = creds.anonKey;

        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const url = urlInput.value.trim();
            const anonKey = keyInput.value.trim();

            localStorage.setItem('dastane_supabase_url', url);
            localStorage.setItem('dastane_supabase_anon_key', anonKey);

            settingsStatus.className = 'adm-status-box success';
            settingsStatus.textContent = '✅ Settings saved! Re-testing connection...';
            settingsStatus.style.display = 'block';

            setTimeout(() => {
                location.reload();
            }, 800);
        });
    }

    const testDbBtn = document.getElementById('testDbConnectionBtn');
    if (testDbBtn) {
        testDbBtn.addEventListener('click', async () => {
            testDbBtn.disabled = true;
            testDbBtn.textContent = 'Testing...';
            const sb = window.DastaneDB ? window.DastaneDB.init() : null;

            if (sb) {
                try {
                    const { count, error } = await sb.from('novels').select('*', { count: 'exact', head: true });
                    if (!error) {
                        alert(`🎉 Success! Connected to Supabase Database successfully.`);
                    } else {
                        alert(`⚠️ Connected to Supabase, but received notice: ${error.message}. Make sure you ran supabase-setup.sql!`);
                    }
                } catch (e) {
                    alert(`❌ Could not connect: ${e.message}`);
                }
            } else {
                alert('❌ Please enter a valid Supabase Project URL and Public Anon Key first!');
            }
            testDbBtn.disabled = false;
            testDbBtn.textContent = 'Test Connection';
        });
    }

    // --------------------------------------------------------------------------
    // 12. 1-Click Offline Backup Generator
    // --------------------------------------------------------------------------
    const generateBackupBtn = document.getElementById('generateBackupBtn');
    const backupCodeOutput = document.getElementById('backupCodeOutput');

    if (generateBackupBtn && backupCodeOutput) {
        generateBackupBtn.addEventListener('click', () => {
            const novelsCode = `// --- js/data/novels-list.js ---\nconst novelsList = ${JSON.stringify(state.novels, null, 4)};\nif (typeof window !== 'undefined') window.novelsList = novelsList;\n\n`;
            const storiesCode = `// --- js/data/stories-list.js ---\nconst storiesList = ${JSON.stringify(state.stories, null, 4)};\nif (typeof window !== 'undefined') window.storiesList = storiesList;\n\n`;
            const audioCode = `// --- js/data/audiobooks-list.js ---\nconst audiobooksList = ${JSON.stringify(state.audiobooks, null, 4)};\nif (typeof window !== 'undefined') window.audiobooksList = audiobooksList;\n\n`;
            const newsCode = `// --- js/data/news/news-list.js ---\nwindow.newsList = ${JSON.stringify(state.news, null, 4)};\n`;

            backupCodeOutput.value = novelsCode + storiesCode + audioCode + newsCode;
            backupCodeOutput.select();
            alert('🎉 Backup code generated! You can copy this code and paste it into your local static JS files anytime as an offline safety backup.');
        });
    }

    // --------------------------------------------------------------------------
    // 13. Modal Open / Close Helpers
    // --------------------------------------------------------------------------
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    }

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            closeModal(modalId);
        });
    });

    document.querySelectorAll('.adm-modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) backdrop.classList.remove('active');
        });
    });

    // Open Add Modals
    const addNovelBtn = document.getElementById('openAddNovelModalBtn');
    if (addNovelBtn) addNovelBtn.addEventListener('click', () => {
        const form = document.getElementById('novelForm');
        if (form) form.reset();
        document.getElementById('novelId').value = '';
        document.getElementById('novelModalTitle').textContent = 'Add New Novel';
        openModal('novelModal');
    });

    const addStoryBtn = document.getElementById('openAddStoryModalBtn');
    if (addStoryBtn) addStoryBtn.addEventListener('click', () => {
        const form = document.getElementById('storyForm');
        if (form) form.reset();
        document.getElementById('storyId').value = '';
        document.getElementById('storyModalTitle').textContent = 'Add Short Story';
        openModal('storyModal');
    });

    const addAudioBtn = document.getElementById('openAddAudioModalBtn');
    if (addAudioBtn) addAudioBtn.addEventListener('click', () => {
        const form = document.getElementById('audioForm');
        if (form) form.reset();
        document.getElementById('audioId').value = '';
        document.getElementById('audioModalTitle').textContent = 'Add Audiobook';
        openModal('audioModal');
    });

    const addNewsBtn = document.getElementById('openAddNewsModalBtn');
    if (addNewsBtn) addNewsBtn.addEventListener('click', () => {
        const form = document.getElementById('newsForm');
        if (form) form.reset();
        document.getElementById('newsId').value = '';
        document.getElementById('newsModalTitle').textContent = 'Post Announcement';
        openModal('newsModal');
    });

    // Boot
    checkAuth();
})();
