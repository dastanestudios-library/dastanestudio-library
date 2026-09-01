/**
 * ============================================================================
 * 📚 DASTANE STUDIO & LIBRARY - MASTER PUBLICATIONS & AUDIOBOOKS CATALOG
 * ============================================================================
 * Contains the complete master catalog of all novels, short stories, and audiobooks.
 * Automatically merges with `js/data/novels-list.js`, `js/data/stories-list.js`,
 * and `js/data/audiobooks-list.js` with guaranteed fallback datasets.
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
        },
        {
            id: 101,
            title: "Dastan-e-Ishq (Audio Drama)",
            type: "audiobook",
            tag: "Audio Drama",
            categoryName: "Audiobook",
            narrator: "Dastane Studio Voice Artists",
            duration: "18:45",
            description: "An emotional audio storytelling journey of love, patience, and classical romance with immersive background music and voice acting.",
            buttonText: "Listen Audio",
            isAvailable: true,
            audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            coverImage: "https://i.pinimg.com/736x/9e/b4/db/9eb4dbdaa4d2b96c5cebf6b3a2d3192b.jpg"
        },
        {
            id: 102,
            title: "The Last Letter (Chapter 1: Voices of Heart)",
            type: "audiobook",
            tag: "Narrated Novel",
            categoryName: "Audiobook",
            narrator: "Dastane Studio Voice Artists",
            duration: "24:10",
            description: "Experience the heartfelt dialogue and dramatic college journey of Shehryar and Mushk in pure high-fidelity voice narration.",
            buttonText: "Listen Audio",
            isAvailable: true,
            audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            coverImage: "https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg"
        },
        {
            id: 103,
            title: "Zindan-e-Khwab (Midnight Suspense)",
            type: "audiobook",
            tag: "Suspense Audio",
            categoryName: "Audiobook",
            narrator: "Dastane Studio Voice Artists",
            duration: "15:30",
            description: "A spine-chilling psychological suspense audio production with intense atmospheric sound effects and voiceover.",
            buttonText: "Listen Audio",
            isAvailable: true,
            audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
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
        if (!window.audiobooksList || window.audiobooksList.length === 0) {
            window.audiobooksList = defaultCatalog.filter(i => i.type === 'audiobook');
        }
    }

})();
