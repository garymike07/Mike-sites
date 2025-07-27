// Mike Sites - Developer Portfolio JavaScript

// Global variables
let currentLanguage = 'en';
let favoriteProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
let currentTheme = localStorage.getItem('theme') || 'dark';

// Translations
const translations = {
    en: {
        welcome: "Welcome to Mike Sites",
        subtitle: "A Living Web Lab",
        description: "Where innovation meets implementation. Crafting digital experiences that push boundaries and solve real-world problems.",
        currentTime: "Current Time",
        dailyTip: "💡 Daily Coding Tip",
        scrollToExplore: "Scroll to explore",
        searchProjects: "Search projects...",
        allCategories: "All Categories",
        aboutMe: "About Me",
        getInTouch: "Get In Touch",
        techStack: "Tech Stack",
        toolbox: "Developer Toolbox",
        blog: "Latest Blog Posts",
        playground: "Code Playground"
    },
    es: {
        welcome: "Bienvenido a Mike Sites",
        subtitle: "Un Laboratorio Web Viviente",
        description: "Donde la innovación se encuentra con la implementación. Creando experiencias digitales que empujan límites y resuelven problemas del mundo real.",
        currentTime: "Hora Actual",
        dailyTip: "💡 Consejo Diario de Programación",
        scrollToExplore: "Desplázate para explorar",
        searchProjects: "Buscar proyectos...",
        allCategories: "Todas las Categorías",
        aboutMe: "Acerca de Mí",
        getInTouch: "Ponte en Contacto",
        techStack: "Stack Tecnológico",
        toolbox: "Caja de Herramientas",
        blog: "Últimas Publicaciones",
        playground: "Patio de Juegos de Código"
    }
};

// Daily coding tips
const dailyTips = [
    "Use semantic HTML elements to improve accessibility and SEO.",
    "Always validate user input on both client and server side.",
    "Use CSS Grid and Flexbox for modern, responsive layouts.",
    "Implement proper error handling in your JavaScript code.",
    "Use version control (Git) for all your projects, no matter how small.",
    "Write clean, readable code with meaningful variable names.",
    "Test your code across different browsers and devices.",
    "Use CSS custom properties (variables) for maintainable stylesheets.",
    "Optimize images and assets for better web performance.",
    "Keep learning new technologies and best practices.",
    "Use progressive enhancement for better user experience.",
    "Implement proper security measures in your applications.",
    "Use modern JavaScript features like async/await for cleaner code.",
    "Follow the DRY principle: Don't Repeat Yourself.",
    "Use a consistent code style and formatting across your projects."
];

// Project data
const projectsData = [
    {
        id: 1,
        title: "SaaS Landing Page",
        category: "saas",
        status: "live",
        description: "Modern, conversion-optimized landing page for SaaS products with animated sections and responsive design.",
        tags: ["React", "Tailwind CSS", "Framer Motion", "TypeScript"],
        thumbnail: "🚀",
        features: [
            "Responsive design for all devices",
            "Smooth scroll animations",
            "Contact form integration",
            "SEO optimized",
            "Fast loading performance"
        ],
        challenges: "Creating smooth animations while maintaining performance across all devices.",
        github: "https://github.com/garymike07/saas-landing",
        demo: "https://saas-demo.mikesites.dev",
        screenshots: ["screenshot1.jpg", "screenshot2.jpg"]
    },
    {
        id: 2,
        title: "Personal Portfolio",
        category: "portfolio",
        status: "live",
        description: "Clean, minimalist portfolio website showcasing creative work with interactive elements and smooth transitions.",
        tags: ["HTML5", "CSS3", "JavaScript", "GSAP"],
        thumbnail: "👨‍💻",
        features: [
            "Interactive animations",
            "Project showcase gallery",
            "Contact form",
            "Blog integration",
            "Dark/Light mode toggle"
        ],
        challenges: "Balancing visual appeal with fast loading times and accessibility.",
        github: "https://github.com/garymike07/portfolio",
        demo: "https://portfolio-demo.mikesites.dev",
        screenshots: ["portfolio1.jpg", "portfolio2.jpg"]
    },
    {
        id: 3,
        title: "Blog Template",
        category: "blog",
        status: "progress",
        description: "Feature-rich blog template with markdown support, search functionality, and social sharing capabilities.",
        tags: ["Next.js", "MDX", "Tailwind CSS", "Prisma"],
        thumbnail: "📝",
        features: [
            "Markdown blog posts",
            "Search and filtering",
            "Social sharing",
            "Comment system",
            "RSS feed generation"
        ],
        challenges: "Implementing efficient search and content management system.",
        github: "https://github.com/garymike07/blog-template",
        demo: "https://blog-demo.mikesites.dev",
        screenshots: ["blog1.jpg", "blog2.jpg"]
    },
    {
        id: 4,
        title: "E-Commerce Site",
        category: "ecommerce",
        status: "concept",
        description: "Full-featured e-commerce platform with shopping cart, payment integration, and admin dashboard.",
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        thumbnail: "🛒",
        features: [
            "Product catalog",
            "Shopping cart",
            "Payment processing",
            "User authentication",
            "Admin dashboard"
        ],
        challenges: "Implementing secure payment processing and inventory management.",
        github: "https://github.com/garymike07/ecommerce",
        demo: "https://shop-demo.mikesites.dev",
        screenshots: ["shop1.jpg", "shop2.jpg"]
    },
    {
        id: 5,
        title: "Cafe Website",
        category: "portfolio",
        status: "live",
        description: "Elegant website for a local cafe with online menu, reservation system, and location information.",
        tags: ["Vue.js", "Nuxt.js", "SCSS", "Firebase"],
        thumbnail: "☕",
        features: [
            "Online menu display",
            "Table reservations",
            "Location and hours",
            "Photo gallery",
            "Contact information"
        ],
        challenges: "Creating an appetizing visual design that loads quickly on mobile devices.",
        github: "https://github.com/garymike07/cafe-website",
        demo: "https://cafe-demo.mikesites.dev",
        screenshots: ["cafe1.jpg", "cafe2.jpg"]
    },
    {
        id: 6,
        title: "Admin Dashboard",
        category: "dashboard",
        status: "progress",
        description: "Comprehensive admin dashboard with data visualization, user management, and real-time analytics.",
        tags: ["React", "D3.js", "Express", "PostgreSQL"],
        thumbnail: "📊",
        features: [
            "Data visualization charts",
            "User management",
            "Real-time analytics",
            "Export functionality",
            "Role-based access"
        ],
        challenges: "Handling large datasets efficiently while maintaining smooth user interactions.",
        github: "https://github.com/garymike07/admin-dashboard",
        demo: "https://dashboard-demo.mikesites.dev",
        screenshots: ["dashboard1.jpg", "dashboard2.jpg"]
    }
];

// Blog posts data
const blogPosts = [
    {
        id: 1,
        title: "Building Modern Web Applications with React",
        excerpt: "Learn the best practices for creating scalable and maintainable React applications in 2024.",
        date: "2024-01-15",
        readTime: "8 min read",
        image: "📱"
    },
    {
        id: 2,
        title: "CSS Grid vs Flexbox: When to Use Which",
        excerpt: "A comprehensive guide to choosing between CSS Grid and Flexbox for your layout needs.",
        date: "2024-01-10",
        readTime: "6 min read",
        image: "🎨"
    },
    {
        id: 3,
        title: "JavaScript Performance Optimization Tips",
        excerpt: "Practical techniques to improve the performance of your JavaScript applications.",
        date: "2024-01-05",
        readTime: "10 min read",
        image: "⚡"
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mike Sites Portfolio Loaded');
    
    // Initialize all components
    initTheme();
    initNavigation();
    initClock();
    initDailyTip();
    initProjects();
    initBlogPosts();
    initContactForm();
    initPlayground();
    initScrollAnimations();
    initLanguageToggle();
    initMobileMenu();
    initNotifications();
    
    // Show welcome notification
    showNotification('Welcome to Mike Sites! 🚀', 'success');
});

// Theme management
function initTheme() {
    document.body.setAttribute('data-theme', currentTheme);
    
    // Update theme button states
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
    
    // Add theme button event listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTheme = btn.dataset.theme;
            document.body.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            
            // Update button states
            document.querySelectorAll('.theme-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.theme === currentTheme);
            });
            
            showNotification(`Theme changed to ${currentTheme}`, 'success');
        });
    });
}

// Navigation management
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.dataset.section;
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.toggle('active', section.id === targetSection);
            });
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
    
    // Category navigation
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            
            // Switch to projects section
            sections.forEach(section => {
                section.classList.toggle('active', section.id === 'projects');
            });
            
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-section="projects"]').classList.add('active');
            
            // Filter projects by category
            filterProjects(category);
            closeMobileMenu();
        });
    });
}

// Real-time clock
function initClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Daily tip rotation
function initDailyTip() {
    const tipElement = document.getElementById('daily-tip');
    if (tipElement) {
        const today = new Date().getDate();
        const tipIndex = today % dailyTips.length;
        tipElement.textContent = dailyTips[tipIndex];
    }
}

// Projects functionality
function initProjects() {
    renderProjects(projectsData);
    
    // Search functionality
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProjects = projectsData.filter(project =>
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
            renderProjects(filteredProjects);
        });
    }
    
    // Filter functionality
    const filterSelect = document.getElementById('project-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const category = e.target.value;
            filterProjects(category);
        });
    }
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-project-id="${project.id}">
            <div class="project-thumbnail">${project.thumbnail}</div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-status status-${project.status}">${getStatusText(project.status)}</span>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <button class="btn btn-primary" onclick="openProjectModal(${project.id})">More Info</button>
                    <button class="favorite-btn ${favoriteProjects.includes(project.id) ? 'active' : ''}" 
                            onclick="toggleFavorite(${project.id})">❤️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProjects(category) {
    const filteredProjects = category === 'all' 
        ? projectsData 
        : projectsData.filter(project => project.category === category);
    renderProjects(filteredProjects);
    
    // Update filter select
    const filterSelect = document.getElementById('project-filter');
    if (filterSelect) {
        filterSelect.value = category;
    }
}

function getStatusText(status) {
    const statusMap = {
        live: 'Live',
        progress: 'In Progress',
        concept: 'Concept'
    };
    return statusMap[status] || status;
}

function toggleFavorite(projectId) {
    const index = favoriteProjects.indexOf(projectId);
    if (index > -1) {
        favoriteProjects.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    } else {
        favoriteProjects.push(projectId);
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('favoriteProjects', JSON.stringify(favoriteProjects));
    
    // Update favorite button
    const favoriteBtn = document.querySelector(`[data-project-id="${projectId}"] .favorite-btn`);
    if (favoriteBtn) {
        favoriteBtn.classList.toggle('active', favoriteProjects.includes(projectId));
    }
}

// Modal functionality
function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${project.title}</h2>
            <span class="project-status status-${project.status}">${getStatusText(project.status)}</span>
        </div>
        <div class="modal-content-body">
            <div class="project-thumbnail-large">${project.thumbnail}</div>
            <p class="project-description-full">${project.description}</p>
            
            <div class="project-features">
                <h3>Key Features</h3>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="project-tech-stack">
                <h3>Tech Stack</h3>
                <div class="tech-tags">
                    ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="project-challenges">
                <h3>Challenges & Solutions</h3>
                <p>${project.challenges}</p>
            </div>
            
            <div class="project-links">
                <a href="${project.github}" target="_blank" class="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                </a>
                <a href="${project.demo}" target="_blank" class="btn btn-primary">
                    🚀 Live Preview
                </a>
                <button class="btn btn-secondary" onclick="cloneProject('${project.title}')">
                    📋 Clone This Project
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function cloneProject(projectTitle) {
    const cloneCommand = `git clone https://github.com/garymike07/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(cloneCommand).then(() => {
        showNotification('Clone command copied to clipboard!', 'success');
    });
}

// Blog posts
function initBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    if (!blogContainer) return;
    
    blogContainer.innerHTML = blogPosts.map(post => `
        <article class="blog-post">
            <div class="blog-post-image">${post.image}</div>
            <div class="blog-post-content">
                <h3 class="blog-post-title">${post.title}</h3>
                <p class="blog-post-excerpt">${post.excerpt}</p>
                <div class="blog-post-meta">
                    <span>${new Date(post.date).toLocaleDateString()}</span>
                    <span>${post.readTime}</span>
                </div>
            </div>
        </article>
    `).join('');
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // In a real application, you would send this data to a server
        console.log('Form data:', data);
    });
}

// Code playground
function initPlayground() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const codeEditors = document.querySelectorAll('.code-editor');
    const runBtn = document.getElementById('run-code');
    const clearBtn = document.getElementById('clear-code');
    const previewFrame = document.getElementById('preview-frame');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding editor
            codeEditors.forEach(editor => {
                editor.classList.toggle('active', editor.id === `${tab}-editor`);
            });
        });
    });
    
    // Run code
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            const htmlCode = document.getElementById('html-editor').value;
            const cssCode = document.getElementById('css-editor').value;
            const jsCode = document.getElementById('js-editor').value;
            
            const fullCode = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>${cssCode}</style>
                </head>
                <body>
                    ${htmlCode}
                    <script>${jsCode}</script>
                </body>
                </html>
            `;
            
            const blob = new Blob([fullCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            previewFrame.src = url;
            
            showNotification('Code executed successfully!', 'success');
        });
    }
    
    // Clear code
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            codeEditors.forEach(editor => {
                editor.value = '';
            });
            previewFrame.src = 'about:blank';
            showNotification('Code cleared!', 'info');
        });
    }
}

// Scroll animations
function initScrollAnimations() {
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
    
    // Observe elements for scroll animations
    document.querySelectorAll('.project-card, .tool-card, .blog-post, .tech-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Language toggle
function initLanguageToggle() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;
    
    languageSelect.value = currentLanguage;
    
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateLanguage();
        showNotification(`Language changed to ${currentLanguage === 'en' ? 'English' : 'Español'}`, 'success');
    });
}

function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Update text content based on language
    const elements = {
        '.hero-title': t.welcome,
        '.hero-subtitle': t.subtitle,
        '.hero-description': t.description,
        '.clock-label': t.currentTime,
        '.tip-label': t.dailyTip,
        '.scroll-indicator span': t.scrollToExplore,
        '#project-search': { placeholder: t.searchProjects },
        '#project-filter option[value="all"]': t.allCategories
    };
    
    Object.entries(elements).forEach(([selector, content]) => {
        const element = document.querySelector(selector);
        if (element) {
            if (typeof content === 'object') {
                Object.assign(element, content);
            } else {
                element.textContent = content;
            }
        }
    });
}

// Mobile menu
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    
    if (sidebar && mobileToggle) {
        sidebar.classList.remove('active');
        mobileToggle.classList.remove('active');
    }
}

// Notifications
function initNotifications() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('project-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Request project button functionality
document.addEventListener('DOMContentLoaded', () => {
    const requestBtn = document.querySelector('.request-project-btn');
    if (requestBtn) {
        requestBtn.addEventListener('click', () => {
            // Switch to contact section
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('.nav-link[data-section]');
            
            sections.forEach(section => {
                section.classList.toggle('active', section.id === 'contact');
            });
            
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === 'contact');
            });
            
            closeMobileMenu();
            showNotification('Let\'s discuss your project! 💼', 'success');
        });
    }
});

// Tool functionality
function launchTool(toolName) {
    showNotification(`${toolName} tool launched! 🛠️`, 'info');
    // In a real application, this would open the actual tool
}

// Add tool button event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const toolName = e.target.closest('.tool-card').querySelector('h3').textContent;
            launchTool(toolName);
        });
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
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
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Show loading complete notification
    setTimeout(() => {
        showNotification('Portfolio loaded successfully! ✨', 'success');
    }, 1000);
});

