/* ============================================
   GERENCIAMENTO DE CONTEÚDO - ÉDAQUÍ STUDIO
   Sistema simples para gerenciar fotos e configurações
   ============================================ */

(function() {
    'use strict';

    const STORAGE_KEY = 'edaqui_studio_data';

    // Funções utilitárias
    function showAlert(message, type = 'success') {
        const container = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        container.innerHTML = '';
        container.appendChild(alert);

        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }

    function getData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return { photos: [], settings: {} };
            }
        }
        return { photos: [], settings: {} };
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Carregar e exibir fotos
    function loadPhotos() {
        const data = getData();
        const photos = data.photos || [];
        const grid = document.getElementById('photosGrid');

        if (photos.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: var(--spacing-xl);">Nenhuma foto adicionada ainda. Adicione a primeira foto acima!</p>';
            return;
        }

        grid.innerHTML = '';

        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            item.innerHTML = `
                <img src="${photo.url}" alt="${photo.alt}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Imagem+Não+Encontrada'">
                <div class="photo-item-info">
                    <div class="photo-item-title">${photo.title || photo.alt}</div>
                    <div class="photo-item-category">${photo.category}</div>
                </div>
                <div class="photo-item-actions">
                    <button onclick="deletePhoto(${index})" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            grid.appendChild(item);
        });
    }

    // Adicionar foto
    function addPhoto(event) {
        event.preventDefault();

        const url = document.getElementById('photoUrl').value.trim();
        const alt = document.getElementById('photoAlt').value.trim();
        const category = document.getElementById('photoCategory').value;
        const title = document.getElementById('photoTitle').value.trim();

        if (!url || !alt || !category) {
            showAlert('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }

        const data = getData();
        if (!data.photos) data.photos = [];

        const newPhoto = {
            id: Date.now(),
            url: url,
            alt: alt,
            category: category,
            title: title || null
        };

        data.photos.push(newPhoto);
        saveData(data);

        showAlert('Foto adicionada com sucesso!');
        document.getElementById('addPhotoForm').reset();
        loadPhotos();
    }

    // Eliminar foto
    window.deletePhoto = function(index) {
        if (!confirm('Tem certeza que deseja eliminar esta foto?')) return;

        const data = getData();
        data.photos.splice(index, 1);
        saveData(data);

        showAlert('Foto eliminada com sucesso!');
        loadPhotos();
    };

    // Carregar configurações
    function loadSettings() {
        const data = getData();
        const settings = data.settings || {};

        if (settings.heroTitle) document.getElementById('heroTitle').value = settings.heroTitle;
        if (settings.heroSubtitle) document.getElementById('heroSubtitle').value = settings.heroSubtitle;
        if (settings.heroImage) document.getElementById('heroImage').value = settings.heroImage;
        if (settings.phone1) document.getElementById('phone1').value = settings.phone1;
        if (settings.phone2) document.getElementById('phone2').value = settings.phone2;
        if (settings.email) document.getElementById('email').value = settings.email;
    }

    // Guardar configurações
    function saveSettings(event) {
        event.preventDefault();

        const data = getData();
        data.settings = {
            heroTitle: document.getElementById('heroTitle').value.trim(),
            heroSubtitle: document.getElementById('heroSubtitle').value.trim(),
            heroImage: document.getElementById('heroImage').value.trim(),
            phone1: document.getElementById('phone1').value.trim(),
            phone2: document.getElementById('phone2').value.trim(),
            email: document.getElementById('email').value.trim()
        };

        saveData(data);
        showAlert('Configurações guardadas com sucesso!');
    }

    // Exportar dados
    window.exportData = function() {
        const data = getData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edaqui-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showAlert('Dados exportados com sucesso!');
    };

    // Importar dados
    window.importData = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.photos || data.settings) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    showAlert('Dados importados com sucesso!');
                    loadPhotos();
                    loadSettings();
                } else {
                    showAlert('Arquivo inválido', 'error');
                }
            } catch (error) {
                showAlert('Erro ao importar dados: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    };

    // Carregar e exibir usuários
    function loadUsers() {
        if (typeof getUsers !== 'function') return;
        
        const users = getUsers();
        const container = document.getElementById('usersList');
        if (!container) return;

        container.innerHTML = '';

        users.forEach((user, index) => {
            const userCard = document.createElement('div');
            userCard.className = 'admin-section';
            userCard.style.marginBottom = 'var(--spacing-md)';
            userCard.style.padding = 'var(--spacing-md)';
            userCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md); flex-wrap: wrap; gap: var(--spacing-sm);">
                    <div style="flex: 1; min-width: 200px;">
                        <h3 style="margin: 0; color: var(--text-primary);">${user.name}</h3>
                        <p style="margin: var(--spacing-xs) 0 0 0; color: var(--text-secondary); font-size: var(--font-size-sm);">${user.username}</p>
                    </div>
                    <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                        <button class="btn btn-secondary btn-sm" onclick="editUserName(${user.id})">
                            <i class="fa-solid fa-edit"></i> Editar Nome
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="editUserPassword(${user.id})">
                            <i class="fa-solid fa-key"></i> Alterar Senha
                        </button>
                        <button class="btn ${user.active ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="toggleUser(${user.id})">
                            <i class="fa-solid fa-${user.active ? 'ban' : 'check'}"></i> ${user.active ? 'Desativar' : 'Ativar'}
                        </button>
                    </div>
                </div>
                <div style="padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: 8px;">
                    <small style="color: var(--text-secondary);">
                        Status: <strong style="color: ${user.active ? '#34c759' : '#ff3b30'}">${user.active ? 'Ativo' : 'Inativo'}</strong> | 
                        Senha: <strong>${user.passwordHash ? 'Configurada' : 'Não configurada'}</strong>
                    </small>
                </div>
            `;
            container.appendChild(userCard);
        });
    }

    // Editar nome de usuário
    window.editUserName = function(userId) {
        if (typeof getUsers !== 'function') {
            showAlert('Sistema de usuários não disponível', 'error');
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const newName = prompt(`Digite o novo nome para ${user.name}:`, user.name);
        if (!newName || newName.trim().length === 0) {
            return;
        }

        user.name = newName.trim();
        saveUsers(users);
        showAlert(`Nome de ${user.username} atualizado para "${user.name}"!`);
        loadUsers();
    };

    // Editar senha de usuário
    window.editUserPassword = async function(userId) {
        if (typeof getUsers !== 'function' || typeof hashPassword !== 'function') {
            showAlert('Sistema de usuários não disponível', 'error');
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const newPassword = prompt(`Digite a nova senha para ${user.name} (mínimo 6 caracteres):`);
        if (!newPassword || newPassword.length < 6) {
            showAlert('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        const confirmPassword = prompt('Confirme a senha:');
        if (newPassword !== confirmPassword) {
            showAlert('As senhas não coincidem!', 'error');
            return;
        }

        try {
            const passwordHash = await hashPassword(newPassword);
            user.passwordHash = passwordHash;
            saveUsers(users);
            showAlert(`Senha de ${user.name} atualizada com sucesso!`);
            loadUsers();
        } catch (error) {
            showAlert('Erro ao atualizar senha', 'error');
        }
    };

    // Ativar/Desativar usuário
    window.toggleUser = function(userId) {
        if (typeof getUsers !== 'function') {
            showAlert('Sistema de usuários não disponível', 'error');
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return;

        // Verificar se está tentando desativar o último usuário ativo
        const activeUsers = users.filter(u => u.active && u.id !== userId);
        if (!user.active && activeUsers.length === 0) {
            showAlert('Deve haver pelo menos um utilizador ativo!', 'error');
            return;
        }

        user.active = !user.active;
        saveUsers(users);
        showAlert(`${user.name} ${user.active ? 'ativado' : 'desativado'} com sucesso!`);
        loadUsers();
    };

    // Inicializar
    function init() {
        document.getElementById('addPhotoForm').addEventListener('submit', addPhoto);
        document.getElementById('settingsForm').addEventListener('submit', saveSettings);
        loadPhotos();
        loadSettings();
        loadUsers();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

