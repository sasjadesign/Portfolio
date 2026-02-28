// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', function () {

    // ==================== PAGE LOADER ====================
    const pageLoader = document.getElementById('pageLoader');

    window.addEventListener('load', function () {
        if (pageLoader) {
            setTimeout(function () {
                pageLoader.classList.add('hidden');
            }, 400);
        }
    });

    // Fallback: falls load schon vorbei ist
    if (document.readyState === 'complete' && pageLoader) {
        setTimeout(function () {
            pageLoader.classList.add('hidden');
        }, 400);
    }

    // ==================== DARK MODE TOGGLE ====================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

  function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark');
        document.documentElement.classList.add('dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

    // Gespeicherten Modus laden
    var savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) {}

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        themeToggle.classList.add('is-animating');
        setTimeout(function () {
            themeToggle.classList.remove('is-animating');
        }, 350);

        var isDark = body.classList.toggle('dark');
        document.documentElement.classList.toggle('dark');
        var newTheme = isDark ? 'dark' : 'light';
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {}
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

    // Reagiere auf System-Wechsel
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (err) {}
        if (!saved) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ==================== MOBILE NAVIGATION ====================
    var hamburger = document.getElementById('navHamburger');
    var navLinks = document.getElementById('navLinks');

    // Create overlay
    var overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    body.appendChild(overlay);

    function toggleNav() {
        if (hamburger) hamburger.classList.toggle('active');
        if (navLinks) navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = (navLinks && navLinks.classList.contains('active')) ? 'hidden' : '';
    }

    if (hamburger) hamburger.addEventListener('click', toggleNav);
    if (overlay) overlay.addEventListener('click', toggleNav);

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navLinks && navLinks.classList.contains('active')) {
                toggleNav();
            }
        });
    });

    // ==================== NAVBAR SCROLL ====================
    var navbar = document.getElementById('navbar');

    function handleScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ==================== ACTIVE NAV LINK ====================
    var sections = document.querySelectorAll('section[id]');
    var navItems = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        var scrollY = window.scrollY + 100;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ==================== SCROLL ANIMATIONS ====================
    var animateElements = document.querySelectorAll('[data-animate]');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(function () {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(function (el) {
        observer.observe(el);
    });

    // ==================== COUNTER ANIMATION ====================
    var counters = document.querySelectorAll('.stat-number[data-count]');

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var target = parseInt(entry.target.getAttribute('data-count'));
                var current = 0;
                var increment = target / 40;
                var timer = setInterval(function () {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 40);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
        counterObserver.observe(counter);
    });

    // ==================== FAQ ACCORDION ====================
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(function (faq) {
                faq.classList.remove('active');
            });

            // Open clicked (if was closed)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ==================== CONTACT FORM ====================
    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
            submitBtn.disabled = true;

            var formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    if (formSuccess) formSuccess.style.display = 'block';
                } else {
                    throw new Error('Formular konnte nicht gesendet werden.');
                }
            })
            .catch(function (error) {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Fehler – bitte erneut versuchen';
                submitBtn.disabled = false;
                setTimeout(function () {
                    submitBtn.innerHTML = originalHTML;
                }, 3000);
            });
        });
    }

    // ==================== BACK TO TOP ====================
    var backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== CURRENT YEAR ====================
    var yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

  // ==================== COOKIE CONSENT ====================
var cookieOverlay = document.getElementById('cookieOverlay');
var cookieAccept = document.getElementById('cookieAccept');
var cookieDecline = document.getElementById('cookieDecline');

var hasConsent = false;
try {
    hasConsent = localStorage.getItem('cookieConsent');
} catch (e) {}

function showCookieBanner() {
    if (cookieOverlay && !hasConsent) {
        cookieOverlay.classList.add('visible');
        body.style.overflow = 'hidden';
    }
}

// Warte bis der Page-Loader weg ist, dann zeige Cookie-Banner
window.addEventListener('load', function () {
    setTimeout(showCookieBanner, 1000);
});

// Fallback
if (document.readyState === 'complete') {
    setTimeout(showCookieBanner, 1000);
}

function closeCookieBanner(choice) {
    try { localStorage.setItem('cookieConsent', choice); } catch (e) {}
    if (cookieOverlay) cookieOverlay.classList.remove('visible');
    body.style.overflow = '';
}

if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
        closeCookieBanner('accepted');
    });
}

if (cookieDecline) {
    cookieDecline.addEventListener('click', function () {
        closeCookieBanner('declined');
    });
}



}); // Ende DOMContentLoaded