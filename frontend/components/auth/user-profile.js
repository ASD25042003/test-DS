/**
 * 👤 Composant Profil Utilisateur - Diagana School  
 * Affichage et modification des informations utilisateur
 */

export class UserProfile {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            onUpdateProfile: options.onUpdateProfile || null,
            onChangePassword: options.onChangePassword || null,
            onLogout: options.onLogout || null,
            showPasswordChange: options.showPasswordChange !== false,
            className: options.className || 'card p-8'
        };
        
        this.userData = null;
        this.isEditing = false;
        this.editData = {};
        
        this.render();
    }

    setUserData(userData) {
        this.userData = userData;
        this.editData = { ...userData };
        this.render();
    }

    render() {
        if (!this.userData) {
            this.container.innerHTML = `
                <div class="${this.options.className}">
                    <div class="text-center py-8">
                        <div class="loading-spinner">🔄 Chargement du profil...</div>
                    </div>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="${this.options.className}">
                ${this.renderHeader()}
                ${this.renderProfileInfo()}
                ${this.renderActions()}
                ${this.options.showPasswordChange ? this.renderPasswordSection() : ''}
                <div class="form-errors" style="display: none;"></div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderHeader() {
        const roleIcon = this.userData.role === 'teacher' ? '🧑‍🏫' : '👨‍🎓';
        const roleName = this.userData.role === 'teacher' ? 'Professeur' : 'Étudiant';
        
        return `
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-4">
                    <div class="profile-avatar" style="
                        width: 64px;
                        height: 64px;
                        background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        color: white;
                        font-weight: bold;
                    ">
                        ${roleIcon}
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold" style="color: var(--color-gray-900);">
                            ${this.userData.firstName} ${this.userData.lastName}
                        </h2>
                        <p class="text-sm" style="color: var(--color-gray-500);">
                            ${roleName} • ${this.userData.email}
                        </p>
                    </div>
                </div>
                
                <button class="btn-secondary edit-profile-btn">
                    <span class="edit-text">✏️ Modifier</span>
                    <span class="cancel-text" style="display: none;">❌ Annuler</span>
                </button>
            </div>
        `;
    }

    renderProfileInfo() {
        if (this.isEditing) {
            return `
                <form class="profile-edit-form">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                Prénom
                            </label>
                            <input 
                                type="text" 
                                class="form-input edit-first-name" 
                                value="${this.editData.firstName || ''}"
                                required
                            >
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                Nom
                            </label>
                            <input 
                                type="text" 
                                class="form-input edit-last-name" 
                                value="${this.editData.lastName || ''}"
                                required
                            >
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                            Email
                        </label>
                        <input 
                            type="email" 
                            class="form-input edit-email" 
                            value="${this.editData.email || ''}"
                            readonly
                            style="background-color: var(--color-beige-200); cursor: not-allowed;"
                        >
                        <p class="text-xs mt-1" style="color: var(--color-gray-500);">
                            L'email ne peut pas être modifié
                        </p>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button type="submit" class="btn-primary save-profile-btn">
                            <span class="save-text">💾 Sauvegarder</span>
                            <span class="loading-spinner" style="display: none;">🔄 Sauvegarde...</span>
                        </button>
                        <button type="button" class="btn-secondary cancel-edit-btn">
                            Annuler
                        </button>
                    </div>
                </form>
            `;
        }

        return `
            <div class="profile-info">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="info-item">
                        <label class="block text-sm font-medium mb-1" style="color: var(--color-gray-500);">
                            Prénom
                        </label>
                        <p class="text-base" style="color: var(--color-gray-900);">
                            ${this.userData.firstName}
                        </p>
                    </div>
                    
                    <div class="info-item">
                        <label class="block text-sm font-medium mb-1" style="color: var(--color-gray-500);">
                            Nom
                        </label>
                        <p class="text-base" style="color: var(--color-gray-900);">
                            ${this.userData.lastName}
                        </p>
                    </div>
                    
                    <div class="info-item">
                        <label class="block text-sm font-medium mb-1" style="color: var(--color-gray-500);">
                            Email
                        </label>
                        <p class="text-base" style="color: var(--color-gray-900);">
                            ${this.userData.email}
                        </p>
                    </div>
                    
                    <div class="info-item">
                        <label class="block text-sm font-medium mb-1" style="color: var(--color-gray-500);">
                            Rôle
                        </label>
                        <p class="text-base" style="color: var(--color-gray-900);">
                            ${this.userData.role === 'teacher' ? 'Professeur' : 'Étudiant'}
                        </p>
                    </div>
                </div>
                
                ${this.userData.createdAt ? `
                <div class="text-sm" style="color: var(--color-gray-500);">
                    Membre depuis ${new Date(this.userData.createdAt).toLocaleDateString('fr-FR')}
                </div>
                ` : ''}
            </div>
        `;
    }

    renderPasswordSection() {
        return `
            <div class="password-section mt-8 pt-6" style="border-top: 1px solid var(--color-beige-300);">
                <h3 class="text-lg font-semibold mb-4" style="color: var(--color-gray-900);">
                    Changer le mot de passe
                </h3>
                
                <form class="password-form" style="display: none;">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                Mot de passe actuel
                            </label>
                            <input 
                                type="password" 
                                class="form-input current-password" 
                                placeholder="••••••••"
                                required
                            >
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                Nouveau mot de passe
                            </label>
                            <input 
                                type="password" 
                                class="form-input new-password" 
                                placeholder="••••••••"
                                minlength="6"
                                required
                            >
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                Confirmer le nouveau mot de passe
                            </label>
                            <input 
                                type="password" 
                                class="form-input confirm-password" 
                                placeholder="••••••••"
                                minlength="6"
                                required
                            >
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 mt-6">
                        <button type="submit" class="btn-primary change-password-btn">
                            <span class="change-text">🔒 Changer le mot de passe</span>
                            <span class="loading-spinner" style="display: none;">🔄 Changement...</span>
                        </button>
                        <button type="button" class="btn-secondary cancel-password-btn">
                            Annuler
                        </button>
                    </div>
                </form>
                
                <button class="btn-secondary show-password-form-btn">
                    🔒 Changer le mot de passe
                </button>
            </div>
        `;
    }

    renderActions() {
        return `
            <div class="actions-section mt-6 pt-4" style="border-top: 1px solid var(--color-beige-300);">
                <div class="flex flex-wrap gap-3">
                    <button class="btn-secondary logout-btn" style="color: #dc2626; border-color: #fecaca;">
                        🚪 Se déconnecter
                    </button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const editBtn = this.container.querySelector('.edit-profile-btn');
        const logoutBtn = this.container.querySelector('.logout-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => this.toggleEdit());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        if (this.isEditing) {
            this.attachEditEventListeners();
        }

        if (this.options.showPasswordChange) {
            this.attachPasswordEventListeners();
        }
    }

    attachEditEventListeners() {
        const form = this.container.querySelector('.profile-edit-form');
        const firstNameInput = this.container.querySelector('.edit-first-name');
        const lastNameInput = this.container.querySelector('.edit-last-name');
        const cancelBtn = this.container.querySelector('.cancel-edit-btn');

        if (firstNameInput) {
            firstNameInput.addEventListener('input', () => {
                this.editData.firstName = firstNameInput.value.trim();
            });
        }

        if (lastNameInput) {
            lastNameInput.addEventListener('input', () => {
                this.editData.lastName = lastNameInput.value.trim();
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveProfile();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.toggleEdit();
            });
        }
    }

    attachPasswordEventListeners() {
        const showPasswordBtn = this.container.querySelector('.show-password-form-btn');
        const passwordForm = this.container.querySelector('.password-form');
        const cancelPasswordBtn = this.container.querySelector('.cancel-password-btn');
        
        if (showPasswordBtn) {
            showPasswordBtn.addEventListener('click', () => {
                showPasswordBtn.style.display = 'none';
                passwordForm.style.display = 'block';
            });
        }

        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChangePassword();
            });
        }

        if (cancelPasswordBtn) {
            cancelPasswordBtn.addEventListener('click', () => {
                passwordForm.style.display = 'none';
                showPasswordBtn.style.display = 'block';
                passwordForm.reset();
            });
        }
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.editData = { ...this.userData };
        }
        this.render();
    }

    async handleSaveProfile() {
        if (!this.editData.firstName || !this.editData.lastName) {
            this.showError('Veuillez remplir tous les champs requis');
            return;
        }

        const saveBtn = this.container.querySelector('.save-profile-btn');
        const saveText = saveBtn.querySelector('.save-text');
        const loadingSpinner = saveBtn.querySelector('.loading-spinner');
        
        saveBtn.disabled = true;
        saveText.style.display = 'none';
        loadingSpinner.style.display = 'inline';

        try {
            if (this.options.onUpdateProfile) {
                const updatedData = await this.options.onUpdateProfile({
                    firstName: this.editData.firstName,
                    lastName: this.editData.lastName
                });
                
                this.userData = { ...this.userData, ...updatedData };
                this.isEditing = false;
                this.render();
                this.showSuccessMessage('Profil mis à jour avec succès');
            }
        } catch (error) {
            this.showError(error.message || 'Erreur lors de la mise à jour du profil');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveText.style.display = 'inline';
                loadingSpinner.style.display = 'none';
            }
        }
    }

    async handleChangePassword() {
        const currentPassword = this.container.querySelector('.current-password').value;
        const newPassword = this.container.querySelector('.new-password').value;
        const confirmPassword = this.container.querySelector('.confirm-password').value;

        if (newPassword !== confirmPassword) {
            this.showError('Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        if (newPassword.length < 6) {
            this.showError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        const changeBtn = this.container.querySelector('.change-password-btn');
        const changeText = changeBtn.querySelector('.change-text');
        const loadingSpinner = changeBtn.querySelector('.loading-spinner');
        
        changeBtn.disabled = true;
        changeText.style.display = 'none';
        loadingSpinner.style.display = 'inline';

        try {
            if (this.options.onChangePassword) {
                await this.options.onChangePassword({
                    currentPassword,
                    newPassword
                });
                
                this.container.querySelector('.password-form').reset();
                this.container.querySelector('.password-form').style.display = 'none';
                this.container.querySelector('.show-password-form-btn').style.display = 'block';
                
                this.showSuccessMessage('Mot de passe changé avec succès');
            }
        } catch (error) {
            this.showError(error.message || 'Erreur lors du changement de mot de passe');
        } finally {
            if (changeBtn) {
                changeBtn.disabled = false;
                changeText.style.display = 'inline';
                loadingSpinner.style.display = 'none';
            }
        }
    }

    handleLogout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            if (this.options.onLogout) {
                this.options.onLogout();
            }
        }
    }

    showError(message) {
        const errorsContainer = this.container.querySelector('.form-errors');
        errorsContainer.innerHTML = `
            <div class="error-banner" style="
                background-color: #fee2e2;
                color: #dc2626;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                margin-top: 1rem;
                border: 1px solid #fecaca;
                font-size: 0.875rem;
            ">
                ${message}
            </div>
        `;
        errorsContainer.style.display = 'block';

        setTimeout(() => {
            errorsContainer.style.display = 'none';
        }, 5000);
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--color-accent-secondary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}