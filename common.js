// Общие функции для всех страниц
class CommonApp {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Переключение темы
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Мобильное меню
        const menuBtn = document.getElementById('menuToggle');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.toggleMenu());
        }

        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const menuBtn = document.querySelector('.menu-btn');
            
            if (mobileMenu && mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Предотвращение zoom при двойном тапе (для iOS)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    setupNavigation() {
        // Плавная прокрутка для навигационных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target);
            });
        });

        // Обновление активной ссылки при скролле
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    handleNavigation(clickedLink) {
        this.closeMenu();
        
        // Обновляем активную ссылку
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
        
        const target = document.querySelector(clickedLink.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    toggleMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    closeMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
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
        if (themeBtn) {
            themeBtn.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.applyTheme();
        }
    }

    // Вспомогательные функции
    showAlert(message) {
        alert(message);
    }

    loadComponent(componentId, url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById(componentId).innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading component:', error);
            });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.commonApp = new CommonApp();
    
    // Добавляем класс для анимаций после загрузки
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Глобальные функции
function showAlert(message) {
    if (window.commonApp) {
        window.commonApp.showAlert(message);
    } else {
        alert(message);
    }
}

function toggleTheme() {
    if (window.commonApp) {
        window.commonApp.toggleTheme();
    }
}

function toggleMenu() {
    if (window.commonApp) {
        window.commonApp.toggleMenu();
    }
}

function closeMenu() {
    if (window.commonApp) {
        window.commonApp.closeMenu();
    }
}
