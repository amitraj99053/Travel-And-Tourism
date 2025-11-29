
/* Corrupted backup of assets/js/main.js captured 2025-11-30 */

/* NOTE: this file is a raw backup of the corrupted `assets/js/main.js`.
   Keep it for troubleshooting/rollback. */

/* ===================================
   Mobile Menu Functionality
   =================================== */

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelector('.nav-links');

let mobileMenuOpen = false;

// Create mobile menu
function createMobileMenu() {
	if (window.innerWidth <= 1024 && !document.querySelector('.mobile-menu')) {
		const mobileMenu = document.createElement('div');
		mobileMenu.className = 'mobile-menu';
		mobileMenu.innerHTML = navLinks.innerHTML;
		navbar.appendChild(mobileMenu);
        
		// Close menu on link click
		mobileMenu.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', closeMobileMenu);
		});
	}
}

// Remove mobile menu
function removeMobileMenu() {
	const mobileMenu = document.querySelector('.mobile-menu');
	if (mobileMenu) {
		mobileMenu.remove();
	}
}

// Toggle mobile menu
function toggleMobileMenu() {
	mobileMenuOpen = !mobileMenuOpen;
    
	if (mobileMenuOpen) {
		createMobileMenu();
		mobileMenuToggle.classList.add('active');
		document.body.style.overflow = 'hidden';
	} else {
		closeMobileMenu();
	}
}

// Close mobile menu
function closeMobileMenu() {
	mobileMenuOpen = false;
	removeMobileMenu();
	mobileMenuToggle.classList.remove('active');
	document.body.style.overflow = '';
}

// Event listeners for mobile menu
if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleMobileMenu);

/* ===================================
   Navbar Scroll Behavior
   =================================== */

let lastScrollTop = 0;
const navbarHeight = navbar ? navbar.offsetHeight : 60;

window.addEventListener('scroll', () => {
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
	// Change navbar style on scroll
	if (scrollTop > 50) {
		if (navbar) {
			navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
			navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
		}
	} else {
		if (navbar) {
			navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
			navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
		}
	}
    
	// Hide navbar on scroll down, show on scroll up
	if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
		if (navbar) navbar.style.transform = 'translateY(-100%)';
	} else {
		if (navbar) navbar.style.transform = 'translateY(0)';
	}
    
	lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

/* ===================================
   Smooth Scroll for Navigation Links
   =================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		const href = this.getAttribute('href');
        
		// Skip if it's just '#'
		if (href === '#') {
			e.preventDefault();
			return;
		}
        
		const target = document.querySelector(href);
        
		if (target) {
			e.preventDefault();
            
			// Close mobile menu if open
			if (mobileMenuOpen) {
				closeMobileMenu();
			}
            
			// Smooth scroll with offset for navbar
			const offsetTop = target.offsetTop - navbarHeight;
			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth'
			});
		}
	});
});

/* ===================================
   Other utilities / placeholders
   =================================== */

// (Full original file is corrupted below; this backup contains the pre-repair snapshot.)
