// Расширенная функциональность
class AdvancedFeatures {
    constructor(app) {
        this.app = app;
        this.setupAdvancedFeatures();
    }

    setupAdvancedFeatures() {
        this.setupSeasonFilter();
        this.setupFavorites();
        this.setupComparison();
        this.setupDataVisualization();
    }

    // Фильтр по сезонам
    setupSeasonFilter() {
        const seasons = ['Все', 'Весна', 'Лето', 'Осень', 'Зима'];
        const container = document.getElementById('seasonFilter');
        
        if (container) {
            container.innerHTML = seasons.map(season => `
                <button class="season-btn" data-season="${season}">
                    ${season}
                </button>
            `).join('');

            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('season-btn')) {
                    this.filterBySeason(e.target.dataset.season);
                }
            });
        }
    }

    filterBySeason(season) {
        if (season === 'Все') {
            this.app.filteredInsects = [...this.app.insects];
        } else {
            this.app.filteredInsects = this.app.insects.filter(insect => 
                insect.season.includes(this.getSeasonMonths(season))
            );
        }
        this.app.renderInsects();
    }

    getSeasonMonths(season) {
        const months = {
            'Весна': 'Март-Май',
            'Лето': 'Июнь-Август',
            'Осень': 'Сентябрь-Ноябрь',
            'Зима': 'Декабрь-Февраль'
        };
        return months[season] || '';
    }

    // Избранное
    setupFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.renderFavorites();
    }

    toggleFavorite(insectId) {
        const index = this.favorites.indexOf(insectId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(insectId);
        }
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.renderFavorites();
    }

    renderFavorites() {
        const container = document.getElementById('favoritesContainer');
        if (container) {
            const favoriteInsects = this.app.insects.filter(insect => 
                this.favorites.includes(insect.id)
            );
            
            container.innerHTML = favoriteInsects.map(insect => `
                <div class="favorite-item">
                    ${insect.image} ${insect.name}
                </div>
            `).join('');
        }
    }
}

// Инициализация расширенных функций
const advancedFeatures = new AdvancedFeatures(app);
