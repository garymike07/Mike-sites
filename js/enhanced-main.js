// Enhanced Mike Sites - Comprehensive Portfolio with E-commerce & Project Request System

document.addEventListener('DOMContentLoaded', () => {
    const app = new EnhancedMikeSites();
    app.init();
});

class EnhancedMikeSites {
    constructor() {
        this.currentSection = 'home';
        this.projectManager = null;
        this.cartManager = null;
        this.requestFormManager = null;
        this.ratingManager = null;
        this.hour12 = localStorage.getItem('clockFormat') === '12h';
        this.theme = localStorage.getItem('theme') || 'dark';
        this.secretKey = 'Shutters500#';
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.initializeClock();
        this.initializeManagers();
        this.initializeAnimations();
        this.hideLoadingOverlay();
        this.initializeScrollEffects();
        this.initializeFloatingElements();
        
        // Make this instance globally available
        window.mikeSites = this;
    }

    initializeManagers() {
        setTimeout(() => {
            this.projectManager = new EnhancedProjectManager();
            this.cartManager = new ShoppingCartManager();
            this.requestFormManager = new EnhancedRequestFormManager();
            this.ratingManager = new RatingSystemManager();
        }, 100);
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                this.startHeroAnimations();
            }, 500);
        }
    }

    startHeroAnimations() {
        // Typewriter effect for hero subtitle
        const typewriterElement = document.querySelector('.typewriter');
        if (typewriterElement) {
            this.typewriterEffect(typewriterElement, 'A Living Web Lab', 100);
        }

        // Animate hero elements
        gsap.timeline()
            .from('.hero-avatar', { scale: 0, rotation: 180, duration: 1, ease: "back.out(1.7)" })
            .from('.hero-title', { y: 50, opacity: 0, duration: 0.8 }, "-=0.5")
            .from('.hero-cta-container .btn', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
            .from('.scroll-indicator', { y: 20, opacity: 0, duration: 0.5 }, "-=0.2");
    }

    typewriterEffect(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Add blinking cursor
                element.innerHTML += '<span class="cursor">|</span>';
            }
        }, speed);
    }

    initializeTheme() {
        document.body.setAttribute('data-theme', this.theme);
        this.updateThemeButtons();
    }

    updateThemeButtons() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.theme);
        });
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
                    second: '2-digit'
                };
                
                clockElement.textContent = now.toLocaleTimeString('en-US', options);
            };

            updateClock();
            setInterval(updateClock, 1000);

            toggleButton.addEventListener('click', () => {
                this.hour12 = !this.hour12;
                localStorage.setItem('clockFormat', this.hour12 ? '12h' : '24h');
                toggleButton.textContent = this.hour12 ? '12h' : '24h';
                updateClock();
            });

            toggleButton.textContent = this.hour12 ? '12h' : '24h';
        }
    }

    initializeScrollEffects() {
        // Scroll progress bar
        window.addEventListener('scroll', () => {
            const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.querySelector('.scroll-progress-bar').style.width = `${scrollProgress}%`;
        });

        // Intersection Observer for section navigation
        const sections = document.querySelectorAll('.section');
        const navButtons = document.querySelectorAll('.nav-btn');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navButtons.forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.section === sectionId);
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    initializeFloatingElements() {
        // Create floating geometric elements
        const hero = document.querySelector('.hero-container');
        if (hero) {
            for (let i = 0; i < 5; i++) {
                const element = document.createElement('div');
                element.className = 'floating-element';
                element.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 100 + 50}px;
                    height: ${Math.random() * 100 + 50}px;
                    background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                    border-radius: ${Math.random() > 0.5 ? '50%' : '10px'};
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: float ${Math.random() * 10 + 10}s infinite linear;
                    pointer-events: none;
                    z-index: -1;
                `;
                hero.appendChild(element);
            }
        }
    }

    initializeAnimations() {
        // Register GSAP plugins
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Animate sections on scroll
            gsap.utils.toArray('.section').forEach(section => {
                gsap.from(section.children, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

            // Parallax effect for hero background
            gsap.to('.hero-container', {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: '.hero-container',
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.navigateToSection(btn.dataset.section));
        });

        // Theme switching
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTheme(btn.dataset.theme));
        });

        // Mobile menu
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('.main-nav');
        
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('mobile-active');
        });

        // Smooth scroll for CTA buttons
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.dataset.section) {
                    e.preventDefault();
                    this.navigateToSection(btn.dataset.section);
                }
            });
        });

        // Scroll indicator click
        document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
            document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
        });
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.currentSection = sectionId;
            
            // Update active states
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.section === sectionId);
            });
        }
    }

    switchTheme(theme) {
        this.theme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeButtons();

        // Animate theme transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// Enhanced Project Manager with E-commerce functionality
class EnhancedProjectManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
    }

    loadProjects() {
        this.projects = [
            {
                id: 1,
                title: "SaaS Dashboard Platform",
                description: "Modern analytics dashboard with real-time data visualization and user management.",
                category: "saas",
                status: "live",
                technologies: ["React", "Node.js", "MongoDB", "Chart.js"],
                image: "images/projects/saas-dashboard.jpg",
                liveUrl: "https://example-saas.com",
                githubUrl: "https://github.com/garymike07/saas-dashboard",
                price: "KES 25,000",
                featured: true,
                downloadable: true
            },
            {
                id: 2,
                title: "E-commerce Store",
                description: "Full-featured online store with payment integration and inventory management.",
                category: "ecommerce",
                status: "live",
                technologies: ["React", "Stripe", "Firebase", "Tailwind"],
                image: "images/projects/ecommerce-store.jpg",
                liveUrl: "https://example-store.com",
                githubUrl: "https://github.com/garymike07/ecommerce-store",
                price: "KES 35,000",
                featured: true,
                downloadable: true
            },
            {
                id: 3,
                title: "Portfolio Website",
                description: "Responsive portfolio website with modern design and smooth animations.",
                category: "portfolio",
                status: "live",
                technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
                image: "images/projects/portfolio-site.jpg",
                liveUrl: "https://example-portfolio.com",
                githubUrl: "https://github.com/garymike07/portfolio-site",
                price: "KES 15,000",
                featured: false,
                downloadable: true
            },
            {
                id: 4,
                title: "Blog Platform",
                description: "Content management system with rich text editor and SEO optimization.",
                category: "blog",
                status: "ongoing",
                technologies: ["Next.js", "Prisma", "PostgreSQL", "Vercel"],
                image: "images/projects/blog-platform.jpg",
                liveUrl: null,
                githubUrl: "https://github.com/garymike07/blog-platform",
                price: "KES 20,000",
                featured: false,
                downloadable: true
            },
            {
                id: 5,
                title: "Analytics Dashboard",
                description: "Business intelligence dashboard with advanced reporting and data visualization.",
                category: "dashboard",
                status: "progress",
                technologies: ["Vue.js", "D3.js", "Express", "MySQL"],
                image: "images/projects/analytics-dashboard.jpg",
                liveUrl: null,
                githubUrl: "https://github.com/garymike07/analytics-dashboard",
                price: "KES 30,000",
                featured: true,
                downloadable: true
            }
        ];
        this.filteredProjects = [...this.projects];
    }

    setupEventListeners() {
        // Filter controls
        document.getElementById('project-filter')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterProjects();
        });

        document.getElementById('home-project-filter')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterProjects();
        });

        // Search controls
        document.getElementById('project-search')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterProjects();
        });

        document.getElementById('home-project-search')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterProjects();
        });
    }

    filterProjects() {
        this.filteredProjects = this.projects.filter(project => {
            const matchesFilter = this.currentFilter === 'all' || project.category === this.currentFilter || project.status === this.currentFilter;
            const matchesSearch = this.searchTerm === '' || 
                project.title.toLowerCase().includes(this.searchTerm) ||
                project.description.toLowerCase().includes(this.searchTerm) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm));
            
            return matchesFilter && matchesSearch;
        });
        this.renderProjects();
    }

    renderProjects() {
        const grids = [
            document.getElementById('projects-grid'),
            document.getElementById('home-projects-grid')
        ];

        grids.forEach(grid => {
            if (grid) {
                grid.innerHTML = this.filteredProjects.map(project => this.createProjectCard(project)).join('');
                this.attachProjectEventListeners(grid);
            }
        });
    }

    createProjectCard(project) {
        const statusBadge = this.getStatusBadge(project.status);
        const featuredBadge = project.featured ? '<div class="featured-badge">Featured</div>' : '';
        
        return `
            <div class="project-card" data-project-id="${project.id}">
                ${featuredBadge}
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
                    <div class="project-overlay">
                        <div class="project-actions">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-sm">Live Demo</a>` : ''}
                            <button class="btn btn-sm btn-secondary view-code-btn" data-project-id="${project.id}">View Code</button>
                            ${project.downloadable ? `<button class="btn btn-sm btn-primary add-to-cart-btn" data-project-id="${project.id}">Add to Cart</button>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        ${statusBadge}
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                    <div class="project-footer">
                        <span class="project-price">${project.price}</span>
                        <div class="project-links">
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" title="GitHub"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusBadge(status) {
        const badges = {
            live: '<span class="status-badge status-live">Live</span>',
            ongoing: '<span class="status-badge status-ongoing">Ongoing</span>',
            progress: '<span class="status-badge status-progress">In Progress</span>',
            concept: '<span class="status-badge status-concept">Concept</span>'
        };
        return badges[status] || '';
    }

    attachProjectEventListeners(container) {
        // View code buttons
        container.querySelectorAll('.view-code-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = parseInt(btn.dataset.projectId);
                this.showCodePreview(projectId);
            });
        });

        // Add to cart buttons
        container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = parseInt(btn.dataset.projectId);
                window.mikeSites.cartManager.addToCart(projectId);
            });
        });
    }

    showCodePreview(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = this.createCodePreviewModal(project);
        document.body.appendChild(modal);
        modal.classList.add('active');

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    createCodePreviewModal(project) {
        const modal = document.createElement('div');
        modal.className = 'modal code-preview-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${project.title} - Source Code Preview</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="file-structure">
                        <h4>File Structure</h4>
                        <div class="file-tree">
                            <div class="file-item folder">📁 src/</div>
                            <div class="file-item file">📄 index.html</div>
                            <div class="file-item file">📄 style.css</div>
                            <div class="file-item file">📄 script.js</div>
                            <div class="file-item file">📄 README.md</div>
                        </div>
                    </div>
                    <div class="code-preview">
                        <h4>Preview (index.html)</h4>
                        <pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;${project.title}&lt;/title&gt;
    &lt;link rel="stylesheet" href="style.css"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="container"&gt;
        &lt;h1&gt;${project.title}&lt;/h1&gt;
        &lt;p&gt;${project.description}&lt;/p&gt;
    &lt;/div&gt;
    &lt;script src="script.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary add-to-cart-modal-btn" data-project-id="${project.id}">Add to Cart - ${project.price}</button>
                </div>
            </div>
        `;

        // Add to cart from modal
        modal.querySelector('.add-to-cart-modal-btn').addEventListener('click', () => {
            window.mikeSites.cartManager.addToCart(project.id);
            modal.remove();
        });

        return modal;
    }
}

// Shopping Cart Manager
class ShoppingCartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('mikeSitesCart')) || [];
        this.init();
    }

    init() {
        this.createCartUI();
        this.updateCartDisplay();
        this.setupEventListeners();
    }

    createCartUI() {
        // Create floating cart icon
        const cartIcon = document.createElement('div');
        cartIcon.className = 'floating-cart';
        cartIcon.innerHTML = `
            <button class="cart-toggle-btn">
                🛒
                <span class="cart-count" id="cart-count">0</span>
            </button>
        `;
        document.body.appendChild(cartIcon);

        // Create cart drawer
        const cartDrawer = document.createElement('div');
        cartDrawer.className = 'cart-drawer';
        cartDrawer.id = 'cart-drawer';
        cartDrawer.innerHTML = `
            <div class="cart-header">
                <h3>Shopping Cart</h3>
                <button class="close-cart-btn">&times;</button>
            </div>
            <div class="cart-items" id="cart-items">
                <!-- Cart items will be rendered here -->
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Total Items: <span id="cart-total-items">0</span></strong>
                </div>
            </div>
        `;
        document.body.appendChild(cartDrawer);
    }

    setupEventListeners() {
        // Toggle cart drawer
        document.querySelector('.cart-toggle-btn').addEventListener('click', () => {
            this.toggleCartDrawer();
        });

        // Close cart drawer
        document.querySelector('.close-cart-btn').addEventListener('click', () => {
            this.closeCartDrawer();
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cartDrawer = document.getElementById('cart-drawer');
            const cartButton = document.querySelector('.floating-cart');
            
            if (!cartDrawer.contains(e.target) && !cartButton.contains(e.target)) {
                this.closeCartDrawer();
            }
        });
    }

    addToCart(projectId) {
        const project = window.mikeSites.projectManager.projects.find(p => p.id === projectId);
        if (!project) return;

        // Check if already in cart
        if (this.cart.find(item => item.id === projectId)) {
            this.showNotification('Project already in cart!', 'warning');
            return;
        }

        this.cart.push({
            id: project.id,
            title: project.title,
            price: project.price,
            image: project.image
        });

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${project.title} added to cart!`, 'success');
        
        // Animate cart icon
        this.animateCartIcon();
    }

    removeFromCart(projectId) {
        this.cart = this.cart.filter(item => item.id !== projectId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotalItems = document.getElementById('cart-total-items');

        cartCount.textContent = this.cart.length;
        cartTotalItems.textContent = this.cart.length;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItems.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
            this.attachCartItemListeners();
        }
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <span class="cart-item-price">${item.price}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-sm download-btn" data-item-id="${item.id}">Download</button>
                    <button class="btn btn-sm btn-danger remove-btn" data-item-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
    }

    attachCartItemListeners() {
        // Download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.itemId);
                this.initiateDownload(itemId);
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.itemId);
                this.removeFromCart(itemId);
            });
        });
    }

    initiateDownload(projectId) {
        const project = this.cart.find(item => item.id === projectId);
        if (!project) return;

        this.showSecretKeyModal(project);
    }

    showSecretKeyModal(project) {
        const modal = document.createElement('div');
        modal.className = 'modal secret-key-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🔐 Secure Download</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Enter the secret key to download <strong>${project.title}</strong> source code:</p>
                    <input type="password" id="secret-key-input" placeholder="Enter secret key..." class="secret-key-input">
                    <div class="secret-key-error" id="secret-key-error" style="display: none;">
                        Invalid secret key. <a href="mailto:wrootmike@gmail.com?subject=Source Code Access Request - Mike Sites&body=Hi Mike, I'd like to request access to download source code from your portfolio. Project of interest: ${project.title}">Request Access Key</a>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" id="verify-key-btn">Download</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active');

        const input = modal.querySelector('#secret-key-input');
        const verifyBtn = modal.querySelector('#verify-key-btn');
        const errorDiv = modal.querySelector('#secret-key-error');

        // Focus input
        input.focus();

        // Handle enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyBtn.click();
            }
        });

        // Verify key
        verifyBtn.addEventListener('click', () => {
            const enteredKey = input.value.trim();
            
            if (enteredKey === window.mikeSites.secretKey) {
                errorDiv.style.display = 'none';
                this.downloadProject(project);
                modal.remove();
            } else {
                errorDiv.style.display = 'block';
                input.value = '';
                input.focus();
                
                // Shake animation
                input.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);
            }
        });

        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    downloadProject(project) {
        this.showNotification('Access granted! Preparing download...', 'success');
        
        // Simulate file preparation and download
        setTimeout(() => {
            this.generateAndDownloadZip(project);
        }, 1000);
    }

    generateAndDownloadZip(project) {
        // Create a ZIP file with project source code
        const zip = new JSZip();
        
        // Add sample files
        zip.file("README.md", `# ${project.title}\n\n${project.description}\n\nThis is the source code for ${project.title}.`);
        zip.file("index.html", this.generateSampleHTML(project));
        zip.file("style.css", this.generateSampleCSS(project));
        zip.file("script.js", this.generateSampleJS(project));
        
        // Generate and download
        zip.generateAsync({type:"blob"}).then(function(content) {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}-source-code.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        this.showNotification(`${project.title} downloaded successfully!`, 'success');
    }

    generateSampleHTML(project) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${project.title}</h1>
        </header>
        <main>
            <p>${project.description}</p>
            <div class="features">
                <h2>Features</h2>
                <ul>
                    <li>Modern responsive design</li>
                    <li>Interactive user interface</li>
                    <li>Optimized performance</li>
                    <li>Cross-browser compatibility</li>
                </ul>
            </div>
        </main>
        <footer>
            <p>&copy; 2024 Mike Sites. All rights reserved.</p>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
    }

    generateSampleCSS(project) {
        return `/* ${project.title} Styles */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    margin-top: 50px;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

h1 {
    color: #667eea;
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.features {
    margin-top: 30px;
}

.features ul {
    list-style: none;
    padding-left: 0;
}

.features li {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}

.features li:before {
    content: "✓ ";
    color: #667eea;
    font-weight: bold;
}

footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    color: #666;
}

@media (max-width: 768px) {
    .container {
        margin: 20px;
        padding: 15px;
    }
    
    h1 {
        font-size: 2rem;
    }
}`;
    }

    generateSampleJS(project) {
        return `// ${project.title} JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('${project.title} loaded successfully!');
    
    // Initialize the application
    init();
});

function init() {
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add interactive features
    addInteractivity();
    
    // Initialize animations
    initAnimations();
}

function addSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addInteractivity() {
    // Add hover effects to feature items
    const featureItems = document.querySelectorAll('.features li');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = '';
        });
    });
}

function initAnimations() {
    // Fade in animation for container
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.8s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for external use
window.${project.title.replace(/\s+/g, '')} = {
    init,
    showNotification
};`;
    }

    toggleCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        drawer.classList.toggle('active');
    }

    closeCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        drawer.classList.remove('active');
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-toggle-btn');
        cartIcon.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
            cartIcon.style.animation = '';
        }, 600);
    }

    saveCart() {
        localStorage.setItem('mikeSitesCart', JSON.stringify(this.cart));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }
}

