// Simple Initial Load Transition for Globify
class PageTransition {
    constructor() {
        this.init();
    }

    init() {
        // Only show transition on initial website opening
        this.showInitialLoadTransition();
    }

    showInitialLoadTransition() {
        // Only show on fresh page load, not on navigation or reload
        if (performance.navigation && performance.navigation.type === 1) return; // Skip on reload
        if (document.referrer && document.referrer.includes(window.location.host)) return; // Skip if coming from same site
        
        // Create overlay for initial load
        const overlay = document.createElement('div');
        overlay.id = 'initial-load-overlay';
        overlay.innerHTML = `
            <div class="initial-transition-content">
                <div class="logo-container">
                    <img src="assets/logo.gif" alt="Globify" class="initial-logo">
                    <div class="logo-text">Globify</div>
                </div>
                <div class="welcome-text">Welcome to Globify...</div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #initial-load-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #0D0D0D 0%, #1a1a1a 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1;
                visibility: visible;
            }

            .initial-transition-content {
                text-align: center;
                color: #FFFFFF;
            }

            .logo-container {
                margin-bottom: 2rem;
                position: relative;
            }

            .initial-logo {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.8));
                animation: logoGrowWelcome 2s ease-out forwards;
            }

            .logo-text {
                font-family: 'Montserrat', sans-serif;
                font-weight: 800;
                font-size: 2rem;
                color: #D4AF37;
                margin-top: 1rem;
                opacity: 0;
                animation: fadeInUp 0.8s ease-out 1s forwards;
            }

            .welcome-text {
                color: #E0E0E0;
                font-family: 'Open Sans', sans-serif;
                font-size: 1.1rem;
                margin: 0;
                opacity: 0;
                animation: fadeIn 0.6s ease-out 1.5s forwards;
            }

            @keyframes logoGrowWelcome {
                0% { 
                    transform: scale(0.3);
                    filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.5));
                    opacity: 0.7;
                }
                60% { 
                    transform: scale(1.3);
                    filter: drop-shadow(0 0 50px rgba(212, 175, 55, 1));
                    opacity: 1;
                }
                100% { 
                    transform: scale(1);
                    filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.8));
                    opacity: 1;
                }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        if (!document.querySelector('#initial-load-styles')) {
            style.id = 'initial-load-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        // Hide overlay after animation
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
                if (style.parentNode) {
                    style.remove();
                }
            }, 500);
        }, 2800);
    }
}

// Initialize only on fresh website opening
if (!window.initialTransitionShown) {
    window.initialTransitionShown = true;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PageTransition();
        });
    } else {
        new PageTransition();
    }
}

// Export for global use
window.PageTransition = PageTransition;