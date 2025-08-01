class RatingManager {
    constructor() {
        this.ratings = this.loadRatings();
        this.init();
    }

    init() {
        this.addEventListeners();
        this.updateRatingDisplay();
    }

    addEventListeners() {
        const stars = document.querySelectorAll('.rating-widget .star');
        stars.forEach(star => {
            star.addEventListener('mouseover', (e) => this.handleStarHover(e));
            star.addEventListener('mouseout', () => this.resetStars());
            star.addEventListener('click', (e) => this.handleStarClick(e));
        });
    }

    handleStarHover(e) {
        const hoverValue = parseInt(e.target.dataset.value);
        const stars = document.querySelectorAll('.rating-widget .star');
        stars.forEach(star => {
            star.classList.toggle('hovered', parseInt(star.dataset.value) <= hoverValue);
        });
    }

    resetStars() {
        document.querySelectorAll('.rating-widget .star').forEach(star => {
            star.classList.remove('hovered');
        });
    }

    handleStarClick(e) {
        const rating = parseInt(e.target.dataset.value);
        this.addRating(rating);

        // Mark selected stars
        const stars = document.querySelectorAll('.rating-widget .star');
        stars.forEach(star => {
            star.classList.toggle('selected', parseInt(star.dataset.value) <= rating);
        });

        // Optional: hide widget after rating
        setTimeout(() => {
            document.getElementById('rating-widget').style.display = 'none';
        }, 1000);
    }

    addRating(rating) {
        const newRating = {
            rating: rating,
            timestamp: new Date().toISOString(),
        };
        this.ratings.push(newRating);
        this.saveRatings();
        this.updateRatingDisplay();
        window.cart.showNotification(`Thanks for your ${rating}-star rating!`, 'success');
    }

    updateRatingDisplay() {
        if (this.ratings.length === 0) return;

        const totalRating = this.ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = (totalRating / this.ratings.length).toFixed(1);
        const totalReviews = this.ratings.length;

        // Header display
        document.getElementById('avg-rating-header').textContent = averageRating;
        document.getElementById('rating-count-header').textContent = totalReviews;

        // Reviews section display
        document.getElementById('avg-rating-value-display').textContent = averageRating;
        document.getElementById('total-reviews-display').textContent = `based on ${totalReviews} reviews`;

        this.renderReviewsList();
    }

    renderReviewsList() {
        const container = document.getElementById('reviews-list');
        if (!container) return;

        container.innerHTML = this.ratings.map(r => `
            <div class="review-card">
                <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                <p class="review-timestamp">Rated on: ${new Date(r.timestamp).toLocaleDateString()}</p>
            </div>
        `).join('');
    }

    loadRatings() {
        const ratingsData = localStorage.getItem('mikeSites_ratings');
        return ratingsData ? JSON.parse(ratingsData) : [];
    }

    saveRatings() {
        localStorage.setItem('mikeSites_ratings', JSON.stringify(this.ratings));
    }
}
