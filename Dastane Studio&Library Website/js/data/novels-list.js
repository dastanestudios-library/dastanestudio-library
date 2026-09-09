/**
 * ============================================================================
 * 📚 DASTANE STUDIO & LIBRARY - NOVELS DATA FILE (Novels Ki List)
 * ============================================================================
 * 💡 Roman Urdu Guide:
 * 1. Agar kisi novel par Language (English/Urdu) aur Episodes ka pop-up ON karna ho:
 *    hasLanguageSelection: true rakhein.
 * 2. Agar pop-up band rakhna ho:
 *    hasLanguageSelection: false rakhein (is se direct novel ka link open hoga).
 * 3. Naya Episode add karne ke liye "episodes" array mein naya block copy paste karein.
 * ============================================================================
 */

const novelsList = [
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

        // 🌐 LANGUAGE & EPISODES SELECTION (Zuban aur Aqsaat Ki Setting)
        hasLanguageSelection: true, // Sirf is novel par pop-up ON hai
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
                    // Agli qist (Episode 3) yahan add karein
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

        // 🌐 LANGUAGE & EPISODES SELECTION TEMPLATE (DISABLED BY DEFAULT)
        hasLanguageSelection: false, // Filhal pop-up OFF hai
        languages: {
            urdu: {
                name: "Urdu Edition",
                nativeName: "اردو ایڈیشن",
                isAvailable: false,
                statusBadge: "Coming Soon...",
                description: "Mukammal Urdu edition jald araha hai",
                episodes: []
            },
            english: {
                name: "English Edition",
                nativeName: "انگلش ایڈیشن",
                isAvailable: false,
                statusBadge: "Coming Soon...",
                description: "English edition coming soon",
                alertMessage: "English edition of Safar E Zayan is coming soon!",
                link: "#"
            }
        }
    }
];

if (typeof window !== 'undefined') {
    window.novelsList = novelsList;
}
