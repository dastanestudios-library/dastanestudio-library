/**
 * ============================================================================
 * 🌐 DASTANE STUDIO & LIBRARY - SUPABASE CLIENT & DATA ENGINE
 * ============================================================================
 * Provides unified async data fetching with graceful offline static fallback.
 * If Supabase is connected, data is loaded live from the PostgreSQL database.
 * If Supabase is unconfigured or offline, static files are used seamlessly.
 * ============================================================================
 */

(function () {
    'use strict';

    // 1. Resolve Credentials
    function getSupabaseCredentials() {
        const fileConfig = window.DASTANE_SUPABASE_CONFIG || {};
        const url = (fileConfig.url && fileConfig.url.trim() !== '') 
            ? fileConfig.url.trim() 
            : (localStorage.getItem('dastane_supabase_url') || '').trim();

        const anonKey = (fileConfig.anonKey && fileConfig.anonKey.trim() !== '') 
            ? fileConfig.anonKey.trim() 
            : (localStorage.getItem('dastane_supabase_anon_key') || '').trim();

        return { url, anonKey };
    }

    // 2. Initialize Client
    let client = null;

    function initSupabase() {
        if (client) return client;

        const { url, anonKey } = getSupabaseCredentials();

        if (window.supabase && url && anonKey) {
            try {
                client = window.supabase.createClient(url, anonKey, {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true
                    }
                });
                console.log('✅ Dastane Studio: Connected to Supabase Cloud Database');
            } catch (err) {
                console.warn('⚠️ Supabase init error:', err);
                client = null;
            }
        }
        return client;
    }

    // 3. Helper: Check if Supabase is active
    function isSupabaseReady() {
        return Boolean(initSupabase());
    }

    // 4. Fetch Novels & Episodes from Supabase
    async function fetchNovelsFromDB() {
        const sb = initSupabase();
        if (!sb) return null;

        try {
            // Fetch novels
            const { data: novels, error: novelsError } = await sb
                .from('novels')
                .select('*')
                .order('id', { ascending: true });

            if (novelsError || !novels) {
                console.warn('Could not fetch novels from DB:', novelsError);
                return null;
            }

            // Fetch episodes
            const { data: episodes, error: episodesError } = await sb
                .from('episodes')
                .select('*')
                .order('episode_number', { ascending: true });

            const episodesList = episodes || [];

            // Transform into existing frontend structure
            return novels.map(n => {
                const novelEpisodes = episodesList.filter(ep => ep.novel_id === n.id);
                const urduEpisodes = novelEpisodes.filter(ep => ep.language === 'urdu').map(ep => ({
                    episodeNumber: ep.episode_number,
                    title: ep.title,
                    nativeTitle: ep.native_title || '',
                    releaseDate: ep.release_date || '',
                    isAvailable: ep.is_available,
                    link: ep.link || '#'
                }));
                const englishEpisodes = novelEpisodes.filter(ep => ep.language === 'english').map(ep => ({
                    episodeNumber: ep.episode_number,
                    title: ep.title,
                    nativeTitle: ep.native_title || '',
                    releaseDate: ep.release_date || '',
                    isAvailable: ep.is_available,
                    link: ep.link || '#'
                }));

                return {
                    id: Number(n.id),
                    title: n.title,
                    type: n.type || 'novel',
                    tag: n.tag || 'Novel',
                    categoryName: n.category_name || 'Novel',
                    description: n.description || '',
                    buttonText: n.button_text || 'Read Online',
                    isAvailable: Boolean(n.is_available),
                    link: n.link || '#',
                    alertMessage: n.alert_message || '',
                    coverImage: n.cover_image || '',
                    hasLanguageSelection: Boolean(n.has_language_selection),
                    languages: {
                        urdu: {
                            name: "Urdu Edition",
                            nativeName: "اردو ایڈیشن",
                            isAvailable: Boolean(n.urdu_enabled),
                            statusBadge: n.urdu_status_badge || "Available Now",
                            description: n.urdu_description || "",
                            episodes: urduEpisodes
                        },
                        english: {
                            name: "English Edition",
                            nativeName: "انگلش ایڈیشن",
                            isAvailable: Boolean(n.english_enabled),
                            statusBadge: n.english_status_badge || "Coming Soon...",
                            description: n.english_description || "",
                            alertMessage: n.english_alert_message || "",
                            link: n.english_link || "#",
                            episodes: englishEpisodes
                        }
                    }
                };
            });
        } catch (e) {
            console.error('Exception fetching novels from Supabase:', e);
            return null;
        }
    }

    // 5. Fetch Short Stories from Supabase
    async function fetchStoriesFromDB() {
        const sb = initSupabase();
        if (!sb) return null;

        try {
            const { data, error } = await sb
                .from('stories')
                .select('*')
                .order('id', { ascending: true });

            if (error || !data) return null;

            return data.map(s => ({
                id: Number(s.id),
                title: s.title,
                type: s.type || 'story',
                tag: s.tag || 'Short Story',
                categoryName: s.category_name || 'Short Story',
                description: s.description || '',
                buttonText: s.button_text || 'Read Online',
                isAvailable: Boolean(s.is_available),
                link: s.link || '#',
                alertMessage: s.alert_message || '',
                coverImage: s.cover_image || ''
            }));
        } catch (e) {
            console.error('Exception fetching stories from Supabase:', e);
            return null;
        }
    }

    // 6. Fetch Audiobooks from Supabase
    async function fetchAudiobooksFromDB() {
        const sb = initSupabase();
        if (!sb) return null;

        try {
            const { data, error } = await sb
                .from('audiobooks')
                .select('*')
                .order('id', { ascending: true });

            if (error || !data) return null;

            return data.map(a => ({
                id: Number(a.id),
                title: a.title,
                type: a.type || 'audiobook',
                tag: a.tag || 'Audio Drama',
                categoryName: a.category_name || 'Audiobook',
                narrator: a.narrator || 'Dastane Studio Voice Artists',
                duration: a.duration || 'Available Soon',
                description: a.description || '',
                buttonText: a.button_text || 'Listen Audio',
                isAvailable: Boolean(a.is_available),
                alertMessage: a.alert_message || '',
                audioSrc: a.audio_src || '',
                coverImage: a.cover_image || ''
            }));
        } catch (e) {
            console.error('Exception fetching audiobooks from Supabase:', e);
            return null;
        }
    }

    // 7. Fetch News & Announcements from Supabase
    async function fetchNewsFromDB() {
        const sb = initSupabase();
        if (!sb) return null;

        try {
            const { data, error } = await sb
                .from('news_announcements')
                .select('*')
                .eq('is_active', true)
                .order('id', { ascending: true });

            if (error || !data) return null;

            return data.map(n => ({
                id: Number(n.id),
                title: n.title,
                subtitle: n.subtitle || '',
                tag: n.tag || 'Important Update',
                tagType: n.tag_type || 'urgent',
                date: n.date_text || '',
                displayDuration: Number(n.display_duration) || 8,
                coverImage: n.cover_image || '',
                highlightBadge: n.highlight_badge || '',
                messageUrdu: n.message_urdu || '',
                messageEnglish: n.message_english || '',
                actionText: n.action_text || 'Read Online',
                actionLink: n.action_link || '#library'
            }));
        } catch (e) {
            console.error('Exception fetching news from Supabase:', e);
            return null;
        }
    }

    // 8. Save Reading Circle Subscriber to DB
    async function saveSubscriberToDB(subscriber) {
        const sb = initSupabase();
        if (!sb) return false;

        try {
            const { error } = await sb.from('subscribers').insert([{
                first_name: subscriber.firstName,
                surname: subscriber.surname || '',
                email: subscriber.email,
                phone: subscriber.phone || '',
                role_plan: subscriber.plan || ''
            }]);
            return !error;
        } catch (e) {
            console.error('Error saving subscriber:', e);
            return false;
        }
    }

    // Export API globally
    window.DastaneDB = {
        init: initSupabase,
        isReady: isSupabaseReady,
        getCredentials: getSupabaseCredentials,
        fetchNovels: fetchNovelsFromDB,
        fetchStories: fetchStoriesFromDB,
        fetchAudiobooks: fetchAudiobooksFromDB,
        fetchNews: fetchNewsFromDB,
        saveSubscriber: saveSubscriberToDB
    };

    // Auto-init on script load
    initSupabase();
})();
