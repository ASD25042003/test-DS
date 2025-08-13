/**
 * Composant UploadForm - Module Ressources
 * Formulaire de création/upload de ressources pédagogiques
 * Intégration complète avec l'API backend
 */

class UploadForm {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            onSubmit: options.onSubmit || (() => {}),
            onCancel: options.onCancel || (() => {}),
            showModal: options.showModal !== false,
            editMode: options.editMode || false,
            resourceData: options.resourceData || null,
            ...options
        };

        this.currentFile = null;
        this.isSubmitting = false;

        // Types de ressources supportés
        this.resourceTypes = [
            { value: 'document', label: '📄 Document', description: 'PDF, DOCX, TXT...' },
            { value: 'media', label: '🖼️ Média', description: 'Images, photos...' },
            { value: 'video', label: '🎥 Vidéo', description: 'MP4, AVI, MOV...' },
            { value: 'lien', label: '🔗 Lien', description: 'Site web, ressource en ligne' }
        ];

        // Matières disponibles
        this.matieres = [
            'Mathématiques', 'Sciences', 'Français', 'Histoire', 
            'Géographie', 'Anglais', 'Espagnol', 'Arts', 'Sport', 'Technologie'
        ];

        // Niveaux scolaires
        this.niveaux = [
            '6ème', '5ème', '4ème', '3ème', 
            '2nde', '1ère', 'Terminale', 'Tous niveaux'
        ];

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('UploadForm: Container non trouvé');
            return;
        }
        
        this.render();
        this.attachEventListeners();
        
        if (this.options.editMode && this.options.resourceData) {
            this.fillFormWithData(this.options.resourceData);
        }
    }

    render() {
        const modalClass = this.options.showModal ? 'modal-overlay' : '';
        const title = this.options.editMode ? '✏️ Modifier la ressource' : '📤 Nouvelle ressource';
        
        this.container.innerHTML = `
            <div class="${modalClass}" id="upload-modal">
                <div class="modal-content max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
                    <form id="resource-form" enctype="multipart/form-data">
                        <!-- En-tête -->
                        <div class="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 class="text-2xl font-bold" style="color: var(--color-gray-900);">
                                ${title}
                            </h2>
                            <button type="button" id="close-modal" class="text-gray-500 hover:text-gray-700 text-xl">
                                ✕
                            </button>
                        </div>

                        <div class="p-6 space-y-6">
                            <!-- Informations de base -->
                            <div class="space-y-4">
                                <div>
                                    <label for="titre" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        Titre de la ressource *
                                    </label>
                                    <input type="text" 
                                           id="titre" 
                                           name="titre" 
                                           required
                                           maxlength="200"
                                           class="form-input w-full"
                                           placeholder="Ex: Cours d'algèbre - Équations du 2nd degré">
                                    <div class="error-message" id="titre-error"></div>
                                </div>

                                <div>
                                    <label for="description" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        Description *
                                    </label>
                                    <textarea id="description" 
                                              name="description" 
                                              required
                                              maxlength="1000"
                                              rows="4"
                                              class="form-input w-full resize-none"
                                              placeholder="Décrivez brièvement le contenu et l'objectif de cette ressource..."></textarea>
                                    <div class="text-xs text-gray-500 mt-1">
                                        <span id="description-count">0</span> / 1000 caractères
                                    </div>
                                    <div class="error-message" id="description-error"></div>
                                </div>
                            </div>

                            <!-- Type et classification -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="type" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        Type de ressource *
                                    </label>
                                    <select id="type" name="type" required class="form-input w-full">
                                        <option value="">Sélectionner un type</option>
                                        ${this.resourceTypes.map(type => `
                                            <option value="${type.value}">${type.label}</option>
                                        `).join('')}
                                    </select>
                                    <div class="error-message" id="type-error"></div>
                                </div>

                                <div>
                                    <label for="matiere" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        Matière *
                                    </label>
                                    <select id="matiere" name="matiere" required class="form-input w-full">
                                        <option value="">Sélectionner une matière</option>
                                        ${this.matieres.map(matiere => `
                                            <option value="${matiere}">${matiere}</option>
                                        `).join('')}
                                    </select>
                                    <div class="error-message" id="matiere-error"></div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="niveau" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        Niveau scolaire
                                    </label>
                                    <select id="niveau" name="niveau" class="form-input w-full">
                                        <option value="">Sélectionner un niveau</option>
                                        ${this.niveaux.map(niveau => `
                                            <option value="${niveau}">${niveau}</option>
                                        `).join('')}
                                    </select>
                                </div>

                                <div>
                                    <label for="visibility" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        Visibilité
                                    </label>
                                    <select id="visibility" name="is_public" class="form-input w-full">
                                        <option value="true">🌐 Public (visible par tous)</option>
                                        <option value="false">🔒 Privé (visible par moi uniquement)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Tags -->
                            <div>
                                <label for="tags" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                    Tags (mots-clés)
                                </label>
                                <input type="text" 
                                       id="tags" 
                                       name="tags"
                                       class="form-input w-full"
                                       placeholder="Ex: géométrie, exercices, correction (séparés par des virgules)">
                                <div class="text-xs text-gray-500 mt-1">
                                    Séparez les tags par des virgules. Maximum 10 tags.
                                </div>
                                <div id="tags-preview" class="flex flex-wrap gap-1 mt-2"></div>
                            </div>

                            <!-- Zone d'upload conditionnel -->
                            <div id="upload-section">
                                <!-- Pour fichiers (document, media, video) -->
                                <div id="file-upload-section" class="hidden">
                                    <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        Fichier
                                    </label>
                                    <div class="file-drop-zone" id="file-drop-zone">
                                        <div class="text-center py-8">
                                            <div class="text-4xl mb-4">📁</div>
                                            <p class="text-lg font-medium mb-2">
                                                Glissez-déposez votre fichier ici
                                            </p>
                                            <p class="text-gray-500 mb-4">ou</p>
                                            <button type="button" class="btn-secondary" id="browse-files">
                                                Parcourir les fichiers
                                            </button>
                                            <input type="file" id="file-input" name="file" class="hidden" accept="*">
                                        </div>
                                        <div id="file-info" class="hidden">
                                            <div class="bg-green-50 border border-green-200 rounded p-4">
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center space-x-3">
                                                        <div class="text-2xl" id="file-icon">📄</div>
                                                        <div>
                                                            <p class="font-medium" id="file-name">--</p>
                                                            <p class="text-sm text-gray-600" id="file-size">--</p>
                                                        </div>
                                                    </div>
                                                    <button type="button" id="remove-file" class="text-red-500 hover:text-red-700">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-xs text-gray-500 mt-2">
                                            Taille maximum: 50 MB. Types supportés: PDF, DOCX, TXT, JPG, PNG, GIF, MP4, AVI, MOV
                                        </div>
                                    </div>
                                    <div class="error-message" id="file-error"></div>
                                </div>

                                <!-- Pour liens -->
                                <div id="link-section" class="hidden">
                                    <label for="url" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                        URL de la ressource *
                                    </label>
                                    <input type="url" 
                                           id="url" 
                                           name="url"
                                           class="form-input w-full"
                                           placeholder="https://exemple.com/ma-ressource">
                                    <div class="text-xs text-gray-500 mt-1">
                                        URL complète vers la ressource externe
                                    </div>
                                    <div class="error-message" id="url-error"></div>
                                </div>
                            </div>

                            <!-- Contenu supplémentaire -->
                            <div>
                                <label for="contenu-extra" class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                    Informations complémentaires
                                </label>
                                <textarea id="contenu-extra" 
                                          name="contenu-extra" 
                                          rows="3"
                                          maxlength="500"
                                          class="form-input w-full resize-none"
                                          placeholder="Objectifs pédagogiques, prérequis, conseils d'utilisation..."></textarea>
                                <div class="text-xs text-gray-500 mt-1">
                                    <span id="contenu-count">0</span> / 500 caractères
                                </div>
                            </div>
                        </div>

                        <!-- Pied de page -->
                        <div class="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
                            <div class="text-sm text-gray-600">
                                * Champs obligatoires
                            </div>
                            <div class="flex space-x-3">
                                <button type="button" id="cancel-btn" class="btn-secondary">
                                    Annuler
                                </button>
                                <button type="submit" id="submit-btn" class="btn-primary">
                                    <span id="submit-text">
                                        ${this.options.editMode ? '💾 Enregistrer' : '📤 Publier'}
                                    </span>
                                    <span id="submit-loading" class="hidden">
                                        <span class="animate-spin">⏳</span> En cours...
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.addStyles();
    }

    addStyles() {
        // Ajout des styles CSS spécifiques au formulaire
        if (!document.querySelector('#upload-form-styles')) {
            const styles = document.createElement('style');
            styles.id = 'upload-form-styles';
            styles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    padding: 1rem;
                }
                
                .modal-content {
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .form-input {
                    padding: 0.75rem;
                    border: 1px solid var(--color-beige-300);
                    border-radius: 8px;
                    background: var(--color-beige-50);
                    transition: all 0.2s ease;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: var(--color-accent-primary);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
                }
                
                .file-drop-zone {
                    border: 2px dashed var(--color-beige-300);
                    border-radius: 12px;
                    transition: all 0.2s ease;
                    background: var(--color-beige-50);
                }
                
                .file-drop-zone.dragover {
                    border-color: var(--color-accent-primary);
                    background: rgba(217, 119, 6, 0.05);
                }
                
                .error-message {
                    color: #dc2626;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: none;
                }
                
                .error-message.show {
                    display: block;
                }
                
                .tag-preview {
                    background: var(--color-accent-primary);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .tag-preview .remove-tag {
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                
                .tag-preview .remove-tag:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    attachEventListeners() {
        const form = this.container.querySelector('#resource-form');
        const typeSelect = this.container.querySelector('#type');
        const fileInput = this.container.querySelector('#file-input');
        const fileDropZone = this.container.querySelector('#file-drop-zone');
        const browseBt = this.container.querySelector('#browse-files');
        const removeFileBtn = this.container.querySelector('#remove-file');
        const tagsInput = this.container.querySelector('#tags');
        const closeBtn = this.container.querySelector('#close-modal');
        const cancelBtn = this.container.querySelector('#cancel-btn');

        // Gestion du type de ressource
        typeSelect?.addEventListener('change', (e) => {
            this.toggleUploadSection(e.target.value);
        });

        // Gestion des fichiers
        browseBt?.addEventListener('click', () => fileInput?.click());
        fileInput?.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
        removeFileBtn?.addEventListener('click', () => this.removeFile());

        // Drag & Drop
        fileDropZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropZone.classList.add('dragover');
        });

        fileDropZone?.addEventListener('dragleave', () => {
            fileDropZone.classList.remove('dragover');
        });

        fileDropZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropZone.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files[0]);
        });

        // Compteurs de caractères
        this.setupCharacterCounters();

        // Gestion des tags
        tagsInput?.addEventListener('input', () => this.updateTagsPreview());

        // Validation en temps réel
        form?.addEventListener('input', () => this.validateForm());

        // Soumission du formulaire
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Fermeture
        closeBtn?.addEventListener('click', () => this.close());
        cancelBtn?.addEventListener('click', () => this.close());

        // Fermeture en cliquant sur l'overlay
        if (this.options.showModal) {
            this.container.querySelector('#upload-modal')?.addEventListener('click', (e) => {
                if (e.target.id === 'upload-modal') {
                    this.close();
                }
            });
        }
    }

    toggleUploadSection(type) {
        const fileSection = this.container.querySelector('#file-upload-section');
        const linkSection = this.container.querySelector('#link-section');
        const fileInput = this.container.querySelector('#file-input');
        const urlInput = this.container.querySelector('#url');

        // Reset
        fileSection.classList.add('hidden');
        linkSection.classList.add('hidden');
        fileInput.removeAttribute('required');
        urlInput.removeAttribute('required');

        if (type === 'lien') {
            linkSection.classList.remove('hidden');
            urlInput.setAttribute('required', true);
        } else if (type) {
            fileSection.classList.remove('hidden');
            if (!this.options.editMode) {
                fileInput.setAttribute('required', true);
            }
        }

        // Mise à jour des types de fichiers acceptés
        this.updateFileAcceptTypes(type);
    }

    updateFileAcceptTypes(type) {
        const fileInput = this.container.querySelector('#file-input');
        const acceptTypes = {
            'document': '.pdf,.doc,.docx,.txt,.rtf',
            'media': '.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp',
            'video': '.mp4,.avi,.mov,.wmv,.flv,.webm'
        };

        if (fileInput && acceptTypes[type]) {
            fileInput.setAttribute('accept', acceptTypes[type]);
        } else {
            fileInput?.setAttribute('accept', '*');
        }
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validation de la taille (50MB)
        if (file.size > 50 * 1024 * 1024) {
            this.showFieldError('file', 'Le fichier est trop volumineux (maximum 50 MB)');
            return;
        }

        this.currentFile = file;
        this.showFileInfo(file);
        this.clearFieldError('file');
    }

    showFileInfo(file) {
        const fileInfo = this.container.querySelector('#file-info');
        const fileName = this.container.querySelector('#file-name');
        const fileSize = this.container.querySelector('#file-size');
        const fileIcon = this.container.querySelector('#file-icon');
        const dropZone = this.container.querySelector('#file-drop-zone');

        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        fileIcon.textContent = this.getFileIcon(file.type);

        dropZone.querySelector('.text-center').classList.add('hidden');
        fileInfo.classList.remove('hidden');
    }

    removeFile() {
        const fileInput = this.container.querySelector('#file-input');
        const fileInfo = this.container.querySelector('#file-info');
        const dropZone = this.container.querySelector('#file-drop-zone');

        this.currentFile = null;
        fileInput.value = '';
        
        dropZone.querySelector('.text-center').classList.remove('hidden');
        fileInfo.classList.add('hidden');
        this.clearFieldError('file');
    }

    getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType.startsWith('video/')) return '🎥';
        if (mimeType.includes('pdf')) return '📕';
        if (mimeType.includes('word') || mimeType.includes('document')) return '📄';
        if (mimeType.includes('text')) return '📝';
        return '📁';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupCharacterCounters() {
        const counters = [
            { input: '#description', counter: '#description-count', max: 1000 },
            { input: '#contenu-extra', counter: '#contenu-count', max: 500 }
        ];

        counters.forEach(({ input, counter, max }) => {
            const inputEl = this.container.querySelector(input);
            const counterEl = this.container.querySelector(counter);

            inputEl?.addEventListener('input', () => {
                const count = inputEl.value.length;
                counterEl.textContent = count;
                counterEl.style.color = count > max * 0.9 ? '#dc2626' : '';
            });
        });
    }

    updateTagsPreview() {
        const tagsInput = this.container.querySelector('#tags');
        const tagsPreview = this.container.querySelector('#tags-preview');
        
        const tags = tagsInput.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .slice(0, 10); // Maximum 10 tags

        tagsPreview.innerHTML = tags.map(tag => `
            <span class="tag-preview">
                ${tag}
                <span class="remove-tag" data-tag="${tag}">✕</span>
            </span>
        `).join('');

        // Événements pour supprimer des tags
        tagsPreview.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tagToRemove = e.target.dataset.tag;
                const newTags = tags.filter(tag => tag !== tagToRemove);
                tagsInput.value = newTags.join(', ');
                this.updateTagsPreview();
            });
        });
    }

    validateForm() {
        let isValid = true;
        const requiredFields = ['titre', 'description', 'type', 'matiere'];
        
        // Validation des champs obligatoires
        requiredFields.forEach(field => {
            const input = this.container.querySelector(`#${field}`);
            if (!input?.value.trim()) {
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validation conditionnelle
        const type = this.container.querySelector('#type').value;
        
        if (type === 'lien') {
            const url = this.container.querySelector('#url').value;
            if (!url.trim()) {
                isValid = false;
            } else if (!this.isValidUrl(url)) {
                this.showFieldError('url', 'URL invalide');
                isValid = false;
            } else {
                this.clearFieldError('url');
            }
        } else if (type && !this.options.editMode && !this.currentFile) {
            this.showFieldError('file', 'Veuillez sélectionner un fichier');
            isValid = false;
        }

        return isValid;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showFieldError(field, message) {
        const errorEl = this.container.querySelector(`#${field}-error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    clearFieldError(field) {
        const errorEl = this.container.querySelector(`#${field}-error`);
        if (errorEl) {
            errorEl.classList.remove('show');
        }
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        this.showSubmitLoading(true);

        try {
            const formData = this.collectFormData();
            
            await this.options.onSubmit(formData, this.currentFile);
            
            // Succès - fermer le formulaire
            this.close();
            
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
        } finally {
            this.isSubmitting = false;
            this.showSubmitLoading(false);
        }
    }

    collectFormData() {
        const form = this.container.querySelector('#resource-form');
        const formData = new FormData(form);
        
        // Traitement des tags
        const tagsString = formData.get('tags') || '';
        const tags = tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .slice(0, 10);

        // Construction de l'objet contenu
        const contenu = {
            description: formData.get('contenu-extra') || ''
        };

        // Ajout de l'URL pour les liens
        if (formData.get('type') === 'lien') {
            contenu.url = formData.get('url');
        }

        return {
            titre: formData.get('titre'),
            description: formData.get('description'),
            type: formData.get('type'),
            matiere: formData.get('matiere'),
            niveau: formData.get('niveau') || null,
            tags: tags,
            contenu: contenu,
            is_public: formData.get('is_public') === 'true'
        };
    }

    showSubmitLoading(show) {
        const submitText = this.container.querySelector('#submit-text');
        const submitLoading = this.container.querySelector('#submit-loading');
        const submitBtn = this.container.querySelector('#submit-btn');

        if (!submitText || !submitLoading || !submitBtn) {
            return; // Éléments non trouvés, probablement formulaire détruit
        }

        if (show) {
            submitText.classList.add('hidden');
            submitLoading.classList.remove('hidden');
            submitBtn.disabled = true;
        } else {
            submitText.classList.remove('hidden');
            submitLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    fillFormWithData(resourceData) {
        // Remplissage automatique pour l'édition
        const fields = ['titre', 'description', 'type', 'matiere', 'niveau'];
        
        fields.forEach(field => {
            const input = this.container.querySelector(`#${field}`);
            if (input && resourceData[field]) {
                input.value = resourceData[field];
            }
        });

        // Visibilité
        const visibilitySelect = this.container.querySelector('#visibility');
        if (visibilitySelect) {
            visibilitySelect.value = resourceData.is_public ? 'true' : 'false';
        }

        // Tags
        if (resourceData.tags && resourceData.tags.length > 0) {
            const tagsInput = this.container.querySelector('#tags');
            tagsInput.value = resourceData.tags.join(', ');
            this.updateTagsPreview();
        }

        // Contenu extra
        if (resourceData.contenu && resourceData.contenu.description) {
            const contenuInput = this.container.querySelector('#contenu-extra');
            contenuInput.value = resourceData.contenu.description;
        }

        // Type de ressource
        this.toggleUploadSection(resourceData.type);

        // URL pour les liens
        if (resourceData.type === 'lien' && resourceData.contenu?.url) {
            const urlInput = this.container.querySelector('#url');
            urlInput.value = resourceData.contenu.url;
        }
    }

    close() {
        this.options.onCancel();
        if (this.options.showModal) {
            this.container.innerHTML = '';
        }
    }

    // Méthodes publiques
    show() {
        if (this.container.querySelector('#upload-modal')) {
            this.container.querySelector('#upload-modal').style.display = 'flex';
        }
    }

    hide() {
        if (this.container.querySelector('#upload-modal')) {
            this.container.querySelector('#upload-modal').style.display = 'none';
        }
    }

    reset() {
        const form = this.container.querySelector('#resource-form');
        form?.reset();
        this.removeFile();
        this.updateTagsPreview();
        this.toggleUploadSection('');
    }
}

export default UploadForm;