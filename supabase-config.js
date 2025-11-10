/* Copiado de supabase-config.js (raiz) */

// IMPORTANTE: Credenciais do Supabase (chave ANON pública)
const SUPABASE_CONFIG = {
    url: 'https://dbwwbipbmhmpazoqhqce.supabase.co', // URL do seu projeto
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3diaXBibWhtcGF6b3FocWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzc5NDksImV4cCI6MjA3ODM1Mzk0OX0.K0EBTUqjD67RA8wx5NBkiluSfLiCfK-GfO2o8KFRKXo' // Chave pública ANON
};

// Inicializar cliente Supabase
let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url) {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        return true;
    }
    return false;
}

// Verificar se Supabase está disponível
function isSupabaseAvailable() {
    return typeof supabase !== 'undefined' && supabaseClient !== null;
}

// Fallback para localStorage se Supabase não estiver disponível
const USE_SUPABASE = true; // Ativado após configurar Supabase


