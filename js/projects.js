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
            const data = await response.json();
            this.projects = data.projects;
            
            this.renderFeaturedProjects();
            this.renderAllProjects();
        } catch (error) {
            console.error('Error loading project data:', error);
            this.projects = [];
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.getAttribute('data-filter'));
            });
        });

        // Category navigation
        document.querySelectorAll('[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('data-category');
                this.setFilter(category);
                // Navigate to projects page
                if (window.mikeSites) {
                    window.mikeSites.navigateToPage('projects');
                }
            });
        });
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

        const filteredProjects = this.getFilteredProjects();
        container.innerHTML = filteredProjects.map(project => this.createProjectCard(project)).join('');
        
        this.attachProjectCardListeners(container);
    }

    getFilteredProjects() {
        if (this.currentFilter === 'all') {
            return this.projects;
        }
        
        return this.projects.filter(project => {
            if (this.currentFilter === 'live' || this.currentFilter === 'ongoing' || this.currentFilter === 'concept') {
                return project.status === this.currentFilter;
            }
            return project.category === this.currentFilter;
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        this.renderAllProjects();
    }

    createProjectCard(project) {
        const isFavorited = this.favorites.includes(project.id);
        const statusClass = project.status.toLowerCase();
        const isPortfolio = project.id === 2; // Personal Portfolio project
        const clickableClass = isPortfolio ? ' clickable' : '';
        const clickableAttribute = isPortfolio ? `style="cursor:pointer;" onclick="window.open('${project.demo}', '_blank')"` : '';

        return `
            <div class="project-card${clickableClass}" data-project-id="${project.id}" ${clickableAttribute}>
                <div class="project-thumbnail">
                    <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
                    <div class="project-status ${statusClass}">${project.status}</div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-actions">
                        <button class="more-info-btn" data-project-id="${project.id}">
                            More Info
                        </button>
                        ${isPortfolio ? `<button class="visit-site-btn" onclick="window.open('${project.demo}', '_blank')">Visit Site</button>` : ''}
                        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-project-id="${project.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
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

        // Favorite buttons
        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = parseInt(btn.getAttribute('data-project-id'));
                this.toggleFavorite(projectId, btn);
            });
        });

        // Card click to open modal
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = parseInt(card.getAttribute('data-project-id'));
                this.openProjectModal(projectId);
            });
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modalBody = document.getElementById('modal-body');
        if (!modalBody) return;

        modalBody.innerHTML = this.createProjectModalContent(project);

        if (project.id === 1) {
            const requestRepoBtn = document.getElementById('request-repo-btn');
            if (requestRepoBtn) {
                requestRepoBtn.addEventListener('click', () => {
                    if (confirm('Contact creator at 0792 618156.')) {
                        window.open('https://github.com/garymike07/myk', '_blank');
                    }
                });
            }
        }
        
        if (window.mikeSites) {
            window.mikeSites.openModal('project-modal');
        }
    }

    createProjectModalContent(project) {
        const liveButton = project.liveUrl ? 
            `<a href="${project.liveUrl}" target="_blank" class="cta-btn primary">
                <span>View Live Demo</span>
                <i class="fas fa-external-link-alt"></i>
            </a>` : '';

        const githubButton = project.githubUrl ? 
            `<a href="${project.githubUrl}" target="_blank" class="cta-btn secondary">
                <span>View on GitHub</span>
                <i class="fab fa-github"></i>
            </a>` : '';

        const requestRepoButton = project.id === 1 ?
            `<button id="request-repo-btn" class="cta-btn secondary">
                <span>Request similar repo</span>
            </button>` : '';

        const clientFeedback = project.clientFeedback ? 
            `<div class="modal-section">
                <h3>Client Feedback</h3>
                <blockquote class="client-quote">
                    "${project.clientFeedback}"
                </blockquote>
            </div>` : '';

        const projectDetails = project.completionDate && project.developer ?
            `<div class="modal-section">
                <h3>Project Details</h3>
                <p><strong>Completed on:</strong> ${project.completionDate}</p>
                <p><strong>Developed by:</strong> ${project.developer}</p>
            </div>` : '';

        return `
            <div class="project-modal-content">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <div class="project-status ${project.status}">${project.status}</div>
                </div>
                
                <div class="modal-section">
                    <img src="${project.thumbnail}" alt="${project.title}" class="modal-image">
                </div>
                
                ${projectDetails}

                <div class="modal-section">
                    <h3>Description</h3>
                    <p>${project.description}</p>
                </div>
                
                <div class="modal-section">
                    <h3>Key Features</h3>
                    <ul class="feature-list">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3>Technology Stack</h3>
                    <div class="tech-stack-grid">
                        <div class="tech-category">
                            <h4>Frontend</h4>
                            <div class="tech-tags">
                                ${project.techStack.frontend.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                        <div class="tech-category">
                            <h4>Backend</h4>
                            <div class="tech-tags">
                                ${project.techStack.backend.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                        <div class="tech-category">
                            <h4>Deployment</h4>
                            <div class="tech-tags">
                                ${project.techStack.deployment.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Challenges Solved</h3>
                    <p>${project.challenges}</p>
                </div>
                
                ${clientFeedback}
                
                <div class="modal-section">
                    <h3>Screenshots</h3>
                    <div class="screenshot-gallery">
                        ${project.screenshots.map(screenshot => 
                            `<img src="${screenshot}" alt="${project.title} screenshot" class="screenshot">`
                        ).join('')}
                    </div>
                </div>
                
                <div class="modal-actions">
                    ${liveButton}
                    ${githubButton}
                    ${requestRepoButton}
                </div>
            </div>
            
            <style>
                .project-card.clickable:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }
                .project-modal-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-xl);
                    padding-bottom: var(--spacing-lg);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .modal-header h2 {
                    font-size: var(--font-size-2xl);
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .modal-section {
                    margin-bottom: var(--spacing-xl);
                }
                
                .modal-section h3 {
                    font-size: var(--font-size-lg);
                    font-weight: 600;
                    margin-bottom: var(--spacing-md);
                    color: var(--text-primary);
                }
                
                .modal-image {
                    width: 100%;
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-md);
                }
                
                .feature-list {
                    list-style: none;
                    padding: 0;
                }
                
                .feature-list li {
                    padding: var(--spacing-sm) 0;
                    border-bottom: 1px solid var(--border-color);
                    position: relative;
                    padding-left: var(--spacing-lg);
                }
                
                .feature-list li:before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--accent-primary);
                    font-weight: bold;
                }
                
                .tech-stack-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-lg);
                }
                
                .tech-category h4 {
                    font-size: var(--font-size-base);
                    font-weight: 600;
                    margin-bottom: var(--spacing-sm);
                    color: var(--text-primary);
                }
                
                .tech-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-xs);
                }
                
                .tech-tag {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    border-radius: var(--border-radius);
                    font-size: var(--font-size-xs);
                    font-weight: 500;
                }
                
                .client-quote {
                    font-style: italic;
                    font-size: var(--font-size-lg);
                    color: var(--text-secondary);
                    border-left: 4px solid var(--accent-primary);
                    padding-left: var(--spacing-lg);
                    margin: var(--spacing-lg) 0;
                }
                
                .screenshot-gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--spacing-md);
                }
                
                .screenshot {
                    width: 100%;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-sm);
                    transition: transform var(--transition-fast);
                    cursor: pointer;
                }
                
                .screenshot:hover {
                    transform: scale(1.05);
                }
                
                .modal-actions {
                    display: flex;
                    gap: var(--spacing-md);
                    justify-content: center;
                    margin-top: var(--spacing-xl);
                    padding-top: var(--spacing-lg);
                    border-top: 1px solid var(--border-color);
                }
                
                @media (max-width: 768px) {
                    .modal-actions {
                        flex-direction: column;
                    }
                    
                    .tech-stack-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .screenshot-gallery {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
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
        const message = index > -1 ? 
            `Removed "${project.title}" from favorites` : 
            `Added "${project.title}" to favorites`;
        
        if (window.mikeSites) {
            window.mikeSites.showNotification(message, 'success');
        }
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

    loadProjects() {
        // This method is called when navigating to projects page
        this.renderAllProjects();
    }

    searchProjects(query) {
        const searchTerm = query.toLowerCase();
        return this.projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    getProjectsByCategory(category) {
        return this.projects.filter(project => project.category === category);
    }

    getProjectsByStatus(status) {
        return this.projects.filter(project => project.status === status);
    }
}

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ProjectManager = new ProjectManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectManager;
}

