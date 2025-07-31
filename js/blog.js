// Mike Sites - Blog Management

class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.loadBlogPosts();
        this.setupEventListeners();
        this.renderPosts();
        this.updatePagination();
    }

    loadBlogPosts() {
        // Sample blog posts - in a real application, this would come from an API
        this.posts = [
            {
                id: 1,
                title: "Building Scalable React Applications",
                excerpt: "Learn the best practices for building large-scale React applications that can grow with your team and user base.",
                content: "In this comprehensive guide, we'll explore the architectural patterns and best practices that make React applications scalable...",
                category: "tutorials",
                author: "Mike Sites",
                publishDate: "2024-01-15",
                readTime: "8 min read",
                tags: ["React", "JavaScript", "Architecture", "Best Practices"],
                thumbnail: "assets/images/blog-react-scalable.jpg",
                featured: true
            },
            {
                id: 2,
                title: "The Future of Web Development in 2024",
                excerpt: "Exploring the emerging trends and technologies that will shape web development in the coming year.",
                content: "As we move into 2024, the web development landscape continues to evolve at a rapid pace...",
                category: "insights",
                author: "Mike Sites",
                publishDate: "2024-01-10",
                readTime: "6 min read",
                tags: ["Web Development", "Trends", "Future", "Technology"],
                thumbnail: "assets/images/blog-future-web.jpg",
                featured: true
            },
            {
                id: 3,
                title: "CSS Grid vs Flexbox: When to Use Which",
                excerpt: "A practical guide to choosing between CSS Grid and Flexbox for your layout needs.",
                content: "CSS Grid and Flexbox are both powerful layout systems, but they serve different purposes...",
                category: "tutorials",
                author: "Mike Sites",
                publishDate: "2024-01-05",
                readTime: "5 min read",
                tags: ["CSS", "Layout", "Grid", "Flexbox"],
                thumbnail: "assets/images/blog-css-grid-flexbox.jpg",
                featured: false
            },
            {
                id: 4,
                title: "My Experience with Next.js 14",
                excerpt: "Hands-on review of the latest Next.js features and how they improve the developer experience.",
                content: "Next.js 14 brings several exciting new features that enhance both developer experience and application performance...",
                category: "reviews",
                author: "Mike Sites",
                publishDate: "2023-12-28",
                readTime: "7 min read",
                tags: ["Next.js", "React", "Performance", "Review"],
                thumbnail: "assets/images/blog-nextjs-14.jpg",
                featured: false
            },
            {
                id: 5,
                title: "10 VS Code Extensions Every Developer Should Use",
                excerpt: "Boost your productivity with these essential VS Code extensions that will transform your coding workflow.",
                content: "Visual Studio Code is already a powerful editor, but with the right extensions, it becomes even more powerful...",
                category: "tips",
                author: "Mike Sites",
                publishDate: "2023-12-20",
                readTime: "4 min read",
                tags: ["VS Code", "Extensions", "Productivity", "Tools"],
                thumbnail: "assets/images/blog-vscode-extensions.jpg",
                featured: false
            },
            {
                id: 6,
                title: "Understanding JavaScript Closures",
                excerpt: "A deep dive into one of JavaScript's most important concepts with practical examples.",
                content: "Closures are a fundamental concept in JavaScript that every developer should understand...",
                category: "tutorials",
                author: "Mike Sites",
                publishDate: "2023-12-15",
                readTime: "6 min read",
                tags: ["JavaScript", "Closures", "Functions", "Concepts"],
                thumbnail: "assets/images/blog-js-closures.jpg",
                featured: false
            },
            {
                id: 7,
                title: "The Rise of AI in Web Development",
                excerpt: "How artificial intelligence is changing the way we build and maintain web applications.",
                content: "Artificial Intelligence is revolutionizing many industries, and web development is no exception...",
                category: "insights",
                author: "Mike Sites",
                publishDate: "2023-12-10",
                readTime: "8 min read",
                tags: ["AI", "Machine Learning", "Web Development", "Future"],
                thumbnail: "assets/images/blog-ai-web-dev.jpg",
                featured: false
            },
            {
                id: 8,
                title: "Optimizing Web Performance: A Complete Guide",
                excerpt: "Learn how to make your websites lightning fast with these performance optimization techniques.",
                content: "Web performance is crucial for user experience and SEO. In this guide, we'll cover everything you need to know...",
                category: "tutorials",
                author: "Mike Sites",
                publishDate: "2023-12-05",
                readTime: "10 min read",
                tags: ["Performance", "Optimization", "Web Vitals", "Speed"],
                thumbnail: "assets/images/blog-performance.jpg",
                featured: false
            },
            {
                id: 9,
                title: "5 Quick CSS Tips for Better Layouts",
                excerpt: "Simple CSS techniques that will immediately improve your layout skills and design consistency.",
                content: "These quick CSS tips will help you create better layouts with less code and more consistency...",
                category: "tips",
                author: "Mike Sites",
                publishDate: "2023-11-30",
                readTime: "3 min read",
                tags: ["CSS", "Tips", "Layout", "Design"],
                thumbnail: "assets/images/blog-css-tips.jpg",
                featured: false
            },
            {
                id: 10,
                title: "Building a REST API with Node.js and Express",
                excerpt: "Step-by-step tutorial on creating a robust REST API using Node.js, Express, and MongoDB.",
                content: "In this tutorial, we'll build a complete REST API from scratch using modern Node.js practices...",
                category: "tutorials",
                author: "Mike Sites",
                publishDate: "2023-11-25",
                readTime: "12 min read",
                tags: ["Node.js", "Express", "API", "Backend"],
                thumbnail: "assets/images/blog-nodejs-api.jpg",
                featured: false
            }
        ];

        this.filteredPosts = [...this.posts];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterPosts();
            });
        }

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCategory(e.target.getAttribute('data-category'));
            });
        });

        // Pagination
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmission(e));
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.filterPosts();
    }

    filterPosts() {
        this.filteredPosts = this.posts.filter(post => {
            const matchesCategory = this.currentCategory === 'all' || post.category === this.currentCategory;
            const matchesSearch = this.searchQuery === '' || 
                post.title.toLowerCase().includes(this.searchQuery) ||
                post.excerpt.toLowerCase().includes(this.searchQuery) ||
                post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));

            return matchesCategory && matchesSearch;
        });

        this.currentPage = 1;
        this.renderPosts();
        this.updatePagination();
    }

    renderPosts() {
        const container = document.getElementById('blog-grid');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        if (postsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-search"></i>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
        this.attachPostCardListeners(container);
    }

    createPostCard(post) {
        const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="blog-card" data-post-id="${post.id}">
                <div class="blog-thumbnail">
                    <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
                    <div class="blog-category">${post.category}</div>
                    ${post.featured ? '<div class="featured-badge">Featured</div>' : ''}
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </span>
                        <span class="blog-read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime}
                        </span>
                    </div>
                    <h2 class="blog-title">${post.title}</h2>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="blog-actions">
                        <button class="read-more-btn" data-post-id="${post.id}">
                            Read More
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <div class="blog-share">
                            <button class="share-btn" data-post-id="${post.id}">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    attachPostCardListeners(container) {
        // Read more buttons
        container.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-post-id'));
                this.openPostModal(postId);
            });
        });

        // Share buttons
        container.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-post-id'));
                this.sharePost(postId);
            });
        });

        // Card click to open modal
        container.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                const postId = parseInt(card.getAttribute('data-post-id'));
                this.openPostModal(postId);
            });
        });
    }

    openPostModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        // Create modal if it doesn't exist
        let modal = document.getElementById('blog-post-modal');
        if (!modal) {
            modal = this.createPostModal();
            document.body.appendChild(modal);
        }

        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = this.createPostModalContent(post);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    createPostModal() {
        const modal = document.createElement('div');
        modal.id = 'blog-post-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="blog-modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body"></div>
            </div>
        `;

        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closePostModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePostModal();
            }
        });

        return modal;
    }

    createPostModalContent(post) {
        const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="blog-post-content">
                <header class="post-header">
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                        <span class="post-date">${formattedDate}</span>
                        <span class="post-read-time">${post.readTime}</span>
                    </div>
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-author">
                        <span>By ${post.author}</span>
                    </div>
                </header>
                
                <div class="post-image">
                    <img src="${post.thumbnail}" alt="${post.title}">
                </div>
                
                <div class="post-content">
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-body">
                        ${this.formatPostContent(post.content)}
                    </div>
                </div>
                
                <footer class="post-footer">
                    <div class="post-tags">
                        <h3>Tags:</h3>
                        <div class="tag-list">
                            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="post-share">
                        <h3>Share this post:</h3>
                        <div class="share-buttons">
                            <button class="share-twitter" data-post-id="${post.id}">
                                <i class="fab fa-twitter"></i>
                                Twitter
                            </button>
                            <button class="share-linkedin" data-post-id="${post.id}">
                                <i class="fab fa-linkedin"></i>
                                LinkedIn
                            </button>
                            <button class="share-copy" data-post-id="${post.id}">
                                <i class="fas fa-link"></i>
                                Copy Link
                            </button>
                        </div>
                    </div>
                </footer>
            </article>
            
            <style>
                .blog-post-content {
                    max-width: 800px;
                    margin: 0 auto;
                    line-height: 1.7;
                }
                
                .post-header {
                    text-align: center;
                    margin-bottom: var(--spacing-xl);
                    padding-bottom: var(--spacing-lg);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .post-meta {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-md);
                    flex-wrap: wrap;
                }
                
                .post-category {
                    background: var(--accent-primary);
                    color: white;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border-radius: var(--border-radius);
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .post-date, .post-read-time {
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }
                
                .post-title {
                    font-size: var(--font-size-3xl);
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-md);
                    line-height: 1.2;
                }
                
                .post-author {
                    color: var(--text-secondary);
                    font-style: italic;
                }
                
                .post-image {
                    margin-bottom: var(--spacing-xl);
                }
                
                .post-image img {
                    width: 100%;
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-md);
                }
                
                .post-excerpt {
                    font-size: var(--font-size-lg);
                    color: var(--text-secondary);
                    font-style: italic;
                    margin-bottom: var(--spacing-xl);
                    padding: var(--spacing-lg);
                    background: var(--bg-tertiary);
                    border-radius: var(--border-radius-lg);
                    border-left: 4px solid var(--accent-primary);
                }
                
                .post-body {
                    font-size: var(--font-size-base);
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-xl);
                }
                
                .post-footer {
                    border-top: 1px solid var(--border-color);
                    padding-top: var(--spacing-lg);
                }
                
                .post-tags, .post-share {
                    margin-bottom: var(--spacing-lg);
                }
                
                .post-tags h3, .post-share h3 {
                    font-size: var(--font-size-base);
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--spacing-sm);
                }
                
                .tag-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }
                
                .post-tag {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    border-radius: var(--border-radius);
                    font-size: var(--font-size-sm);
                    font-weight: 500;
                }
                
                .share-buttons {
                    display: flex;
                    gap: var(--spacing-md);
                    flex-wrap: wrap;
                }
                
                .share-buttons button {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-sm) var(--spacing-md);
                    border: none;
                    border-radius: var(--border-radius);
                    font-size: var(--font-size-sm);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                
                .share-twitter {
                    background: #1da1f2;
                    color: white;
                }
                
                .share-linkedin {
                    background: #0077b5;
                    color: white;
                }
                
                .share-copy {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }
                
                .share-buttons button:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }
                
                @media (max-width: 768px) {
                    .post-meta {
                        flex-direction: column;
                        align-items: center;
                        gap: var(--spacing-sm);
                    }
                    
                    .post-title {
                        font-size: var(--font-size-2xl);
                    }
                    
                    .share-buttons {
                        justify-content: center;
                    }
                }
            </style>
        `;
    }

    formatPostContent(content) {
        // Simple content formatting - in a real app, you'd use a markdown parser
        return content.split('\n').map(paragraph => 
            paragraph.trim() ? `<p>${paragraph}</p>` : ''
        ).join('');
    }

    closePostModal() {
        const modal = document.getElementById('blog-post-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const url = `${window.location.origin}/blog.html#post-${postId}`;
        const text = `Check out this article: ${post.title}`;

        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: url
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(url).then(() => {
                if (window.mikeSites) {
                    window.mikeSites.showNotification('Link copied to clipboard!', 'success');
                }
            });
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        
        const currentPageElement = document.getElementById('current-page');
        const totalPagesElement = document.getElementById('total-pages');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (currentPageElement) currentPageElement.textContent = this.currentPage;
        if (totalPagesElement) totalPagesElement.textContent = totalPages;

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderPosts();
            this.updatePagination();
            this.scrollToTop();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderPosts();
            this.updatePagination();
            this.scrollToTop();
        }
    }

    scrollToTop() {
        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    handleNewsletterSubmission(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate subscription (replace with actual implementation)
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (window.mikeSites) {
                window.mikeSites.showNotification(
                    'Successfully subscribed to newsletter!', 
                    'success'
                );
            }
            
            emailInput.value = '';
        }, 2000);
    }

    searchPosts(query) {
        this.searchQuery = query.toLowerCase();
        this.filterPosts();
    }

    getPostsByCategory(category) {
        return this.posts.filter(post => post.category === category);
    }

    getFeaturedPosts() {
        return this.posts.filter(post => post.featured);
    }

    getRecentPosts(limit = 5) {
        return this.posts
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, limit);
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.BlogManager = new BlogManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}

