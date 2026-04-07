document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 1.1 Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }

    // 2. Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Leaflet Map Initialization
    // Coordenadas aproximadas para Mejicana 1481, Punta Arenas
    const lat = -53.1611;
    const lng = -70.9080;
    
    const map = L.map('map', {
        scrollWheelZoom: false
    }).setView([lat, lng], 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    const customIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -35]
    });

    L.marker([lat, lng], { icon: customIcon }).addTo(map)
        .bindPopup('<b>Departamentos Costanera</b><br>Mejicana 1481, Punta Arenas.')
        .openPopup();

    // 4. Reveal Sections on Scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // 5. Contact Form Simulation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Nos contactaremos contigo a la brevedad.');
            contactForm.reset();
        });
    }

    // 6. Stacked Card Slider Logic
    const sliderWrapper = document.querySelector('.stacked-slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'next', 'next-2', 'prev-hidden');
            
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex + 1) % totalSlides) {
                slide.classList.add('next');
            } else if (index === (currentIndex + 2) % totalSlides) {
                slide.classList.add('next-2');
            } else {
                slide.classList.add('prev-hidden');
            }
        });
    }

    function nextSlide() {
        if (sliderWrapper.classList.contains('expanded')) return;
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        if (sliderWrapper.classList.contains('expanded')) return;
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Expansion Logic
    const expandBtns = document.querySelectorAll('.btn-expand');
    const collapseBtns = document.querySelectorAll('.btn-collapse');

    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            sliderWrapper.classList.add('expanded');
        });
    });

    collapseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            sliderWrapper.classList.remove('expanded');
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Auto-play
        let autoPlay = setInterval(nextSlide, 5000);
        
        sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
        sliderWrapper.addEventListener('mouseleave', () => {
            if (!sliderWrapper.classList.contains('expanded')) {
                autoPlay = setInterval(nextSlide, 5000);
            }
        });

        // Initialize
        updateSlider();
    }
    // 6. Multi-Language System
    const langDropdown = document.querySelector('.lang-dropdown');
    const selectedLang = document.getElementById('selected-lang');
    const langOptions = document.querySelectorAll('.lang-option');
    
    function setLanguage(lang) {
        if (!translations[lang]) return;
        
        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update dropdown UI
        const activeOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (activeOption) {
            // Update the main selected text
            const newLangText = activeOption.querySelector('span').textContent;
            selectedLang.querySelector('.current-lang').textContent = newLangText;
            
            // Update active class in list
            langOptions.forEach(opt => opt.classList.remove('active'));
            activeOption.classList.add('active');
        }

        // Save preference
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;
    }

    // Toggle dropdown on click (for mobile)
    selectedLang.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langDropdown.classList.remove('active');
    });

    // Add click listeners to options
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            setLanguage(option.getAttribute('data-lang'));
            langDropdown.classList.remove('active');
        });
    });

    // Initialize
    const savedLang = localStorage.getItem('preferredLang') || 'es';
    setLanguage(savedLang);

});
