/**
 * ============================================================================
 * 🎧 DASTANE STUDIO & LIBRARY - AUDIOBOOKS DATA FILE (صوتی کتب و ڈرامے)
 * ============================================================================
 * 📁 FOLDER LOCATION: js/data/audiobooks/audiobooks-list.js
 * 
 * 💡 رہنمائی (Quick Guide):
 * نئی آڈیو بک ایڈ کرنے کے لیے نیچے دیے گئے بلاک کو کاپی کریں اور تفصیلات تبدیل کریں۔
 * ============================================================================
 */

const audiobooksList = [
    {
        id: 101,
        title: "Dastan-e-Ishq (Audio Drama)",
        type: "audiobook",
        tag: "Audio Drama",
        categoryName: "Audiobook",
        narrator: "Dastane Studio Voice Artists",
        duration: "Available Soon",
        description: "An emotional audio storytelling journey of love, patience, and classical romance with immersive background music and voice acting.",
        buttonText: "Available Soon...",
        isAvailable: false,
        alertMessage: "Dastan-e-Ishq audio drama will be available soon. Voice production is in progress!",
        audioSrc: "",
        coverImage: "https://i.pinimg.com/736x/9e/b4/db/9eb4dbdaa4d2b96c5cebf6b3a2d3192b.jpg"
    },
    {
        id: 102,
        title: "The Last Letter (Chapter 1: Voices of Heart)",
        type: "audiobook",
        tag: "Narrated Novel",
        categoryName: "Audiobook",
        narrator: "Dastane Studio Voice Artists",
        duration: "Available Soon",
        description: "Experience the heartfelt dialogue and dramatic college journey of Shehryar and Mushk in pure high-fidelity voice narration.",
        buttonText: "Available Soon...",
        isAvailable: false,
        alertMessage: "The Last Letter audio edition will be available soon. Stay tuned!",
        audioSrc: "",
        coverImage: "https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg"
    },
    {
        id: 103,
        title: "Zindan-e-Khwab (Midnight Suspense)",
        type: "audiobook",
        tag: "Suspense Audio",
        categoryName: "Audiobook",
        narrator: "Dastane Studio Voice Artists",
        duration: "Available Soon",
        description: "A spine-chilling psychological suspense audio production with intense atmospheric sound effects and voiceover.",
        buttonText: "Available Soon...",
        isAvailable: false,
        alertMessage: "Zindan-e-Khwab suspense audio is coming soon!",
        audioSrc: "",
        coverImage: "https://i.pinimg.com/736x/32/d4/ff/32d4ff5780dc906d9459a159ea68a639.jpg"
    }
];

if (typeof window !== 'undefined') {
    window.audiobooksList = audiobooksList;
}
