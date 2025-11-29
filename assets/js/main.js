/* assets/js/main.js — cleaned, repaired version
   Provides: viewport fix, mobile menu, smooth scroll, active link tracking,
   modal/auth chooser (open/close + focus-trap) and small responsive helpers.
*/

'use strict';

// Small DOM helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ----------------------------
   Viewport height helper (mobile browsers)
   ---------------------------- */
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
setViewportHeight();

/* ----------------------------
   Mobile menu toggle
   ---------------------------- */
const mobileMenuToggle = $('#mobile-menu-toggle');
const navbar = $('#navbar');
const navLinks = $('.nav-links');
let mobileMenuOpen = false;

function openMobileMenu() {
    if (!navLinks || !navbar || mobileMenuOpen) return;
    mobileMenuOpen = true;
    const clone = navLinks.cloneNode(true);
    clone.classList.add('mobile-menu');
    clone.setAttribute('aria-hidden', 'false');
    clone.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') closeMobileMenu();
    });
    navbar.appendChild(clone);
    document.body.style.overflow = 'hidden';
    mobileMenuToggle && mobileMenuToggle.classList.add('active');
}

function closeMobileMenu() {
    const mm = $('.mobile-menu');
    if (mm) mm.remove();
    mobileMenuOpen = false;
    document.body.style.overflow = '';
    mobileMenuToggle && mobileMenuToggle.classList.remove('active');
}

mobileMenuToggle && mobileMenuToggle.addEventListener('click', () => {
    mobileMenuOpen ? closeMobileMenu() : openMobileMenu();
});

/* ----------------------------
   Smooth scrolling for internal links
   ---------------------------- */
const navBarHeight = navbar ? navbar.offsetHeight : 64;
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') { e.preventDefault(); return; }
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        closeMobileMenu();
        const top = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navBarHeight);
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ----------------------------
   Active nav link tracking (IntersectionObserver)
   ---------------------------- */
const sectionObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.id;
        if (!id) return;
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) link.classList.toggle('active', entry.isIntersecting);
    });
}, { threshold: 0.55 }) : null;

document.querySelectorAll('section[id]').forEach(s => sectionObserver && sectionObserver.observe(s));

/* ----------------------------
   Modal / Auth chooser
   - expose: window.openLoginModal(), window.closeLoginModal(), window.setAuthModalMode(mode)
   Modes: 'choose' (chooser), 'signin', 'signup'
   ---------------------------- */
const modalId = 'login-modal';
const modal = document.getElementById(modalId);
let lastFocused = null;

function trapFocus(modalEl) {
    const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(modalEl.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    function keyHandler(e) {
        if (e.key === 'Tab') {
            if (nodes.length === 0) { e.preventDefault(); return; }
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        } else if (e.key === 'Escape') {
            closeLoginModal();
        }
    }

    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
}

let removeTrap = null;

function openLoginModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    setViewportHeight();
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // focus first focusable inside modal
    setTimeout(() => {
        const first = modal.querySelector('button, [href], input, select, textarea');
        first && first.focus();
    }, 50);
    removeTrap = trapFocus(modal);
}

function closeLoginModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (typeof removeTrap === 'function') removeTrap();
    lastFocused && lastFocused.focus && lastFocused.focus();
}

// Wire close buttons and backdrop
if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeLoginModal(); });
    const closeBtn = modal.querySelector('[data-modal-close]');
    closeBtn && closeBtn.addEventListener('click', closeLoginModal);
}

// Auth mode switching
function setAuthModalMode(mode) {
    if (!modal) return;
    const chooser = modal.querySelector('#auth-chooser');
    const viewSignin = modal.querySelector('.view-signin');
    const viewSignup = modal.querySelector('.view-signup');

    // default
    if (mode === 'choose') {
        chooser && chooser.classList.remove('hidden');
        viewSignin && viewSignin.classList.add('hidden');
        viewSignup && viewSignup.classList.add('hidden');
        return;
    }

    chooser && chooser.classList.add('hidden');
    if (mode === 'signin') {
        viewSignin && viewSignin.classList.remove('hidden');
        viewSignup && viewSignup.classList.add('hidden');
    } else if (mode === 'signup') {
        viewSignup && viewSignup.classList.remove('hidden');
        viewSignin && viewSignin.classList.add('hidden');
    }
}

// Activate a specific role tab programmatically: view = 'signin'|'signup', role = 'traveler'|'mechanic'
function activateAuthRole(view, role) {
    if (!modal) return;
    if (view === 'signin') {
        const tabTraveler = modal.querySelector('#tab-traveler');
        const tabMechanic = modal.querySelector('#tab-mechanic');
        const panelTraveler = modal.querySelector('#panel-traveler');
        const panelMechanic = modal.querySelector('#panel-mechanic');
        if (role === 'mechanic') {
            tabMechanic && tabMechanic.classList.add('active');
            tabMechanic && tabMechanic.setAttribute('aria-selected', 'true');
            tabTraveler && tabTraveler.classList.remove('active');
            tabTraveler && tabTraveler.setAttribute('aria-selected', 'false');
            panelMechanic && panelMechanic.classList.remove('hidden');
            panelTraveler && panelTraveler.classList.add('hidden');
        } else {
            tabTraveler && tabTraveler.classList.add('active');
            tabTraveler && tabTraveler.setAttribute('aria-selected', 'true');
            tabMechanic && tabMechanic.classList.remove('active');
            tabMechanic && tabMechanic.setAttribute('aria-selected', 'false');
            panelTraveler && panelTraveler.classList.remove('hidden');
            panelMechanic && panelMechanic.classList.add('hidden');
        }
    } else if (view === 'signup') {
        const tabTravelerSignup = modal.querySelector('#tab-traveler-signup');
        const tabMechanicSignup = modal.querySelector('#tab-mechanic-signup');
        const panelSignupTraveler = modal.querySelector('#panel-signup-traveler');
        const panelSignupMechanic = modal.querySelector('#panel-signup-mechanic');
        if (role === 'mechanic') {
            tabMechanicSignup && tabMechanicSignup.classList.add('active');
            tabMechanicSignup && tabMechanicSignup.setAttribute('aria-selected', 'true');
            tabTravelerSignup && tabTravelerSignup.classList.remove('active');
            tabTravelerSignup && tabTravelerSignup.setAttribute('aria-selected', 'false');
            panelSignupMechanic && panelSignupMechanic.classList.remove('hidden');
            panelSignupTraveler && panelSignupTraveler.classList.add('hidden');
        } else {
            tabTravelerSignup && tabTravelerSignup.classList.add('active');
            tabTravelerSignup && tabTravelerSignup.setAttribute('aria-selected', 'true');
            tabMechanicSignup && tabMechanicSignup.classList.remove('active');
            tabMechanicSignup && tabMechanicSignup.setAttribute('aria-selected', 'false');
            panelSignupTraveler && panelSignupTraveler.classList.remove('hidden');
            panelSignupMechanic && panelSignupMechanic.classList.add('hidden');
        }
    }
}

// Expose globals
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.setAuthModalMode = setAuthModalMode;

// Setup chooser buttons and tabs inside modal
function setupLoginModal() {
    if (!modal) return;
    const chooser = modal.querySelector('#auth-chooser');
    const chooserSigninBtn = modal.querySelector('#chooser-signin-btn');
    const chooserSignupBtn = modal.querySelector('#chooser-signup-btn');
    const inModalSignup = modal.querySelector('a[data-auth-signup]');

    chooserSigninBtn && chooserSigninBtn.addEventListener('click', () => setAuthModalMode('signin'));
    chooserSignupBtn && chooserSignupBtn.addEventListener('click', () => setAuthModalMode('signup'));
    inModalSignup && inModalSignup.addEventListener('click', (e) => {
        // navigate to standalone signup after closing modal
        e.preventDefault();
        closeLoginModal();
        const href = inModalSignup.getAttribute('href');
        if (href) window.location.href = href;
    });

    // Wire Sign In tabs (Traveler / Mechanic)
    const tabTraveler = modal.querySelector('#tab-traveler');
    const tabMechanic = modal.querySelector('#tab-mechanic');
    const panelTraveler = modal.querySelector('#panel-traveler');
    const panelMechanic = modal.querySelector('#panel-mechanic');

    if (tabTraveler) {
        tabTraveler.addEventListener('click', () => {
            tabTraveler.classList.add('active');
            tabTraveler.setAttribute('aria-selected', 'true');
            tabMechanic.classList.remove('active');
            tabMechanic.setAttribute('aria-selected', 'false');
            panelTraveler.classList.remove('hidden');
            panelMechanic.classList.add('hidden');
        });
    }

    if (tabMechanic) {
        tabMechanic.addEventListener('click', () => {
            tabMechanic.classList.add('active');
            tabMechanic.setAttribute('aria-selected', 'true');
            tabTraveler.classList.remove('active');
            tabTraveler.setAttribute('aria-selected', 'false');
            panelMechanic.classList.remove('hidden');
            panelTraveler.classList.add('hidden');
        });
    }

    // Wire Sign Up tabs (Traveler / Mechanic)
    const tabTravelerSignup = modal.querySelector('#tab-traveler-signup');
    const tabMechanicSignup = modal.querySelector('#tab-mechanic-signup');
    const panelSignupTraveler = modal.querySelector('#panel-signup-traveler');
    const panelSignupMechanic = modal.querySelector('#panel-signup-mechanic');

    if (tabTravelerSignup) {
        tabTravelerSignup.addEventListener('click', () => {
            tabTravelerSignup.classList.add('active');
            tabTravelerSignup.setAttribute('aria-selected', 'true');
            tabMechanicSignup.classList.remove('active');
            tabMechanicSignup.setAttribute('aria-selected', 'false');
            panelSignupTraveler.classList.remove('hidden');
            panelSignupMechanic.classList.add('hidden');
        });
    }

    if (tabMechanicSignup) {
        tabMechanicSignup.addEventListener('click', () => {
            tabMechanicSignup.classList.add('active');
            tabMechanicSignup.setAttribute('aria-selected', 'true');
            tabTravelerSignup.classList.remove('active');
            tabTravelerSignup.setAttribute('aria-selected', 'false');
            panelSignupMechanic.classList.remove('hidden');
            panelSignupTraveler.classList.add('hidden');
        });
    }
}

/* ----------------------------
   Small UX helpers
   ---------------------------- */
function debounce(fn, wait = 120) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function detectDeviceCapabilities() {
    try {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn && conn.effectiveType) {
            if (conn.effectiveType.includes('2g') || conn.effectiveType.includes('slow-2g')) {
                document.documentElement.classList.add('reduced-bandwidth');
            }
        }
    } catch (e) { /* ignore */ }
}

/* ----------------------------
   Init
   ---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    detectDeviceCapabilities();
    setupLoginModal();
    
    // Wire "Get Started" button (navbar and hero)
    const signupBtn = document.getElementById('signup-btn');
    const heroCTA = document.getElementById('hero-cta');
    
    const handleGetStarted = (e) => {
        // If this was an anchor click, prevent navigation and open modal instead
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        openLoginModal();
        setAuthModalMode('choose');
    };

    signupBtn && signupBtn.addEventListener('click', handleGetStarted);
    heroCTA && heroCTA.addEventListener('click', handleGetStarted);
    
    // Ensure home icon works (click listener for smooth scroll to #hero)
    const homeIcon = document.querySelector('.nav-home');
    if (homeIcon) {
        homeIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const top = Math.max(0, heroSection.getBoundingClientRect().top + window.pageYOffset - navBarHeight);
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    }
    
    // If page opened with query ?auth=signup or ?auth=signin, auto-open modal
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');
    const role = params.get('role');
    if (auth === 'signin' || auth === 'signup' || auth === 'choose') {
        openLoginModal();
        const mode = auth === 'choose' ? 'choose' : auth;
        setAuthModalMode(mode);
        // If a role is provided, activate the corresponding tab
        if (role && (mode === 'signin' || mode === 'signup')) {
            activateAuthRole(mode, role);
        }
    }
});

/* ----------------------------
   Exports for debugging/global use
   ---------------------------- */
window.AppHelpers = {
    openLoginModal,
    closeLoginModal,
    setAuthModalMode,
    activateAuthRole,
    setViewportHeight,
    debounce
};

/* End of cleaned main.js */