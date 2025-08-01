// Mike Sites - Projects Management

class ProjectManager {
    constructor() {
        this.projects = [];
        this.favorites = this.loadFavorites();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadProjectData();
        this.setupEventListeners();
    }

    async loadProjectData() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.projects = data.projects || [];
            
            this.renderFeaturedProjects();
            this.renderAllProjects();
        } catch (error) {
            console.error('Error loading project data:', error);
            this.projects = this.getFallbackProjects();
            this.renderFeaturedProjects();
            this.renderAllProjects();
        }
    }

    getFallbackProjects() {
        return [
            {
                id: 1,
                title: "Personal Portfolio",
                category: "portfolio",
                status: "live",
                description: "Clean, minimalist portfolio website showcasing creative work with interactive elements and smooth transitions.",
                tags: ["HTML5", "CSS3", "JavaScript", "GSAP"],
                thumbnail: "images/1000023920.jpg",
                features: [
                    "Interactive animations",
                    "Project showcase gallery",
                    "Contact form",
                    "Blog integration",
                    "Dark/Light mode toggle"
                ],
                challenges: "Balancing visual appeal with fast loading times and accessibility.",
                github: "https://github.com/garymike07/portfolio",
                demo: "https://garymike07.github.io/myk/",
                screenshots: []
            },
            {
                id: 2,
                title: "SaaS Landing Page",
                category: "saas",
                status: "ongoing",
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
                github: "https://github.com/garymike07/myk",
                demo: "https://garymike07.github.io/myk/",
                screenshots: []
            }
        ];
    }

    setupEventListeners() {
        // Project filter dropdown
        const projectFilter = document.getElementById("project-filter");
        if (projectFilter) {
            projectFilter.addEventListener("change", (e) => {
                this.setFilter(e.target.value);
            });
        }

        // Project search
        const projectSearch = document.getElementById("project-search");
        if (projectSearch) {
            projectSearch.addEventListener("input", () => {
                this.renderAllProjects();
            });
        }
    }

    renderFeaturedProjects() {
        const container = document.getElementById('projects-scroll');
        if (!container) return;

        // Show first 4 projects as featured
        const featuredProjects = this.projects.slice(0, 4);
        container.innerHTML = featuredProjects.map(project => this.createProjectCard(project)).join('');
        
        this.attachProjectCardListeners(container);
    }

    renderAllProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        let filteredProjects = this.getFilteredProjects();

        // Sort projects by status: live, ongoing, concept
        const statusOrder = { 'live': 1, 'ongoing': 2, 'progress': 3, 'concept': 4 };
        filteredProjects.sort((a, b) => {
            const aOrder = statusOrder[a.status.toLowerCase()] || 5;
            const bOrder = statusOrder[b.status.toLowerCase()] || 5;
            return aOrder - bOrder;
        });

        if (filteredProjects.length === 0) {
            container.innerHTML = '<div class="no-projects">No projects found matching your criteria.</div>';
            return;
        }

        container.innerHTML = filteredProjects.map(project => this.createProjectCard(project)).join('');
        
        this.attachProjectCardListeners(container);
    }

    getFilteredProjects() {
        let filtered = [...this.projects];

        // Apply status filter from dropdown
        const projectFilter = document.getElementById("project-filter");
        if (projectFilter && projectFilter.value !== "all") {
            filtered = filtered.filter(project => 
                project.status && project.status.toLowerCase() === projectFilter.value.toLowerCase()
            );
        }

        // Apply search query
        const projectSearch = document.getElementById("project-search");
        if (projectSearch && projectSearch.value.trim()) {
            const searchTerm = projectSearch.value.toLowerCase().trim();
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }
        
        return filtered;
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderAllProjects();
    }

    createProjectCard(project) {
        const statusClass = project.status ? project.status.toLowerCase() : 'unknown';
        const thumbnail = project.thumbnail && project.thumbnail.startsWith('images/') 
            ? project.thumbnail 
            : (project.thumbnail && !project.thumbnail.includes('emoji') 
                ? project.thumbnail 
                : this.getProjectIcon(project.category));

        const demoLink = project.demo && project.demo !== '#' 
            ? `<a href="${project.demo}" target="_blank" class="btn btn-secondary">Live Demo</a>`
            : `<button class="btn btn-secondary" disabled>Demo Soon</button>`;

        return `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-thumbnail">
                    ${thumbnail.startsWith('images/') 
                        ? `<img src="${thumbnail}" alt="${project.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                        : `<div class="project-icon">${thumbnail}</div>`
                    }
                    <div class="project-icon-fallback" style="display: none;">${this.getProjectIcon(project.category)}</div>
                </div>
                <div class="project-content">
                    <span class="project-status status-${statusClass}">${project.status || 'Unknown'}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags ? project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('') : ''}
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-primary more-info-btn" data-project-id="${project.id}">
                            More Info
                        </button>
                        ${demoLink}
                    </div>
                </div>
            </div>
        `;
    }

    getProjectIcon(category) {
        const icons = {
            'saas': '🚀',
            'portfolio': '👨‍💻',
            'blog': '📝',
            'ecommerce': '🛒',
            'dashboard': '📊',
            'other': '🌐'
        };
        return icons[category] || '🌐';
    }

    attachProjectCardListeners(container) {
        // More info buttons
        container.querySelectorAll('.more-info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = parseInt(btn.getAttribute('data-project-id'));
                this.openProjectModal(projectId);
            });
        });

        // Card click (excluding buttons)
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn')) return;
                const projectId = parseInt(card.getAttribute('data-project-id'));
                this.openProjectModal(projectId);
            });
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modalContent = this.createProjectModalContent(project);
        
        // Use global MikeSites instance if available
        if (window.mikeSites) {
            window.mikeSites.openModal(modalContent);
        } else {
            // Fallback: directly manipulate modal
            const modalOverlay = document.querySelector('.modal-overlay');
            const modalBody = document.getElementById('modal-body');
            if (modalOverlay && modalBody) {
                modalBody.innerHTML = modalContent;
                modalOverlay.classList.add('active');
            }
        }
    }

    createProjectModalContent(project) {
        const demoButton = project.demo && project.demo !== '#' 
            ? `<a href="${project.demo}" target="_blank" class="btn btn-primary">
                <span>View Live Demo</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m7 7 10 10-5 0 0-10"/>
                    <path d="m13 7 8 0 0 8"/>
                </svg>
            </a>` 
            : `<button class="btn btn-secondary" disabled>Demo Coming Soon</button>`;

        const githubButton = project.github && project.github !== '#'
            ? `<a href="${project.github}" target="_blank" class="btn btn-secondary">
                <span>View on GitHub</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>` 
            : '';

        const projectDetails = project.completionDate || project.developedBy
            ? `<div class="modal-section">
                <h3>Project Details</h3>
                ${project.completionDate ? `<p><strong>Completed:</strong> ${project.completionDate}</p>` : ''}
                ${project.developedBy ? `<p><strong>Developer:</strong> ${project.developedBy}</p>` : ''}
            </div>`
            : '';

        const challengesSection = project.challenges
            ? `<div class="modal-section">
                <h3>Challenges Solved</h3>
                <p>${project.challenges}</p>
            </div>`
            : '';

        const thumbnail = project.thumbnail && project.thumbnail.startsWith('images/')
            ? `<img src="${project.thumbnail}" alt="${project.title}" class="modal-image">`
            : `<div class="modal-icon">${this.getProjectIcon(project.category)}</div>`;

        return `
            <div class="project-modal-content">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <span class="project-status status-${project.status ? project.status.toLowerCase() : 'unknown'}">${project.status || 'Unknown'}</span>
                </div>
                
                <div class="modal-section">
                    ${thumbnail}
                </div>
                
                ${projectDetails}

                <div class="modal-section">
                    <h3>Description</h3>
                    <p>${project.description}</p>
                </div>
                
                ${project.features && project.features.length > 0 ? `
                <div class="modal-section">
                    <h3>Key Features</h3>
                    <ul class="feature-list">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${project.tags && project.tags.length > 0 ? `
                <div class="modal-section">
                    <h3>Technology Stack</h3>
                    <div class="tech-tags">
                        ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${challengesSection}
                
                <div class="modal-actions">
                    ${demoButton}
                    ${githubButton}
                </div>
            </div>
        `;
    }

    toggleFavorite(projectId, button) {
        const index = this.favorites.indexOf(projectId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            button.classList.remove('favorited');
        } else {
            this.favorites.push(projectId);
            button.classList.add('favorited');
        }
        
        this.saveFavorites();
        
        // Show notification
        const project = this.projects.find(p => p.id === projectId);
        const message = index > -1 
            ? `Removed "${project.title}" from favorites` 
            : `Added "${project.title}" to favorites`;
        
        console.log(message);
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem('mikeSites_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('mikeSites_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    searchProjects(query) {
        const searchTerm = query.toLowerCase();
        return this.projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    }

    getProjectsByCategory(category) {
        return this.projects.filter(project => project.category === category);
    }

    getProjectsByStatus(status) {
        return this.projects.filter(project => project.status === status);
    }
}

// Make ProjectManager available globally
window.ProjectManager = ProjectManager;


// Add view source button functionality to project modal
document.addEventListener('DOMContentLoaded', function() {
    // Override the openProjectModal method to include source code viewer
    if (window.ProjectManager) {
        const originalOpenModal = ProjectManager.prototype.openProjectModal;
        
        ProjectManager.prototype.openProjectModal = function(projectId) {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) return;

            // Call original modal opening
            originalOpenModal.call(this, projectId);
            
            // Add source code viewer functionality after modal is opened
            setTimeout(() => {
                const viewSourceBtn = document.getElementById('view-source-btn');
                if (viewSourceBtn && window.sourceCodeViewer) {
                    viewSourceBtn.addEventListener('click', () => {
                        window.sourceCodeViewer.show(project);
                        // Close the project modal
                        const modalOverlay = document.querySelector('.modal-overlay');
                        if (modalOverlay) {
                            modalOverlay.classList.remove('active');
                        }
                    });
                }
            }, 100);
        };
    }
});

// Make source code viewer globally accessible
window.sourceCodeViewer = null;
document.addEventListener('DOMContentLoaded', function() {
    if (typeof SourceCodeViewer !== 'undefined') {
        window.sourceCodeViewer = new SourceCodeViewer();
    }
});

