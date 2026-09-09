/**
 * ============================================================================
 * 📖 DASTANE STUDIO & LIBRARY - SHORT STORIES DATA FILE (Mukhtasar Afsanay)
 * ============================================================================
 * 💡 Roman Urdu Guide:
 * Naya afsana ya kahani shamil karne ke liye neeche diye gaye format ko copy karein
 * aur naye details enter karein.
 * ============================================================================
 */

const storiesList = [
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

if (typeof window !== 'undefined') {
    window.storiesList = storiesList;
}
