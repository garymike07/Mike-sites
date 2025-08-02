// Mike Sites - Main JavaScript Functionality

document.addEventListener('DOMContentLoaded', () => {
    const app = new MikeSites();
    app.init();
});

class MikeSites {
    constructor() {
        this.currentSection = 'home';
        this.projectManager = null;
        this.hour12 = localStorage.getItem('clockFormat') === '12h';
    }

    init() {
        this.setupEventListeners();
        this.initializeClock();
        this.initializeDailyTip();
        this.hideLoadingOverlay();
        
        // Initialize project manager after DOM is ready
        setTimeout(() => {
            this.projectManager = new ProjectManager();
        }, 100);

        // Make this instance globally available
        window.mikeSites = this;
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
        const toggleButton = document.getElementById('clock-format-toggle');

        if (clockElement && toggleButton) {
            const updateClock = () => {
                const now = new Date();
                const options = {
                    timeZone: 'Africa/Nairobi',
                    hour12: this.hour12,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };
                clockElement.textContent = now.toLocaleTimeString('en-GB', options);
            };

            updateClock();
            setInterval(updateClock, 1000);

            toggleButton.textContent = this.hour12 ? '12h' : '24h';
            toggleButton.addEventListener('click', () => {
                this.hour12 = !this.hour12;
                localStorage.setItem('clockFormat', this.hour12 ? '12h' : '24h');
                toggleButton.textContent = this.hour12 ? '12h' : '24h';
                updateClock(); // Update immediately on toggle
            });
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
        // Smooth scroll navigation
        document.querySelectorAll('.nav-btn, .btn-cta[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.currentTarget.getAttribute('data-section');
                if (window.animationController) {
                    window.animationController.smoothScrollTo(`#${sectionId}`);
                } else {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                }
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
            projectFilter.addEventListener('change', () => this.projectManager?.renderAllProjects());
        }
        const projectSearch = document.getElementById('project-search');
        if (projectSearch) {
            projectSearch.addEventListener('input', () => this.projectManager?.renderAllProjects());
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
        const backToHomeBtn = document.getElementById('back-to-home');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', () => {
                 if (window.animationController) {
                    window.animationController.smoothScrollTo('#home');
                } else {
                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Modal functionality
        this.setupModalListeners();
        this.setupSectionObserver(); // For active nav highlighting
        this.setupHamburgerMenu();
    }

    setupHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const siteHeader = document.querySelector('.site-header');
        const mainNav = document.querySelector('.main-nav');

        if (hamburger && siteHeader && mainNav) {
            hamburger.addEventListener('click', () => {
                siteHeader.classList.toggle('nav-open');
            });

            mainNav.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (siteHeader.classList.contains('nav-open')) {
                        siteHeader.classList.remove('nav-open');
                    }
                });
            });
        }
    }

    setupSectionObserver() {
        const sections = document.querySelectorAll('.section');
        const navButtons = document.querySelectorAll('.nav-btn, .btn-cta[data-section]');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5, // Section is active when 50% is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.currentSection = sectionId;

                    // Update nav buttons state
                    navButtons.forEach(btn => {
                        btn.classList.toggle('active', btn.getAttribute('data-section') === sectionId);
                    });

                    // Also handle header nav buttons if they exist separately
                     document.querySelectorAll('.main-nav .nav-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.getAttribute('data-section') === sectionId);
                    });

                    // Show/hide back button
                    const backButton = document.getElementById('back-to-home');
                    if (backButton) {
                        backButton.style.display = (sectionId === 'home') ? 'none' : 'inline-block';
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    setupModalListeners() {
        const modalOverlay = document.getElementById('project-modal');
        const closeModalBtn = document.getElementById('close-modal');

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(content) {
        const modalOverlay = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (modalOverlay && modalBody) {
            modalBody.innerHTML = content;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modalOverlay = document.getElementById('project-modal');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
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



// Enhanced Contact Form Handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('form-success');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(this);
    const features = [];
    formData.getAll('features').forEach(feature => features.push(feature));
    
    const projectData = {
        name: formData.get('name'),
        email: formData.get('email'),
        projectType: formData.get('project-type'),
        budget: formData.get('budget'),
        timeline: formData.get('timeline'),
        features: features,
        description: formData.get('message'),
        inspiration: formData.get('inspiration'),
        timestamp: new Date().toISOString()
    };
    
    // Simulate form submission (in real implementation, this would send to a server)
    setTimeout(() => {
        // Reset loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        successMessage.style.display = 'block';
        
        // Reset form
        this.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        // Log project request (for demo purposes)
        console.log('Project Request Submitted:', projectData);
        
        // In a real implementation, you would send this data to your email service
        // Example: EmailJS, Netlify Forms, or a custom backend
        
    }, 2000);
});

// Source Code Viewer Functionality
class SourceCodeViewer {
    constructor() {
        this.viewer = document.getElementById('source-code-viewer');
        this.title = document.getElementById('source-code-title');
        this.codeContent = document.getElementById('code-content');
        this.tabs = document.querySelectorAll('.source-tab');
        this.copyBtn = document.getElementById('copy-code-btn');
        this.closeBtn = document.getElementById('close-source-btn');
        this.currentProject = null;
        this.currentTab = 'html';
        
        this.init();
    }
    
    init() {
        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
        
        // Copy code functionality
        this.copyBtn.addEventListener('click', () => {
            this.copyCode();
        });
        
        // Close viewer
        this.closeBtn.addEventListener('click', () => {
            this.close();
        });
        
        // Close on overlay click
        this.viewer.addEventListener('click', (e) => {
            if (e.target === this.viewer) {
                this.close();
            }
        });
    }
    
    show(project) {
        this.currentProject = project;
        this.title.textContent = `${project.title} - Source Code`;
        this.switchTab('html');
        this.viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.viewer.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update active tab
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Generate and display code
        const code = this.generateCode(tabName);
        this.codeContent.innerHTML = this.highlightSyntax(code, tabName);
    }
    
    generateCode(type) {
        if (!this.currentProject) return '';
        
        const project = this.currentProject;
        
        switch (type) {
            case 'html':
                return this.generateHTML(project);
            case 'css':
                return this.generateCSS(project);
            case 'js':
                return this.generateJS(project);
            default:
                return '';
        }
    }
    
    generateHTML(project) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${project.title}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <section id="home" class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">${project.title}</h1>
                <p class="hero-description">${project.description}</p>
                <div class="hero-actions">
                    <button class="btn btn-primary">Get Started</button>
                    <button class="btn btn-secondary">Learn More</button>
                </div>
            </div>
        </section>

        <section id="features" class="features-section">
            <div class="container">
                <h2>Key Features</h2>
                <div class="features-grid">
                    ${project.features.map(feature => `
                    <div class="feature-card">
                        <div class="feature-icon">✨</div>
                        <h3>${feature}</h3>
                        <p>Advanced ${feature.toLowerCase()} functionality</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 ${project.title}. Built with ${project.tags.join(', ')}.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
    }
    
    generateCSS(project) {
        return `/* ${project.title} - Styles */
:root {
    --primary-color: #3b82f6;
    --secondary-color: #1e293b;
    --accent-color: #60a5fa;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --background: #ffffff;
    --surface: #f8fafc;
    --border: #e5e7eb;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--background);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Header Styles */
.header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.nav-brand h1 {
    color: var(--primary-color);
    font-size: 1.5rem;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: var(--primary-color);
}

/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    padding: 6rem 2rem;
    text-align: center;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-description {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Button Styles */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: white;
    color: var(--primary-color);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: var(--primary-color);
}

/* Features Section */
.features-section {
    padding: 6rem 2rem;
    background: var(--surface);
}

.features-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.feature-card p {
    color: var(--text-secondary);
}

/* Footer */
.footer {
    background: var(--secondary-color);
    color: white;
    text-align: center;
    padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-menu {
        flex-direction: column;
        gap: 1rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
}`;
    }
    
    generateJS(project) {
        return `// ${project.title} - JavaScript Functionality

class ${project.title.replace(/\s+/g, '')}App {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.loadContent();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScroll(link.getAttribute('href'));
            });
        });
        
        // Button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });
        
        // Feature cards hover effects
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });
        });
    }
    
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    handleButtonClick(button) {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Handle different button types
        if (button.classList.contains('btn-primary')) {
            this.handlePrimaryAction();
        } else if (button.classList.contains('btn-secondary')) {
            this.handleSecondaryAction();
        }
    }
    
    handlePrimaryAction() {
        // Primary button functionality
        console.log('Primary action triggered');
        this.showNotification('Welcome to ${project.title}!', 'success');
    }
    
    handleSecondaryAction() {
        // Secondary button functionality
        console.log('Secondary action triggered');
        this.showNotification('Learn more about our features', 'info');
    }
    
    animateCard(card, type) {
        if (type === 'enter') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }
    
    loadContent() {
        // Simulate content loading
        const features = ${JSON.stringify(project.features)};
        const technologies = ${JSON.stringify(project.tags)};
        
        console.log('Loaded features:', features);
        console.log('Built with:', technologies);
        
        // Initialize any dynamic content
        this.updateStats();
    }
    
    updateStats() {
        // Update any dynamic statistics or counters
        const stats = {
            users: Math.floor(Math.random() * 10000) + 1000,
            projects: Math.floor(Math.random() * 100) + 50,
            satisfaction: 98
        };
        
        console.log('Current stats:', stats);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = \`notification notification-\${type}\`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            backgroundColor: type === 'success' ? '#10b981' : '#3b82f6',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Utility functions
const utils = {
    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Local storage helpers
    storage: {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        
        get(key) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        
        remove(key) {
            localStorage.removeItem(key);
        }
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ${project.title.replace(/\s+/g, '')}App();
    
    // Make app globally accessible for debugging
    window.app = app;
    window.utils = utils;
    
    console.log('${project.title} application initialized successfully!');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ${project.title.replace(/\s+/g, '')}App, utils };
}`;
    }
    
    highlightSyntax(code, language) {
        // Basic syntax highlighting
        let highlighted = code;
        
        if (language === 'html') {
            highlighted = highlighted
                .replace(/(&lt;\/?)(\w+)([^&gt;]*&gt;)/g, '<span class="code-keyword">$1$2</span><span class="code-variable">$3</span>')
                .replace(/(&quot;[^&quot;]*&quot;)/g, '<span class="code-string">$1</span>');
        } else if (language === 'css') {
            highlighted = highlighted
                .replace(/(\/\*.*?\*\/)/g, '<span class="code-comment">$1</span>')
                .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="code-keyword">$1</span>$2')
                .replace(/(#[a-fA-F0-9]{3,6})/g, '<span class="code-string">$1</span>')
                .replace(/(\d+px|\d+rem|\d+%)/g, '<span class="code-number">$1</span>');
        } else if (language === 'js') {
            highlighted = highlighted
                .replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>')
                .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="code-comment">$1</span>')
                .replace(/\b(class|function|const|let|var|if|else|for|while|return|import|export)\b/g, '<span class="code-keyword">$1</span>')
                .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="code-string">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
        }
        
        return highlighted;
    }
    
    copyCode() {
        const code = this.codeContent.textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
            }, 2000);
        });
    }
}

// Initialize source code viewer
const sourceCodeViewer = new SourceCodeViewer();

