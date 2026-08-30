/**
 * ============================================================================
 * 📚 DASTANE STUDIO & LIBRARY - NOVELS DATA FILE (ناولوں کی لسٹ)
 * ============================================================================
 * 
 * 💡 رہنمائی برائے صارف (User Guide):
 * نیا ناول شامل کرنے کے لیے:
 * 1. نیچے دی گئی لسٹ میں سے کسی بھی بلاک `{ ... }` کو کاپی (Copy) کریں۔
 * 2. آخری ناول کے بعد کوما (,) لگا کر نیا بلاک پیسٹ (Paste) کر دیں۔
 * 3. title, tag, description وغیرہ اپنی مرضی کے مطابق تبدیل کر لیں۔
 * 
 * To add a new novel:
 * 1. Copy one novel object block `{ ... }` below.
 * 2. Add a comma `,` after the last item and paste your new object.
 * 3. Update the title, tag, description, and other details.
 * ============================================================================
 */

const novelsData = [
    {
        id: 1,
        title: "The Last Letter",
        tag: "Featured Novel",
        description: "A beautiful journey of love, patience, and destiny of a young collage students Shereyar Hashim and Mushk Farooqi.",
        buttonText: "Read Online",
        isAvailable: true,
        link: "https://thelastletterds.blogspot.com/",
        alertMessage: "The reading system is currently loading... (Dastan-e-Ishq)",
        coverImage: "https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg"
    },
    {
        id: 2,
        title: "Ishq E Lamakan",
        tag: "Featured Novel",
        description: "A beautiful journey of love, patience, and destiny of a young collage students Shereyar Hashim and Mushk Farooqi.",
        buttonText: "Coming Soon",
        isAvailable: false,
        link: "https://thelastletterds.blogspot.com/",
        alertMessage: "The reading system is currently loading... (Dastan-e-Ishq)",
        coverImage: "https://i.pinimg.com/1200x/d9/67/10/d967100f67748c6bb200b735dcfed865.jpg"
        
    },
    {
        id: 3,
        title: "Dastan-e-Ishq",
        tag: "Featured Novel",
        description: "A beautiful journey of love, patience, and destiny set deep within the heart of traditional Pakistan.",
        buttonText: "Coming Soon",
        isAvailable: false,
        link: "#",
        alertMessage: "The reading system is currently loading... (Dastan-e-Ishq)",
        coverImage: "https://i.pinimg.com/736x/9e/b4/db/9eb4dbdaa4d2b96c5cebf6b3a2d3192b.jpg" // اختیاری: اگر تصویر لگانا چاہیں تو پاتھ دیں مثلاً: "assets/images/novel1.jpg"
    },
    
    {
        id: 4,
        title: "Zindan-e-Khwab",
        tag: "Short Story",
        description: "A gripping modern suspense story about a creative mind whose darkest dreams begin turning into absolute realities.",
        buttonText: "Coming Soon",
        isAvailable: false,
        link: "#",
        alertMessage: "The reading system is currently loading... (Zindan-e-Khwab)",
        coverImage: "https://i.pinimg.com/736x/32/d4/ff/32d4ff5780dc906d9459a159ea68a639.jpg"
    },
    
    {
        id: 5,
        title: "Safar E Zayan",
        tag: "Upcoming Project",
        description: "A massive cultural mystery thriller based on ancient local folklore and the hidden historical secrets of our soil.",
        buttonText: "Coming Soon",
        isAvailable: false, // اگر دستیاب نہیں ہے تو false رکھیں، بٹن ڈس ایبل ہو جائے گا
        link: "#",
        alertMessage: "",
        coverImage: "https://i.pinimg.com/1200x/70/38/d4/7038d4e578dd91b0f074302ea12de001.jpg"
    }
];

// If using ES modules in future or global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = novelsData;
}
