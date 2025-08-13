/**
 * 📝 Composant Formulaire d'Inscription - Diagana School
 * Composant réutilisable pour l'inscription avec clé
 */

export class RegisterForm {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            onSubmit: options.onSubmit || null,
            onToggleLogin: options.onToggleLogin || null,
            className: options.className || 'card p-8 animate-slide-in'
        };
        
        this.formData = {
            registrationKey: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="${this.options.className}">
                <h1 class="text-2xl font-semibold mb-6 text-center" style="color: var(--color-gray-900);">
                    Inscription
                </h1>
                
                <form class="space-y-5 register-form-element">
                    <div>
                        <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                            Clé d'inscription
                        </label>
                        <input 
                            type="text" 
                            class="form-input registration-key" 
                            placeholder="PROF_2024_A1B2C3 ou ELEVE_2024_E1F2G3"
                            required
                        >
                        <p class="text-xs mt-1" style="color: var(--color-gray-500);">
                            Utilisez votre clé fournie par l'établissement
                        </p>
                        <div class="error-message registration-key-error" style="display: none;"></div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                Prénom
                            </label>
                            <input 
                                type="text" 
                                class="form-input first-name" 
                                placeholder="Jean"
                                required
                            >
                            <div class="error-message first-name-error" style="display: none;"></div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                                Nom
                            </label>
                            <input 
                                type="text" 
                                class="form-input last-name" 
                                placeholder="Dupont"
                                required
                            >
                            <div class="error-message last-name-error" style="display: none;"></div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                            Adresse email
                        </label>
                        <input 
                            type="email" 
                            class="form-input register-email" 
                            placeholder="jean.dupont@diagana.com"
                            required
                        >
                        <div class="error-message register-email-error" style="display: none;"></div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                            Mot de passe
                        </label>
                        <input 
                            type="password" 
                            class="form-input register-password" 
                            placeholder="••••••••"
                            required
                            minlength="8"
                        >
                        <p class="text-xs mt-1" style="color: var(--color-gray-500);">
                            Min 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre
                        </p>
                        <div class="error-message register-password-error" style="display: none;"></div>
                    </div>

                    <div class="terms-container">
                        <label class="flex items-start text-sm">
                            <input type="checkbox" class="mr-2 mt-1 rounded terms-checkbox" style="accent-color: var(--color-accent-primary);" required>
                            <span style="color: var(--color-gray-500);">
                                J'accepte les 
                                <a href="#" class="toggle-form" style="color: var(--color-accent-primary);">conditions d'utilisation</a>
                                et la 
                                <a href="#" class="toggle-form" style="color: var(--color-accent-primary);">politique de confidentialité</a>
                            </span>
                        </label>
                        <div class="error-message terms-error" style="display: none;"></div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary register-submit-btn" style="width: 100%; padding: 0.875rem 1.5rem; border-radius: 8px; font-size: 1rem;">
                        <span class="submit-text">Créer mon compte</span>
                        <span class="loading-spinner" style="display: none;">
                            🔄 Inscription...
                        </span>
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <span style="color: var(--color-gray-500);">Déjà un compte ?</span>
                    <a href="#" class="toggle-form ml-1 show-login-link" style="color: var(--color-accent-primary);">Se connecter</a>
                </div>
                
                <div class="form-errors" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = this.container.querySelector('.register-form-element');
        const registrationKeyInput = this.container.querySelector('.registration-key');
        const firstNameInput = this.container.querySelector('.first-name');
        const lastNameInput = this.container.querySelector('.last-name');
        const emailInput = this.container.querySelector('.register-email');
        const passwordInput = this.container.querySelector('.register-password');
        const termsCheckbox = this.container.querySelector('.terms-checkbox');
        const submitButton = this.container.querySelector('.register-submit-btn');
        const loginLink = this.container.querySelector('.show-login-link');

        registrationKeyInput.addEventListener('input', () => {
            this.formData.registrationKey = registrationKeyInput.value.trim().toUpperCase();
            registrationKeyInput.value = this.formData.registrationKey;
            this.validateForm();
            this.clearFieldError('registrationKey');
            this.validateRegistrationKey();
        });

        firstNameInput.addEventListener('input', () => {
            this.formData.firstName = firstNameInput.value.trim();
            this.validateForm();
            this.clearFieldError('firstName');
        });

        lastNameInput.addEventListener('input', () => {
            this.formData.lastName = lastNameInput.value.trim();
            this.validateForm();
            this.clearFieldError('lastName');
        });

        emailInput.addEventListener('input', () => {
            this.formData.email = emailInput.value.trim();
            this.validateForm();
            this.clearFieldError('email');
        });

        passwordInput.addEventListener('input', () => {
            this.formData.password = passwordInput.value;
            this.validateForm();
            this.clearFieldError('password');
            this.validatePassword();
        });

        termsCheckbox.addEventListener('change', () => {
            this.validateForm();
            this.clearFieldError('terms');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        if (loginLink && this.options.onToggleLogin) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.options.onToggleLogin();
            });
        }

        [registrationKeyInput, firstNameInput, lastNameInput, emailInput, passwordInput].forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.01)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    validateRegistrationKey() {
        const key = this.formData.registrationKey;
        const keyPattern = /^(PROF|ELEVE)_\d{4}_[A-Z0-9]{6}$/;
        
        if (key && !keyPattern.test(key)) {
            this.showFieldError('registrationKey', 'Format de clé invalide (ex: PROF_2024_A1B2C3)');
            return false;
        }
        
        return true;
    }

    validatePassword() {
        const password = this.formData.password;
        // Sélectionner spécifiquement l'élément d'aide du mot de passe
        const requirements = this.container.querySelector('input.register-password + p.text-xs.mt-1');
        
        // Validation selon les règles backend : min 8 chars, 1 minuscule, 1 majuscule, 1 chiffre
        const hasMinLength = password.length >= 8;
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const isValid = hasMinLength && hasLowerCase && hasUpperCase && hasNumber;
        
        // Garder le texte simple comme dans la version test
        if (requirements) {
            if (password.length === 0 || isValid) {
                requirements.style.color = 'var(--color-gray-500)';
                requirements.textContent = 'Min 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre';
            }
        }
        
        return password.length === 0 ? false : isValid;
    }

    validateForm() {
        const termsCheckbox = this.container.querySelector('.terms-checkbox');
        const isValid = 
            this.formData.registrationKey &&
            this.formData.firstName &&
            this.formData.lastName &&
            this.formData.email &&
            this.validatePassword() &&
            termsCheckbox.checked &&
            this.validateRegistrationKey();

        // Ne pas désactiver le bouton pour correspondre à la version test
        // const submitButton = this.container.querySelector('.register-submit-btn');
        // submitButton.disabled = !isValid;
        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) return;

        this.setLoading(true);
        this.clearErrors();

        try {
            if (this.options.onSubmit) {
                await this.options.onSubmit(this.formData);
            }
        } catch (error) {
            this.showError(error.message || 'Erreur lors de l\'inscription');
            
            if (error.details && error.details.field) {
                this.showFieldError(error.details.field, error.message);
            }
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const submitButton = this.container.querySelector('.register-submit-btn');
        const submitText = submitButton.querySelector('.submit-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');
        
        submitButton.disabled = loading;
        submitText.style.display = loading ? 'none' : 'inline';
        loadingSpinner.style.display = loading ? 'inline' : 'none';
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
    }

    showFieldError(field, message) {
        const fieldMap = {
            registrationKey: 'registration-key-error',
            firstName: 'first-name-error',
            lastName: 'last-name-error',
            email: 'register-email-error',
            password: 'register-password-error'
        };
        
        const errorClass = fieldMap[field] || `${field}-error`;
        const errorElement = this.container.querySelector(`.${errorClass}`);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = '#dc2626';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
        }
    }

    clearFieldError(field) {
        const fieldMap = {
            registrationKey: 'registration-key-error',
            firstName: 'first-name-error',
            lastName: 'last-name-error',
            email: 'register-email-error',
            password: 'register-password-error'
        };
        
        const errorClass = fieldMap[field] || `${field}-error`;
        const errorElement = this.container.querySelector(`.${errorClass}`);
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    clearErrors() {
        const errorsContainer = this.container.querySelector('.form-errors');
        errorsContainer.style.display = 'none';
        
        Object.keys(this.formData).forEach(field => {
            this.clearFieldError(field);
        });
        this.clearFieldError('terms');
    }

    reset() {
        this.formData = {
            registrationKey: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        
        const requirements = this.container.querySelector('input.register-password + p.text-xs.mt-1');
        if (requirements) {
            requirements.style.color = 'var(--color-gray-500)';
            requirements.textContent = 'Min 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre';
        }
        
        this.clearErrors();
        this.validateForm();
    }

    getData() {
        return { ...this.formData };
    }

    setData(data) {
        Object.keys(this.formData).forEach(key => {
            if (data[key] !== undefined) {
                this.formData[key] = data[key];
                
                const input = this.container.querySelector(`.${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
                if (input) {
                    input.value = data[key];
                }
            }
        });
        
        this.validateForm();
    }
}