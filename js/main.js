/* ========================================
   VB Makeup - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollEffects();
    initPortfolio();
    initCarousel();
    initCounters();
    initAnimations();
});

/* ========================================
   Preloader
   ======================================== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');

    if (preloader) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                preloader.classList.add('hidden');
            }, 2000);
        });
    }
}

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ========================================
   Scroll Effects
   ======================================== */
function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');

    // Back to top button visibility
    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* ========================================
   Portfolio
   ======================================== */
let currentImageIndex = 0;
let portfolioImages = [];

function initPortfolio() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Get all portfolio images for lightbox
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        portfolioImages.push(img.src);
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Lightbox functions
function openLightbox(button) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const portfolioItem = button.closest('.portfolio-item');
    const imgSrc = portfolioItem.querySelector('img').src;

    // Find the index of the clicked image
    currentImageIndex = portfolioImages.indexOf(imgSrc);

    lightboxImage.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = portfolioImages.length - 1;
    } else if (currentImageIndex >= portfolioImages.length) {
        currentImageIndex = 0;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = portfolioImages[currentImageIndex];
}

// Close lightbox on background click
document.addEventListener('click', function (e) {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', function (e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeLightboxImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeLightboxImage(1);
        }
    }
});

/* ========================================
   Testimonials Carousel
   ======================================== */
let currentSlide = 0;
let totalSlides = 0;
let visibleSlides = 3;
let autoSlideInterval;
let cardWidth = 0;
let gap = 30;

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    totalSlides = cards.length;
    updateVisibleSlides();
    calculateCardWidth();

    // Add button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            moveCarousel(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            moveCarousel(1);
        });
    }

    // Create dots
    dotsContainer.innerHTML = '';
    const maxSlide = getMaxSlide();
    for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    // Auto-slide
    startAutoSlide();

    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Update on resize
    window.addEventListener('resize', () => {
        updateVisibleSlides();
        calculateCardWidth();
        currentSlide = Math.min(currentSlide, getMaxSlide());
        updateCarousel();
        recreateDots();
    });
}

function calculateCardWidth() {
    const track = document.getElementById('carouselTrack');
    const card = track.querySelector('.testimonial-card');
    if (card) {
        cardWidth = card.offsetWidth;
    }
}

function getMaxSlide() {
    return Math.max(0, totalSlides - visibleSlides);
}

function updateVisibleSlides() {
    if (window.innerWidth <= 768) {
        visibleSlides = 1;
    } else {
        visibleSlides = 3;
    }
}

function moveCarousel(direction) {
    const maxSlide = getMaxSlide();
    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = maxSlide;
    } else if (currentSlide > maxSlide) {
        currentSlide = 0;
    }

    updateCarousel();
    updateDots();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    updateDots();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const offset = currentSlide * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dots .dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function recreateDots() {
    const dotsContainer = document.getElementById('carouselDots');
    dotsContainer.innerHTML = '';
    const maxSlide = getMaxSlide();
    for (let i = 0; i <= maxSlide; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

/* ========================================
   Animated Counters
   ======================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const options = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    requestAnimationFrame(updateCounter);
}

/* ========================================
   Scroll Animations
   ======================================== */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .about-image, .about-text, .portfolio-item, .testimonial-card, .contact-info, .contact-form-wrapper');

    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, options);

    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

/* ========================================
   Contact Form
   ======================================== */
function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset errors
    resetErrors();

    // Validate
    let isValid = true;

    if (!validateName(name.value)) {
        showError('name', 'Please enter your name (at least 2 characters)');
        isValid = false;
    }

    if (!validateEmail(email.value)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!validateMessage(message.value)) {
        showError('message', 'Please enter your message (at least 10 characters)');
        isValid = false;
    }

    if (isValid) {
        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        setTimeout(() => {
            form.style.opacity = '0';
            setTimeout(() => {
                formSuccess.classList.add('active');
                form.reset();

                // Reset after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('active');
                    form.style.opacity = '1';
                    submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                    submitBtn.disabled = false;
                }, 5000);
            }, 300);
        }, 1500);
    }
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    field.parentElement.classList.add('error');
    errorElement.textContent = message;
}

function resetErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
    });

    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.textContent = '';
    });
}

/* ========================================
   Newsletter Form
   ======================================== */
function handleNewsletter(event) {
    event.preventDefault();

    const form = event.target;
    const input = form.querySelector('input');
    const button = form.querySelector('button');

    if (validateEmail(input.value)) {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = '#27ae60';

        setTimeout(() => {
            input.value = '';
            button.innerHTML = '<i class="fas fa-arrow-right"></i>';
            button.style.background = '';
            alert('Thank you for subscribing to our newsletter!');
        }, 1500);
    } else {
        input.style.borderColor = '#e74c3c';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);
    }
}

/* ========================================
   Smooth Scroll Enhancement
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

