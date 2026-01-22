/**
 * MERGED SCRIPT - All JavaScript functionality in one file
 * Combines: main.js, gallery.js, subscriptions.js, stats-counter.js, accordion.js
 */

// ============================================================================
// MAIN.JS - Navigation and hamburger menu functionality
// ============================================================================

// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('header')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll event listener for header shadow
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 0) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Accessibility: Set active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
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

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ============================================================================
// GALLERY.JS - Product image gallery with carousel functionality
// ============================================================================

class ProductGallery {
    constructor() {
        this.currentIndex = 0;
        this.galleryImages = [
            'assets/perfume1.jpg',
            'assets/perfume2.jpg',
            'assets/perfume3.jpg'
        ];

        this.initElements();
        this.attachEventListeners();
        this.updateDisplay();
    }

    initElements() {
        this.mainImage = document.getElementById('mainImage');
        this.prevBtn = document.getElementById('galleryPrevBtn');
        this.nextBtn = document.getElementById('galleryNextBtn');
        this.dots = document.querySelectorAll('.carousel-dot');
    }

    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousImage());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextImage());
        }

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToImage(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });

        // Auto-rotate gallery (optional)
        // setInterval(() => this.nextImage(), 5000);
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        this.updateDisplay();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
        this.updateDisplay();
    }

    goToImage(index) {
        this.currentIndex = index;
        this.updateDisplay();
    }

    updateDisplay() {
        // Update main image with fade transition
        if (this.mainImage) {
            this.mainImage.style.opacity = '0.5';
            setTimeout(() => {
                this.mainImage.src = this.galleryImages[this.currentIndex];
                this.mainImage.style.transition = 'opacity 0.3s ease';
                this.mainImage.style.opacity = '1';
            }, 150);
        }

        // Update dots
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update aria-label for accessibility
        if (this.mainImage) {
            this.mainImage.setAttribute('alt', `Perfume bottle view ${this.currentIndex + 1} of ${this.galleryImages.length}`);
        }
    }
}

// ============================================================================
// SUBSCRIPTIONS.JS - Handle subscription options and Add to Cart functionality
// ============================================================================

class SubscriptionHandler {
    constructor() {
        this.purchaseTypeRadios = document.querySelectorAll('input[name="purchaseType"]');
        this.fragranceRadios = document.querySelectorAll('input[name="fragrance"]');
        this.fragranceDoubleRadios = document.querySelectorAll('input[name="fragrance-double"]');
        this.addToCartBtn = document.getElementById('addToCartBtn');
        this.subscriptionBoxes = document.querySelectorAll('.subscription-box');

        this.currentPurchaseType = 'single';
        this.currentFragrance = 'original';

        this.initEventListeners();
        this.updateAddToCartButton();
    }

    initEventListeners() {
        // Purchase type radio buttons
        this.purchaseTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handlePurchaseTypeChange(e.target.value);
            });
        });

        // Single Fragrance radio buttons
        this.fragranceRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentFragrance = e.target.value;
                this.updateAddToCartButton();
            });
        });

        // Double Fragrance radio buttons
        this.fragranceDoubleRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentFragrance = e.target.value;
                this.updateAddToCartButton();
            });
        });

        // Add to Cart button
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAddToCart();
            });
        }
    }

    handlePurchaseTypeChange(purchaseType) {
        this.currentPurchaseType = purchaseType;

        // Toggle visibility of fragrance options and included sections
        this.subscriptionBoxes.forEach((box, index) => {
            const options = box.querySelectorAll('.fragrance-options');
            const includedSections = box.querySelectorAll('.included-section');
            const whatIncludedTitles = box.querySelectorAll('.what-included-title');
            const benefitsLists = box.querySelectorAll('.benefits-list');

            if ((purchaseType === 'single' && index === 0) || (purchaseType === 'double' && index === 1)) {
                // Show this box's content
                options.forEach(opt => opt.style.display = 'block');
                includedSections.forEach(sec => sec.style.display = 'flex');
                whatIncludedTitles.forEach(title => title.style.display = 'block');
                benefitsLists.forEach(list => list.style.display = 'block');
            } else {
                // Hide other boxes' content
                options.forEach(opt => opt.style.display = 'none');
                includedSections.forEach(sec => sec.style.display = 'none');
                whatIncludedTitles.forEach(title => title.style.display = 'none');
                benefitsLists.forEach(list => list.style.display = 'none');
            }
        });

        this.updateAddToCartButton();
    }

    updateAddToCartButton() {
        if (!this.addToCartBtn) return;

        // Create different URLs based on selection
        const baseUrl = 'https://example.com/checkout/';
        const params = new URLSearchParams({
            product: 'gtg-perfume',
            type: this.currentPurchaseType,
            fragrance: this.currentFragrance,
            timestamp: Date.now()
        });

        const checkoutUrl = `${baseUrl}?${params.toString()}`;
        this.addToCartBtn.href = checkoutUrl;
        this.addToCartBtn.setAttribute('data-purchase', this.currentPurchaseType);
        this.addToCartBtn.setAttribute('data-fragrance', this.currentFragrance);

        // Update button text based on selection
        const price = this.currentPurchaseType === 'single' ? '$99.99' : '$199.99';
        this.addToCartBtn.textContent = `Add to Cart - ${price}`;
    }

    handleAddToCart() {
        const url = this.addToCartBtn.href;
        const purchaseType = this.currentPurchaseType;
        const fragrance = this.currentFragrance;

        // Log the selection for debugging
        console.log('Adding to cart:', {
            purchaseType,
            fragrance,
            url
        });

        // Show confirmation toast (optional)
        this.showToast(`Added ${fragrance} ${purchaseType} subscription to cart!`);

        // In a real application, this would redirect or make an API call
        // window.location.href = url;
    }

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a5f3f;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ============================================================================
// STATS-COUNTER.JS - Animate percentage counters on scroll into view
// ============================================================================

class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-counter');
        this.hasStarted = false;
        this.initObserver();
    }

    initObserver() {
        // Use Intersection Observer to detect when stats section comes into view
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasStarted) {
                    this.hasStarted = true;
                    this.startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe the stats section
        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    startCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = Date.now();
            const startValue = 0;

            const updateCounter = () => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                // Easing function for smooth animation
                const easeOutQuad = (t) => t * (2 - t);
                const easedProgress = easeOutQuad(progress);
                const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

                counter.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ============================================================================
// ACCORDION.JS - Expandable accordion functionality
// ============================================================================

class Accordion {
    constructor() {
        this.accordionItems = document.querySelectorAll('.accordion-item');
        this.initAccordion();
    }

    initAccordion() {
        this.accordionItems.forEach((item, index) => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');

            // First item is open by default
            if (index === 0) {
                content.style.display = 'block';
                icon.textContent = '−';
            } else {
                content.style.display = 'none';
                icon.textContent = '+';
            }

            // Add click event listener
            header.addEventListener('click', () => {
                this.toggleAccordion(item, header, content, icon);
            });

            // Add keyboard accessibility
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleAccordion(item, header, content, icon);
                }
            });
        });
    }

    toggleAccordion(item, header, content, icon) {
        const isOpen = content.style.display === 'block';

        if (isOpen) {
            // Close the accordion
            content.style.display = 'none';
            icon.textContent = '+';
            content.style.animation = 'none';
        } else {
            // Open the accordion
            content.style.display = 'block';
            icon.textContent = '−';
            content.style.animation = 'slideDown 0.3s ease';
        }

        // Optional: Close other accordions (for single-open behavior)
        // Uncomment below if you want only one accordion open at a time
        /*
        this.accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherContent = otherItem.querySelector('.accordion-content');
                const otherIcon = otherItem.querySelector('.accordion-icon');
                otherContent.style.display = 'none';
                otherIcon.textContent = '+';
            }
        });
        */
    }
}

// ============================================================================
// INITIALIZATION - Initialize all modules when DOM is ready
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    new ProductGallery();
    new SubscriptionHandler();
    new StatsCounter();
    new Accordion();
    
    // Make fragrance images clickable to select radio
    const fragranceItems = document.querySelectorAll('.fragrance-item');
    fragranceItems.forEach(item => {
        const fragranceImg = item.querySelector('.fragrance-img');
        const radioInput = item.querySelector('input[type="radio"]');
        
        if (fragranceImg && radioInput) {
            fragranceImg.addEventListener('click', (e) => {
                e.preventDefault();
                radioInput.checked = true;
                radioInput.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    });
    
    console.log('GTG Perfumes - All scripts initialized successfully');
});
