// Enhanced Request Form Manager with Multi-Step Wizard

class EnhancedRequestFormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            projectTypes: [],
            features: [],
            timeline: '',
            budget: '',
            description: '',
            contact: {},
            additionalNotes: ''
        };

        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
        this.loadFormData();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal request-project-modal';
        modal.id = 'request-project-modal';
        modal.innerHTML = `
            <div class="modal-content request-modal-content">
                <div class="modal-header">
                    <h2>Request Custom Project</h2>
                    <button class="close-modal" id="close-request-modal">&times;</button>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <div class="progress-text" id="progress-text">Step 1 of 4</div>
                </div>

                <div class="form-wizard-content" id="form-wizard-content">
                    <!-- Step content will be dynamically loaded here -->
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" id="prev-step-btn" style="display: none;">Previous</button>
                    <button class="btn btn-primary" id="next-step-btn">Next</button>
                    <button class="btn btn-success" id="send-request-btn" style="display: none;">Send Request</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
        this.renderStepContent();
        this.updateProgress();
    }

    setupEventListeners() {
        // Open modal button
        document.getElementById('request-project-btn')?.addEventListener('click', () => {
            this.showModal();
        });

        // Close modal
        this.modal.querySelector('#close-request-modal').addEventListener('click', () => {
            this.hideModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Navigation buttons
        this.modal.querySelector('#prev-step-btn').addEventListener('click', () => {
            this.changeStep(-1);
        });

        this.modal.querySelector('#next-step-btn').addEventListener('click', () => {
            this.changeStep(1);
        });

        this.modal.querySelector('#send-request-btn').addEventListener('click', () => {
            this.handleSendRequest();
        });

        // Form content event delegation
        this.modal.querySelector('#form-wizard-content').addEventListener('click', (e) => {
            if (e.target.closest('.selection-card')) {
                this.handleCardSelection(e.target.closest('.selection-card'));
            }
        });

        this.modal.querySelector('#form-wizard-content').addEventListener('change', (e) => {
            if (e.target.type === 'radio' || e.target.type === 'checkbox') {
                this.handleInputChange(e.target);
            }
        });

        this.modal.querySelector('#form-wizard-content').addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.handleInputChange(e.target);
            }
        });
    }

    showModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    changeStep(direction) {
        if (direction > 0 && !this.validateCurrentStep()) {
            return;
        }

        this.currentStep += direction;
        this.currentStep = Math.max(1, Math.min(this.totalSteps, this.currentStep));
        
        this.renderStepContent();
        this.updateProgress();
        this.updateNavigationButtons();
        this.saveFormData();
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (this.formData.projectTypes.length === 0) {
                    this.showValidationError('Please select at least one project type.');
                    return false;
                }
                break;
            case 2:
                if (this.formData.features.length === 0) {
                    this.showValidationError('Please select at least one feature.');
                    return false;
                }
                break;
            case 3:
                if (!this.formData.timeline || !this.formData.budget) {
                    this.showValidationError('Please select both timeline and budget.');
                    return false;
                }
                break;
            case 4:
                if (!this.formData.description.trim() || !this.formData.contact.name || !this.formData.contact.email) {
                    this.showValidationError('Please fill in all required fields.');
                    return false;
                }
                if (!this.isValidEmail(this.formData.contact.email)) {
                    this.showValidationError('Please enter a valid email address.');
                    return false;
                }
                break;
        }
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showValidationError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        
        const content = this.modal.querySelector('#form-wizard-content');
        content.insertBefore(errorDiv, content.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    renderStepContent() {
        const content = this.modal.querySelector('#form-wizard-content');
        
        switch (this.currentStep) {
            case 1:
                content.innerHTML = this.renderStep1();
                break;
            case 2:
                content.innerHTML = this.renderStep2();
                break;
            case 3:
                content.innerHTML = this.renderStep3();
                break;
            case 4:
                content.innerHTML = this.renderStep4();
                break;
        }
        
        this.restoreFormState();
    }

    renderStep1() {
        return `
            <div class="step-content">
                <h3>What type of project do you need?</h3>
                <p class="step-description">Select one or more project types that match your requirements.</p>
                
                <div class="selection-grid">
                    <div class="selection-card" data-value="website">
                        <div class="card-icon">🌐</div>
                        <h4>Website/Landing Page</h4>
                        <p>Professional business websites and landing pages</p>
                    </div>
                    
                    <div class="selection-card" data-value="ecommerce">
                        <div class="card-icon">🛒</div>
                        <h4>E-commerce Store</h4>
                        <p>Online stores with payment integration</p>
                    </div>
                    
                    <div class="selection-card" data-value="webapp">
                        <div class="card-icon">💻</div>
                        <h4>Web Application</h4>
                        <p>Custom web applications and dashboards</p>
                    </div>
                    
                    <div class="selection-card" data-value="mobile">
                        <div class="card-icon">📱</div>
                        <h4>Mobile App</h4>
                        <p>iOS and Android mobile applications</p>
                    </div>
                    
                    <div class="selection-card" data-value="saas">
                        <div class="card-icon">☁️</div>
                        <h4>SaaS Platform</h4>
                        <p>Software as a Service solutions</p>
                    </div>
                    
                    <div class="selection-card" data-value="portfolio">
                        <div class="card-icon">👤</div>
                        <h4>Portfolio/Blog</h4>
                        <p>Personal or business portfolio sites</p>
                    </div>
                    
                    <div class="selection-card" data-value="custom">
                        <div class="card-icon">⚙️</div>
                        <h4>Custom Software</h4>
                        <p>Bespoke software solutions</p>
                    </div>
                    
                    <div class="selection-card" data-value="api">
                        <div class="card-icon">🔗</div>
                        <h4>API Development</h4>
                        <p>Backend APIs and integrations</p>
                    </div>
                </div>
                
                <div class="other-option">
                    <label>
                        <input type="checkbox" id="other-project-type"> Other:
                        <input type="text" id="other-project-input" placeholder="Describe your project type..." disabled>
                    </label>
                </div>
            </div>
        `;
    }

    renderStep2() {
        const selectedTypes = this.formData.projectTypes;
        let features = [];

        // Dynamic features based on selected project types
        if (selectedTypes.includes('website') || selectedTypes.includes('portfolio')) {
            features.push(
                { id: 'contact-forms', label: 'Contact forms and lead capture', icon: '📝' },
                { id: 'blog-section', label: 'Blog/News section', icon: '📰' },
                { id: 'social-media', label: 'Social media integration', icon: '📱' },
                { id: 'seo-optimization', label: 'SEO optimization', icon: '🔍' },
                { id: 'multi-language', label: 'Multi-language support', icon: '🌍' },
                { id: 'cms', label: 'Content management system', icon: '⚙️' },
                { id: 'analytics', label: 'Analytics integration', icon: '📊' },
                { id: 'live-chat', label: 'Live chat integration', icon: '💬' }
            );
        }

        if (selectedTypes.includes('ecommerce')) {
            features.push(
                { id: 'product-catalog', label: 'Product catalog', icon: '📦' },
                { id: 'shopping-cart', label: 'Shopping cart and checkout', icon: '🛒' },
                { id: 'payment-gateway', label: 'Payment gateway (M-Pesa, Stripe, PayPal)', icon: '💳' },
                { id: 'inventory-management', label: 'Inventory management', icon: '📋' },
                { id: 'order-tracking', label: 'Order tracking', icon: '🚚' },
                { id: 'customer-accounts', label: 'Customer accounts', icon: '👥' },
                { id: 'reviews-ratings', label: 'Reviews and ratings', icon: '⭐' },
                { id: 'email-marketing', label: 'Email marketing integration', icon: '📧' }
            );
        }

        if (selectedTypes.includes('webapp') || selectedTypes.includes('saas')) {
            features.push(
                { id: 'user-auth', label: 'User authentication', icon: '🔐' },
                { id: 'database-integration', label: 'Database integration', icon: '🗄️' },
                { id: 'realtime-features', label: 'Real-time features', icon: '⚡' },
                { id: 'file-upload', label: 'File upload/management', icon: '📁' },
                { id: 'notifications', label: 'Notifications system', icon: '🔔' },
                { id: 'admin-dashboard', label: 'Admin dashboard', icon: '👨‍💼' },
                { id: 'api-integrations', label: 'API integrations', icon: '🔗' },
                { id: 'data-visualization', label: 'Data visualization', icon: '📈' }
            );
        }

        if (selectedTypes.includes('mobile')) {
            features.push(
                { id: 'push-notifications', label: 'Push notifications', icon: '📲' },
                { id: 'offline-functionality', label: 'Offline functionality', icon: '📴' },
                { id: 'location-services', label: 'Location services', icon: '📍' },
                { id: 'camera-integration', label: 'Camera integration', icon: '📷' },
                { id: 'social-login', label: 'Social login', icon: '🔑' },
                { id: 'in-app-purchases', label: 'In-app purchases', icon: '💰' },
                { id: 'analytics-tracking', label: 'Analytics tracking', icon: '📊' },
                { id: 'cloud-sync', label: 'Cloud synchronization', icon: '☁️' }
            );
        }

        // Remove duplicates
        features = features.filter((feature, index, self) => 
            index === self.findIndex(f => f.id === feature.id)
        );

        return `
            <div class="step-content">
                <h3>What features do you need?</h3>
                <p class="step-description">Select the features that are important for your project.</p>
                
                <div class="features-grid">
                    ${features.map(feature => `
                        <label class="feature-checkbox">
                            <input type="checkbox" value="${feature.id}" ${this.formData.features.includes(feature.id) ? 'checked' : ''}>
                            <div class="feature-card">
                                <span class="feature-icon">${feature.icon}</span>
                                <span class="feature-label">${feature.label}</span>
                            </div>
                        </label>
                    `).join('')}
                </div>
                
                <div class="custom-features">
                    <label>
                        <strong>Additional features or requirements:</strong>
                        <textarea id="custom-features-input" placeholder="Describe any additional features you need..." rows="3">${this.formData.customFeatures || ''}</textarea>
                    </label>
                </div>
            </div>
        `;
    }

    renderStep3() {
        return `
            <div class="step-content">
                <h3>Project timeline and budget</h3>
                <p class="step-description">Help us understand your timeline and budget requirements.</p>
                
                <div class="timeline-budget-container">
                    <div class="timeline-section">
                        <h4>Timeline</h4>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="timeline" value="rush" ${this.formData.timeline === 'rush' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Rush (1-2 weeks)</strong>
                                    <span class="timeline-note">+50% cost</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="timeline" value="standard" ${this.formData.timeline === 'standard' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Standard (3-4 weeks)</strong>
                                    <span class="timeline-note">Recommended</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="timeline" value="extended" ${this.formData.timeline === 'extended' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Extended (5-8 weeks)</strong>
                                    <span class="timeline-note">Complex projects</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="timeline" value="flexible" ${this.formData.timeline === 'flexible' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>No specific deadline</strong>
                                    <span class="timeline-note">Flexible timing</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div class="budget-section">
                        <h4>Budget Range (KES)</h4>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="budget" value="startup" ${this.formData.budget === 'startup' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Startup Budget</strong>
                                    <span class="budget-range">KES 15,000 - 50,000</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="budget" value="small" ${this.formData.budget === 'small' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Small Business</strong>
                                    <span class="budget-range">KES 50,000 - 150,000</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="budget" value="medium" ${this.formData.budget === 'medium' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Medium Project</strong>
                                    <span class="budget-range">KES 150,000 - 350,000</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="budget" value="enterprise" ${this.formData.budget === 'enterprise' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Enterprise Level</strong>
                                    <span class="budget-range">KES 350,000 - 750,000</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="budget" value="premium" ${this.formData.budget === 'premium' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Premium/Complex</strong>
                                    <span class="budget-range">KES 750,000+</span>
                                </div>
                            </label>
                            
                            <label class="radio-option">
                                <input type="radio" name="budget" value="custom" ${this.formData.budget === 'custom' ? 'checked' : ''}>
                                <div class="radio-card">
                                    <strong>Custom Budget</strong>
                                    <input type="text" id="custom-budget-input" placeholder="Enter your budget..." 
                                           value="${this.formData.customBudget || ''}" 
                                           ${this.formData.budget === 'custom' ? '' : 'disabled'}>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStep4() {
        return `
            <div class="step-content">
                <h3>Tell us more about your project</h3>
                <p class="step-description">Provide detailed information about your project and contact details.</p>
                
                <div class="project-details-form">
                    <div class="form-group">
                        <label for="project-description"><strong>Describe your project in detail *</strong></label>
                        <textarea id="project-description" rows="5" placeholder="Please provide a detailed description of your project, including goals, target audience, specific requirements, design preferences, and any other important details..." required>${this.formData.description}</textarea>
                    </div>
                    
                    <div class="contact-info-section">
                        <h4>Contact Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contact-name">Full Name *</label>
                                <input type="text" id="contact-name" placeholder="Your full name" required value="${this.formData.contact.name || ''}">
                            </div>
                            <div class="form-group">
                                <label for="contact-email">Email Address *</label>
                                <input type="email" id="contact-email" placeholder="your.email@example.com" required value="${this.formData.contact.email || ''}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contact-phone">Phone Number</label>
                                <input type="tel" id="contact-phone" placeholder="+254 700 000 000" value="${this.formData.contact.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label for="contact-company">Company/Organization</label>
                                <input type="text" id="contact-company" placeholder="Your company name" value="${this.formData.contact.company || ''}">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Preferred Contact Method</label>
                            <div class="radio-inline-group">
                                <label><input type="radio" name="contact-method" value="email" ${(this.formData.contact.method || 'email') === 'email' ? 'checked' : ''}> Email</label>
                                <label><input type="radio" name="contact-method" value="phone" ${this.formData.contact.method === 'phone' ? 'checked' : ''}> Phone</label>
                                <label><input type="radio" name="contact-method" value="whatsapp" ${this.formData.contact.method === 'whatsapp' ? 'checked' : ''}> WhatsApp</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="additional-notes">Additional Notes or Special Requirements</label>
                        <textarea id="additional-notes" rows="3" placeholder="Any additional information, special requirements, or questions you'd like to mention...">${this.formData.additionalNotes}</textarea>
                    </div>
                </div>
            </div>
        `;
    }

    handleCardSelection(card) {
        const value = card.dataset.value;
        const isSelected = card.classList.contains('selected');
        
        if (this.currentStep === 1) {
            // Project types - multiple selection
            if (isSelected) {
                card.classList.remove('selected');
                this.formData.projectTypes = this.formData.projectTypes.filter(type => type !== value);
            } else {
                card.classList.add('selected');
                this.formData.projectTypes.push(value);
            }
        }
        
        this.saveFormData();
    }

    handleInputChange(input) {
        switch (this.currentStep) {
            case 2:
                if (input.type === 'checkbox') {
                    if (input.checked) {
                        if (!this.formData.features.includes(input.value)) {
                            this.formData.features.push(input.value);
                        }
                    } else {
                        this.formData.features = this.formData.features.filter(f => f !== input.value);
                    }
                } else if (input.id === 'custom-features-input') {
                    this.formData.customFeatures = input.value;
                }
                break;
                
            case 3:
                if (input.name === 'timeline') {
                    this.formData.timeline = input.value;
                } else if (input.name === 'budget') {
                    this.formData.budget = input.value;
                    const customInput = document.getElementById('custom-budget-input');
                    if (customInput) {
                        customInput.disabled = input.value !== 'custom';
                        if (input.value !== 'custom') {
                            customInput.value = '';
                            this.formData.customBudget = '';
                        }
                    }
                } else if (input.id === 'custom-budget-input') {
                    this.formData.customBudget = input.value;
                }
                break;
                
            case 4:
                if (input.id === 'project-description') {
                    this.formData.description = input.value;
                } else if (input.id === 'contact-name') {
                    this.formData.contact.name = input.value;
                } else if (input.id === 'contact-email') {
                    this.formData.contact.email = input.value;
                } else if (input.id === 'contact-phone') {
                    this.formData.contact.phone = input.value;
                } else if (input.id === 'contact-company') {
                    this.formData.contact.company = input.value;
                } else if (input.name === 'contact-method') {
                    this.formData.contact.method = input.value;
                } else if (input.id === 'additional-notes') {
                    this.formData.additionalNotes = input.value;
                }
                break;
        }
        
        this.saveFormData();
    }

    restoreFormState() {
        // Restore project type selections
        if (this.currentStep === 1) {
            this.formData.projectTypes.forEach(type => {
                const card = document.querySelector(`[data-value="${type}"]`);
                if (card) {
                    card.classList.add('selected');
                }
            });
        }
        
        // Restore feature selections
        if (this.currentStep === 2) {
            this.formData.features.forEach(feature => {
                const checkbox = document.querySelector(`input[value="${feature}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }

    updateProgress() {
        const progressFill = this.modal.querySelector('#progress-fill');
        const progressText = this.modal.querySelector('#progress-text');
        
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }

    updateNavigationButtons() {
        const prevBtn = this.modal.querySelector('#prev-step-btn');
        const nextBtn = this.modal.querySelector('#next-step-btn');
        const sendBtn = this.modal.querySelector('#send-request-btn');
        
        prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
        nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
        sendBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
    }

    handleSendRequest() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.generateEmailRequest();
    }

    generateEmailRequest() {
        const projectTypesText = this.formData.projectTypes.join(', ');
        const featuresText = this.formData.features.join(', ');
        const timelineText = this.getTimelineText(this.formData.timeline);
        const budgetText = this.getBudgetText(this.formData.budget);
        
        const emailSubject = `Custom Project Request - ${projectTypesText} - ${this.formData.contact.name}`;
        
        const emailBody = `Hi Mike,

I would like to request a custom project with the following specifications:

PROJECT TYPE: ${projectTypesText}

FEATURES REQUIRED: 
${featuresText}
${this.formData.customFeatures ? `\nAdditional Features: ${this.formData.customFeatures}` : ''}

TIMELINE: ${timelineText}
BUDGET RANGE: ${budgetText}${this.formData.customBudget ? ` (${this.formData.customBudget})` : ''}

PROJECT DESCRIPTION:
${this.formData.description}

CONTACT INFORMATION:
Name: ${this.formData.contact.name}
Email: ${this.formData.contact.email}
Phone: ${this.formData.contact.phone || 'Not provided'}
Company: ${this.formData.contact.company || 'Not provided'}
Preferred Contact: ${this.formData.contact.method || 'Email'}

${this.formData.additionalNotes ? `ADDITIONAL NOTES:\n${this.formData.additionalNotes}\n\n` : ''}Please review my request and get back to me with your availability and detailed quote.

Best regards,
${this.formData.contact.name}`;

        // Create mailto link
        const mailtoLink = `mailto:wrootmike@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Show summary modal
        this.showRequestSummary(emailSubject, emailBody, mailtoLink);
    }

    showRequestSummary(subject, body, mailtoLink) {
        const summaryModal = document.createElement('div');
        summaryModal.className = 'modal request-summary-modal';
        summaryModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✅ Request Summary</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Your project request has been prepared. Please review the details below:</p>
                    
                    <div class="summary-section">
                        <h4>Email Subject:</h4>
                        <p class="summary-text">${subject}</p>
                    </div>
                    
                    <div class="summary-section">
                        <h4>Request Details:</h4>
                        <pre class="summary-text">${body}</pre>
                    </div>
                    
                    <p class="summary-note">Clicking "Send Request" will open your default email client with the pre-filled message.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Edit Request</button>
                    <a href="${mailtoLink}" class="btn btn-success">Send Request</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(summaryModal);
        summaryModal.classList.add('active');
        
        // Close functionality
        summaryModal.querySelector('.close-modal').addEventListener('click', () => {
            summaryModal.remove();
        });
        
        summaryModal.addEventListener('click', (e) => {
            if (e.target === summaryModal) {
                summaryModal.remove();
            }
        });
        
        // Clear form data after sending
        summaryModal.querySelector('.btn-success').addEventListener('click', () => {
            this.clearFormData();
            this.hideModal();
            summaryModal.remove();
            
            // Show success notification
            if (window.mikeSites && window.mikeSites.cartManager) {
                window.mikeSites.cartManager.showNotification('Request sent successfully! I will get back to you soon.', 'success');
            }
        });
    }

    getTimelineText(timeline) {
        const timelines = {
            rush: 'Rush (1-2 weeks) - +50% cost',
            standard: 'Standard (3-4 weeks)',
            extended: 'Extended (5-8 weeks)',
            flexible: 'No specific deadline'
        };
        return timelines[timeline] || timeline;
    }

    getBudgetText(budget) {
        const budgets = {
            startup: 'Startup Budget: KES 15,000 - 50,000',
            small: 'Small Business: KES 50,000 - 150,000',
            medium: 'Medium Project: KES 150,000 - 350,000',
            enterprise: 'Enterprise Level: KES 350,000 - 750,000',
            premium: 'Premium/Complex: KES 750,000+',
            custom: 'Custom Budget'
        };
        return budgets[budget] || budget;
    }

    saveFormData() {
        localStorage.setItem('mikeSitesRequestForm', JSON.stringify(this.formData));
    }

    loadFormData() {
        const saved = localStorage.getItem('mikeSitesRequestForm');
        if (saved) {
            this.formData = { ...this.formData, ...JSON.parse(saved) };
        }
    }

    clearFormData() {
        this.formData = {
            projectTypes: [],
            features: [],
            timeline: '',
            budget: '',
            description: '',
            contact: {},
            additionalNotes: ''
        };
        localStorage.removeItem('mikeSitesRequestForm');
        this.currentStep = 1;
        this.renderStepContent();
        this.updateProgress();
        this.updateNavigationButtons();
    }
}

