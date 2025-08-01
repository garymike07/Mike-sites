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
        // Filter buttons (now handled by main.js nav-btn for sections)
        // The project filter dropdown is still handled here
        const projectFilter = document.getElementById("project-filter");
        if (projectFilter) {
            projectFilter.addEventListener("change", (e) => {
                this.setFilter(e.target.value);
            });
        }

        // Category navigation (now handled by main.js nav-btn for sections)
        // No longer need to navigate to a separate projects page

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
        let filtered = this.projects;

        // Apply category filter from dropdown
        const projectFilter = document.getElementById("project-filter");
        if (projectFilter && projectFilter.value !== "all") {
            filtered = filtered.filter(project => project.category === projectFilter.value);
        }

        // Apply search query
        const projectSearch = document.getElementById("project-search");
        if (projectSearch && projectSearch.value) {
            const searchTerm = projectSearch.value.toLowerCase();
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        return filtered;
    }

    setFilter(filter) {
        // No longer setting this.currentFilter as filtering is done directly from DOM elements
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

        // Card click to open modal (except for portfolio which opens site directly)
        container.querySelectorAll('.project-card:not(.clickable)').forEach(card => {
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
        
        if (window.mikeSites) {
            window.mikeSites.openModal('project-modal');
        }
    }

    createProjectModalContent(project) {
        const liveButton = project.demo ? 
            `<a href="${project.demo}" target="_blank" class="btn btn-primary project-action-btn">
                <span>View Live Demo</span>
                <i class="fas fa-external-link-alt"></i>
            </a>` : 
            `<button class="btn btn-secondary project-action-btn" disabled>
                <span>Demo Not Available</span>
            </button>`;

        const githubButton = project.github ? 
            `<a href="${project.github}" target="_blank" class="cta-btn secondary">
                <span>View on GitHub</span>
                <i class="fab fa-github"></i>
            </a>` : '';

        const visitSiteButton = project.id === 2 ? 
            `<a href="${project.demo}" target="_blank" class="cta-btn primary">
                <span>Visit Portfolio Site</span>
                <i class="fas fa-external-link-alt"></i>
            </a>` : '';

        const projectDetails = project.completionDate && project.developedBy ?
            `<div class="modal-section">
                <h3>Project Details</h3>
                <p><strong>Completed on:</strong> ${project.completionDate}</p>
                <p><strong>Developed by:</strong> ${project.developedBy}</p>
            </div>` : '';

        const challengesSection = project.challenges ?
            `<div class="modal-section">
                <h3>Challenges Solved</h3>
                <p>${project.challenges}</p>
            </div>` : '';

          const screenshotsSection = project.screenshots && project.screenshots.length > 0 && project.id !== 2 ?
            `<div class="modal-section">
                <h3>Screenshots</h3>
                <div class="screenshot-gallery">
                    ${project.screenshots.map(screenshot => 
                        `<img src="images/${screenshot}" alt="${project.title} screenshot" class="screenshot">`
                    ).join("")}
                </div>
            </div>` : "";          <div class="project-modal-content">
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
                    <div class="tech-tags">
                        ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                ${challengesSection}
                
                ${screenshotsSection}
                
                <div class="modal-actions">
                    ${visitSiteButton}
                    ${liveButton}
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
        const message = index > -1 ? 
            `Removed "${project.title}" from favorites` : 
            `Added "${project.title}" to favorites`;
        
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

