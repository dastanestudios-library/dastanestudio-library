/**
 * ============================================================================
 * 📖 DASTANE STUDIO & LIBRARY - ADVANCED NOVELS RENDERER & FAVORITES ENGINE
 * ============================================================================
 * Features:
 * 1. Live Real-Time Search across all novels, stories, and genres.
 * 2. Multi-Category Filtering: All Publications, Novels, Short Stories, Favorites.
 * 3. User-Account Specific Favorites (saved permanently per user account).
 * 4. 9-Items Per Page Grid Pagination (3 rows x 3 columns) with smooth page navigation.
 * 5. Instant Visibility & Zero Blank Screen Guarantee.
 * ============================================================================
 */

(function () {
    'use strict';

    const ITEMS_PER_PAGE = 9;
    let currentFilter = 'all';
    let searchQuery = '';
    let currentPage = 1;

    // Hardcoded Emergency Fallback Catalog
    const emergencyFallback = [
        {
            id: 1,
            title: "The Last Letter",
            type: "novel",
            tag: "Featured Novel",
            categoryName: "Novel",
            description: "A poignant journey of love, patience, and destiny between college students Shehryar Hashim and Mushk Farooqi.",
            buttonText: "Read Online",
            isAvailable: true,
            link: "https://thelastletterds.blogspot.com/",
            alertMessage: "The reading system is currently loading...",
            coverImage: "https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg"
        },
        {
            id: 5,
            title: "Safar E Zayan",
            type: "novel",
            tag: "Upcoming Novel",
            categoryName: "Novel",
            description: "A massive cultural mystery thriller rooted in ancient regional folklore and the hidden historical secrets of our soil.",
            buttonText: "Coming Soon",
            isAvailable: false,
            link: "#",
            alertMessage: "Safar E Zayan is releasing soon. Stay tuned!",
            coverImage: "https://i.pinimg.com/1200x/70/38/d4/7038d4e578dd91b0f074302ea12de001.jpg"
        },
        {
            id: 2,
            title: "Ishq E Lamakan",
            type: "story",
            tag: "Short Story",
            categoryName: "Short Story",
            description: "A mystical exploration of spiritual attachment, sacrifice, and the boundless horizons of heartfelt passion.",
            buttonText: "Coming Soon",
            isAvailable: false,
            link: "#",
            alertMessage: "Ishq E Lamakan is currently in editorial review.",
            coverImage: "https://i.pinimg.com/1200x/d9/67/10/d967100f67748c6bb200b735dcfed865.jpg"
        },
        {
            id: 3,
            title: "Dastan-e-Ishq",
            type: "story",
            tag: "Short Story",
            categoryName: "Short Story",
            description: "A heartfelt emotional story exploring devotion, time, and the unyielding beauty of classical Pakistani storytelling.",
            buttonText: "Coming Soon",
            isAvailable: false,
            link: "#",
            alertMessage: "Dastan-e-Ishq is preparing for digital release.",
            coverImage: "https://i.pinimg.com/736x/9e/b4/db/9eb4dbdaa4d2b96c5cebf6b3a2d3192b.jpg"
        },
        {
            id: 4,
            title: "Zindan-e-Khwab",
            type: "story",
            tag: "Suspense Story",
            categoryName: "Short Story",
            description: "A gripping psychological suspense tale of an imaginative mind whose darkest dreams materialize into waking reality.",
            buttonText: "Coming Soon",
            isAvailable: false,
            link: "#",
            alertMessage: "Zindan-e-Khwab will be available to read soon.",
            coverImage: "https://i.pinimg.com/736x/32/d4/ff/32d4ff5780dc906d9459a159ea68a639.jpg"
        }
    ];

    // Helper: Get active user from session
    function getActiveUser() {
        try {
            const data = localStorage.getItem('dastane_active_session');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    // Helper: Get favorites for currently logged-in user or guest
    function getFavorites() {
        try {
            const user = getActiveUser();
            if (user) {
                return Array.isArray(user.favorites) ? user.favorites : [];
            } else {
                const guestData = localStorage.getItem('dastane_guest_favorites');
                return guestData ? JSON.parse(guestData) : [];
            }
        } catch (e) {
            console.error('Error reading favorites:', e);
            return [];
        }
    }

    // Helper: Save favorites
    function saveFavorites(favs) {
        try {
            const user = getActiveUser();
            if (user) {
                user.favorites = favs;
                localStorage.setItem('dastane_active_session', JSON.stringify(user));

                const usersData = localStorage.getItem('dastane_users_db');
                if (usersData) {
                    const users = JSON.parse(usersData);
                    const idx = users.findIndex(u => (u.id && u.id === user.id) || (u.username && u.username === user.username));
                    if (idx !== -1) {
                        users[idx].favorites = favs;
                        localStorage.setItem('dastane_users_db', JSON.stringify(users));
                    }
                }
            } else {
                localStorage.setItem('dastane_guest_favorites', JSON.stringify(favs));
            }
            updateFavCountBadge();
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }

    // Helper: Update live badge count
    function updateFavCountBadge() {
        const badge = document.getElementById('favCountBadge');
        if (badge) {
            const favs = getFavorites();
            badge.textContent = favs.length;
        }
    }

    // Floating micro toast notification
    function showToast(message, isAdded) {
        let toast = document.getElementById('dastaneToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'dastaneToast';
            toast.className = 'dastane-toast';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<span style="font-size: 16px;">${isAdded ? '❤️' : '🤍'}</span> <span>${message}</span>`;
        toast.classList.add('show');

        if (toast.timeoutId) clearTimeout(toast.timeoutId);
        toast.timeoutId = setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    }

    // Toggle a novel in favorites
    function toggleFavorite(novelId, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const user = getActiveUser();
        const id = Number(novelId);
        const allItems = getAllCatalogItems();
        const novel = allItems.find(n => n.id === id);
        const title = novel ? novel.title : 'Story';

        // Enforce Account Requirement
        if (!user) {
            if (typeof window.showModal === 'function') {
                window.showModal(
                    '🔒 Account Required for Favorites',
                    `
                    <div style="text-align: center; padding: 12px 0;">
                        <div style="font-size: 42px; margin-bottom: 12px;">📚❤️</div>
                        <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; color: var(--accent-color); margin-bottom: 8px;">Sign In to Save Your Reading List</h3>
                        <p style="font-size: 14.5px; line-height: 1.6; margin-bottom: 20px; opacity: 0.9;">
                            Please Sign In or Create a Free Account to add <strong>"${escapeHtml(title)}"</strong> to your personal library and access your favorite reads anytime across all devices!
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                            <button class="read-btn" style="padding: 10px 22px;" onclick="document.getElementById('confirmationModal').classList.remove('active'); if (typeof window.openAuthModal === 'function') window.openAuthModal('signup');">Create Free Account</button>
                            <button class="read-btn" style="background: transparent; border: 1.5px solid var(--accent-color); color: var(--accent-color); padding: 10px 20px;" onclick="document.getElementById('confirmationModal').classList.remove('active'); if (typeof window.openAuthModal === 'function') window.openAuthModal('login');">Sign In</button>
                        </div>
                    </div>
                    `
                );
            } else {
                alert('Please Sign In or Create an Account to save stories to your Favorites!');
            }
            return;
        }

        const favs = getFavorites();
        const index = favs.indexOf(id);

        let isAdded = false;
        if (index > -1) {
            favs.splice(index, 1);
            isAdded = false;
            showToast(`Removed "${title}" from your Favorites.`, false);
        } else {
            favs.push(id);
            isAdded = true;
            showToast(`Saved "${title}" to your Favorites!`, true);
        }

        saveFavorites(favs);

        if (currentFilter === 'favorites') {
            renderNovelCards();
        } else {
            const btn = document.querySelector(`.book-fav-btn[data-novel-id="${id}"]`);
            if (btn) {
                btn.classList.toggle('favorited', isAdded);
                btn.setAttribute('aria-label', isAdded ? 'Remove from favorites' : 'Add to favorites');
                btn.setAttribute('title', isAdded ? 'Remove from favorites' : 'Save to favorites');
                btn.innerHTML = isAdded 
                    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
                    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            }
        }
    }

    // Get all catalog items with full fallback guarantees
    function getAllCatalogItems() {
        if (typeof window !== 'undefined' && Array.isArray(window.novelsData) && window.novelsData.length > 0) {
            return window.novelsData;
        }

        let items = [];
        if (typeof window !== 'undefined' && Array.isArray(window.novelsList) && window.novelsList.length > 0) {
            items = items.concat(window.novelsList);
        }
        if (typeof window !== 'undefined' && Array.isArray(window.storiesList) && window.storiesList.length > 0) {
            items = items.concat(window.storiesList);
        }

        if (items.length > 0) {
            return items;
        }

        return emergencyFallback;
    }

    // Global Novel Read fallback handler
    window.handleNovelRead = function (title, message) {
        const alertMsg = message || `The reading system for "${title}" is currently loading...`;
        if (typeof window.showModal === 'function') {
            window.showModal(`📖 ${title}`, `<p>${alertMsg}</p>`);
        } else {
            alert(alertMsg);
        }
    };

    // Filter by tab
    function filterLibrary(filterType) {
        currentFilter = filterType || 'all';
        currentPage = 1;

        document.querySelectorAll('.lib-filter-btn').forEach(btn => {
            if (btn.getAttribute('data-filter') === currentFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        renderNovelCards();
    }

    // Main Renderer
    function renderNovelCards() {
        const grid = document.getElementById('booksGrid');
        const paginationEl = document.getElementById('libraryPagination');
        if (!grid) return;

        const user = getActiveUser();
        const allItems = getAllCatalogItems();
        const favs = getFavorites();
        let filtered = allItems;

        // 1. Check if guest is trying to view favorites tab
        if (currentFilter === 'favorites' && !user) {
            grid.innerHTML = `
                <div class="empty-favorites-box">
                    <div style="font-size: 44px; margin-bottom: 12px;">🔒❤️</div>
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 8px;">Sign In to Access Your Library</h3>
                    <p style="font-size: 14.5px; opacity: 0.85; max-width: 440px; margin: 0 auto 18px; line-height: 1.6;">
                        Your personal Favorites reading list is saved securely in your account. Please Sign In or Create a Free Account to view and manage your saved books!
                    </p>
                    <button class="read-btn" onclick="if (typeof window.openAuthModal === 'function') window.openAuthModal('login');">Sign In to Your Account</button>
                </div>
            `;
            if (paginationEl) paginationEl.style.display = 'none';
            return;
        }

        // 2. Category Filter
        if (currentFilter === 'novel') {
            filtered = filtered.filter(item => item.type === 'novel' || item.categoryName === 'Novel');
        } else if (currentFilter === 'story') {
            filtered = filtered.filter(item => item.type === 'story' || item.categoryName === 'Short Story');
        } else if (currentFilter === 'favorites') {
            filtered = filtered.filter(item => favs.includes(item.id));
        }

        // 3. Search Filter
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => {
                const titleMatch = (item.title || '').toLowerCase().includes(q);
                const descMatch = (item.description || '').toLowerCase().includes(q);
                const tagMatch = (item.tag || '').toLowerCase().includes(q);
                const catMatch = (item.categoryName || '').toLowerCase().includes(q);
                return titleMatch || descMatch || tagMatch || catMatch;
            });
        }

        // 4. Handle Empty State for Favorites
        if (currentFilter === 'favorites' && filtered.length === 0 && searchQuery.trim() === '') {
            grid.innerHTML = `
                <div class="empty-favorites-box">
                    <div style="font-size: 44px; margin-bottom: 12px;">📚❤️</div>
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 8px;">No Favorite Books Saved Yet</h3>
                    <p style="font-size: 14.5px; opacity: 0.85; max-width: 440px; margin: 0 auto 18px; line-height: 1.6;">
                        You haven't saved any stories to your reading list yet. Click the heart icon on any novel or story to access it here anytime!
                    </p>
                    <button class="read-btn" onclick="window.filterLibrary('all')">Browse All Publications</button>
                </div>
            `;
            if (paginationEl) paginationEl.style.display = 'none';
            return;
        }

        // 4. Handle Empty State for Search
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-favorites-box">
                    <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 6px;">No Titles Found</h3>
                    <p style="font-size: 14px; opacity: 0.8; margin-bottom: 16px;">
                        No publications matched your search query "<strong>${escapeHtml(searchQuery)}</strong>".
                    </p>
                    <button class="read-btn" onclick="window.clearLibrarySearch()">Clear Search</button>
                </div>
            `;
            if (paginationEl) paginationEl.style.display = 'none';
            return;
        }

        // 5. Pagination Calculation (9 items per page)
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        if (currentPage > totalPages) currentPage = 1;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const pagedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        grid.innerHTML = '';

        pagedItems.forEach((novel, index) => {
            const isFav = favs.includes(novel.id);
            const card = document.createElement('div');
            // Add visible immediately so no blank/invisible state
            card.className = 'book-card reveal visible';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transitionDelay = `${index * 0.05}s`;

            // Favorite Button HTML
            const favIconSvg = isFav
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

            const favBtnHtml = `
                <button class="book-fav-btn ${isFav ? 'favorited' : ''}" data-novel-id="${novel.id}" aria-label="${isFav ? 'Remove from favorites' : 'Save to favorites'}" title="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
                    ${favIconSvg}
                </button>
            `;

            // Cover Image
            const imageHtml = novel.coverImage 
                ? `<div class="book-cover-wrap"><img src="${novel.coverImage}" alt="${escapeHtml(novel.title)}" class="book-cover" loading="lazy"></div>`
                : '';

            // Tag badge
            const tagHtml = novel.tag ? `<span class="tag">${escapeHtml(novel.tag)}</span>` : '';

            // Title & Description
            const titleHtml = `<h3>${escapeHtml(novel.title)}</h3>`;
            const descHtml = `<p>${escapeHtml(novel.description || '')}</p>`;

            // Action button
            let buttonHtml = '';
            if (novel.isAvailable === false) {
                buttonHtml = `<button class="read-btn" disabled>${novel.buttonText || 'Coming Soon'}</button>`;
            } else if (novel.link && novel.link !== '#' && novel.link.trim() !== '') {
                buttonHtml = `<a href="${novel.link}" class="read-btn" target="_blank" rel="noopener noreferrer">${novel.buttonText || 'Read Online'}</a>`;
            } else {
                const safeTitle = (novel.title || '').replace(/'/g, "\\'");
                const safeMsg = (novel.alertMessage || '').replace(/'/g, "\\'");
                buttonHtml = `<button class="read-btn" onclick="handleNovelRead('${safeTitle}', '${safeMsg}')">${novel.buttonText || 'Read Online'}</button>`;
            }

            card.innerHTML = `
                ${favBtnHtml}
                ${imageHtml}
                ${tagHtml}
                ${titleHtml}
                ${descHtml}
                <div class="card-action">
                    ${buttonHtml}
                </div>
            `;

            // Bind Favorite Click
            const favBtn = card.querySelector('.book-fav-btn');
            if (favBtn) {
                favBtn.addEventListener('click', (e) => toggleFavorite(novel.id, e));
            }

            grid.appendChild(card);
        });

        // 6. Render Pagination
        renderPagination(totalPages);
    }

    // Render Pagination Controls
    function renderPagination(totalPages) {
        const paginationEl = document.getElementById('libraryPagination');
        if (!paginationEl) return;

        if (totalPages <= 1) {
            paginationEl.style.display = 'none';
            return;
        }

        paginationEl.style.display = 'flex';
        paginationEl.innerHTML = '';

        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-nav-btn' + (currentPage === 1 ? ' disabled' : '');
        prevBtn.innerHTML = '&larr; Prev';
        prevBtn.disabled = (currentPage === 1);
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderNovelCards();
                scrollToLibrary();
            }
        });
        paginationEl.appendChild(prevBtn);

        // Numbered Pages
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-num-btn' + (i === currentPage ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderNovelCards();
                scrollToLibrary();
            });
            paginationEl.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-nav-btn' + (currentPage === totalPages ? ' disabled' : '');
        nextBtn.innerHTML = 'Next &rarr;';
        nextBtn.disabled = (currentPage === totalPages);
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderNovelCards();
                scrollToLibrary();
            }
        });
        paginationEl.appendChild(nextBtn);
    }

    function scrollToLibrary() {
        const libSection = document.getElementById('library');
        if (libSection) {
            libSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Clear Search
    function clearLibrarySearch() {
        searchQuery = '';
        const searchInput = document.getElementById('librarySearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        renderNovelCards();
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

    // Initialize Search & Filter Listeners
    function initLibraryControls() {
        const filterAllBtn = document.getElementById('filterAllBtn');
        const filterNovelsBtn = document.getElementById('filterNovelsBtn');
        const filterStoriesBtn = document.getElementById('filterStoriesBtn');
        const filterFavBtn = document.getElementById('filterFavBtn');

        if (filterAllBtn) filterAllBtn.addEventListener('click', () => filterLibrary('all'));
        if (filterNovelsBtn) filterNovelsBtn.addEventListener('click', () => filterLibrary('novel'));
        if (filterStoriesBtn) filterStoriesBtn.addEventListener('click', () => filterLibrary('story'));
        if (filterFavBtn) filterFavBtn.addEventListener('click', () => filterLibrary('favorites'));

        const searchInput = document.getElementById('librarySearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                currentPage = 1;
                if (clearBtn) {
                    clearBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
                }
                renderNovelCards();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', clearLibrarySearch);
        }
    }

    // Expose methods globally
    window.filterLibrary = filterLibrary;
    window.toggleFavorite = toggleFavorite;
    window.getFavorites = getFavorites;
    window.clearLibrarySearch = clearLibrarySearch;
    window.refreshLibraryCatalog = renderNovelCards;

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLibraryControls();
            updateFavCountBadge();
            renderNovelCards();
        });
    } else {
        initLibraryControls();
        updateFavCountBadge();
        renderNovelCards();
    }

})();
