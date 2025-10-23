// Основной класс приложения
class EntomologyApp {
    constructor() {
        this.insects = [];
        this.filteredInsects = [];
        this.currentTheme = 'light';
        this.quizScore = 0;
        this.currentQuizQuestion = 0;
        
        this.init();
    }

    // Инициализация приложения
    init() {
        this.loadInsectsData();
        this.setupEventListeners();
        this.setupSearch();
        this.setupQuiz();
        this.setupMap();
        this.setupAnimations();
        this.setupTheme();
    }

    // Загрузка данных о насекомых
    loadInsectsData() {
        this.insects = [
            {
                id: 1,
                name: "Махаон обыкновенный",
                latinName: "Papilio machaon",
                type: "Бабочка",
                rarity: "Редкий",
                season: "Май-Сентябрь",
                habitat: "Луга, поля",
                description: "Крупная дневная бабочка с красивым желтым окрасом",
                image: "🦋",
                coordinates: [57.63, 39.87],
                facts: ["Занесен в Красную книгу", "Размах крыльев до 9 см"]
            },
            {
                id: 2,
                name: "Пчела медоносная",
                latinName: "Apis mellifera",
                type: "Пчела",
                rarity: "Обычный",
                season: "Апрель-Октябрь",
                habitat: "Сады, луга",
                description: "Общественное насекомое, важный опылитель",
                image: "🐝",
                coordinates: [57.60, 39.85],
                facts: ["Живут большими семьями", "Производят мед"]
            },
            {
                id: 3,
                name: "Божья коровка",
                latinName: "Coccinella septempunctata",
                type: "Жук",
                rarity: "Обычный",
                season: "Апрель-Октябрь",
                habitat: "Сады, поля",
                description: "Хищный жук, уничтожает тлю",
                image: "🐞",
                coordinates: [57.65, 39.90],
                facts: ["Уничтожает до 150 тлей в день", "Имеет 7 точек на крыльях"]
            },
            {
                id: 4,
                name: "Стрекоза плоская",
                latinName: "Libellula depressa",
                type: "Стрекоза",
                rarity: "Обычный",
                season: "Май-Август",
                habitat: "Водоемы",
                description: "Быстрый хищник, охотится в воздухе",
                image: "蜻蜓",
                coordinates: [57.62, 39.92],
                facts: ["Скорость полета до 50 км/ч", "Хищник"]
            }
        ];
        
        this.filteredInsects = [...this.insects];
        this.renderInsects();
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target);
            });
        });

        // Переключение темы
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Мобильное меню
        document.getElementById('menuToggle').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Кнопки действий
        document.getElementById('exploreBtn').addEventListener('click', () => {
            this.scrollToSection('species');
        });

        // Фильтры
        document.getElementById('filterType').addEventListener('change', (e) => {
            this.applyFilters();
        });

        document.getElementById('filterRarity').addEventListener('change', (e) => {
            this.applyFilters();
        });
    }

    // Поиск насекомых
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        searchBtn.addEventListener('click', () => {
            this.handleSearch(searchInput.value);
        });

        // Поиск при нажатии Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(e.target.value);
            }
        });
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.filteredInsects = [...this.insects];
        } else {
            this.filteredInsects = this.insects.filter(insect => 
                insect.name.toLowerCase().includes(query.toLowerCase()) ||
                insect.latinName.toLowerCase().includes(query.toLowerCase()) ||
                insect.type.toLowerCase().includes(query.toLowerCase()) ||
                insect.description.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.renderInsects();
        this.updateSearchResults();
    }

    // Фильтрация
    applyFilters() {
        const typeFilter = document.getElementById('filterType').value;
        const rarityFilter = document.getElementById('filterRarity').value;

        this.filteredInsects = this.insects.filter(insect => {
            const typeMatch = typeFilter === 'all' || insect.type === typeFilter;
            const rarityMatch = rarityFilter === 'all' || insect.rarity === rarityFilter;
            return typeMatch && rarityMatch;
        });

        this.renderInsects();
    }

    // Рендеринг списка насекомых
    renderInsects() {
        const container = document.getElementById('insectsContainer');
        if (!container) return;

        container.innerHTML = this.filteredInsects.map(insect => `
            <div class="insect-card" data-id="${insect.id}">
                <div class="insect-image">${insect.image}</div>
                <div class="insect-info">
                    <h3>${insect.name}</h3>
                    <p class="latin-name">${insect.latinName}</p>
                    <div class="insect-meta">
                        <span class="type ${insect.type.toLowerCase()}">${insect.type}</span>
                        <span class="rarity ${insect.rarity.toLowerCase()}">${insect.rarity}</span>
                    </div>
                    <p class="description">${insect.description}</p>
                    <div class="insect-details">
                        <span>🕒 ${insect.season}</span>
                        <span>📍 ${insect.habitat}</span>
                    </div>
                    <button class="details-btn" onclick="app.showInsectDetails(${insect.id})">
                        Подробнее
                    </button>
                </div>
            </div>
        `).join('');

        // Добавляем анимации появления
        this.animateCards();
    }

    // Показ детальной информации
    showInsectDetails(insectId) {
        const insect = this.insects.find(i => i.id === insectId);
        if (!insect) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="modal-header">
                    <div class="modal-image">${insect.image}</div>
                    <div>
                        <h2>${insect.name}</h2>
                        <p class="latin-name">${insect.latinName}</p>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Тип:</strong>
                            <span>${insect.type}</span>
                        </div>
                        <div class="info-item">
                            <strong>Редкость:</strong>
                            <span class="rarity ${insect.rarity.toLowerCase()}">${insect.rarity}</span>
                        </div>
                        <div class="info-item">
                            <strong>Сезон:</strong>
                            <span>${insect.season}</span>
                        </div>
                        <div class="info-item">
                            <strong>Место обитания:</strong>
                            <span>${insect.habitat}</span>
                        </div>
                    </div>
                    <div class="facts">
                        <h3>Интересные факты:</h3>
                        <ul>
                            ${insect.facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Закрытие модального окна
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Викторина
    setupQuiz() {
        this.quizQuestions = [
            {
                question: "Какая бабочка занесена в Красную книгу Ярославской области?",
                options: ["Капустница", "Махаон", "Крапивница", "Адмирал"],
                correct: 1
            },
            {
                question: "Какое насекомое является важным опылителем растений?",
                options: ["Комар", "Пчела", "Муха", "Оса"],
                correct: 1
            },
            {
                question: "Сколько точек обычно у семиточечной божьей коровки?",
                options: ["5", "6", "7", "8"],
                correct: 2
            }
        ];

        document.getElementById('startQuiz').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('restartQuiz').addEventListener('click', () => {
            this.restartQuiz();
        });
    }

    startQuiz() {
        this.quizScore = 0;
        this.currentQuizQuestion = 0;
        document.getElementById('quizStart').style.display = 'none';
        document.getElementById('quizGame').style.display = 'block';
        this.showQuestion();
    }

    showQuestion() {
        if (this.currentQuizQuestion >= this.quizQuestions.length) {
            this.showQuizResults();
            return;
        }

        const question = this.quizQuestions[this.currentQuizQuestion];
        document.getElementById('quizQuestion').textContent = question.question;
        
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <button class="quiz-option" onclick="app.checkAnswer(${index})">
                ${option}
            </button>
        `).join('');

        document.getElementById('quizProgress').textContent = 
            `Вопрос ${this.currentQuizQuestion + 1} из ${this.quizQuestions.length}`;
    }

    checkAnswer(selectedIndex) {
        const question = this.quizQuestions[this.currentQuizQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            option.disabled = true;
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex) {
                option.classList.add('incorrect');
            }
        });

        if (selectedIndex === question.correct) {
            this.quizScore++;
        }

        setTimeout(() => {
            this.currentQuizQuestion++;
            this.showQuestion();
        }, 2000);
    }

    showQuizResults() {
        document.getElementById('quizGame').style.display = 'none';
        document.getElementById('quizResults').style.display = 'block';
        document.getElementById('finalScore').textContent = 
            `${this.quizScore} из ${this.quizQuestions.length}`;
        
        const percentage = (this.quizScore / this.quizQuestions.length) * 100;
        let message = "";
        
        if (percentage >= 80) message = "Отлично! Вы настоящий энтомолог!";
        else if (percentage >= 60) message = "Хорошо! Вы хорошо разбираетесь в насекомых!";
        else message = "Попробуйте еще раз! Насекомые - это интересно!";
        
        document.getElementById('quizMessage').textContent = message;
    }

    nextQuestion() {
        this.currentQuizQuestion++;
        this.showQuestion();
    }

    restartQuiz() {
        document.getElementById('quizResults').style.display = 'none';
        document.getElementById('quizStart').style.display = 'block';
    }

    // Карта (упрощенная версия)
    setupMap() {
        // Имитация карты с насекомыми
        const mapContainer = document.getElementById('insectsMap');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <h3>Карта распространения насекомых</h3>
                <div class="map-points">
                    ${this.insects.map(insect => `
                        <div class="map-point" style="top: ${insect.coordinates[0] % 50}%; left: ${insect.coordinates[1] % 50}%;" 
                             title="${insect.name}">
                            ${insect.image}
                        </div>
                    `).join('')}
                </div>
                <p>Карта показывает примерные места обитания насекомых в Ярославской области</p>
            </div>
        `;
    }

    // Анимации
    setupAnimations() {
        this.animateCards();
        this.setupScrollAnimations();
    }

    animateCards() {
        const cards = document.querySelectorAll('.insect-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Темная тема
    setupTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.applyTheme();
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    // Навигация
    handleNavigation(clickedLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
        
        const targetSection = clickedLink.getAttribute('href').substring(1);
        this.scrollToSection(targetSection);
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Мобильное меню
    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.toggle('active');
    }

    // Обновление результатов поиска
    updateSearchResults() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `Найдено: ${this.filteredInsects.length} насекомых`;
        }
    }

    // Статистика
    getStatistics() {
        const stats = {
            total: this.insects.length,
            byType: {},
            byRarity: {}
        };

        this.insects.forEach(insect => {
            stats.byType[insect.type] = (stats.byType[insect.type] || 0) + 1;
            stats.byRarity[insect.rarity] = (stats.byRarity[insect.rarity] || 0) + 1;
        });

        return stats;
    }

    // Экспорт данных
    exportData() {
        const dataStr = JSON.stringify(this.insects, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'nasekomye-yaroslavl.json';
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Инициализация приложения
const app = new EntomologyApp();

// Глобальные функции для HTML атрибутов
window.showInsectDetails = (id) => app.showInsectDetails(id);
window.startQuiz = () => app.startQuiz();
window.nextQuestion = () => app.nextQuestion();
window.restartQuiz = () => app.restartQuiz();

// Service Worker для оффлайн-работы (опционально)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
}
