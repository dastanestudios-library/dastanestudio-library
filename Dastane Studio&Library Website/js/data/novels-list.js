/**
 * ============================================================================
 * 📚 DASTANE STUDIO & LIBRARY - NOVELS DATA FILE (ناولز کی لسٹ)
 * ============================================================================
 * 💡 رہنمائی (Guide):
 * نیا ناول شامل کرنے کے لیے نیچے دیے گئے فارمیٹ کو کاپی کر کے پیسٹ کریں۔
 * To add a new novel, copy a block below and update the details.
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
    }
];

if (typeof window !== 'undefined') {
    window.novelsList = novelsList;
}
