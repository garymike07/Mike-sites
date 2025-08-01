class RequestFormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {};

        this.modal = document.getElementById('request-project-modal');
        this.closeButton = document.getElementById('close-request-modal');
        this.openButton = document.getElementById('request-project-btn');

        this.progressBar = this.modal.querySelector('.progress-bar');
        this.progressText = this.modal.querySelector('#progress-text');
        this.contentContainer = this.modal.querySelector('.form-wizard-content');

        this.prevBtn = document.getElementById('prev-step-btn');
        this.nextBtn = document.getElementById('next-step-btn');
        this.sendBtn = document.getElementById('send-request-btn');

        this.init();
    }

    init() {
        this.addEventListeners();
        this.renderStepContent();
        this.updateProgress();
    }

    addEventListeners() {
        this.openButton?.addEventListener('click', () => this.showModal());
        this.closeButton?.addEventListener('click', () => this.hideModal());
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        this.prevBtn?.addEventListener('click', () => this.changeStep(-1));
        this.nextBtn?.addEventListener('click', () => this.changeStep(1));
        this.sendBtn?.addEventListener('click', () => this.handleSendRequest());

        // Use event delegation for dynamically added content
        this.contentContainer.addEventListener('click', (e) => {
            if (e.target.closest('.selection-card')) {
                this.handleCardSelection(e.target.closest('.selection-card'));
            }
        });
    }

    showModal() {
        this.modal.classList.add('active');
    }

    hideModal() {
        this.modal.classList.remove('active');
    }

    changeStep(direction) {
        const newStep = this.currentStep + direction;
        if (newStep > 0 && newStep <= this.totalSteps) {
            this.currentStep = newStep;
            this.renderStepContent();
            this.updateProgress();
        }
    }

    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
        this.progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;

        this.prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
        this.nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
        this.sendBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
    }

    renderStepContent() {
        let content = '';
        switch (this.currentStep) {
            case 1:
                content = this.getStep1HTML();
                break;
            case 2:
                content = this.getStep2HTML();
                break;
            case 3:
                content = this.getStep3HTML();
                break;
            case 4:
                content = this.getStep4HTML();
                break;
            case 5:
                content = this.getStep5HTML();
                break;
        }
        this.contentContainer.innerHTML = content;
        this.restoreStepData();
    }

    getStep1HTML() {
        return `
            <div class="form-step active">
                <h3>What type of project do you need?</h3>
                <div class="selection-grid">
                    <div class="selection-card" data-value="Website/Landing Page"><div class="icon">🌐</div>Website/Landing Page</div>
                    <div class="selection-card" data-value="E-commerce Store"><div class="icon">🛒</div>E-commerce Store</div>
                    <div class="selection-card" data-value="Web Application"><div class="icon">💻</div>Web Application</div>
                    <div class="selection-card" data-value="Mobile App"><div class="icon">📱</div>Mobile App</div>
                    <div class="selection-card" data-value="SaaS Platform"><div class="icon">☁️</div>SaaS Platform</div>
                    <div class="selection-card" data-value="Portfolio/Blog"><div class="icon">👤</div>Portfolio/Blog</div>
                    <div class="selection-card" data-value="Custom Software"><div class="icon">⚙️</div>Custom Software</div>
                    <div class="selection-card" data-value="API Development"><div class="icon">🗃️</div>API Development</div>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <label for="other-project-type">Other:</label>
                    <input type="text" id="other-project-type" name="other_project_type" class="form-control">
                </div>
            </div>
        `;
    }

    getStep2HTML() {
        // This would be more dynamic based on step 1 selections in a real app
        return `
            <div class="form-step active">
                <h3>What features do you need?</h3>
                <div class="form-group">
                    <label>For Websites/Landing Pages:</label>
                    <div class="checkbox-grid">
                        <label><input type="checkbox" name="features" value="Contact forms"> Contact forms</label>
                        <label><input type="checkbox" name="features" value="Blog/News section"> Blog/News section</label>
                        <label><input type="checkbox" name="features" value="SEO optimization"> SEO optimization</label>
                        <label><input type="checkbox" name="features" value="Multi-language support"> Multi-language support</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>For E-commerce:</label>
                    <div class="checkbox-grid">
                        <label><input type="checkbox" name="features" value="Product catalog"> Product catalog</label>
                        <label><input type="checkbox" name="features" value="Shopping cart"> Shopping cart</label>
                        <label><input type="checkbox" name="features" value="Payment gateway"> Payment gateway</label>
                        <label><input type="checkbox" name="features" value="Inventory management"> Inventory management</label>
                    </div>
                </div>
            </div>
        `;
    }

    getStep3HTML() {
        return `
            <div class="form-step active">
                <h3>Project timeline and budget</h3>
                <div class="form-group">
                    <label>Timeline:</label>
                    <div class="radio-group">
                        <label><input type="radio" name="timeline" value="Rush (1-2 weeks)"> Rush (1-2 weeks)</label>
                        <label><input type="radio" name="timeline" value="Standard (3-4 weeks)"> Standard (3-4 weeks)</label>
                        <label><input type="radio" name="timeline" value="Extended (5-8 weeks)"> Extended (5-8 weeks)</label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Budget (KES):</label>
                    <div class="radio-group">
                        <label><input type="radio" name="budget" value="15,000 - 50,000"> 15,000 - 50,000</label>
                        <label><input type="radio" name="budget" value="50,000 - 150,000"> 50,000 - 150,000</label>
                        <label><input type="radio" name="budget" value="150,000 - 350,000"> 150,000 - 350,000</label>
                        <label><input type="radio" name="budget" value="350,000+"> 350,000+</label>
                    </div>
                </div>
            </div>
        `;
    }

    getStep4HTML() {
        return `
            <div class="form-step active">
                <h3>Tell us more about your project</h3>
                <div class="form-group">
                    <label for="full-name">Full Name</label>
                    <input type="text" id="full-name" name="full_name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="description">Project Description</label>
                    <textarea id="description" name="description" rows="5"></textarea>
                </div>
            </div>
        `;
    }

    getStep5HTML() {
        // Summary step
        const summary = this.getSummary();
        return `
            <div class="form-step active">
                <h3>Request Summary</h3>
                <div class="summary-content">
                    <p><strong>Project Types:</strong> ${summary.project_types}</p>
                    <p><strong>Features:</strong> ${summary.features}</p>
                    <p><strong>Timeline:</strong> ${summary.timeline}</p>
                    <p><strong>Budget:</strong> ${summary.budget}</p>
                    <p><strong>Name:</strong> ${summary.full_name}</p>
                    <p><strong>Email:</strong> ${summary.email}</p>
                    <p><strong>Description:</strong> ${summary.description}</p>
                </div>
            </div>
        `;
    }

    saveStepData() {
        const stepContainer = this.contentContainer.querySelector('.form-step');
        if (!stepContainer) return;

        const inputs = stepContainer.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) {
                    if (!this.formData[input.name]) {
                        this.formData[input.name] = [];
                    }
                    if (!this.formData[input.name].includes(input.value)) {
                        this.formData[input.name].push(input.value);
                    }
                } else {
                    if (this.formData[input.name] && this.formData[input.name].includes(input.value)) {
                        this.formData[input.name] = this.formData[input.name].filter(v => v !== input.value);
                    }
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    restoreStepData() {
        const stepContainer = this.contentContainer.querySelector('.form-step');
        if (!stepContainer) return;

        const inputs = stepContainer.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (this.formData[input.name]) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    if (this.formData[input.name].includes(input.value)) {
                        input.checked = true;
                    }
                } else {
                    input.value = this.formData[input.name];
                }
            }
        });

        // For card selection in step 1
        if (this.currentStep === 1) {
            const selectedTypes = this.formData['project_types'] || [];
            this.contentContainer.querySelectorAll('.selection-card').forEach(card => {
                if (selectedTypes.includes(card.dataset.value)) {
                    card.classList.add('selected');
                }
            });
        }
    }

    changeStep(direction) {
        if (direction > 0) {
            this.saveStepData();
        }

        const newStep = this.currentStep + direction;
        if (newStep > 0 && newStep <= this.totalSteps) {
            this.currentStep = newStep;
            this.renderStepContent();
            this.updateProgress();
        }
    }

    getSummary() {
        return {
            project_types: this.formData['project_types']?.join(', ') || 'N/A',
            features: this.formData['features']?.join(', ') || 'N/A',
            timeline: this.formData['timeline']?.[0] || 'N/A',
            budget: this.formData['budget']?.[0] || 'N/A',
            full_name: this.formData['full_name'] || 'N/A',
            email: this.formData['email'] || 'N/A',
            description: this.formData['description'] || 'N/A',
        };
    }

    handleCardSelection(card) {
        const fieldName = 'project_types';
        this.formData[fieldName] = this.formData[fieldName] || [];
        const value = card.dataset.value;

        if (this.formData[fieldName].includes(value)) {
            // Deselect
            this.formData[fieldName] = this.formData[fieldName].filter(item => item !== value);
            card.classList.remove('selected');
        } else {
            // Select
            this.formData[fieldName].push(value);
            card.classList.add('selected');
        }
    }

    handleSendRequest() {
        const summary = this.getSummary();
        const subject = `Custom Project Request - ${summary.project_types} - ${summary.full_name}`;
        const body = `
Hi Mike,

I would like to request a custom project with the following specifications:

PROJECT TYPE: ${summary.project_types}
FEATURES REQUIRED: ${summary.features}
TIMELINE: ${summary.timeline}
BUDGET RANGE: ${summary.budget}

PROJECT DESCRIPTION:
${summary.description}

CONTACT INFORMATION:
Name: ${summary.full_name}
Email: ${summary.email}

Best regards,
${summary.full_name}
        `;

        const mailtoLink = `mailto:wrootmike@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        this.hideModal();
        // Optionally, reset the form
        this.currentStep = 1;
        this.formData = {};
        this.renderStepContent();
        this.updateProgress();
    }

    restoreStepData() {
        if (this.currentStep === 1) {
            const selectedTypes = this.formData['project_types'] || [];
            this.contentContainer.querySelectorAll('.selection-card').forEach(card => {
                if (selectedTypes.includes(card.dataset.value)) {
                    card.classList.add('selected');
                }
            });
        }
    }
}
