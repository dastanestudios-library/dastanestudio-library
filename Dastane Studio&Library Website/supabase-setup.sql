-- ============================================================================
-- 📚 DASTANE STUDIO & LIBRARY - SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- ============================================================================
-- 💡 Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click on "SQL Editor" on the left menu.
-- 3. Click "New Query", paste this entire script, and click "RUN".
-- ============================================================================

-- 1. NOVELS TABLE
CREATE TABLE IF NOT EXISTS public.novels (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'novel',
    tag TEXT DEFAULT 'Featured Novel',
    category_name TEXT DEFAULT 'Novel',
    description TEXT,
    button_text TEXT DEFAULT 'Read Online',
    is_available BOOLEAN DEFAULT true,
    link TEXT,
    alert_message TEXT,
    cover_image TEXT,
    has_language_selection BOOLEAN DEFAULT false,
    urdu_enabled BOOLEAN DEFAULT true,
    urdu_status_badge TEXT DEFAULT 'Available Now',
    urdu_description TEXT DEFAULT 'Mukammal sehar-angez aqsaat Urdu zuban mein mulaahiza farmayein',
    english_enabled BOOLEAN DEFAULT false,
    english_status_badge TEXT DEFAULT 'Coming Soon...',
    english_description TEXT DEFAULT 'English translation is currently in editorial review',
    english_alert_message TEXT DEFAULT 'English translation will be available soon!',
    english_link TEXT DEFAULT '#',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EPISODES TABLE (For multi-episode serialized novels)
CREATE TABLE IF NOT EXISTS public.episodes (
    id BIGSERIAL PRIMARY KEY,
    novel_id BIGINT REFERENCES public.novels(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'urdu', -- 'urdu' or 'english'
    episode_number INT NOT NULL,
    title TEXT NOT NULL,
    native_title TEXT,
    release_date TEXT,
    is_available BOOLEAN DEFAULT true,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SHORT STORIES TABLE
CREATE TABLE IF NOT EXISTS public.stories (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'story',
    tag TEXT DEFAULT 'Short Story',
    category_name TEXT DEFAULT 'Short Story',
    description TEXT,
    button_text TEXT DEFAULT 'Read Online',
    is_available BOOLEAN DEFAULT false,
    link TEXT DEFAULT '#',
    alert_message TEXT,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIOBOOKS & VOICE DRAMAS TABLE
CREATE TABLE IF NOT EXISTS public.audiobooks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'audiobook',
    tag TEXT DEFAULT 'Audio Drama',
    category_name TEXT DEFAULT 'Audiobook',
    narrator TEXT DEFAULT 'Dastane Studio Voice Artists',
    duration TEXT DEFAULT 'Available Soon',
    description TEXT,
    button_text TEXT DEFAULT 'Listen Audio',
    is_available BOOLEAN DEFAULT false,
    alert_message TEXT,
    audio_src TEXT DEFAULT '',
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LATEST NEWS & ANNOUNCEMENTS TABLE (9:16 Story Slider)
CREATE TABLE IF NOT EXISTS public.news_announcements (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    tag TEXT DEFAULT 'Important Update • اہم اطلاع',
    tag_type TEXT DEFAULT 'urgent', -- 'urgent', 'update', 'release', 'feature'
    date_text TEXT DEFAULT 'September 2026',
    display_duration INT DEFAULT 8,
    cover_image TEXT,
    highlight_badge TEXT,
    message_urdu TEXT,
    message_english TEXT,
    action_text TEXT DEFAULT 'Read Online',
    action_link TEXT DEFAULT '#library',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. READING CIRCLE SUBSCRIBERS & INQUIRIES
CREATE TABLE IF NOT EXISTS public.subscribers (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    surname TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    role_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 🔐 ROW LEVEL SECURITY (RLS) & PRIVILEGES
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audiobooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ POLICIES (Everyone can read published library items)
CREATE POLICY "Public Read Novels" ON public.novels FOR SELECT USING (true);
CREATE POLICY "Public Read Episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Public Read Stories" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Public Read Audiobooks" ON public.audiobooks FOR SELECT USING (true);
CREATE POLICY "Public Read News" ON public.news_announcements FOR SELECT USING (true);

-- 2. PUBLIC INSERT FOR SUBSCRIBERS FORM
CREATE POLICY "Public Insert Subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);

-- 3. ADMIN FULL ACCESS POLICIES (Only logged-in admin can insert, update, delete)
CREATE POLICY "Admin Full Novels" ON public.novels FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Episodes" ON public.episodes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Stories" ON public.stories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Audiobooks" ON public.audiobooks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full News" ON public.news_announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Read Subscribers" ON public.subscribers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Subscribers" ON public.subscribers FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- 📦 SEED DATA (Pre-populating with current website publications)
-- ============================================================================

-- Seed Novels
INSERT INTO public.novels (id, title, type, tag, category_name, description, button_text, is_available, link, alert_message, cover_image, has_language_selection, urdu_enabled, urdu_status_badge, urdu_description, english_enabled, english_status_badge, english_description, english_alert_message, english_link)
VALUES
(1, 'The Last Letter', 'novel', 'Featured Novel', 'Novel', 'A poignant journey of love, patience, and destiny between college students Shehryar Hashim and Mushk Farooqi.', 'Read Online', true, 'https://thelastletterds.blogspot.com/2026/08/the-last-letter-dastane-studio.html', 'The reading system is currently loading...', 'https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg', true, true, 'Available Now', 'Mukammal sehar-angez aqsaat Urdu zuban mein mulaahiza farmayein', false, 'Coming Soon...', 'English translation is currently in editorial review', 'The English translation of The Last Letter will be available soon. Translation and proofing are in progress!', '#'),
(5, 'Safar E Zayan', 'novel', 'Upcoming Novel', 'Novel', 'A massive cultural mystery thriller rooted in ancient regional folklore and the hidden historical secrets of our soil.', 'Coming Soon', false, '#', 'Safar E Zayan is releasing soon. Stay tuned!', 'https://i.pinimg.com/1200x/70/38/d4/7038d4e578dd91b0f074302ea12de001.jpg', false, false, 'Coming Soon...', 'Mukammal Urdu edition jald araha hai', false, 'Coming Soon...', 'English edition coming soon', 'English edition of Safar E Zayan is coming soon!', '#')
ON CONFLICT (id) DO NOTHING;

-- Seed Episodes for The Last Letter
INSERT INTO public.episodes (novel_id, language, episode_number, title, native_title, release_date, is_available, link)
VALUES
(1, 'urdu', 1, 'Episode 1: The First Letter', 'قسط نمبر 1: پہلا خط', 'Released', true, 'https://thelastletterds.blogspot.com/2026/08/the-last-letter-dastane-studio.html'),
(1, 'urdu', 2, 'Episode 2: Destined Paths', 'قسط نمبر 2: تقدیر کے فیصلے', 'Released • 9 Sep 2026', true, 'https://thelastletterds.blogspot.com/2026/09/dastane-studio-last-letter-episode2.html')
ON CONFLICT DO NOTHING;

-- Seed Short Stories
INSERT INTO public.stories (id, title, type, tag, category_name, description, button_text, is_available, link, alert_message, cover_image)
VALUES
(2, 'Ishq E Lamakan', 'story', 'Short Story', 'Short Story', 'A mystical exploration of spiritual attachment, sacrifice, and the boundless horizons of heartfelt passion.', 'Coming Soon', false, '#', 'Ishq E Lamakan is currently in editorial review.', 'https://i.pinimg.com/1200x/d9/67/10/d967100f67748c6bb200b735dcfed865.jpg'),
(3, 'Dastan-e-Ishq', 'story', 'Short Story', 'Short Story', 'A heartfelt emotional story exploring devotion, time, and the unyielding beauty of classical Pakistani storytelling.', 'Coming Soon', false, '#', 'Dastan-e-Ishq is preparing for digital release.', 'https://i.pinimg.com/736x/9e/b4/db/9eb4dbdaa4d2b96c5cebf6b3a2d3192b.jpg'),
(4, 'Zindan-e-Khwab', 'story', 'Suspense Story', 'Short Story', 'A gripping psychological suspense tale of an imaginative mind whose darkest dreams materialize into waking reality.', 'Coming Soon', false, '#', 'Zindan-e-Khwab will be available to read soon.', 'https://i.pinimg.com/736x/32/d4/ff/32d4ff5780dc906d9459a159ea68a639.jpg')
ON CONFLICT (id) DO NOTHING;

-- Seed Audiobooks
INSERT INTO public.audiobooks (id, title, type, tag, category_name, narrator, duration, description, button_text, is_available, alert_message, audio_src, cover_image)
VALUES
(101, 'Dastan-e-Ishq (Audio Drama)', 'audiobook', 'Audio Drama', 'Audiobook', 'Dastane Studio Voice Artists', 'Available Soon', 'An emotional audio storytelling journey of love, patience, and classical romance with immersive background music and voice acting.', 'Available Soon...', false, 'Dastan-e-Ishq audio drama will be available soon. Voice production is in progress!', '', 'https://i.pinimg.com/736x/9e/b4/db/9eb4dbdaa4d2b96c5cebf6b3a2d3192b.jpg'),
(102, 'The Last Letter (Chapter 1: Voices of Heart)', 'audiobook', 'Narrated Novel', 'Audiobook', 'Dastane Studio Voice Artists', 'Available Soon', 'Experience the heartfelt dialogue and dramatic college journey of Shehryar and Mushk in pure high-fidelity voice narration.', 'Available Soon...', false, 'The Last Letter audio edition will be available soon. Stay tuned!', '', 'https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg'),
(103, 'Zindan-e-Khwab (Midnight Suspense)', 'audiobook', 'Suspense Audio', 'Audiobook', 'Dastane Studio Voice Artists', 'Available Soon', 'A spine-chilling psychological suspense audio production with intense atmospheric sound effects and voiceover.', 'Available Soon...', false, 'Zindan-e-Khwab suspense audio is coming soon!', '', 'https://i.pinimg.com/736x/32/d4/ff/32d4ff5780dc906d9459a159ea68a639.jpg')
ON CONFLICT (id) DO NOTHING;

-- Seed Announcements / News Slider
INSERT INTO public.news_announcements (id, title, subtitle, tag, tag_type, date_text, display_duration, cover_image, highlight_badge, message_urdu, message_english, action_text, action_link, is_active)
VALUES
(1, 'The Last Letter — Episode 2 Release Update', 'اہم ترین اطلاع برائے قارئین دی لاسٹ لیٹر', 'Important Update • اہم اطلاع', 'urgent', 'September 02, 2026', 9, 'https://i.pinimg.com/736x/c5/b6/63/c5b6632df4ac5e540a5d55f9fc5737c6.jpg', '📅 New Date: 9 Sep 2026 • 8:00 PM', 'معزز قارئین کرام! داستان اسٹوڈیو کی جانب سے خصوصی اعلان:\nناول دی لاسٹ لیٹر (The Last Letter) کی دوسری قسط اب یکم ستمبر کے بجائے ان شاء اللہ 9 ستمبر 2026 (بدھ) کو رات ٹھیک 8:00 بجے ریلیز کی جائے گی۔\n\nتاخیر کے لیے ہم اپنے تمام پیارے قارئین سے دل سے معذرت خواہ ہیں۔ قسط نمبر 2 بے حد سنسنی خیز اور جذباتی موڑ پر مشتمل ہے، اسی لیے اعلیٰ معیار اور دلنشین کہانی کے لیے تفصیلی ایڈیٹنگ پر اضافی وقت لگایا جا رہا ہے۔ آپ کے بے پناہ صبر اور محبت کا شکریہ!', 'Dear Readers! Official announcement from Dastane Studio: Episode 2 of The Last Letter will now officially release on Wednesday, 9th September 2026 at 8:00 PM PKT (InshaAllah) instead of 1st September.\n\nWe sincerely apologize for this short delay. Episode 2 is packed with intense emotional drama and unexpected turns, which required meticulous editorial care. Thank you for your immense patience and love!', 'Read Episode 1 Online', 'https://thelastletterds.blogspot.com/2026/08/the-last-letter-dastane-studio.html', true),
(2, 'Audiobooks & Voice Dramas Production', 'صوتی کتب اور وائس ڈراموں کی تیاریاں جاری', 'Studio News • نئی پیشکش', 'feature', 'September 2026', 7, 'https://i.pinimg.com/736x/9e/b4/db/9eb4dbdaa4d2b96c5cebf6b3a2d3192b.jpg', '🎙️ 3D Audio Experience • Coming Soon', 'داستان اسٹوڈیو اپنے ناولز کے صوتی ایڈیشنز (Audiobooks) اور وائس ڈراموں کی پروڈکشن تیزی سے مکمل کر رہا ہے۔ بہت جلد آپ اپنی پسندیدہ کہانیوں کو سحر انگیز آوازوں اور 3D ساؤنڈ اسکیپس کے ساتھ سن سکیں گے!', 'Dastane Studio is actively in production for its audiobooks and immersive voice drama editions. Soon, readers will be able to experience literature through cinematic voice performances and rich ambient soundscapes!', 'Browse Library', '#library', true),
(3, 'Writers & Storytellers Submissions Open', 'نئے قلمکاروں کے لیے مسودات کی اشاعت', 'Call For Writers • قلمکار', 'update', 'Open Submissions', 7, 'https://i.pinimg.com/1200x/70/38/d4/7038d4e578dd91b0f074302ea12de001.jpg', '✍️ 100% Original Author Credit', 'کیا آپ ایک نئے مصنف ہیں؟ داستان اسٹوڈیو آپ کے مسودے کو سو فیصد کریڈٹ، ایڈیٹنگ اور عالمی ڈیجیٹل قارئین تک پہنچانے کے لیے اوپن ہے۔ اپنے مسودات ہم سے شیئر کریں!', 'Are you an emerging writer? Dastane Studio offers 100% original author credit, professional editorial support, and a prestigious platform for your stories. Join our circle today!', 'Join Reading Circle', '#reading-circle', true)
ON CONFLICT (id) DO NOTHING;

-- Reset identity sequence counters to prevent collision
SELECT setval('novels_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.novels));
SELECT setval('stories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.stories));
SELECT setval('audiobooks_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.audiobooks));
SELECT setval('news_announcements_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.news_announcements));
