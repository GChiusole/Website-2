// ===================================
// Academic Website - JavaScript
// Interactive Features & Navigation
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION FUNCTIONALITY =====
    
    // Mobile menu toggle with accessibility features
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        // Toggle menu function
        function toggleMenu() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Focus management
            if (!isExpanded) {
                // When opening menu, focus first link
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        }
        
        // Click handler
        navToggle.addEventListener('click', toggleMenu);
        
        // Keyboard handler for hamburger button
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
            // Escape key closes menu
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
            
            // Keyboard navigation within menu
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.focus();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu on escape key anywhere
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== PUBLICATION FILTERS =====
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item[data-category]');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter publications
            publicationItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'grid';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===== CV NAVIGATION =====
    
    const cvNavLinks = document.querySelectorAll('.cv-nav a');
    const cvSections = document.querySelectorAll('.cv-section');

    // Highlight current section in CV navigation
    function updateCVNav() {
        let current = '';
        
        cvSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        cvNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    if (cvSections.length > 0) {
        window.addEventListener('scroll', updateCVNav);
    }

    // ===== CONTACT FORM =====
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // ===== UTILITY FUNCTIONS =====
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        `;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // ===== LAST UPDATED DATE =====
    
    const lastUpdatedElements = document.querySelectorAll('#last-updated');
    if (lastUpdatedElements.length > 0) {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        lastUpdatedElements.forEach(element => {
            element.textContent = currentDate;
        });
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.publication-item, .course-card, .research-card, .project-card, .award-item, .student-item');
    animateElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // ===== KEYBOARD NAVIGATION =====
    
    // Handle keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // Handle Escape key to close mobile menu
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });

    // ===== EXTERNAL LINKS =====
    
    // Add target="_blank" to external links (without icons)
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        if (!link.hostname || link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // ===== SCROLL TO TOP BUTTON =====
    
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Style the button
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #2563eb;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect for scroll button
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.backgroundColor = '#1d4ed8';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.backgroundColor = '#2563eb';
    });

    // ===== SEMINAR NOTES (MOBILE ACCORDION) =====
    const seminarNotes = document.querySelectorAll('.seminar-note-hover');
    const seminarMediaQuery = window.matchMedia('(max-width: 768px)');

    function shouldUseSeminarAccordion() {
        return seminarMediaQuery.matches;
    }

    function closeSeminarNote(note) {
        if (!note || !note.classList.contains('open')) {
            return;
        }

        note.classList.remove('open');
        note.setAttribute('aria-expanded', 'false');

        const tooltip = note.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.maxHeight = '0px';
        }
    }

    function openSeminarNote(note) {
        if (!note) {
            return;
        }

        const tooltip = note.querySelector('.tooltip');
        if (!tooltip) {
            return;
        }

        note.classList.add('open');
        note.setAttribute('aria-expanded', 'true');
        tooltip.style.maxHeight = tooltip.scrollHeight + 'px';
    }

    function toggleSeminarNote(note) {
        if (!shouldUseSeminarAccordion()) {
            return;
        }

        const isOpen = note.classList.contains('open');

        seminarNotes.forEach(other => {
            if (other !== note) {
                closeSeminarNote(other);
            }
        });

        if (isOpen) {
            closeSeminarNote(note);
        } else {
            openSeminarNote(note);
        }
    }

    seminarNotes.forEach(note => {
        const tooltip = note.querySelector('.tooltip');
        if (!tooltip) {
            return;
        }

        note.setAttribute('tabindex', '0');
        note.setAttribute('role', 'button');
        note.setAttribute('aria-expanded', 'false');

        note.addEventListener('click', (event) => {
            if (!shouldUseSeminarAccordion()) {
                return;
            }

            if (event.target.closest('.seminar-pdf-btn')) {
                return;
            }

            event.preventDefault();
            toggleSeminarNote(note);
        });

        note.addEventListener('keydown', (event) => {
            if (!shouldUseSeminarAccordion()) {
                return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleSeminarNote(note);
            }
        });
    });

    function resetSeminarNotes() {
        if (shouldUseSeminarAccordion()) {
            seminarNotes.forEach(note => {
                const tooltip = note.querySelector('.tooltip');
                if (tooltip && note.classList.contains('open')) {
                    tooltip.style.maxHeight = tooltip.scrollHeight + 'px';
                }
            });
            return;
        }

        seminarNotes.forEach(note => {
            note.classList.remove('open');
            note.setAttribute('aria-expanded', 'false');
            const tooltip = note.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.maxHeight = '';
            }
        });
    }

    if (typeof seminarMediaQuery.addEventListener === 'function') {
        seminarMediaQuery.addEventListener('change', resetSeminarNotes);
    } else if (typeof seminarMediaQuery.addListener === 'function') {
        seminarMediaQuery.addListener(resetSeminarNotes);
    }
    resetSeminarNotes();

    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // ===== THEME TOGGLE (Optional) =====
    
    // Uncomment and customize if you want to add dark mode support
    /*
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', 
                document.body.classList.contains('dark-theme') ? 'dark' : 'light'
            );
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
    */

    // ===== CONSOLE MESSAGE =====
    
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                    Academic Website                          ║
    ║                   Built with ❤️                              ║
    ║                                                              ║
    ║  To customize this website:                                  ║
    ║  1. Replace placeholder content with your information        ║
    ║  2. Add your profile picture to images/profile.jpg           ║
    ║  3. Update the contact form with your preferred method       ║
    ║  4. Customize colors in css/style.css                       ║
    ║                                                              ║
    ║  For GitHub Pages deployment instructions, see README.md     ║
    ╚══════════════════════════════════════════════════════════════╝
    `);
});

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Function to copy text to clipboard (useful for contact info)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Function to download CV (if you want to track downloads)
function downloadCV() {
    // Track CV downloads if you have analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'CV',
            'event_label': 'PDF Download'
        });
    }
}

// Function to format publication citations
function formatCitation(authors, title, venue, year) {
    return `${authors}. "${title}" ${venue}, ${year}.`;
}

// Function to validate form fields
function validateField(field, value) {
    const validations = {
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        required: (val) => val && val.trim().length > 0,
        minLength: (val, min = 3) => val && val.length >= min
    };
    
    return validations[field] ? validations[field](value) : true;
}

    // ===== RESEARCH AREA IMAGE HOVER EFFECT =====
    // Swap between static PNG and animated GIF on hover
    const researchFigures = document.querySelectorAll('.research-figure[data-gif]');

    researchFigures.forEach(img => {
        const staticSrc = img.src;
        const gifSrc = img.getAttribute('data-gif');
    
        // Preload the GIF for smooth transition
        const gifImage = new Image();
        gifImage.src = gifSrc;
    
        img.addEventListener('mouseenter', function() {
            this.src = gifSrc;
        });
    
        img.addEventListener('mouseleave', function() {
            this.src = staticSrc;
        });
    });

// Export functions for use in other scripts if needed
window.AcademicWebsite = {
    copyToClipboard,
    downloadCV,
    formatCitation,
    validateField
};

// ===== RESEARCH AREA EXPAND/COLLAPSE =====

function setResearchCardExpandedState(topicId, isExpanded) {
    const card = document.querySelector(`.research-card[data-topic="${topicId}"]`);
    const button = card ? card.querySelector('.expand-btn') : null;
    
    if (card) {
        card.setAttribute('aria-expanded', String(isExpanded));
    }
    
    if (button) {
        button.setAttribute('aria-expanded', String(isExpanded));
    }
}

function expandContentSection(section) {
    if (!section || section.classList.contains('active')) {
        return;
    }

    section.classList.add('active');
    section.style.maxHeight = section.scrollHeight + 'px';

    const clearInlineHeight = (event) => {
        if (event.propertyName === 'max-height') {
            section.style.maxHeight = '';
            section.removeEventListener('transitionend', clearInlineHeight);
        }
    };

    section.addEventListener('transitionend', clearInlineHeight);
}

function collapseContentSection(section) {
    if (!section || !section.classList.contains('active')) {
        return;
    }

    section.style.maxHeight = section.scrollHeight + 'px';

    requestAnimationFrame(() => {
        section.classList.remove('active');
        section.style.maxHeight = '0px';
    });

    const clearInlineHeight = (event) => {
        if (event.propertyName === 'max-height') {
            section.style.maxHeight = '';
            section.removeEventListener('transitionend', clearInlineHeight);
        }
    };

    section.addEventListener('transitionend', clearInlineHeight);
}

function toggleExpand(topicId) {
    const expandedContent = document.getElementById(topicId + '-expanded');
    const allExpandedContent = document.querySelectorAll('.expanded-content');
    const clickedCard = document.querySelector(`.research-card[data-topic="${topicId}"]`);
    
    if (!expandedContent) {
        return;
    }
    
    // Check if we're switching from another expanded section
    const wasAnotherExpanded = Array.from(allExpandedContent).some(content => 
        content.id !== topicId + '-expanded' && content.classList.contains('active')
    );
    
    // Close all other expanded sections
    allExpandedContent.forEach(content => {
        if (content.id !== topicId + '-expanded' && content.classList.contains('active')) {
            collapseContentSection(content);
            const otherTopic = content.id.replace('-expanded', '');
            setResearchCardExpandedState(otherTopic, false);
        }
    });
    
    // Toggle current section
    if (expandedContent.classList.contains('active')) {
        collapseContentSection(expandedContent);
        setResearchCardExpandedState(topicId, false);
    } else {
        expandContentSection(expandedContent);
        setResearchCardExpandedState(topicId, true);
        
        // Lazy load video when section is expanded
        const lazyVideo = expandedContent.querySelector('video.lazy-video[data-src]');
        if (lazyVideo) {
            const videoSrc = lazyVideo.getAttribute('data-src');
            if (videoSrc) {
                const source = lazyVideo.querySelector('source');
                if (source) {
                    source.src = videoSrc;
                    source.removeAttribute('data-src');
                }
                lazyVideo.load();
                lazyVideo.play().catch(err => console.log('Video autoplay prevented:', err));
                lazyVideo.removeAttribute('data-src');
            }
        }
        
        // Fallback: Lazy load WebP/GIF when section is expanded (for backward compatibility)
        const lazyPicture = expandedContent.querySelector('picture');
        if (lazyPicture) {
            const source = lazyPicture.querySelector('source[data-srcset]');
            const img = lazyPicture.querySelector('img.lazy-gif[data-src]');
            
            // Load WebP source
            if (source && source.hasAttribute('data-srcset')) {
                source.srcset = source.getAttribute('data-srcset');
                source.removeAttribute('data-srcset');
            }
            
            // Load fallback image
            if (img && img.hasAttribute('data-src')) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            }
        } else {
            // Fallback for direct img tags (old structure)
            const lazyGif = expandedContent.querySelector('.lazy-gif[data-src]');
            if (lazyGif) {
                const gifSrc = lazyGif.getAttribute('data-src');
                if (gifSrc) {
                    lazyGif.src = gifSrc;
                    lazyGif.removeAttribute('data-src');
                }
            }
        }
        
        // Only scroll if we're not switching from another expanded section
        // or scroll to the card instead of the expanded content
        setTimeout(() => {
            if (wasAnotherExpanded && clickedCard) {
                // When switching between cards, scroll to the clicked card
                const offset = 100;
                const elementPosition = clickedCard.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                // When opening fresh, scroll to expanded content
                const offset = 100;
                const elementPosition = expandedContent.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Re-render MathJax if present
            if (typeof MathJax !== 'undefined') {
                MathJax.typesetPromise([expandedContent]).catch((err) => console.log(err));
            }
        }, 100);
    }
}

function closeExpanded(topicId) {
    const expandedContent = document.getElementById(topicId + '-expanded');
    
    if (!expandedContent) {
        return;
    }

    const card = document.querySelector(`.research-card[data-topic="${topicId}"]`);
    collapseContentSection(expandedContent);
    setResearchCardExpandedState(topicId, false);
    
    // Scroll back to the card
    if (card) {
        setTimeout(() => {
            const offset = 100;
            const elementPosition = card.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 100);
    }
}

// Make entire research cards clickable
document.addEventListener('DOMContentLoaded', function() {
    const researchCards = document.querySelectorAll('.research-card');
    
    researchCards.forEach(card => {
        const topicId = card.getAttribute('data-topic');
        
        // Add click handler to card
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the button directly (to avoid double-trigger)
            if (!e.target.closest('.expand-btn')) {
                toggleExpand(topicId);
            }
        });
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Click to learn more about ' + card.querySelector('h3').textContent);
        card.setAttribute('aria-expanded', 'false');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleExpand(topicId);
            }
        });
    });
});

// Make functions globally available
window.toggleExpand = toggleExpand;
window.closeExpanded = closeExpanded;
