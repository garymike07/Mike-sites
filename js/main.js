// Mike Sites - Main JavaScript Functionality

document.addEventListener('DOMContentLoaded', () => {
    const app = new MikeSites();
    app.init();
});

class MikeSites {
    constructor() {
        this.currentSection = 'home';
        this.projectManager = null;
    }

    init() {
        this.setupEventListeners();
        this.initializeClock();
        this.initializeDailyTip();
        this.showSection('home');
        this.hideLoadingOverlay();
        
        // Initialize project manager after DOM is ready
        setTimeout(() => {
            this.projectManager = new ProjectManager();
        }, 100);
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }

    initializeClock() {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            const updateClock = () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString();
                clockElement.textContent = timeString;
            };
            updateClock();
            setInterval(updateClock, 1000);
        }
    }

    initializeDailyTip() {
        const tips = [
            "Use semantic HTML elements to improve accessibility and SEO.",
            "Always validate user input on both client and server side.",
            "Use CSS Grid and Flexbox for modern, responsive layouts.",
            "Optimize images and use lazy loading for better performance.",
            "Write clean, readable code with meaningful variable names.",
            "Test your website on multiple devices and browsers.",
            "Use version control (Git) for all your projects.",
            "Keep your dependencies up to date for security.",
            "Use HTTPS for all production websites.",
            "Implement proper error handling in your applications."
        ];
        
        const tipElement = document.getElementById('daily-tip');
        if (tipElement) {
            const today = new Date().getDate();
            const tipIndex = today % tips.length;
            tipElement.textContent = tips[tipIndex];
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sectionId = e.target.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });

        // Theme switching
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-theme');
                this.setTheme(theme);
            });
        });

        // Project filtering and search
        const projectFilter = document.getElementById('project-filter');
        if (projectFilter) {
            projectFilter.addEventListener('change', () => {
                if (this.projectManager) {
                    this.projectManager.renderAllProjects();
                }
            });
        }

        const projectSearch = document.getElementById('project-search');
        if (projectSearch) {
            projectSearch.addEventListener('input', () => {
                if (this.projectManager) {
                    this.projectManager.renderAllProjects();
                }
            });
        }

        // Modal close button
        const closeButton = document.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }
        
        // Close modal on overlay click
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e);
            });
        }

        // Back to home button
        const backButton = document.getElementById('back-to-home');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.showSection('home');
            });
        }
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('mikeSites_theme', theme);
        
        // Update theme button states
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            }
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
            this.currentSection = sectionId;
        }

        // Update navigation button states
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });

        // Show/hide back button
        const backButton = document.getElementById('back-to-home');
        if (backButton) {
            if (sectionId === 'home') {
                backButton.style.display = 'none';
            } else {
                backButton.style.display = 'inline-block';
            }
        }

        // Load projects if navigating to projects section
        if (sectionId === 'projects' && this.projectManager) {
            this.projectManager.renderAllProjects();
        }
    }

    openModal(content) {
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalBody = document.getElementById('modal-body');
        if (modalOverlay && modalBody) {
            if (typeof content === 'string') {
                modalBody.innerHTML = content;
            }
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    handleContactForm(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                e.target.reset();
            }, 2000);
        }, 1000);
        
        console.log('Contact form submitted:', data);
    }
}

// Make MikeSites available globally
window.MikeSites = MikeSites;

