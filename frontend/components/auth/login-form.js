/**
 * 📝 Composant Formulaire de Connexion - Diagana School
 * Composant réutilisable pour l'authentification
 */

export class LoginForm {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            onSubmit: options.onSubmit || null,
            onToggleRegister: options.onToggleRegister || null,
            showRememberMe: options.showRememberMe !== false,
            showForgotPassword: options.showForgotPassword !== false,
            className: options.className || 'card p-8 animate-slide-in'
        };
        
        this.formData = {
            email: '',
            password: '',
            rememberMe: false
        };
        
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="${this.options.className}">
                <h1 class="text-2xl font-semibold mb-6 text-center" style="color: var(--color-gray-900);">
                    Connexion
                </h1>
                
                <form class="space-y-5 login-form-element">
                    <div>
                        <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                            Adresse email
                        </label>
                        <input 
                            type="email" 
                            class="form-input login-email" 
                            placeholder="votre.email@diagana.com"
                            required
                        >
                        <div class="error-message email-error" style="display: none;"></div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2" style="color: var(--color-gray-700);">
                            Mot de passe
                        </label>
                        <input 
                            type="password" 
                            class="form-input login-password" 
                            placeholder="••••••••"
                            required
                        >
                        <div class="error-message password-error" style="display: none;"></div>
                    </div>
                    
                    ${this.options.showRememberMe || this.options.showForgotPassword ? `
                    <div class="flex items-center justify-between text-sm">
                        ${this.options.showRememberMe ? `
                        <label class="flex items-center remember-me-container">
                            <input type="checkbox" class="mr-2 rounded remember-me-checkbox" style="accent-color: var(--color-accent-primary);">
                            <span style="color: var(--color-gray-500);">Se souvenir de moi</span>
                        </label>
                        ` : '<div></div>'}
                        
                        ${this.options.showForgotPassword ? `
                        <a href="#" class="toggle-form forgot-password-link" style="color: var(--color-accent-primary);">Mot de passe oublié ?</a>
                        ` : ''}
                    </div>
                    ` : ''}
                    
                    <button type="submit" class="btn btn-primary login-submit-btn" style="width: 100%; padding: 0.875rem 1.5rem; border-radius: 8px; font-size: 1rem;">
                        <span class="submit-text">Se connecter</span>
                        <span class="loading-spinner" style="display: none;">
                            🔄 Connexion...
                        </span>
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <span style="color: var(--color-gray-500);">Pas encore de compte ?</span>
                    <a href="#" class="toggle-form ml-1 show-register-link" style="color: var(--color-accent-primary);">S'inscrire</a>
                </div>
                
                <div class="form-errors" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = this.container.querySelector('.login-form-element');
        const emailInput = this.container.querySelector('.login-email');
        const passwordInput = this.container.querySelector('.login-password');
        const rememberMeCheckbox = this.container.querySelector('.remember-me-checkbox');
        const submitButton = this.container.querySelector('.login-submit-btn');
        const registerLink = this.container.querySelector('.show-register-link');
        const forgotPasswordLink = this.container.querySelector('.forgot-password-link');

        emailInput.addEventListener('input', () => {
            this.formData.email = emailInput.value;
            this.validateForm();
            this.clearFieldError('email');
        });

        passwordInput.addEventListener('input', () => {
            this.formData.password = passwordInput.value;
            this.validateForm();
            this.clearFieldError('password');
        });

        if (rememberMeCheckbox) {
            rememberMeCheckbox.addEventListener('change', () => {
                this.formData.rememberMe = rememberMeCheckbox.checked;
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        if (registerLink && this.options.onToggleRegister) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.options.onToggleRegister();
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        [emailInput, passwordInput].forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.01)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    validateForm() {
        const isValid = this.formData.email && this.formData.password;
        // Ne pas désactiver le bouton pour correspondre à la version test
        // const submitButton = this.container.querySelector('.login-submit-btn');
        // submitButton.disabled = !isValid;
        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) return;

        const submitButton = this.container.querySelector('.login-submit-btn');
        const submitText = submitButton.querySelector('.submit-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');

        this.setLoading(true);
        this.clearErrors();

        try {
            if (this.options.onSubmit) {
                await this.options.onSubmit(this.formData);
            }
        } catch (error) {
            this.showError(error.message || 'Erreur lors de la connexion');
            
            if (error.details && error.details.field) {
                this.showFieldError(error.details.field, error.message);
            }
        } finally {
            this.setLoading(false);
        }
    }

    handleForgotPassword() {
        const email = this.formData.email;
        if (email) {
            console.log('Demande de réinitialisation pour:', email);
        } else {
            this.showFieldError('email', 'Veuillez saisir votre email');
        }
    }

    setLoading(loading) {
        const submitButton = this.container.querySelector('.login-submit-btn');
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
        const errorElement = this.container.querySelector(`.${field}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = '#dc2626';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
        }
    }

    clearFieldError(field) {
        const errorElement = this.container.querySelector(`.${field}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    clearErrors() {
        const errorsContainer = this.container.querySelector('.form-errors');
        errorsContainer.style.display = 'none';
        
        this.clearFieldError('email');
        this.clearFieldError('password');
    }

    reset() {
        this.formData = {
            email: '',
            password: '',
            rememberMe: false
        };
        
        const emailInput = this.container.querySelector('.login-email');
        const passwordInput = this.container.querySelector('.login-password');
        const rememberMeCheckbox = this.container.querySelector('.remember-me-checkbox');
        
        emailInput.value = '';
        passwordInput.value = '';
        if (rememberMeCheckbox) rememberMeCheckbox.checked = false;
        
        this.clearErrors();
        this.validateForm();
    }

    getData() {
        return { ...this.formData };
    }

    setData(data) {
        if (data.email !== undefined) {
            this.formData.email = data.email;
            this.container.querySelector('.login-email').value = data.email;
        }
        
        if (data.password !== undefined) {
            this.formData.password = data.password;
            this.container.querySelector('.login-password').value = data.password;
        }
        
        if (data.rememberMe !== undefined) {
            this.formData.rememberMe = data.rememberMe;
            const checkbox = this.container.querySelector('.remember-me-checkbox');
            if (checkbox) checkbox.checked = data.rememberMe;
        }
        
        this.validateForm();
    }
}