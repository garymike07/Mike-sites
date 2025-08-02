// Mike Sites - Projects Management

class ProjectManager {
    constructor() {
        this.projects = [];
        this.favorites = this.loadFavorites();
        this.currentFilter = 'all';
        this.currentTechFilter = '';
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
            console.log('Projects loaded:', this.projects.length);
        } catch (error) {
            console.error('Error loading project data:', error);
            this.projects = this.getFallbackProjects();
            console.log('Using fallback projects:', this.projects.length);
        }
        
        // Always render after loading data
        this.renderFeaturedProjects();
        this.renderAllProjects();
        this.renderHomeProjects();
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
        // Project filter dropdown - Projects section
        const projectFilter = document.getElementById("project-filter");
        if (projectFilter) {
            projectFilter.addEventListener("change", (e) => {
                this.setFilter(e.target.value);
            });
        }

        // Project search - Projects section
        const projectSearch = document.getElementById("project-search");
        if (projectSearch) {
            projectSearch.addEventListener("input", () => {
                this.renderAllProjects();
            });
        }

        // Home section filter dropdown
        const homeProjectFilter = document.getElementById("home-project-filter");
        if (homeProjectFilter) {
            homeProjectFilter.addEventListener("change", (e) => {
                this.setHomeFilter(e.target.value);
            });
        }

        // Home section search
        const homeProjectSearch = document.getElementById("home-project-search");
        if (homeProjectSearch) {
            homeProjectSearch.addEventListener("input", () => {
                this.renderHomeProjects();
            });
        }

        // Clear filters button
        this.addClearFiltersButton();
    }

    renderHomeProjects() {
        const container = document.getElementById('home-projects-grid');
        if (!container) return;

        let filteredProjects = this.getHomeFilteredProjects();

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

        // Show first 6 projects on home page
        const homeProjects = filteredProjects.slice(0, 6);
        container.innerHTML = homeProjects.map(project => this.createProjectCard(project, true)).join('');
        
        this.attachProjectCardListeners(container);
    }

    getHomeFilteredProjects() {
        let filtered = [...this.projects];

        // Apply category filter from home dropdown
        const homeProjectFilter = document.getElementById("home-project-filter");
        if (homeProjectFilter && homeProjectFilter.value !== "all") {
            filtered = filtered.filter(project => 
                project.category && project.category.toLowerCase() === homeProjectFilter.value.toLowerCase()
            );
        }

        // Apply search query from home search
        const homeProjectSearch = document.getElementById("home-project-search");
        if (homeProjectSearch && homeProjectSearch.value.trim()) {
            const searchTerm = homeProjectSearch.value.toLowerCase().trim();
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        // Apply technology filter if set
        if (this.currentTechFilter) {
            filtered = filtered.filter(project => 
                project.tags && project.tags.some(tag => 
                    tag.toLowerCase().includes(this.currentTechFilter.toLowerCase())
                )
            );
        }
        
        // Apply technology filter if set
        if (this.currentTechFilter) {
            filtered = filtered.filter(project =>
                project.tags && project.tags.some(tag =>
                    tag.toLowerCase().includes(this.currentTechFilter.toLowerCase())
                )
            );
        }

        return filtered;
    }

    setHomeFilter(filter) {
        this.renderHomeProjects();
    }

    setTechFilter(tech) {
        this.currentTechFilter = tech;
        this.renderAllProjects();
        this.renderHomeProjects();
        
        // Show visual feedback
        this.showFilterFeedback(`Filtering by: ${tech}`);
    }

    clearAllFilters() {
        this.currentFilter = 'all';
        this.currentTechFilter = '';
        
        // Reset dropdowns
        const projectFilter = document.getElementById("project-filter");
        if (projectFilter) projectFilter.value = 'all';
        
        const homeProjectFilter = document.getElementById("home-project-filter");
        if (homeProjectFilter) homeProjectFilter.value = 'all';
        
        // Clear search boxes
        const projectSearch = document.getElementById("project-search");
        if (projectSearch) projectSearch.value = '';
        
        const homeProjectSearch = document.getElementById("home-project-search");
        if (homeProjectSearch) homeProjectSearch.value = '';
        
        // Re-render
        this.renderAllProjects();
        this.renderHomeProjects();
        
        this.showFilterFeedback('All filters cleared');
    }

    showFilterFeedback(message) {
        // Create or update filter feedback element
        let feedback = document.getElementById('filter-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'filter-feedback';
            feedback.className = 'filter-feedback';
            document.body.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    }

    addClearFiltersButton() {
        // Add clear filters button to both sections
        const projectControls = document.querySelector('#projects .project-controls');
        if (projectControls && !projectControls.querySelector('.clear-filters-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'btn btn-secondary clear-filters-btn';
            clearBtn.textContent = 'Clear Filters';
            clearBtn.addEventListener('click', () => this.clearAllFilters());
            projectControls.appendChild(clearBtn);
        }

        const homeProjectControls = document.querySelector('#home .project-controls');
        if (homeProjectControls && !homeProjectControls.querySelector('.clear-filters-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'btn btn-secondary clear-filters-btn';
            clearBtn.textContent = 'Clear Filters';
            clearBtn.addEventListener('click', () => this.clearAllFilters());
            homeProjectControls.appendChild(clearBtn);
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
        console.log('renderAllProjects called, projects count:', this.projects.length);
        const container = document.getElementById('projects-grid');
        if (!container) {
            console.error('projects-grid container not found');
            return;
        }

        let filteredProjects = this.getFilteredProjects();
        console.log('Filtered projects count:', filteredProjects.length);

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

        const projectsHTML = filteredProjects.map(project => this.createProjectCard(project)).join('');
        container.innerHTML = projectsHTML;
        console.log('Projects rendered to container');
        
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

    createProjectCard(project, isHome = false) {
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
                        ${project.tags ? project.tags.map(tag => `<span class="project-tag tech-filter-tag" data-tech="${tag}">${tag}</span>`).join('') : ''}
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-primary more-info-btn" data-project-id="${project.id}">
                            More Info
                        </button>
                        ${demoLink}
                        <button class="btn btn-secondary source-code-btn" data-project-id="${project.id}">
                            Source Code
                        </button>
                        <button class="btn btn-cta add-to-cart-btn" data-project-id="${project.id}">
                            Add to Cart
                        </button>
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
            'other': '🌐',
            'ai-tool': '🤖',
            'fintech': '💰',
            'mobile-app': '📱',
            'social-platform': '🤝'
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

        // Source Code buttons
        container.querySelectorAll('.source-code-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = parseInt(btn.getAttribute('data-project-id'));
                const project = this.projects.find(p => p.id === projectId);
                if (project && window.sourceCodeViewer) {
                    window.sourceCodeViewer.show(project);
                }
            });
        });

        // Tech tag filtering
        container.querySelectorAll('.tech-filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                const tech = tag.getAttribute('data-tech');
                this.setTechFilter(tech);
            });
        });

        // Card click (excluding buttons and tags)
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn') || e.target.closest('.tech-filter-tag')) return;
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
        }
    }

    createProjectModalContent(project) {
        const featuresList = project.features ? project.features.map(feature => `<li>${feature}</li>`).join('') : '';
        const screenshotsHtml = project.screenshots && project.screenshots.length > 0 
            ? `<div class="modal-section">
                <h3>Screenshots</h3>
                <div class="screenshots-grid">
                    ${project.screenshots.map(screenshot => `<img src="images/${screenshot}" alt="${project.title} Screenshot" class="modal-image">`).join('')}
                </div>
            </div>`
            : '';

        const githubLink = project.github && project.github !== '#' 
            ? `<a href="${project.github}" target="_blank" class="btn btn-secondary">View on GitHub</a>`
            : '';
        const demoLink = project.demo && project.demo !== '#' 
            ? `<a href="${project.demo}" target="_blank" class="btn btn-primary">Live Demo</a>`
            : '';

        return `
            <button class="close-button" id="close-modal">&times;</button>
            <div class="modal-header">
                <h2>${project.title}</h2>
                <span class="project-status status-${project.status.toLowerCase()}">${project.status}</span>
            </div>
            <div class="modal-section">
                <h3>Description</h3>
                <p class="modal-description">${project.description}</p>
            </div>
            <div class="modal-section">
                <h3>Technologies Used</h3>
                <div class="modal-tags">
                    ${project.tags ? project.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
            ${featuresList ? `<div class="modal-section"><h3>Key Features</h3><ul>${featuresList}</ul></div>` : ''}
            ${project.challenges ? `<div class="modal-section"><h3>Challenges & Solutions</h3><p>${project.challenges}</p></div>` : ''}
            ${screenshotsHtml}
            <div class="modal-actions">
                ${githubLink}
                ${demoLink}
            </div>
        `;
    }

    loadFavorites() {
        try {
            const favorites = localStorage.getItem('mikeSites_favorites');
            return favorites ? JSON.parse(favorites) : [];
        } catch (e) {
            console.error('Error loading favorites from localStorage', e);
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('mikeSites_favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(projectId) {
        const index = this.favorites.indexOf(projectId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(projectId);
        }
        this.saveFavorites();
        this.renderAllProjects(); // Re-render to update favorite status
    }
}



