// Rating System Manager

class RatingSystemManager {
    constructor() {
        this.ratings = JSON.parse(localStorage.getItem('mikeSitesRatings')) || [];
        this.currentRating = 0;
        this.init();
    }

    init() {
        this.createRatingWidget();
        this.updateHeaderRating();
        this.createRatingSection();
    }

    createRatingWidget() {
        // Create floating rating widget
        const ratingWidget = document.createElement('div');
        ratingWidget.className = 'floating-rating-widget';
        ratingWidget.innerHTML = `
            <div class="rating-widget-content">
                <div class="rating-prompt">Rate this site</div>
                <div class="star-rating" id="floating-star-rating">
                    ${this.createStarHTML(0)}
                </div>
                <button class="rate-btn" id="submit-rating-btn" disabled>Submit</button>
            </div>
        `;
        
        document.body.appendChild(ratingWidget);
        this.setupRatingWidgetEvents();
    }

    createStarHTML(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating;
            starsHTML += `<span class="star ${filled ? 'filled' : ''}" data-rating="${i}">⭐</span>`;
        }
        return starsHTML;
    }

    setupRatingWidgetEvents() {
        const starContainer = document.getElementById('floating-star-rating');
        const submitBtn = document.getElementById('submit-rating-btn');
        
        // Star hover and click events
        starContainer.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('star')) {
                const rating = parseInt(e.target.dataset.rating);
                this.highlightStars(starContainer, rating);
            }
        });

        starContainer.addEventListener('mouseout', () => {
            this.highlightStars(starContainer, this.currentRating);
        });

        starContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                this.currentRating = parseInt(e.target.dataset.rating);
                this.highlightStars(starContainer, this.currentRating);
                submitBtn.disabled = false;
                submitBtn.textContent = `Submit ${this.currentRating} Star${this.currentRating !== 1 ? 's' : ''}`;
            }
        });

        // Submit rating
        submitBtn.addEventListener('click', () => {
            this.showRatingModal();
        });
    }

    highlightStars(container, rating) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('filled', index < rating);
        });
    }

    showRatingModal() {
        const modal = document.createElement('div');
        modal.className = 'modal rating-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>⭐ Rate Mike Sites</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="rating-display">
                        <div class="large-star-rating">
                            ${this.createStarHTML(this.currentRating)}
                        </div>
                        <p>You rated this site <strong>${this.currentRating} out of 5 stars</strong></p>
                    </div>
                    
                    <div class="rating-form">
                        <div class="form-group">
                            <label for="reviewer-name">Your Name (Optional)</label>
                            <input type="text" id="reviewer-name" placeholder="Anonymous" maxlength="50">
                        </div>
                        
                        <div class="form-group">
                            <label for="rating-comment">Comment (Optional)</label>
                            <textarea id="rating-comment" placeholder="Share your thoughts about the site..." rows="4" maxlength="500"></textarea>
                        </div>
                        
                        <div class="character-count">
                            <span id="comment-count">0</span>/500 characters
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" id="submit-final-rating">Submit Rating</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active');

        // Character counter
        const commentTextarea = modal.querySelector('#rating-comment');
        const characterCount = modal.querySelector('#comment-count');
        
        commentTextarea.addEventListener('input', () => {
            characterCount.textContent = commentTextarea.value.length;
        });

        // Submit final rating
        modal.querySelector('#submit-final-rating').addEventListener('click', () => {
            this.submitRating(modal);
        });

        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    submitRating(modal) {
        const name = modal.querySelector('#reviewer-name').value.trim() || 'Anonymous';
        const comment = modal.querySelector('#rating-comment').value.trim();
        
        const rating = {
            id: Date.now(),
            rating: this.currentRating,
            name: name,
            comment: comment,
            timestamp: new Date().toISOString(),
            timeAgo: 'Just now'
        };

        this.ratings.unshift(rating); // Add to beginning
        this.saveRatings();
        this.updateHeaderRating();
        this.updateRatingSection();
        
        // Hide rating widget temporarily
        this.hideRatingWidget();
        
        // Show success message
        modal.remove();
        this.showSuccessMessage(rating);
        
        // Reset current rating
        this.currentRating = 0;
        document.getElementById('submit-rating-btn').disabled = true;
        document.getElementById('submit-rating-btn').textContent = 'Submit';
        this.highlightStars(document.getElementById('floating-star-rating'), 0);
    }

    showSuccessMessage(rating) {
        const successModal = document.createElement('div');
        successModal.className = 'modal rating-success-modal';
        successModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎉 Thank You!</h3>
                </div>
                <div class="modal-body">
                    <div class="success-content">
                        <div class="success-rating">
                            ${this.createStarHTML(rating.rating)}
                        </div>
                        <p>Thank you for rating Mike Sites!</p>
                        <p>Your ${rating.rating}-star rating has been submitted successfully.</p>
                        ${rating.comment ? `<div class="submitted-comment">"${rating.comment}"</div>` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(successModal);
        successModal.classList.add('active');

        // Auto close after 3 seconds
        setTimeout(() => {
            if (successModal.parentNode) {
                successModal.remove();
                this.showRatingWidget(); // Show widget again after delay
            }
        }, 3000);
    }

    hideRatingWidget() {
        const widget = document.querySelector('.floating-rating-widget');
        if (widget) {
            widget.style.display = 'none';
        }
    }

    showRatingWidget() {
        const widget = document.querySelector('.floating-rating-widget');
        if (widget) {
            widget.style.display = 'block';
        }
    }

    updateHeaderRating() {
        const avgRatingElement = document.getElementById('avg-rating-header');
        const ratingCountElement = document.getElementById('rating-count-header');
        
        if (this.ratings.length === 0) {
            avgRatingElement.textContent = '0.0';
            ratingCountElement.textContent = '0';
            return;
        }

        const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const avgRating = (totalRating / this.ratings.length).toFixed(1);
        
        avgRatingElement.textContent = avgRating;
        ratingCountElement.textContent = this.ratings.length;
    }

    createRatingSection() {
        // Find or create reviews section
        let reviewsSection = document.getElementById('reviews-section');
        
        if (!reviewsSection) {
            reviewsSection = document.createElement('section');
            reviewsSection.id = 'reviews-section';
            reviewsSection.className = 'section reviews-section';
            reviewsSection.innerHTML = `
                <div class="section-container">
                    <div class="section-header">
                        <h2>Reviews & Ratings</h2>
                    </div>
                    <div class="reviews-content">
                        <div class="rating-overview">
                            <div class="overall-rating">
                                <div class="rating-number" id="overall-rating-number">0.0</div>
                                <div class="rating-stars" id="overall-rating-stars">
                                    ${this.createStarHTML(0)}
                                </div>
                                <div class="rating-text">
                                    <span id="total-reviews">0</span> reviews
                                </div>
                            </div>
                            <div class="rating-breakdown" id="rating-breakdown">
                                <!-- Rating breakdown will be generated here -->
                            </div>
                        </div>
                        <div class="reviews-list" id="reviews-list">
                            <!-- Individual reviews will be displayed here -->
                        </div>
                    </div>
                </div>
            `;
            
            // Insert before contact section or at the end
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.parentNode.insertBefore(reviewsSection, contactSection);
            } else {
                document.querySelector('main').appendChild(reviewsSection);
            }
        }
        
        this.updateRatingSection();
    }

    updateRatingSection() {
        this.updateOverallRating();
        this.updateRatingBreakdown();
        this.updateReviewsList();
    }

    updateOverallRating() {
        const ratingNumberElement = document.getElementById('overall-rating-number');
        const ratingStarsElement = document.getElementById('overall-rating-stars');
        const totalReviewsElement = document.getElementById('total-reviews');
        
        if (!ratingNumberElement) return;

        if (this.ratings.length === 0) {
            ratingNumberElement.textContent = '0.0';
            ratingStarsElement.innerHTML = this.createStarHTML(0);
            totalReviewsElement.textContent = '0';
            return;
        }

        const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const avgRating = totalRating / this.ratings.length;
        
        ratingNumberElement.textContent = avgRating.toFixed(1);
        ratingStarsElement.innerHTML = this.createStarHTML(Math.round(avgRating));
        totalReviewsElement.textContent = this.ratings.length;
    }

    updateRatingBreakdown() {
        const breakdownElement = document.getElementById('rating-breakdown');
        if (!breakdownElement) return;

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        
        this.ratings.forEach(rating => {
            breakdown[rating.rating]++;
        });

        const total = this.ratings.length || 1; // Avoid division by zero
        
        breakdownElement.innerHTML = '';
        for (let i = 5; i >= 1; i--) {
            const count = breakdown[i];
            const percentage = (count / total) * 100;
            
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <span class="breakdown-stars">${i} ⭐</span>
                <div class="breakdown-bar">
                    <div class="breakdown-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="breakdown-count">${count}</span>
            `;
            breakdownElement.appendChild(breakdownItem);
        }
    }

    updateReviewsList() {
        const reviewsListElement = document.getElementById('reviews-list');
        if (!reviewsListElement) return;

        if (this.ratings.length === 0) {
            reviewsListElement.innerHTML = `
                <div class="no-reviews">
                    <p>No reviews yet. Be the first to rate this site!</p>
                </div>
            `;
            return;
        }

        // Update time ago for all ratings
        this.updateTimeAgo();

        reviewsListElement.innerHTML = this.ratings.map(rating => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <span class="reviewer-name">${rating.name}</span>
                        <span class="review-time">${rating.timeAgo}</span>
                    </div>
                    <div class="review-rating">
                        ${this.createStarHTML(rating.rating)}
                    </div>
                </div>
                ${rating.comment ? `<div class="review-comment">${rating.comment}</div>` : ''}
            </div>
        `).join('');
    }

    updateTimeAgo() {
        const now = new Date();
        
        this.ratings.forEach(rating => {
            const ratingTime = new Date(rating.timestamp);
            const diffMs = now - ratingTime;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) {
                rating.timeAgo = 'Just now';
            } else if (diffMins < 60) {
                rating.timeAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                rating.timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            } else if (diffDays < 30) {
                rating.timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            } else {
                rating.timeAgo = ratingTime.toLocaleDateString();
            }
        });
    }

    saveRatings() {
        localStorage.setItem('mikeSitesRatings', JSON.stringify(this.ratings));
    }

    // Method to add sample ratings for demonstration
    addSampleRatings() {
        const sampleRatings = [
            {
                id: Date.now() - 86400000,
                rating: 5,
                name: 'Sarah Johnson',
                comment: 'Amazing portfolio! The design is modern and the projects showcase real talent. Highly recommended!',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                timeAgo: '1 day ago'
            },
            {
                id: Date.now() - 172800000,
                rating: 4,
                name: 'David Chen',
                comment: 'Great work on the interactive features. The shopping cart for source code is a brilliant idea.',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                timeAgo: '2 days ago'
            },
            {
                id: Date.now() - 259200000,
                rating: 5,
                name: 'Maria Rodriguez',
                comment: 'Professional and well-organized. The project request system makes it easy to get quotes.',
                timestamp: new Date(Date.now() - 259200000).toISOString(),
                timeAgo: '3 days ago'
            },
            {
                id: Date.now() - 345600000,
                rating: 4,
                name: 'Anonymous',
                comment: '',
                timestamp: new Date(Date.now() - 345600000).toISOString(),
                timeAgo: '4 days ago'
            },
            {
                id: Date.now() - 432000000,
                rating: 5,
                name: 'James Wilson',
                comment: 'Excellent developer portfolio. The code previews and download system work flawlessly.',
                timestamp: new Date(Date.now() - 432000000).toISOString(),
                timeAgo: '5 days ago'
            }
        ];

        // Only add sample ratings if no ratings exist
        if (this.ratings.length === 0) {
            this.ratings = sampleRatings;
            this.saveRatings();
            this.updateHeaderRating();
            this.updateRatingSection();
        }
    }
}

// Initialize sample ratings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add sample ratings after a short delay to ensure the rating system is initialized
    setTimeout(() => {
        if (window.mikeSites && window.mikeSites.ratingManager) {
            window.mikeSites.ratingManager.addSampleRatings();
        }
    }, 2000);
});

