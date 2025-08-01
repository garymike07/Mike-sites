// Mike Sites - Main JavaScript Functionality

class MikeSites {
    constructor() {
        this.currentPage = 'home';
        this.sidebarOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.startClock();
        this.animateStats();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Navigation links
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const section = btn.getAttribute("data-section");
                this.navigateToSection(section);
            });
        });

        // Submenu toggles
        document.querySelectorAll('.submenu-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSubmenu(toggle.parentElement);
            });
        });

        // Modal controls
        this.setupModalControls();

        // Request project button
        const requestBtn = document.getElementById('request-project-btn');
        if (requestBtn) {
            requestBtn.addEventListener('click', () => this.openRequestModal());
        }

        // Scroll buttons
        this.setupScrollButtons();

        // CTA buttons
        document.querySelectorAll('.cta-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && this.sidebarOpen) {
                const sidebar = document.querySelector('.sidebar');
                const mobileToggle = document.getElementById('mobile-menu-toggle');
                
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax effect
        window.addEventListener('scroll', () => this.handleParallax());

        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 768) {
            // Mobile behavior
            this.sidebarOpen = !this.sidebarOpen;
            sidebar.classList.toggle('open', this.sidebarOpen);
        } else {
            // Desktop behavior
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    }

    closeSidebar() {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.remove('open');
            this.sidebarOpen = false;
        }
    }

    toggleSubmenu(menuItem) {
        const isOpen = menuItem.classList.contains('open');
        
        // Close all other submenus
        document.querySelectorAll('.has-submenu.open').forEach(item => {
            if (item !== menuItem) {
                item.classList.remove('open');
            }
        });
        
        // Toggle current submenu
        menuItem.classList.toggle('open', !isOpen);
    }

    navigateToSection(sectionName) {
        // Update active nav item
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        const activeNavBtn = document.querySelector(`.nav-btn[data-section="${sectionName}"]`);
        if (activeNavBtn) {
            activeNavBtn.classList.add("active");
        }

        // Show/hide sections
        document.querySelectorAll(".section").forEach(section => {
            section.classList.remove("active");
        });
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add("active");
            this.currentPage = sectionName;
        }

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Load section-specific content
        this.loadSectionContent(sectionName);

        // Handle back button visibility
        const backButton = document.getElementById("back-to-home");
        if (backButton) {
            if (sectionName !== "home") {
                backButton.style.display = "block";
            } else {
                backButton.style.display = "none";
            }
        }
    }

    loadSectionContent(sectionName) {
        switch (sectionName) {
            case 'projects':
                // Projects are now loaded directly on the home page
                break;
            case 'demos':
                // Load live demos content
                this.loadLiveDemos();
                break;
            case 'tech-stack':
                this.animateProficiencyBars();
                break;
            default:
                break;
        }
    }

    setupModalControls() {
        // Project modal
        const projectModal = document.getElementById('project-modal');
        const projectModalClose = document.getElementById('modal-close');
        
        if (projectModalClose) {
            projectModalClose.addEventListener('click', () => this.closeModal('project-modal'));
        }

        // Request modal
        const requestModal = document.getElementById('request-modal');
        const requestModalClose = document.getElementById('request-modal-close');
        
        if (requestModalClose) {
            requestModalClose.addEventListener('click', () => this.closeModal('request-modal'));
        }

        // Close modal when clicking overlay
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Request form submission
        const requestForm = document.getElementById('request-form');
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => this.handleRequestSubmission(e));
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    openRequestModal() {
        this.openModal('request-modal');
    }

    handleRequestSubmission(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Show success message
            this.showNotification('Request submitted successfully! I\'ll get back to you soon.', 'success');
            
            // Close modal and reset form
            this.closeModal('request-modal');
            e.target.reset();
        }, 2000);
    }

    setupScrollButtons() {
        const scrollLeft = document.getElementById('scroll-left');
        const scrollRight = document.getElementById('scroll-right');
        const projectsScroll = document.getElementById('projects-scroll');
        
        if (scrollLeft && scrollRight && projectsScroll) {
            scrollLeft.addEventListener('click', () => {
                projectsScroll.scrollBy({ left: -350, behavior: 'smooth' });
            });
            
            scrollRight.addEventListener('click', () => {
                projectsScroll.scrollBy({ left: 350, behavior: 'smooth' });
            });
        }
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    animateStats() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => this.animateNumber(stat));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateNumber(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    animateProficiencyBars() {
        const bars = document.querySelectorAll('.proficiency-bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                const level = bar.getAttribute('data-level');
                bar.style.width = level + '%';
            }, index * 100);
        });
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleResize() {
        // Close sidebar on desktop resize
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.remove('open');
            this.sidebarOpen = false;
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-md) var(--spacing-lg);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform var(--transition-normal);
            max-width: 400px;
        `;

        if (type === 'success') {
            notification.style.borderColor = '#10b981';
        } else if (type === 'error') {
            notification.style.borderColor = '#ef4444';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    loadProjects() {
        // This will be handled by projects.js
        if (window.ProjectManager) {
            window.ProjectManager.loadProjects();
        }
    }

    initializeComponents() {
        // Initialize any additional components
        this.setupImageLazyLoading();
        this.setupFormValidation();
    }

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: var(--font-size-sm);
                margin-top: var(--spacing-xs);
            `;
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mikeSites = new MikeSites();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MikeSites;
}



    loadLiveDemos() {
        const demosContainer = document.querySelector("#demos .demos-container");
        if (demosContainer) {
            demosContainer.innerHTML = `
                <h2>Live Demos</h2>
                <p>Explore interactive live demonstrations of my projects.</p>
                <div class="demo-grid">
                    <div class="demo-card">
                        <h3>Project Alpha</h3>
                        <p>A cutting-edge SaaS platform.</p>
                        <a href="#" class="btn btn-primary">View Demo</a>
                    </div>
                    <div class="demo-card">
                        <h3>Project Beta</h3>
                        <p>An e-commerce solution with advanced features.</p>
                        <a href="#" class="btn btn-primary">View Demo</a>
                    </div>
                    <div class="demo-card">
                        <h3>Project Gamma</h3>
                        <p>A data visualization dashboard.</p>
                        <a href="#" class="btn btn-primary">View Demo</a>
                    </div>
                </div>
            `;
        }
    }


