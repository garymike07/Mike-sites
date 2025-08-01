// Mike Sites - Main JavaScript Functionality

document.addEventListener('DOMContentLoaded', () => {
    const app = new MikeSites();
    app.init();
});

class MikeSites {
    constructor() {
        this.projectManager = new ProjectManager();
    }

    init() {
        this.setupEventListeners();
        this.projectManager.renderAllProjects();
        this.showSection('home');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sectionId = e.target.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });

        // Project filtering and search
        const projectFilter = document.getElementById('project-filter');
        if (projectFilter) {
            projectFilter.addEventListener('change', () => this.projectManager.renderAllProjects());
        }

        const projectSearch = document.getElementById('project-search');
        if (projectSearch) {
            projectSearch.addEventListener('input', () => this.projectManager.renderAllProjects());
        }

        // Modal close button
        const closeButton = document.querySelector('.close-button');
        if(closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }
        
        // Close modal on overlay click
        const modalOverlay = document.querySelector('.modal-overlay');
        if(modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
    }

    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });
    }

    openModal(content) {
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalBody = document.getElementById('modal-body');
        if (modalOverlay && modalBody) {
            modalBody.innerHTML = content;
            modalOverlay.classList.add('active');
        }
    }

    closeModal() {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }
}
