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
let projectsData = [];

// Blog posts data
let blogPosts = [];

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Mike Sites Portfolio Loaded');
    
    // Initialize all components that don't depend on fetched data
    initTheme();
    initNavigation();
    initClock();
    initDailyTip();
    initContactForm();
    initPlayground();
    initScrollAnimations();
    initLanguageToggle();
    initMobileMenu();
    initNotifications();
    initBlogGenerator();

    // Fetch data
    try {
        const [projectsRes, blogPostsRes] = await Promise.all([
            fetch('data/projects.json'),
            fetch('data/blog-posts.json')
        ]);
        if (!projectsRes.ok || !blogPostsRes.ok) {
            throw new Error(`HTTP error! status: ${projectsRes.status} ${blogPostsRes.status}`);
        }
        const projectsJSON = await projectsRes.json();
        const blogPostsJSON = await blogPostsRes.json();

        projectsData = projectsJSON.projects;
        blogPosts = blogPostsJSON.posts;

        // Initialize data-dependent components
        initProjects();
        initBlogPosts();

    } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Could not load project or blog data.', 'error');
    }

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
            
            // Switch to home section to show the projects
            sections.forEach(section => {
                section.classList.toggle('active', section.id === 'home');
            });
            
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-section="home"]').classList.add('active');
            
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
            <div class="project-thumbnail">
                ${project.thumbnail.startsWith('images/') ? 
                    `<img src="${project.thumbnail}" alt="${project.title}" loading="lazy">` : 
                    project.thumbnail}
            </div>
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

    let extraFields = '';
    if (project.id === 2) {
        extraFields = `
            <div class="project-meta" style="margin-top: 20px; font-size: 0.9rem; color: var(--text-secondary);">
                ${project.developedBy ? `<div style="margin-bottom: 5px;"><strong>Developed by:</strong> ${project.developedBy}</div>` : ''}
                ${project.completionDate ? `<div><strong>Completed on:</strong> ${project.completionDate}</div>` : ''}
            </div>
        `;
    }

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${project.title}</h2>
            <span class="project-status status-${project.status}">${getStatusText(project.status)}</span>
        </div>
        <div class="modal-content-body">
            <div class="project-thumbnail-large">${project.thumbnail}</div>
            <p class="project-description-full">${project.description}</p>
            
            ${extraFields}

            <div class="project-features" style="margin-top: 20px;">
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
                <button class="btn btn-secondary" onclick="requestProjectClone()">
                    🛒 Request Clone
                </button>
                <button class="btn btn-secondary" onclick="downloadProject('${project.github}')">
                    📥 Download Code
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function requestProjectClone() {
    showNotification('To request a clone of this project, please contact the creator.', 'info');
}

function downloadProject(githubUrl) {
    const pin = prompt("Please enter the secret PIN to download the project:");
    if (pin === "1234") {
        const downloadUrl = `${githubUrl}/archive/refs/heads/main.zip`;
        window.open(downloadUrl, '_blank');
        showNotification('Download started!', 'success');
    } else {
        showNotification('Invalid PIN. Download aborted.', 'error');
    }
}

function openRequestRepoModal() {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>Contact Creator</h2>
        </div>
        <div class="modal-content-body" style="text-align: center; padding: 30px;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">To request a similar repository or for any inquiries, please contact the creator at:</p>
            <h3 style="font-size: 1.5rem; color: var(--accent-color); margin-bottom: 30px; letter-spacing: 1px;">0792 618156</h3>
            <p style="margin-bottom: 20px;">You can view the source code for the original project on GitHub:</p>
            <a href="https://github.com/garymike07/myk" target="_blank" class="btn btn-primary">
                View on GitHub
            </a>
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
    const blogContainer = document.querySelector('.blog-posts-grid');
    if (!blogContainer) return;

    // Sort posts by date in descending order
    const sortedPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get the most recent post
    const recentPost = sortedPosts[0];

    if (recentPost) {
        blogContainer.innerHTML = `
            <article class="blog-post" onclick="openBlogModal(${recentPost.id})" style="cursor: pointer;">
                <div class="blog-post-image">${recentPost.image}</div>
                <div class="blog-post-content">
                    <h3 class="blog-post-title">${recentPost.title}</h3>
                    <p class="blog-post-excerpt">${recentPost.excerpt}</p>
                    <div class="blog-post-meta">
                        <span>${new Date(recentPost.date).toLocaleDateString()}</span>
                        <span>${recentPost.readTime}</span>
                    </div>
                </div>
            </article>
        `;
    }
}

function openBlogModal(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    // Simple markdown to HTML for paragraphs
    const formattedContent = post.content.split('\n\n').map(p => `<p>${p}</p>`).join('');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${post.title}</h2>
        </div>
        <div class="modal-content-body" style="padding-top: 20px;">
            <div class="blog-post-meta" style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-secondary); display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span><strong>By:</strong> ${post.author}</span> &bull;
                <span><strong>Date:</strong> ${new Date(post.date).toLocaleDateString()}</span> &bull;
                <span><strong>Read time:</strong> ${post.readTime}</span>
            </div>

            <div class="project-tech-stack" style="margin-bottom: 30px;">
                <h3>Tags</h3>
                <div class="tech-tags" style="margin-top: 10px;">
                    ${post.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            </div>

            <div class="blog-content-full" style="line-height: 1.8; color: var(--text-secondary);">
                ${formattedContent}
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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

function initBlogGenerator() {
    const titleInput = document.getElementById('blog-title');
    const authorInput = document.getElementById('blog-author');
    const contentInput = document.getElementById('blog-content');
    const templateSelector = document.getElementById('template-selector');
    const previewFrame = document.getElementById('blog-preview-frame');
    const downloadBtn = document.getElementById('download-html-btn');

    if (!titleInput) return; // Don't run if the generator elements aren't on the page

    let activeTemplate = 'minimalist';

    function parseMarkdown(text) {
        if (!text) return '';
        const toHtml = text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
            .split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
        return toHtml;
    }

    function getFullHtml(title, author, content, template) {
        const bodyClass = `template-${template}-body`;
        const htmlContent = parseMarkdown(content);

        let templateStructure = `
            <h1>${title}</h1>
            <div class="author">By ${author}</div>
            <div class="content">${htmlContent}</div>
        `;

        if (template === 'professional') {
            templateStructure = `
                <div class="container">
                    <main>
                        <h1>${title}</h1>
                        <div class="author">By ${author}</div>
                        <div class="content">${htmlContent}</div>
                    </main>
                    <aside class="sidebar">
                        <h3>About the Author</h3>
                        <p>${author} is a passionate writer and creator.</p>
                    </aside>
                </div>
            `;
        } else if (template === 'creative') {
            templateStructure = `
                <header class="header">
                    <h1>${title}</h1>
                    <p class="author">By ${author}</p>
                </header>
                <div class="content">${htmlContent}</div>
            `;
        }

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    /* Inlined styles for the template */
                    .template-minimalist-body { font-family: sans-serif; background-color: #fff; color: #333; line-height: 1.7; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .template-minimalist-body h1 { font-size: 2.5rem; margin-bottom: 20px; text-align: center; }
                    .template-minimalist-body .author { text-align: center; color: #888; margin-bottom: 40px; }
                    .template-minimalist-body p { margin-bottom: 20px; }

                    .template-professional-body { font-family: sans-serif; background-color: #f8f9fa; color: #212529; line-height: 1.6; margin: 0; padding: 0; }
                    .template-professional-body .container { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 3fr 1fr; gap: 30px; padding: 40px 20px; }
                    .template-professional-body h1 { font-size: 2.8rem; margin-bottom: 15px; color: #0056b3; }
                    .template-professional-body .author { color: #6c757d; margin-bottom: 30px; }
                    .template-professional-body .sidebar { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                    .template-professional-body .sidebar h3 { margin-bottom: 15px; }

                    .template-creative-body { font-family: sans-serif; background-color: #fff; color: #444; margin: 0; padding: 0; }
                    .template-creative-body .header { height: 400px; background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://via.placeholder.com/1200x400') no-repeat center center/cover; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
                    .template-creative-body .header h1 { font-size: 3.5rem; }
                    .template-creative-body .content { max-width: 800px; margin: 40px auto; padding: 0 20px; }

                    .template-developer-body { font-family: monospace; background-color: #0d1117; color: #c9d1d9; line-height: 1.6; padding: 40px; }
                    .template-developer-body h1 { font-size: 2.5rem; margin-bottom: 20px; color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 10px; }
                    .template-developer-body .author { color: #8b949e; margin-bottom: 30px; }
                    .template-developer-body code { background-color: #161b22; padding: 2px 4px; border-radius: 4px; }
                    .template-developer-body pre { background-color: #161b22; padding: 15px; border-radius: 8px; overflow-x: auto; }
                </style>
            </head>
            <body class="${bodyClass}">
                ${templateStructure}
            </body>
            </html>
        `;
    }

    function updateBlogPreview() {
        if (!previewFrame) return;
        const title = titleInput.value || 'Your Title Here';
        const author = authorInput.value || 'Anonymous';
        const content = contentInput.value || 'Your content will appear here.';
        const fullHtml = getFullHtml(title, author, content, activeTemplate);
        previewFrame.srcdoc = fullHtml;
    }

    function downloadHtmlFile() {
        const title = titleInput.value || 'blog-post';
        const author = authorInput.value || 'Anonymous';
        const content = contentInput.value || '';
        const fullHtml = getFullHtml(title, author, content, activeTemplate);
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    titleInput.addEventListener('input', updateBlogPreview);
    authorInput.addEventListener('input', updateBlogPreview);
    contentInput.addEventListener('input', updateBlogPreview);
    downloadBtn.addEventListener('click', downloadHtmlFile);

    templateSelector.addEventListener('click', (e) => {
        if (e.target.matches('.template-btn')) {
            templateSelector.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            activeTemplate = e.target.dataset.template;
            updateBlogPreview();
        }
    });

    updateBlogPreview(); // Initial call
}


// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId || 'project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize modal close functionality
function initModals() {
    // Close modal when clicking the close button
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            closeModal();
        });
    });

    // Close modal when clicking outside of it
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Make sure to call initModals in the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    initModals();
});

// Global object for external access
window.mikeSites = {
    openModal: openModal,
    closeModal: closeModal
};

