/**
 * 🎯 Contrôleur Authentification - Diagana School
 * Orchestration entre API, composants et gestion d'état
 */

import { authApi } from '/static/api/auth.js';
import { LoginForm, RegisterForm } from '/static/components/auth/index.js';

class AuthController {
    constructor() {
        this.currentUser = null;
        this.loginForm = null;
        this.registerForm = null;
        this.currentView = 'login';
        
        this.init();
    }

    init() {
        // Vérifier l'authentification au démarrage
        this.checkAuthentication();
        this.bindGlobalEvents();
    }

    checkAuthentication() {
        const token = authApi.getToken();
        if (token && this.isOnAuthPage()) {
            this.redirectToDashboard();
        } else if (!token && this.requiresAuth()) {
            this.redirectToAuth();
        }
    }

    isOnAuthPage() {
        return window.location.pathname === '/auth';
    }

    requiresAuth() {
        const publicPages = ['/auth', '/', '/index.html'];
        const protectedPages = ['/home', '/dashboard'];
        const currentPath = window.location.pathname;
        return protectedPages.includes(currentPath);
    }

    redirectToAuth() {
        window.location.href = '/auth';
    }

    redirectToDashboard() {
        window.location.href = '/home';
    }

    bindGlobalEvents() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'authToken') {
                if (!e.newValue && this.requiresAuth()) {
                    this.redirectToAuth();
                } else if (e.newValue && this.isOnAuthPage()) {
                    this.redirectToDashboard();
                }
            }
        });
    }

    initAuthPage() {
        if (!this.isOnAuthPage()) return;

        this.setupAuthForms();
        this.showLogin();
    }

    setupAuthForms() {
        const loginContainer = document.getElementById('login-form-container');
        const registerContainer = document.getElementById('register-form-container');

        if (!loginContainer || !registerContainer) {
            console.error('Conteneurs des formulaires non trouvés');
            return;
        }

        this.loginForm = new LoginForm(loginContainer, {
            onSubmit: this.handleLogin.bind(this),
            onToggleRegister: this.showRegister.bind(this),
            showRememberMe: true,
            showForgotPassword: true
        });

        this.registerForm = new RegisterForm(registerContainer, {
            onSubmit: this.handleRegister.bind(this),
            onToggleLogin: this.showLogin.bind(this)
        });
    }

    async handleLogin(credentials) {
        try {
            const response = await authApi.login({
                email: credentials.email,
                password: credentials.password
            });

            if (response.user) {
                this.currentUser = response.user;
                
                if (credentials.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                this.showSuccessMessage(`Bienvenue ${response.user.prenom} !`);
                
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1500);
            }
        } catch (error) {
            throw error;
        }
    }

    async handleRegister(userData) {
        try {
            const response = await authApi.register({
                keyValue: userData.registrationKey || userData.keyValue,
                nom: userData.lastName || userData.nom,
                prenom: userData.firstName || userData.prenom,
                email: userData.email,
                password: userData.password,
                classe: userData.classe,
                matiere: userData.matiere,
                date_naissance: userData.date_naissance
            });

            if (response.user) {
                this.currentUser = response.user;
                
                this.showSuccessMessage(`Compte créé avec succès ! Bienvenue ${response.user.prenom} !`);
                
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1500);
            }
        } catch (error) {
            throw error;
        }
    }

    showLogin() {
        this.currentView = 'login';
        this.toggleForms();
    }

    showRegister() {
        this.currentView = 'register';
        this.toggleForms();
    }

    toggleForms() {
        const loginContainer = document.getElementById('login-form-container');
        const registerContainer = document.getElementById('register-form-container');

        if (!loginContainer || !registerContainer) return;

        if (this.currentView === 'login') {
            loginContainer.style.display = 'block';
            registerContainer.style.display = 'none';
            
            if (this.loginForm) {
                this.loginForm.reset();
            }
        } else {
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
            
            if (this.registerForm) {
                this.registerForm.reset();
            }
        }
    }

    async logout() {
        try {
            await authApi.logout();
            this.currentUser = null;
            localStorage.removeItem('rememberMe');
            this.redirectToAuth();
        } catch (error) {
            console.warn('Erreur lors de la déconnexion:', error);
            authApi.setToken(null);
            this.redirectToAuth();
        }
    }

    async getCurrentUser() {
        if (!authApi.isAuthenticated()) {
            return null;
        }

        if (this.currentUser) {
            return this.currentUser;
        }

        try {
            const response = await authApi.getProfile();
            this.currentUser = response.user;
            return this.currentUser;
        } catch (error) {
            console.warn('Erreur lors de la récupération du profil:', error);
            this.redirectToAuth();
            return null;
        }
    }

    async updateProfile(profileData) {
        try {
            const response = await authApi.updateProfile(profileData);
            if (response.user) {
                this.currentUser = { ...this.currentUser, ...response.user };
            }
            return response.user;
        } catch (error) {
            throw error;
        }
    }

    async changePassword(passwordData) {
        try {
            await authApi.changePassword(passwordData);
        } catch (error) {
            throw error;
        }
    }

    isAuthenticated() {
        return authApi.isAuthenticated();
    }

    getToken() {
        return authApi.getToken();
    }

    showSuccessMessage(message) {
        const existingMessage = document.querySelector('.auth-success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success-message';
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

    handleForgotPassword(email) {
        console.log('Demande de réinitialisation de mot de passe pour:', email);
    }

    validateRegistrationKey(key) {
        const keyPattern = /^(PROF|ELEVE)_\d{4}_[A-Z0-9]{6}$/;
        return keyPattern.test(key);
    }
}

const authController = new AuthController();

window.authController = authController;

document.addEventListener('DOMContentLoaded', () => {
    if (authController.isOnAuthPage()) {
        authController.initAuthPage();
    }
});

export { authController, AuthController };