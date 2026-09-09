/**
 * ============================================================================
 * 📚 DASTANE STUDIO & LIBRARY - MASTER PUBLICATIONS CATALOG
 * ============================================================================
 * Contains the master catalog of all publications (Novels, Stories & Audiobooks).
 * Automatically merges from:
 * 1. `js/data/novels-list.js` (Novels)
 * 2. `js/data/stories-list.js` (Short Stories)
 * 3. `js/data/audiobooks/audiobooks-list.js` (Audiobooks)
 * with built-in guaranteed fallbacks.
 * ============================================================================
 */

(function () {
    'use strict';

    const defaultCatalog = [
        {
            id: 1,
            title: "The Last Letter",
            type: "novel",
            tag: "Featured Novel",
            categoryName: "Novel",
            description: "A poignant journey of love, patience, and destiny between college students Shehryar Hashim and Mushk Farooqi.",
            buttonText: "Read Online",
            isAvailable: true,
            link: "https://thelastletterds.blogspot.com/2026/08/the-last-letter-dastane-studio.html",
            alertMessage: "The reading system is currently loading...",
            coverImage: "https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg",
            hasLanguageSelection: true,
            languages: {
                urdu: {
                    name: "Urdu Edition",
                    nativeName: "اردو ایڈیشن",
                    isAvailable: true,
                    statusBadge: "Available Now",
                    description: "Mukammal sehar-angez aqsaat Urdu zuban mein mulaahiza farmayein",
                    episodes: [
                        {
                            episodeNumber: 1,
                            title: "Episode 1: The First Letter",
                            nativeTitle: "قسط نمبر 1: پہلا خط",
                            releaseDate: "Released",
                            isAvailable: true,
                            link: "https://thelastletterds.blogspot.com/2026/08/the-last-letter-dastane-studio.html"
                        },
                        {
                            episodeNumber: 2,
                            title: "Episode 2: Destined Paths",
                            nativeTitle: "قسط نمبر 2: تقدیر کے فیصلے",
                            releaseDate: "Released • 9 Sep 2026",
                            isAvailable: true,
                            link: "https://thelastletterds.blogspot.com/2026/09/dastane-studio-last-letter-episode2.html"
                        }
                    ]
                },
                english: {
                    name: "English Edition",
                    nativeName: "انگلش ایڈیشن",
                    isAvailable: false,
                    statusBadge: "Coming Soon...",
                    description: "English translation is currently in editorial review",
                    alertMessage: "The English translation of 'The Last Letter' will be available soon. Translation and proofing are in progress!",
                    link: "#"
                }
            }
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
            coverImage: "https://i.pinimg.com/1200x/70/38/d4/7038d4e578dd91b0f074302ea12de001.jpg",
            hasLanguageSelection: false
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

    let merged = [];
    if (typeof window !== 'undefined') {
        if (Array.isArray(window.novelsList) && window.novelsList.length > 0) {
            merged = merged.concat(window.novelsList);
        }
        if (Array.isArray(window.storiesList) && window.storiesList.length > 0) {
            merged = merged.concat(window.storiesList);
        }
        if (Array.isArray(window.audiobooksList) && window.audiobooksList.length > 0) {
            merged = merged.concat(window.audiobooksList);
        }
    }

    if (merged.length === 0) {
        merged = defaultCatalog;
    }

    window.novelsData = merged;

    if (typeof window !== 'undefined') {
        if (!window.novelsList || window.novelsList.length === 0) {
            window.novelsList = defaultCatalog.filter(i => i.type === 'novel');
        }
        if (!window.storiesList || window.storiesList.length === 0) {
            window.storiesList = defaultCatalog.filter(i => i.type === 'story');
        }
    }

})();
