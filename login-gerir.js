/* ============================================
   AUTENTICAÇÃO - GERIR CONTEÚDO
   Sistema de 3 usuários com senhas individuais
   ============================================ */

(function() {
    'use strict';

    const USERS_KEY = 'edaqui_admin_users';
    const SESSION_KEY = 'edaqui_admin_session';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
    const MAX_USERS = 3;

    // Função simples de hash (SHA-256 via Web Crypto API)
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Obter usuários
    function getUsers() {
        const stored = localStorage.getItem(USERS_KEY);
        let users = null;
        
        if (stored) {
            try {
                users = JSON.parse(stored);
            } catch (e) {
                users = initializeDefaultUsers();
            }
        } else {
            users = initializeDefaultUsers();
        }
        
        // Garantir que todos os usuários tenham senha padrão se não tiverem
        let needsUpdate = false;
        users.forEach(user => {
            if (!user.passwordHash || user.passwordHash === '') {
                user.passwordHash = DEFAULT_PASSWORD_HASH;
                needsUpdate = true;
            }
        });
        
        if (needsUpdate) {
            saveUsers(users);
        }
        
        return users;
    }

    // Salvar usuários
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Senha padrão para todos os usuários
    const DEFAULT_PASSWORD = '12345678';
    
    // Hash pré-calculado da senha padrão "12345678" (SHA-256)
    // Este hash é calculado uma vez e reutilizado
    const DEFAULT_PASSWORD_HASH = 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f';

    // Inicializar usuários padrão
    function initializeDefaultUsers() {
        const defaultUsers = [
            { id: 1, username: 'admin1', passwordHash: DEFAULT_PASSWORD_HASH, name: 'Administrador 1', active: true },
            { id: 2, username: 'admin2', passwordHash: DEFAULT_PASSWORD_HASH, name: 'Administrador 2', active: true },
            { id: 3, username: 'admin3', passwordHash: DEFAULT_PASSWORD_HASH, name: 'Administrador 3', active: true }
        ];
        saveUsers(defaultUsers);
        return defaultUsers;
    }

    // Verificar senha
    async function verifyPassword(username, password) {
        const users = getUsers();
        const user = users.find(u => u.username === username && u.active);
        
        if (!user || !user.passwordHash) {
            return { valid: false, user: null };
        }

        const passwordHash = await hashPassword(password);
        if (passwordHash === user.passwordHash) {
            return { valid: true, user: user };
        }
        
        return { valid: false, user: null };
    }

    // Encontrar usuário por username
    function findUserByUsername(username) {
        const users = getUsers();
        return users.find(u => u.username === username);
    }

    // Criar sessão
    function createSession(user) {
        const session = {
            userId: user.id,
            username: user.username,
            timestamp: Date.now(),
            expires: Date.now() + SESSION_DURATION
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    // Verificar sessão
    function checkSession() {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        if (!sessionStr) return false;

        try {
            const session = JSON.parse(sessionStr);
            if (Date.now() < session.expires) {
                // Verificar se o usuário ainda existe e está ativo
                const user = getUsers().find(u => u.id === session.userId && u.active);
                return !!user;
            } else {
                localStorage.removeItem(SESSION_KEY);
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    // Obter usuário atual da sessão
    function getCurrentUser() {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        if (!sessionStr) return null;

        try {
            const session = JSON.parse(sessionStr);
            const users = getUsers();
            return users.find(u => u.id === session.userId);
        } catch (e) {
            return null;
        }
    }

    // Limpar sessão (logout)
    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    // Verificar se algum usuário tem senha configurada
    function hasAnyPasswordSet() {
        const users = getUsers();
        return users.some(u => u.passwordHash && u.passwordHash.length > 0);
    }

    // Processar login
    async function handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username')?.value || '';
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');

        if (!username || !password) {
            errorMessage.textContent = 'Por favor, preencha todos os campos.';
            errorMessage.classList.add('show');
            return;
        }

        // Verificar se há senhas configuradas
        if (!hasAnyPasswordSet()) {
            errorMessage.textContent = 'Nenhuma senha configurada. Configure as senhas no painel de gestão.';
            errorMessage.classList.add('show');
            return;
        }

        // Desabilitar botão
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading"></span> A verificar...';

        // Verificar credenciais
        const result = await verifyPassword(username, password);

        if (result.valid) {
            // Criar sessão
            createSession(result.user);
            // Redirecionar para página de gestão (usar replace para evitar loop)
            window.location.replace('gerir.html');
        } else {
            // Credenciais inválidas
            errorMessage.textContent = 'Utilizador ou senha incorretos. Tente novamente.';
            errorMessage.classList.add('show');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Entrar';
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    }

    // Inicializar
    function init() {
        // Verificar se já está autenticado
        if (checkSession()) {
            // Usar replace para evitar loop no histórico
            window.location.replace('gerir.html');
            return;
        }

        // Inicializar usuários se necessário (garantir que tenham senha padrão)
        getUsers();

        // Event listeners
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }

    // Aguardar DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exportar funções para uso em outras páginas
    window.checkAdminSession = checkSession;
    window.clearAdminSession = clearSession;
    window.getCurrentUser = getCurrentUser;
    window.getUsers = getUsers;
    window.saveUsers = saveUsers;
    window.hashPassword = hashPassword;

})();

