/**
 * ============================================================================
 * 📚 DASTANE STUDIO & LIBRARY - NOVELS DATA FILE (ناولز کی لسٹ)
 * ============================================================================
 * 💡 رہنمائی (Guide):
 * 1. اگر کسی ناول میں زبان (English/Urdu) اور اقساط (Episodes) کا پوپ اپ آن کرنا ہو:
 *    hasLanguageSelection: true رکھیں
 * 2. اگر پوپ اپ بند رکھنا ہو:
 *    hasLanguageSelection: false رکھیں (تو وہ براہ راست لنک پر جائے گا)
 * 3. نیا Episode شامل کرنے کے لیے episodes کی لسٹ میں نیا بلاک شامل کریں۔
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
        link: "https://thelastletterds.blogspot.com/",
        alertMessage: "The reading system is currently loading...",
        coverImage: "https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg",

        // 🌐 LANGUAGE & EPISODES SELECTION (زبان اور اقساط کی سیٹنگ)
        hasLanguageSelection: true, // صرف اس ناول میں آن ہے
        languages: {
            urdu: {
                name: "Urdu Edition",
                nativeName: "اردو ایڈیشن",
                isAvailable: true,
                statusBadge: "Available Now",
                description: "مکمل سحر انگیز اقساط اردو زبان میں ملاحظہ فرمائیں",
                episodes: [
                    {
                        episodeNumber: 1,
                        title: "Episode 1: The First Letter",
                        nativeTitle: "قسط نمبر 1: پہلا خط",
                        releaseDate: "Released",
                        isAvailable: true,
                        link: "https://thelastletterds.blogspot.com/"
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

        // 🌐 LANGUAGE & EPISODES SELECTION TEMPLATE (DISABLED BY DEFAULT)
        hasLanguageSelection: false, // فی الحال آف ہے
        languages: {
            urdu: {
                name: "Urdu Edition",
                nativeName: "اردو ایڈیشن",
                isAvailable: false,
                statusBadge: "Coming Soon...",
                description: "مکمل اردو ایڈیشن جلد آرہا ہے",
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
