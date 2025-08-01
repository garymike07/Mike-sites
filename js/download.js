class DownloadManager {
    constructor() {
        this.secretKey = "Shutters500#";
        this.projectToDownload = null;
        this.projectData = [];
        this.init();
    }

    async init() {
        await this.fetchProjectData();
        this.addEventListeners();
    }

    async fetchProjectData() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            this.projectData = data.projects || [];
        } catch (error) {
            console.error("Could not fetch project data for download:", error);
        }
    }

    addEventListeners() {
        // Event delegation for download buttons inside the cart
        document.getElementById('cart-items-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('download-item-btn')) {
                const projectId = parseInt(e.target.dataset.projectId);
                this.showModal(projectId);
            }
        });

        // Modal event listeners
        document.getElementById('submit-secret-key-btn')?.addEventListener('click', () => this.handleDownload());
        document.getElementById('close-download-modal')?.addEventListener('click', () => this.hideModal());
        document.getElementById('secure-download-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'secure-download-modal') {
                this.hideModal();
            }
        });
    }

    showModal(projectId) {
        this.projectToDownload = this.projectData.find(p => p.id === projectId);
        if (!this.projectToDownload) {
            console.error("Project not found for download");
            return;
        }

        document.getElementById('download-project-name').textContent = this.projectToDownload.title;
        document.getElementById('secure-download-modal').classList.add('active');
        document.getElementById('download-error').style.display = 'none';
        document.getElementById('request-access-section').style.display = 'none';
        document.getElementById('secret-key').value = '';
    }

    hideModal() {
        document.getElementById('secure-download-modal').classList.remove('active');
    }

    handleDownload() {
        const inputKey = document.getElementById('secret-key').value;
        if (inputKey === this.secretKey) {
            this.hideModal();
            this.generateZip(this.projectToDownload);
            window.cart.showNotification('Access granted! Downloading...', 'success');
        } else {
            document.getElementById('download-error').style.display = 'block';
            const requestSection = document.getElementById('request-access-section');
            requestSection.style.display = 'block';

            const requestLink = document.getElementById('request-access-key-link');
            const projectName = this.projectToDownload.title;
            requestLink.href = `mailto:wrootmike@gmail.com?subject=Source Code Access Request - ${projectName}&body=Hi Mike, I'd like to request access to download the source code for the project: ${projectName}.`;
        }
    }

    generateZip(project) {
        const zip = new JSZip();

        // Use the same code generation logic as the source code viewer
        const sourceCodeViewer = window.sourceCodeViewer;
        if (sourceCodeViewer) {
            const htmlContent = sourceCodeViewer.generateHTML(project);
            const cssContent = sourceCodeViewer.generateCSS(project);
            const jsContent = sourceCodeViewer.generateJS(project);

            zip.file("index.html", htmlContent);
            zip.file("styles.css", cssContent);
            zip.file("script.js", jsContent);

            zip.generateAsync({ type: "blob" })
                .then(function(content) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = `${project.title.replace(/\s+/g, '-')}-source-code.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
        }
    }
}
