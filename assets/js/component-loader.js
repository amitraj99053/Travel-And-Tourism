/**
 * Component Loader
 * Dynamically loads HTML components into the page
 */

(function () {
    'use strict';

    /**
     * Load a component from the components directory
     * @param {string} componentName - Name of the component file (without .html extension)
     * @param {string} targetId - ID of the element where the component should be inserted
     */
    async function loadComponent(componentName, targetId) {
        try {
            const response = await fetch(`components/${componentName}.html`);

            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName} (${response.status})`);
            }

            const html = await response.text();
            const targetElement = document.getElementById(targetId);

            if (!targetElement) {
                console.error(`Target element not found: ${targetId}`);
                return;
            }

            targetElement.innerHTML = html;

        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }

    /**
     * Load all components when DOM is ready
     */
    function loadAllComponents() {
        const components = [
            { name: 'navbar', target: 'navbar-placeholder' },
            { name: 'hero', target: 'hero-placeholder' },
            { name: 'features', target: 'features-placeholder' },
            { name: 'how-it-works', target: 'how-it-works-placeholder' },
            { name: 'about', target: 'about-placeholder' },
            { name: 'contact', target: 'contact-placeholder' },
            { name: 'footer', target: 'footer-placeholder' },
            { name: 'login-modal', target: 'login-modal-placeholder' }
        ];

        // Load all components
        Promise.all(
            components.map(comp => loadComponent(comp.name, comp.target))
        ).then(() => {
            // Development-only log: enable by setting `window.__DEV__ = true` in the console
            if (window && window.__DEV__) {
                console.log('All components loaded successfully');
            }

            // Dispatch a custom event to signal that components are loaded
            // This allows main.js to initialize after components are ready
            document.dispatchEvent(new CustomEvent('componentsLoaded'));

            // Also manually trigger a DOMContentLoaded-like event for compatibility
            // This ensures that any code listening for DOMContentLoaded will run
            setTimeout(() => {
                const event = new Event('DOMContentLoaded', {
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(event);
            }, 100);
        }).catch(error => {
            console.error('Error loading components:', error);
        });
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }
})();
