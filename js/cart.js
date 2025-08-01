class Cart {
    constructor() {
        this.cart = this.loadFromLocalStorage();
        this.projectData = [];
        this.init();
    }

    async init() {
        await this.fetchProjectData();
        this.addEventListeners();
        this.updateCartUI();
    }

    async fetchProjectData() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.projectData = data.projects || [];
        } catch (error) {
            console.error("Could not fetch project data:", error);
        }
    }

    addEventListeners() {
        // Add to cart buttons
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const projectId = parseInt(e.target.dataset.projectId);
                this.addItem(projectId);
            }
        });

        // Open cart drawer
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.openDrawer());
        }

        // Close cart drawer
        const closeCartBtn = document.getElementById('close-cart-btn');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.closeDrawer());
        }

        // Close on overlay click
        const cartOverlay = document.getElementById('cart-overlay');
        if(cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeDrawer());
        }

        // Remove from cart buttons (event delegation)
        const cartItemsContainer = document.getElementById('cart-items-container');
        if(cartItemsContainer) {
            cartItemsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-from-cart-btn')) {
                    const projectId = parseInt(e.target.dataset.projectId);
                    this.removeItem(projectId);
                }
            });
        }
    }

    addItem(projectId) {
        if (!this.cart.includes(projectId)) {
            this.cart.push(projectId);
            this.saveToLocalStorage();
            this.updateCartUI();
            this.showNotification(`Project added to cart!`);
        } else {
            this.showNotification('Project is already in the cart.', 'warning');
        }
    }

    removeItem(projectId) {
        const index = this.cart.indexOf(projectId);
        if (index > -1) {
            this.cart.splice(index, 1);
            this.saveToLocalStorage();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        this.updateCartCount();
        this.renderCartItems();
    }

    updateCartCount() {
        const cartItemCount = document.getElementById('cart-item-count');
        const cartTotalItems = document.getElementById('cart-total-items');
        const count = this.cart.length;

        if (cartItemCount) cartItemCount.textContent = count;
        if (cartTotalItems) cartTotalItems.textContent = count;
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        container.innerHTML = this.cart.map(projectId => {
            const project = this.projectData.find(p => p.id === projectId);
            if (!project) return '';

            const thumbnail = project.thumbnail && project.thumbnail.startsWith('images/')
                ? project.thumbnail
                : 'images/default-thumbnail.png';

            return `
                <div class="cart-item">
                    <img src="${thumbnail}" alt="${project.title}" class="cart-item-thumbnail">
                    <div class="cart-item-info">
                        <h4>${project.title}</h4>
                        <button class="btn btn-secondary btn-sm download-item-btn" data-project-id="${project.id}">Download</button>
                    </div>
                    <button class="remove-from-cart-btn" data-project-id="${project.id}">&times;</button>
                </div>
            `;
        }).join('');
    }

    openDrawer() {
        document.getElementById('cart-drawer')?.classList.add('open');
        document.getElementById('cart-overlay')?.classList.add('open');
    }

    closeDrawer() {
        document.getElementById('cart-drawer')?.classList.remove('open');
        document.getElementById('cart-overlay')?.classList.remove('open');
    }

    loadFromLocalStorage() {
        const cartData = localStorage.getItem('mikeSites_cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    saveToLocalStorage() {
        localStorage.setItem('mikeSites_cart', JSON.stringify(this.cart));
    }

    showNotification(message, type = 'success') {
        // A simple notification, can be expanded later
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}
