/**
 * ============================================================================
 * 📢 DASTANE STUDIO & LIBRARY - NEWS & ANNOUNCEMENTS ENGINE (9:16 STORY SLIDER)
 * ============================================================================
 * Features:
 * 1. 9:16 Aspect Ratio Vertical Story Card matching the Studio theme.
 * 2. Segmented top progress bars displaying real-time countdown.
 * 3. Individual editable duration per news item (displayDuration).
 * 4. Automatic right-to-left smooth transition.
 * 5. Touch swipe gestures (Left / Right) & Navigation buttons.
 * 6. Pause timer on hover / touch hold.
 * ============================================================================
 */

(function () {
    'use strict';

    let currentIndex = 0;
    let timerInterval = null;
    let progressStartTime = 0;
    let currentDurationMs = 8000;
    let isPaused = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function getNewsData() {
        if (typeof window !== 'undefined' && Array.isArray(window.newsList) && window.newsList.length > 0) {
            return window.newsList;
        }
        return [
            {
                id: 1,
                title: "The Last Letter — Episode 2 Release Update",
                subtitle: "اہم ترین اطلاع برائے قارئین",
                tag: "Important Update • اہم اطلاع",
                date: "September 02, 2026",
                displayDuration: 9,
                coverImage: "https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg",
                highlightBadge: "📅 New Date: 9 Sep 2026 • 8:00 PM",
                messageUrdu: "ناول 'دی لاسٹ لیٹر' کی دوسری قسط اب 9 ستمبر 2026 کو رات 8:00 بجے ریلیز کی جائے گی۔ تاخیر کے لیے ہم دل سے معذرت خواہ ہیں۔ قسط نمبر 2 بے حد سنسنی خیز اور معیاری بنائی جا رہی ہے!",
                messageEnglish: "Episode 2 of 'The Last Letter' will officially release on Wednesday, 9th September 2026 at 8:00 PM PKT. We sincerely apologize for the delay as we polish every detail!",
                actionText: "Read Episode 1 Online",
                actionLink: "https://thelastletterds.blogspot.com/"
            }
        ];
    }

    function renderNewsSection() {
        const container = document.getElementById('newsAnnouncementsBox');
        if (!container) return;

        const news = getNewsData();
        if (news.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = `
            <div class="news-outer-wrapper reveal">
                <div class="news-section-header">
                    <span class="news-live-pill"><span class="news-live-dot"></span> STUDIO DISPATCH</span>
                    <h2 class="news-main-title">Latest News &amp; Announcements</h2>
                    <p class="news-main-sub">Stay updated with fresh release schedules, studio notices, and literary events.</p>
                </div>

                <!-- 9:16 Vertical Story Box -->
                <div class="news-story-container" id="newsStoryContainer">
                    <!-- Segmented Story Progress Bars -->
                    <div class="news-story-bars" id="newsStoryBars">
                        ${news.map((item, idx) => `
                            <div class="story-bar-track" data-index="${idx}">
                                <div class="story-bar-fill" id="storyBarFill_${idx}"></div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Slide Content Wrapper (Right-to-Left Slider) -->
                    <div class="news-slides-track" id="newsSlidesTrack">
                        ${news.map((item, idx) => renderSingleSlide(item, idx)).join('')}
                    </div>

                    <!-- Left & Right Arrow Navigation -->
                    <button class="news-nav-btn news-prev-btn" id="newsPrevBtn" aria-label="Previous News">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button class="news-nav-btn news-next-btn" id="newsNextBtn" aria-label="Next News">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>

                    <!-- Story Footer Info & Counter -->
                    <div class="news-story-footer">
                        <div class="news-counter" id="newsCounter">1 / ${news.length}</div>
                        <div class="news-swipe-hint">👈 Swipe or Click to browse announcements 👉</div>
                    </div>
                </div>
            </div>
        `;

        setupNewsInteractivity(news);
        goToSlide(0, news);
    }

    function renderSingleSlide(item, idx) {
        return `
            <div class="news-slide-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <div class="news-slide-bg" style="background-image: url('${item.coverImage || ''}');"></div>
                <div class="news-slide-overlay"></div>

                <div class="news-slide-content">
                    <!-- Tag & Date -->
                    <div class="news-card-header">
                        <span class="news-tag-badge">${escapeHtml(item.tag || 'Announcement')}</span>
                        <span class="news-date-text">${escapeHtml(item.date || '')}</span>
                    </div>

                    <!-- Cover Preview Thumbnail -->
                    ${item.coverImage ? `
                        <div class="news-card-thumb-wrap">
                            <img src="${item.coverImage}" alt="${escapeHtml(item.title)}" class="news-card-thumb" loading="lazy">
                        </div>
                    ` : ''}

                    <!-- Highlight Badge -->
                    ${item.highlightBadge ? `
                        <div class="news-highlight-pill">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>${escapeHtml(item.highlightBadge)}</span>
                        </div>
                    ` : ''}

                    <!-- Main Title & Subtitle -->
                    <h3 class="news-card-title">${escapeHtml(item.title)}</h3>
                    ${item.subtitle ? `<div class="news-card-subtitle">${escapeHtml(item.subtitle)}</div>` : ''}

                    <!-- Messages -->
                    <div class="news-messages-box">
                        <p class="news-msg-urdu">${escapeHtml(item.messageUrdu || '').replace(/\n/g, '<br>')}</p>
                        ${item.messageEnglish ? `<p class="news-msg-english">${escapeHtml(item.messageEnglish).replace(/\n/g, '<br>')}</p>` : ''}
                    </div>

                    <!-- Action Button -->
                    ${item.actionText && item.actionLink ? `
                        <div class="news-card-action">
                            <a href="${item.actionLink}" class="news-action-btn" target="${item.actionLink.startsWith('#') ? '_self' : '_blank'}" rel="noopener noreferrer">
                                <span>${escapeHtml(item.actionText)}</span>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    function setupNewsInteractivity(news) {
        const container = document.getElementById('newsStoryContainer');
        const prevBtn = document.getElementById('newsPrevBtn');
        const nextBtn = document.getElementById('newsNextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide(news);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide(news);
            });
        }

        // Pause timer on hover / hold
        if (container) {
            container.addEventListener('mouseenter', () => { isPaused = true; });
            container.addEventListener('mouseleave', () => { isPaused = false; });

            // Touch gestures (Mobile Swiping)
            container.addEventListener('touchstart', (e) => {
                isPaused = true;
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                isPaused = false;
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe(news);
            }, { passive: true });
        }
    }

    function handleSwipe(news) {
        const threshold = 45;
        const diff = touchEndX - touchStartX;
        if (diff < -threshold) {
            // Swiped Left -> Go Next (RTL / Smooth Next)
            nextSlide(news);
        } else if (diff > threshold) {
            // Swiped Right -> Go Prev
            prevSlide(news);
        }
    }

    function goToSlide(index, news) {
        if (!news || news.length === 0) return;
        if (index < 0) index = news.length - 1;
        if (index >= news.length) index = 0;

        currentIndex = index;

        // Slide Track Offset (Right-to-Left shift)
        const track = document.getElementById('newsSlidesTrack');
        if (track) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Update active slide class
        document.querySelectorAll('.news-slide-item').forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });

        // Update Counter
        const counter = document.getElementById('newsCounter');
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${news.length}`;
        }

        // Reset and start individual display duration timer
        const currentItem = news[currentIndex];
        const durationSec = (currentItem && currentItem.displayDuration) ? Number(currentItem.displayDuration) : 8;
        currentDurationMs = durationSec * 1000;

        startStoryProgress(currentIndex, news);
    }

    function nextSlide(news) {
        goToSlide(currentIndex + 1, news);
    }

    function prevSlide(news) {
        goToSlide(currentIndex - 1, news);
    }

    function startStoryProgress(index, news) {
        clearInterval(timerInterval);
        progressStartTime = Date.now();

        // Update all progress bar fills
        news.forEach((_, i) => {
            const fill = document.getElementById(`storyBarFill_${i}`);
            if (fill) {
                if (i < index) {
                    fill.style.width = '100%';
                } else if (i > index) {
                    fill.style.width = '0%';
                } else {
                    fill.style.width = '0%';
                }
            }
        });

        const activeFill = document.getElementById(`storyBarFill_${index}`);

        let elapsed = 0;
        timerInterval = setInterval(() => {
            if (!isPaused) {
                elapsed += 50;
                const percent = Math.min(100, (elapsed / currentDurationMs) * 100);
                if (activeFill) {
                    activeFill.style.width = `${percent}%`;
                }

                if (elapsed >= currentDurationMs) {
                    clearInterval(timerInterval);
                    nextSlide(news);
                }
            }
        }, 50);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Initialize News
    function init() {
        renderNewsSection();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.refreshNewsAnnouncements = init;

})();
