// JavaScript global pour la navbar mobile - Diagana School

// Fonctions du menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    // Toggle les classes active
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Empêche le scroll du body quand le menu est ouvert
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu(event) {
    // Ferme le menu si on clique sur l'overlay ou sur un lien de navigation
    if (event.target === event.currentTarget || event.target.classList.contains('mobile-nav-link')) {
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.querySelector('.hamburger');
        
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Fermer le menu mobile avec la touche Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Fermer le menu mobile lors du redimensionnement de l'écran
window.addEventListener('resize', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Animation au scroll pour les éléments fade-in
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe animate-fade-in ou animate-slide-up
    document.querySelectorAll('.animate-fade-in, .animate-slide-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
});

// Smooth scroll pour les liens d'ancrage
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Ferme le menu mobile si ouvert
                closeMobileMenu({ target: document.querySelector('.mobile-nav-link') });
            }
        });
    });
});

// Fonction pour activer le bon élément de navigation selon la page actuelle
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Map des pages vers les éléments de navigation
    const pageMap = {
        'index.html': ['#features', '#about', '#stats'],
        'dashboard.html': 'dashboard',
        'resources.html': 'resources', 
        'collections.html': 'collections',
        'profiles.html': 'profiles',
        'auth.html': 'auth'
    };
    
    // Active le bon élément dans la navigation desktop
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Active le bon élément dans la navigation mobile
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Active le bon élément dans la bottom navigation
    document.querySelectorAll('.bottom-nav-item').forEach(link => {
        link.classList.remove('active');
    });
    
    // Logique d'activation basée sur la page actuelle
    if (currentPage === 'dashboard.html' || currentPage === '') {
        document.querySelector('a[href="#"]')?.classList.add('active');
        document.querySelector('.mobile-nav-link[href="#"]')?.classList.add('active');
        document.querySelector('.bottom-nav-item[href="#"]')?.classList.add('active');
    } else if (currentPage === 'resources.html') {
        document.querySelector('a[href="resources.html"]')?.classList.add('active');
        document.querySelector('.mobile-nav-link[href="resources.html"]')?.classList.add('active');
        document.querySelector('.bottom-nav-item[href="resources.html"]')?.classList.add('active');
    } else if (currentPage === 'collections.html') {
        document.querySelector('a[href="collections.html"]')?.classList.add('active');
        document.querySelector('.mobile-nav-link[href="collections.html"]')?.classList.add('active');
        document.querySelector('.bottom-nav-item[href="collections.html"]')?.classList.add('active');
    } else if (currentPage === 'profiles.html') {
        document.querySelector('a[href="profiles.html"]')?.classList.add('active');
        document.querySelector('.mobile-nav-link[href="profiles.html"]')?.classList.add('active');
        document.querySelector('.bottom-nav-item[href="profiles.html"]')?.classList.add('active');
    }
}

// Initialise la navigation active au chargement
document.addEventListener('DOMContentLoaded', setActiveNavigation);
