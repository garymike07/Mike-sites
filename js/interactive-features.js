// Interactive Features and Advanced Functionality

class InteractiveFeatures {
    constructor() {
        this.init();
        this.setupCodePlayground();
        this.setupGitHubIntegration();
        this.setupSkillVisualizations();
        this.setupVoiceCommands();
        this.setupPerformanceDashboard();
        this.setupGameification();
    }

    init() {
        console.log('Initializing Interactive Features...');
        this.createFloatingActionButton();
        this.setupThemeSystem();
        this.setupProgressiveWebApp();
    }

    createFloatingActionButton() {
        const fab = document.createElement('button');
        fab.className = 'fab';
        fab.innerHTML = '⚡';
        fab.title = 'Interactive Features';
        
        fab.addEventListener('click', () => {
            this.showFeatureMenu();
        });
        
        document.body.appendChild(fab);
    }

    showFeatureMenu() {
        const menu = document.createElement('div');
        menu.className = 'feature-menu glass';
        menu.innerHTML = `
            <div class="feature-menu-header">
                <h3>Interactive Features</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="feature-menu-content">
                <button class="feature-btn" data-feature="code-playground">
                    💻 Code Playground
                </button>
                <button class="feature-btn" data-feature="github-stats">
                    📊 GitHub Stats
                </button>
                <button class="feature-btn" data-feature="skill-radar">
                    🎯 Skill Radar
                </button>
                <button class="feature-btn" data-feature="voice-commands">
                    🎤 Voice Commands
                </button>
                <button class="feature-btn" data-feature="performance">
                    ⚡ Performance
                </button>
                <button class="feature-btn" data-feature="easter-eggs">
                    🥚 Easter Eggs
                </button>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Event listeners
        menu.querySelector('.close-btn').addEventListener('click', () => {
            menu.remove();
        });
        
        menu.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feature = e.target.dataset.feature;
                this.activateFeature(feature);
                menu.remove();
            });
        });
    }

    activateFeature(feature) {
        switch (feature) {
            case 'code-playground':
                this.openCodePlayground();
                break;
            case 'github-stats':
                this.showGitHubStats();
                break;
            case 'skill-radar':
                this.showSkillRadar();
                break;
            case 'voice-commands':
                this.toggleVoiceCommands();
                break;
            case 'performance':
                this.showPerformanceDashboard();
                break;
            case 'easter-eggs':
                this.showEasterEggs();
                break;
        }
    }

    setupCodePlayground() {
        this.codePlayground = {
            isOpen: false,
            editor: null
        };
    }

    openCodePlayground() {
        if (this.codePlayground.isOpen) return;
        
        const playground = document.createElement('div');
        playground.className = 'code-playground-modal';
        playground.innerHTML = `
            <div class="code-playground glass">
                <div class="playground-header">
                    <h3>Live Code Playground</h3>
                    <div class="playground-controls">
                        <select id="language-select">
                            <option value="javascript">JavaScript</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="python">Python</option>
                        </select>
                        <button id="run-code" class="interactive-button">Run</button>
                        <button id="clear-code" class="interactive-button">Clear</button>
                        <button id="close-playground" class="interactive-button">Close</button>
                    </div>
                </div>
                <div class="playground-content">
                    <div class="code-editor">
                        <textarea id="code-input" placeholder="Write your code here...">
// Welcome to the Live Code Playground!
console.log('Hello, World!');

// Try some interactive examples:
const greeting = 'Welcome to Mike Sites!';
console.log(greeting);

// Create dynamic content
document.body.style.background = 'linear-gradient(45deg, #0066ff, #00d4ff)';
                        </textarea>
                    </div>
                    <div class="code-output">
                        <div class="output-header">Output:</div>
                        <div id="code-result"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(playground);
        this.codePlayground.isOpen = true;
        
        // Setup Monaco Editor if available
        if (typeof monaco !== 'undefined') {
            this.setupMonacoEditor();
        }
        
        // Event listeners
        document.getElementById('run-code').addEventListener('click', () => {
            this.executeCode();
        });
        
        document.getElementById('clear-code').addEventListener('click', () => {
            document.getElementById('code-input').value = '';
            document.getElementById('code-result').innerHTML = '';
        });
        
        document.getElementById('close-playground').addEventListener('click', () => {
            playground.remove();
            this.codePlayground.isOpen = false;
        });
    }

    setupMonacoEditor() {
        const editorContainer = document.createElement('div');
        editorContainer.id = 'monaco-editor';
        editorContainer.style.height = '300px';
        
        const textarea = document.getElementById('code-input');
        textarea.parentNode.replaceChild(editorContainer, textarea);
        
        this.codePlayground.editor = monaco.editor.create(editorContainer, {
            value: textarea.value,
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false
        });
    }

    executeCode() {
        const codeInput = this.codePlayground.editor 
            ? this.codePlayground.editor.getValue()
            : document.getElementById('code-input').value;
        
        const resultDiv = document.getElementById('code-result');
        resultDiv.innerHTML = '';
        
        // Create a safe execution environment
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        try {
            // Capture console output
            const originalLog = console.log;
            const logs = [];
            
            iframe.contentWindow.console.log = (...args) => {
                logs.push(args.join(' '));
            };
            
            // Execute code in iframe
            iframe.contentWindow.eval(codeInput);
            
            // Display results
            if (logs.length > 0) {
                resultDiv.innerHTML = logs.map(log => `<div class="log-entry">${log}</div>`).join('');
            } else {
                resultDiv.innerHTML = '<div class="log-entry">Code executed successfully (no output)</div>';
            }
            
        } catch (error) {
            resultDiv.innerHTML = `<div class="error-entry">Error: ${error.message}</div>`;
        } finally {
            document.body.removeChild(iframe);
        }
    }

    setupGitHubIntegration() {
        this.githubData = {
            username: 'garymike07',
            repos: [],
            stats: {}
        };
    }

    async fetchGitHubData() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.githubData.username}`);
            const userData = await response.json();
            
            const reposResponse = await fetch(`https://api.github.com/users/${this.githubData.username}/repos?sort=updated&per_page=10`);
            const reposData = await reposResponse.json();
            
            this.githubData.stats = userData;
            this.githubData.repos = reposData;
            
            return { user: userData, repos: reposData };
        } catch (error) {
            console.error('Failed to fetch GitHub data:', error);
            return null;
        }
    }

    async showGitHubStats() {
        const data = await this.fetchGitHubData();
        if (!data) return;
        
        const modal = document.createElement('div');
        modal.className = 'github-stats-modal';
        modal.innerHTML = `
            <div class="github-stats glass">
                <div class="stats-header">
                    <h3>GitHub Statistics</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="stats-content">
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-number">${data.user.public_repos}</span>
                            <span class="stat-label">Repositories</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${data.user.followers}</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${data.user.following}</span>
                            <span class="stat-label">Following</span>
                        </div>
                    </div>
                    <div class="recent-repos">
                        <h4>Recent Repositories</h4>
                        <div class="repos-list">
                            ${data.repos.map(repo => `
                                <div class="repo-item">
                                    <h5>${repo.name}</h5>
                                    <p>${repo.description || 'No description'}</p>
                                    <div class="repo-stats">
                                        <span>⭐ ${repo.stargazers_count}</span>
                                        <span>🍴 ${repo.forks_count}</span>
                                        <span>${repo.language || 'Unknown'}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    setupSkillVisualizations() {
        this.skills = [
            { name: 'JavaScript', level: 95 },
            { name: 'React', level: 90 },
            { name: 'Node.js', level: 85 },
            { name: 'Python', level: 80 },
            { name: 'CSS/SCSS', level: 92 },
            { name: 'TypeScript', level: 88 },
            { name: 'MongoDB', level: 75 },
            { name: 'AWS', level: 70 }
        ];
    }

    showSkillRadar() {
        const modal = document.createElement('div');
        modal.className = 'skill-radar-modal';
        modal.innerHTML = `
            <div class="skill-radar glass">
                <div class="radar-header">
                    <h3>Skill Radar Chart</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="radar-content">
                    <canvas id="skill-radar-canvas" width="400" height="400"></canvas>
                    <div class="skill-legend">
                        ${this.skills.map(skill => `
                            <div class="skill-item">
                                <span class="skill-name">${skill.name}</span>
                                <div class="skill-bar">
                                    <div class="skill-progress" style="width: ${skill.level}%"></div>
                                </div>
                                <span class="skill-level">${skill.level}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        this.drawRadarChart();
        
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    drawRadarChart() {
        const canvas = document.getElementById('skill-radar-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.stroke();
        }
        
        // Draw axes
        const angleStep = (2 * Math.PI) / this.skills.length;
        for (let i = 0; i < this.skills.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.stroke();
            
            // Draw labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.skills[i].name, x + Math.cos(angle) * 20, y + Math.sin(angle) * 20);
        }
        
        // Draw skill polygon
        ctx.beginPath();
        for (let i = 0; i < this.skills.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const skillRadius = (this.skills[i].level / 100) * radius;
            const x = centerX + Math.cos(angle) * skillRadius;
            const y = centerY + Math.sin(angle) * skillRadius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw skill points
        for (let i = 0; i < this.skills.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const skillRadius = (this.skills[i].level / 100) * radius;
            const x = centerX + Math.cos(angle) * skillRadius;
            const y = centerY + Math.sin(angle) * skillRadius;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#00d4ff';
            ctx.fill();
        }
    }

    setupVoiceCommands() {
        this.voiceEnabled = false;
        this.recognition = null;
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };
        }
    }

    toggleVoiceCommands() {
        if (!this.recognition) {
            alert('Voice recognition not supported in this browser');
            return;
        }
        
        if (this.voiceEnabled) {
            this.recognition.stop();
            this.voiceEnabled = false;
            this.showNotification('Voice commands disabled');
        } else {
            this.recognition.start();
            this.voiceEnabled = true;
            this.showNotification('Voice commands enabled. Try saying "show projects" or "go to about"');
        }
    }

    processVoiceCommand(command) {
        console.log('Voice command:', command);
        
        if (command.includes('show projects') || command.includes('projects')) {
            document.querySelector('[data-section="projects"]').click();
        } else if (command.includes('about') || command.includes('about me')) {
            document.querySelector('[data-section="about"]').click();
        } else if (command.includes('contact')) {
            document.querySelector('[data-section="contact"]').click();
        } else if (command.includes('home')) {
            document.querySelector('[data-section="home"]').click();
        } else if (command.includes('dark mode') || command.includes('dark theme')) {
            document.querySelector('[data-theme="dark"]').click();
        } else if (command.includes('light mode') || command.includes('light theme')) {
            document.querySelector('[data-theme="light"]').click();
        } else if (command.includes('code playground')) {
            this.openCodePlayground();
        }
    }

    setupPerformanceDashboard() {
        this.performanceData = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0
        };
    }

    showPerformanceDashboard() {
        this.measurePerformance();
        
        const modal = document.createElement('div');
        modal.className = 'performance-modal';
        modal.innerHTML = `
            <div class="performance-dashboard glass">
                <div class="dashboard-header">
                    <h3>Performance Dashboard</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="dashboard-content">
                    <div class="performance-metrics">
                        <div class="metric-card">
                            <h4>Load Time</h4>
                            <span class="metric-value">${this.performanceData.loadTime}ms</span>
                        </div>
                        <div class="metric-card">
                            <h4>DOM Content Loaded</h4>
                            <span class="metric-value">${this.performanceData.domContentLoaded}ms</span>
                        </div>
                        <div class="metric-card">
                            <h4>First Paint</h4>
                            <span class="metric-value">${this.performanceData.firstPaint}ms</span>
                        </div>
                        <div class="metric-card">
                            <h4>First Contentful Paint</h4>
                            <span class="metric-value">${this.performanceData.firstContentfulPaint}ms</span>
                        </div>
                    </div>
                    <div class="performance-chart">
                        <canvas id="performance-chart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        this.drawPerformanceChart();
        
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    measurePerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.performanceData.loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
            this.performanceData.domContentLoaded = Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
            
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.performanceData.firstPaint = Math.round(entry.startTime);
                } else if (entry.name === 'first-contentful-paint') {
                    this.performanceData.firstContentfulPaint = Math.round(entry.startTime);
                }
            });
        }
    }

    drawPerformanceChart() {
        const canvas = document.getElementById('performance-chart');
        const ctx = canvas.getContext('2d');
        
        const data = [
            this.performanceData.firstPaint,
            this.performanceData.firstContentfulPaint,
            this.performanceData.domContentLoaded,
            this.performanceData.loadTime
        ];
        
        const labels = ['First Paint', 'First Contentful Paint', 'DOM Content Loaded', 'Load Time'];
        const maxValue = Math.max(...data);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        const barWidth = canvas.width / data.length - 20;
        const barMaxHeight = canvas.height - 40;
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * barMaxHeight;
            const x = index * (barWidth + 20) + 10;
            const y = canvas.height - barHeight - 20;
            
            ctx.fillStyle = '#00d4ff';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 5);
            ctx.fillText(value + 'ms', x + barWidth / 2, y - 5);
        });
    }

    setupGameification() {
        this.achievements = [
            { id: 'explorer', name: 'Explorer', description: 'Visited all sections', unlocked: false },
            { id: 'coder', name: 'Coder', description: 'Used the code playground', unlocked: false },
            { id: 'voice-user', name: 'Voice Commander', description: 'Used voice commands', unlocked: false },
            { id: 'theme-switcher', name: 'Theme Master', description: 'Tried all themes', unlocked: false }
        ];
        
        this.visitedSections = new Set();
        this.usedFeatures = new Set();
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showAchievementNotification(achievement);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h4>Achievement Unlocked!</h4>
                    <p><strong>${achievement.name}</strong></p>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showEasterEggs() {
        const easterEggs = [
            'Try the Konami Code: ↑↑↓↓←→←→BA',
            'Type "matrix" in the console',
            'Hold Shift and click the logo 5 times',
            'Say "activate developer mode" with voice commands',
            'Press Ctrl+Shift+D for developer tools'
        ];
        
        const modal = document.createElement('div');
        modal.className = 'easter-eggs-modal';
        modal.innerHTML = `
            <div class="easter-eggs glass">
                <div class="eggs-header">
                    <h3>🥚 Easter Eggs</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="eggs-content">
                    <p>Hidden features and secrets:</p>
                    <ul>
                        ${easterEggs.map(egg => `<li>${egg}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    setupThemeSystem() {
        // Enhanced theme switching with smooth transitions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-btn')) {
                const theme = e.target.dataset.theme;
                this.switchTheme(theme);
            }
        });
    }

    switchTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('preferred-theme', theme);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
        
        this.showNotification(`Switched to ${theme} theme`);
    }

    setupProgressiveWebApp() {
        // Service worker registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
        
        // Install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });
    }

    showInstallPrompt() {
        const installBanner = document.createElement('div');
        installBanner.className = 'install-banner';
        installBanner.innerHTML = `
            <div class="install-content">
                <span>Install Mike Sites as a PWA for the best experience!</span>
                <button id="install-btn" class="interactive-button">Install</button>
                <button id="dismiss-install" class="interactive-button">Dismiss</button>
            </div>
        `;
        
        document.body.appendChild(installBanner);
        
        document.getElementById('install-btn').addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            }
            installBanner.remove();
        });
        
        document.getElementById('dismiss-install').addEventListener('click', () => {
            installBanner.remove();
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize interactive features
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveFeatures = new InteractiveFeatures();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveFeatures;
}

