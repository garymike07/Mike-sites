// Mike Sites - Theme Management

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = {
            dark: {
                name: 'Dark',
                icon: 'fas fa-moon',
                class: 'dark-theme'
            },
            light: {
                name: 'Light',
                icon: 'fas fa-sun',
                class: 'light-theme'
            },
            neon: {
                name: 'Neon',
                icon: 'fas fa-bolt',
                class: 'neon-theme'
            }
        };
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
        this.updateThemeToggle();
    }

    setupEventListeners() {
        // Theme toggle buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.getAttribute('data-theme');
                this.setTheme(theme);
            });
        });

        // Mobile theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle && window.innerWidth <= 768) {
            themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileThemeMenu();
            });

            // Close theme menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!themeToggle.contains(e.target)) {
                    this.closeMobileThemeMenu();
                }
            });
        }

        // Keyboard shortcuts for theme switching
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.setTheme('dark');
                        break;
                    case '2':
                        e.preventDefault();
                        this.setTheme('light');
                        break;
                    case '3':
                        e.preventDefault();
                        this.setTheme('neon');
                        break;
                }
            }
        });

        // System theme preference detection
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.hasUserPreference()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }

        // Remove all theme classes
        Object.values(this.themes).forEach(theme => {
            document.body.classList.remove(theme.class);
        });

        // Add new theme class
        document.body.classList.add(this.themes[themeName].class);
        
        this.currentTheme = themeName;
        this.saveTheme();
        this.updateThemeToggle();
        this.animateThemeTransition();
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(themeName);
        
        // Show notification
        if (window.mikeSites) {
            window.mikeSites.showNotification(
                `Switched to ${this.themes[themeName].name} theme`, 
                'success'
            );
        }
    }

    updateThemeToggle() {
        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            const btnTheme = btn.getAttribute('data-theme');
            if (btnTheme === this.currentTheme) {
                btn.classList.add('active');
            }
        });

        // Update theme toggle icon and text for mobile
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const currentThemeData = this.themes[this.currentTheme];
            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');
            
            if (icon) {
                icon.className = currentThemeData.icon;
            }
            if (text) {
                text.textContent = currentThemeData.name;
            }
        }
    }

    toggleMobileThemeMenu() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.classList.toggle('open');
        }
    }

    closeMobileThemeMenu() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.classList.remove('open');
        }
    }

    animateThemeTransition() {
        // Create a smooth transition effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            z-index: 9998;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '0.8';
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }, 150);
        });
    }

    saveTheme() {
        try {
            localStorage.setItem('mikeSites_theme', this.currentTheme);
            localStorage.setItem('mikeSites_hasUserPreference', 'true');
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    }

    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('mikeSites_theme');
            
            if (savedTheme && this.themes[savedTheme]) {
                this.setTheme(savedTheme);
            } else {
                // Use system preference if no saved theme
                this.detectSystemTheme();
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
            this.setTheme('dark'); // Fallback to dark theme
        }
    }

    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    }

    hasUserPreference() {
        try {
            return localStorage.getItem('mikeSites_hasUserPreference') === 'true';
        } catch (error) {
            return false;
        }
    }

    dispatchThemeChangeEvent(themeName) {
        const event = new CustomEvent('themeChange', {
            detail: {
                theme: themeName,
                themeData: this.themes[themeName]
            }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeData(themeName = null) {
        const theme = themeName || this.currentTheme;
        return this.themes[theme];
    }

    getAllThemes() {
        return this.themes;
    }

    cycleTheme() {
        const themeNames = Object.keys(this.themes);
        const currentIndex = themeNames.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        this.setTheme(themeNames[nextIndex]);
    }

    resetToDefault() {
        this.setTheme('dark');
    }

    // Theme-specific utilities
    getThemeColors() {
        const computedStyle = getComputedStyle(document.documentElement);
        return {
            primary: computedStyle.getPropertyValue('--bg-primary').trim(),
            secondary: computedStyle.getPropertyValue('--bg-secondary').trim(),
            accent: computedStyle.getPropertyValue('--accent-primary').trim(),
            text: computedStyle.getPropertyValue('--text-primary').trim(),
            textSecondary: computedStyle.getPropertyValue('--text-secondary').trim()
        };
    }

    updateMetaThemeColor() {
        const colors = this.getThemeColors();
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = colors.primary;
    }

    // Accessibility features
    enableHighContrast() {
        document.body.classList.add('high-contrast');
        this.saveAccessibilityPreference('highContrast', true);
    }

    disableHighContrast() {
        document.body.classList.remove('high-contrast');
        this.saveAccessibilityPreference('highContrast', false);
    }

    enableReducedMotion() {
        document.body.classList.add('reduced-motion');
        this.saveAccessibilityPreference('reducedMotion', true);
    }

    disableReducedMotion() {
        document.body.classList.remove('reduced-motion');
        this.saveAccessibilityPreference('reducedMotion', false);
    }

    saveAccessibilityPreference(key, value) {
        try {
            const preferences = this.getAccessibilityPreferences();
            preferences[key] = value;
            localStorage.setItem('mikeSites_accessibility', JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving accessibility preference:', error);
        }
    }

    getAccessibilityPreferences() {
        try {
            const saved = localStorage.getItem('mikeSites_accessibility');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading accessibility preferences:', error);
            return {};
        }
    }

    loadAccessibilityPreferences() {
        const preferences = this.getAccessibilityPreferences();
        
        if (preferences.highContrast) {
            this.enableHighContrast();
        }
        
        if (preferences.reducedMotion) {
            this.enableReducedMotion();
        }
    }

    // Theme export/import functionality
    exportThemeSettings() {
        const settings = {
            theme: this.currentTheme,
            accessibility: this.getAccessibilityPreferences(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(settings, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mikesites-theme-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importThemeSettings(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    
                    if (settings.theme && this.themes[settings.theme]) {
                        this.setTheme(settings.theme);
                    }
                    
                    if (settings.accessibility) {
                        Object.entries(settings.accessibility).forEach(([key, value]) => {
                            this.saveAccessibilityPreference(key, value);
                        });
                        this.loadAccessibilityPreferences();
                    }
                    
                    resolve(settings);
                } catch (error) {
                    reject(new Error('Invalid theme settings file'));
                }
            };
            
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ThemeManager = new ThemeManager();
    
    // Load accessibility preferences
    window.ThemeManager.loadAccessibilityPreferences();
    
    // Update meta theme color
    window.ThemeManager.updateMetaThemeColor();
    
    // Listen for theme changes to update meta theme color
    document.addEventListener('themeChange', () => {
        window.ThemeManager.updateMetaThemeColor();
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

