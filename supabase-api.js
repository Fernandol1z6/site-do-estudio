/* Copiado de supabase-api.js (raiz) */

const SUPABASE_TABLES = {
    photos: 'photos',
    work_cards: 'work_cards',
    services: 'services',
    about: 'about',
    settings: 'settings',
    categories: 'categories'
};

/* ============================================
   FOTOS
   ============================================ */

async function getPhotos() {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return getLocalPhotos();
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.photos)
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar fotos:', error);
        return getLocalPhotos();
    }
}

async function addPhoto(photoData) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return addLocalPhoto(photoData);
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.photos)
            .insert([photoData])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao adicionar foto:', error);
        return addLocalPhoto(photoData);
    }
}

async function updatePhoto(id, photoData) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return updateLocalPhoto(id, photoData);
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.photos)
            .update(photoData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
        return updateLocalPhoto(id, photoData);
    }
}

async function deletePhotoFromAPI(id) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return deleteLocalPhoto(id);
    }

    try {
        const { error } = await supabaseClient
            .from(SUPABASE_TABLES.photos)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Erro ao eliminar foto:', error);
        return deleteLocalPhoto(id);
    }
}

// Exportar funções globalmente para uso
if (typeof window !== 'undefined') {
    window.deletePhotoFromAPI = deletePhotoFromAPI;
    window.addPhoto = addPhoto;
    window.updatePhoto = updatePhoto;
    window.getPhotos = getPhotos;
    window.getWorkCards = getWorkCards;
    window.saveWorkCards = saveWorkCards;
    window.getServices = getServices;
    window.addService = addService;
    window.updateService = updateService;
    window.deleteService = deleteService;
    window.getAbout = getAbout;
    window.saveAbout = saveAbout;
    window.getSettings = getSettings;
    window.saveSettings = saveSettings;
}

/* ============================================
   WORK CARDS
   ============================================ */

async function getWorkCards() {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return getLocalWorkCards();
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.work_cards)
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar work cards:', error);
        return getLocalWorkCards();
    }
}

async function saveWorkCards(workCards) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return saveLocalWorkCards(workCards);
    }

    try {
        await supabaseClient.from(SUPABASE_TABLES.work_cards).delete().neq('id', 0);
        
        const workCardsWithOrder = workCards.map((card, index) => ({
            ...card,
            order_index: index
        }));

        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.work_cards)
            .insert(workCardsWithOrder)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao salvar work cards:', error);
        return saveLocalWorkCards(workCards);
    }
}

/* ============================================
   SERVIÇOS
   ============================================ */

async function getServices() {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return getLocalServices();
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.services)
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        return getLocalServices();
    }
}

async function addService(serviceData) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return addLocalService(serviceData);
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.services)
            .insert([serviceData])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao adicionar serviço:', error);
        return addLocalService(serviceData);
    }
}

async function updateService(id, serviceData) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return updateLocalService(id, serviceData);
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.services)
            .update(serviceData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        return updateLocalService(id, serviceData);
    }
}

async function deleteService(id) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return deleteLocalService(id);
    }

    try {
        const { error } = await supabaseClient
            .from(SUPABASE_TABLES.services)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Erro ao eliminar serviço:', error);
        return deleteLocalService(id);
    }
}

/* ============================================
   ABOUT
   ============================================ */

async function getAbout() {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return getLocalAbout();
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.about)
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return data || null;
    } catch (error) {
        console.error('Erro ao buscar about:', error);
        return getLocalAbout();
    }
}

async function saveAbout(aboutData) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return saveLocalAbout(aboutData);
    }

    try {
        const existing = await getAbout();
        
        if (existing) {
            const { data, error } = await supabaseClient
                .from(SUPABASE_TABLES.about)
                .update(aboutData)
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabaseClient
                .from(SUPABASE_TABLES.about)
                .insert([aboutData])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Erro ao salvar about:', error);
        return saveLocalAbout(aboutData);
    }
}

/* ============================================
   SETTINGS
   ============================================ */

async function getSettings() {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return getLocalSettings();
    }

    try {
        const { data, error } = await supabaseClient
            .from(SUPABASE_TABLES.settings)
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        console.error('Erro ao buscar settings:', error);
        return getLocalSettings();
    }
}

async function saveSettings(settingsData) {
    if (!isSupabaseAvailable() || !USE_SUPABASE) {
        return saveLocalSettings(settingsData);
    }

    try {
        const existing = await getSettings();
        
        if (existing) {
            const { data, error } = await supabaseClient
                .from(SUPABASE_TABLES.settings)
                .update(settingsData)
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabaseClient
                .from(SUPABASE_TABLES.settings)
                .insert([settingsData])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Erro ao salvar settings:', error);
        return saveLocalSettings(settingsData);
    }
}

/* ============================================
   FALLBACK - LOCALSTORAGE
   ============================================ */

const STORAGE_KEY = 'edaqui_studio_data';

function getLocalData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function saveLocalData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getLocalPhotos() {
    const data = getLocalData();
    return data?.photos || [];
}

function addLocalPhoto(photoData) {
    const data = getLocalData() || { photos: [] };
    const newId = data.photos.length > 0 ? Math.max(...data.photos.map(p => p.id)) + 1 : 1;
    data.photos.push({ id: newId, ...photoData });
    saveLocalData(data);
    return { id: newId, ...photoData };
}

function updateLocalPhoto(id, photoData) {
    const data = getLocalData();
    if (!data) return null;
    const index = data.photos.findIndex(p => p.id === id);
    if (index !== -1) {
        data.photos[index] = { ...data.photos[index], ...photoData };
        saveLocalData(data);
        return data.photos[index];
    }
    return null;
}

function deleteLocalPhoto(id) {
    const data = getLocalData();
    if (!data) return false;
    data.photos = data.photos.filter(p => p.id !== id);
    saveLocalData(data);
    return true;
}

function getLocalWorkCards() {
    const data = getLocalData();
    return data?.workCards || [];
}

function saveLocalWorkCards(workCards) {
    const data = getLocalData() || {};
    data.workCards = workCards;
    saveLocalData(data);
    return workCards;
}

function getLocalServices() {
    const data = getLocalData();
    return data?.services || [];
}

function addLocalService(serviceData) {
    const data = getLocalData() || { services: [] };
    const newId = data.services.length > 0 ? Math.max(...data.services.map(s => s.id)) + 1 : 1;
    data.services.push({ id: newId, ...serviceData });
    saveLocalData(data);
    return { id: newId, ...serviceData };
}

function updateLocalService(id, serviceData) {
    const data = getLocalData();
    if (!data) return null;
    const index = data.services.findIndex(s => s.id === id);
    if (index !== -1) {
        data.services[index] = { ...data.services[index], ...serviceData };
        saveLocalData(data);
        return data.services[index];
    }
    return null;
}

function deleteLocalService(id) {
    const data = getLocalData();
    if (!data) return false;
    data.services = data.services.filter(s => s.id !== id);
    saveLocalData(data);
    return true;
}

function getLocalAbout() {
    const data = getLocalData();
    return data?.about || null;
}

function saveLocalAbout(aboutData) {
    const data = getLocalData() || {};
    data.about = aboutData;
    saveLocalData(data);
    return aboutData;
}

function getLocalSettings() {
    const data = getLocalData();
    return data?.settings || null;
}

function saveLocalSettings(settingsData) {
    const data = getLocalData() || {};
    data.settings = settingsData;
    saveLocalData(data);
    return settingsData;
}


