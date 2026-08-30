/**
 * ============================================================================
 * 📖 DASTANE STUDIO & LIBRARY - NOVEL CARDS RENDERER & FAVORITES SYSTEM
 * ============================================================================
 * Handles rendering novels from `js/data/novels.js`, Bookmarking / Favorites,
 * Library Filtering (All Titles vs. My Favorites), and Favorite Count Badges.
 * ============================================================================
 */

(function () {
    'use strict';

    const FAVORITES_STORAGE_KEY = 'dastane_user_favorites';
    let currentFilter = 'all';

    // Helper: Get user's favorited novel IDs
    function getFavorites() {
        try {
            const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading favorites:', e);
            return [];
        }
    }

    // Helper: Save user's favorited novel IDs
    function saveFavorites(favs) {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
            updateFavCountBadge();
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }

    // Helper: Update badge count
    function updateFavCountBadge() {
        const badge = document.getElementById('favCountBadge');
        if (badge) {
            const favs = getFavorites();
            badge.textContent = favs.length;
            badge.style.display = favs.length > 0 ? 'inline-block' : 'inline-block';
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

        const favs = getFavorites();
        const id = Number(novelId);
        const index = favs.indexOf(id);

        const novel = (typeof novelsData !== 'undefined' && Array.isArray(novelsData))
            ? novelsData.find(n => n.id === id)
            : null;
        const title = novel ? novel.title : 'Story';

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

        // Re-render cards or update button UI
        if (currentFilter === 'favorites') {
            renderNovelCards();
        } else {
            // Update specific button on screen
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

    // Global Novel Read fallback handler
    window.handleNovelRead = function (title, message) {
        const alertMsg = message || `The reading system for "${title}" is currently loading...`;
        if (typeof window.showModal === 'function') {
            window.showModal(`📖 ${title}`, `<p>${alertMsg}</p>`);
        } else {
            alert(alertMsg);
        }
    };

    // Filter library items
    function filterLibrary(filterType) {
        currentFilter = filterType || 'all';

        // Update tab buttons active state
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
        if (!grid) return;

        if (typeof novelsData === 'undefined' || !Array.isArray(novelsData) || novelsData.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; opacity: 0.7;">
                    <p>No publications available at the moment. Please check back soon!</p>
                </div>
            `;
            return;
        }

        const favs = getFavorites();
        let displayNovels = novelsData;

        if (currentFilter === 'favorites') {
            displayNovels = novelsData.filter(n => favs.includes(n.id));
        }

        // Empty favorites state
        if (currentFilter === 'favorites' && displayNovels.length === 0) {
            grid.innerHTML = `
                <div class="empty-favorites-box">
                    <div style="font-size: 44px; margin-bottom: 12px;">📚❤️</div>
                    <h3 style="font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 8px;">No Favorite Books Saved Yet</h3>
                    <p style="font-size: 14.5px; opacity: 0.85; max-width: 440px; margin: 0 auto 18px; line-height: 1.6;">
                        You haven't added any stories to your personal library yet. Click the heart icon on any novel card to save your favorite reads here!
                    </p>
                    <button class="read-btn" onclick="window.filterLibrary('all')">Browse All Publications</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';

        displayNovels.forEach((novel, index) => {
            const isFav = favs.includes(novel.id);
            const card = document.createElement('div');
            card.className = 'book-card reveal';
            card.style.transitionDelay = `${index * 0.08}s`;

            // Favorite Button HTML
            const favIconSvg = isFav
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

            const favBtnHtml = `
                <button class="book-fav-btn ${isFav ? 'favorited' : ''}" data-novel-id="${novel.id}" aria-label="${isFav ? 'Remove from favorites' : 'Save to favorites'}" title="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
                    ${favIconSvg}
                </button>
            `;

            // Optional cover image
            const imageHtml = novel.coverImage 
                ? `<div class="book-cover-wrap"><img src="${novel.coverImage}" alt="${novel.title}" class="book-cover"></div>`
                : '';

            // Tag badge
            const tagHtml = novel.tag ? `<span class="tag">${novel.tag}</span>` : '';

            // Title & Description
            const titleHtml = `<h3>${novel.title}</h3>`;
            const descHtml = `<p>${novel.description || ''}</p>`;

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
    }

    // Bind Filter Tabs
    function initFilterTabs() {
        const filterAllBtn = document.getElementById('filterAllBtn');
        const filterFavBtn = document.getElementById('filterFavBtn');

        if (filterAllBtn) filterAllBtn.addEventListener('click', () => filterLibrary('all'));
        if (filterFavBtn) filterFavBtn.addEventListener('click', () => filterLibrary('favorites'));
    }

    // Expose methods globally
    window.filterLibrary = filterLibrary;
    window.toggleFavorite = toggleFavorite;
    window.getFavorites = getFavorites;

    // Initialize on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        initFilterTabs();
        updateFavCountBadge();
        renderNovelCards();
    });

})();
