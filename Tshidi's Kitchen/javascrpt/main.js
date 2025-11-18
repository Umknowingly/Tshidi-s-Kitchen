// main.js - Enhanced JavaScript for TSHIDI'S KITCHEN

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initAccordions();
    initGalleryLightbox();
    initSearchFunctionality();
    initFormValidation();
    initDynamicContent();
    initGoogleMap();
});

// 1. Accordion functionality for FAQ sections
function initAccordions() {
    const accordions = document.querySelectorAll('details');
    
    accordions.forEach(accordion => {
        const summary = accordion.querySelector('summary');
        
        summary.addEventListener('click', function(e) {
            if (accordion.hasAttribute('open')) {
                e.preventDefault();
                accordion.removeAttribute('open');
            }
        });
        
        // Add animation
        accordion.addEventListener('toggle', function() {
            if (accordion.open) {
                accordion.style.maxHeight = accordion.scrollHeight + 'px';
            } else {
                accordion.style.maxHeight = '0';
            }
        });
    });
}

// 2. Gallery Lightbox
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image, .product-image img, .item-image img');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="" class="lightbox-image">
            <div class="lightbox-caption"></div>
            <button class="lightbox-nav lightbox-prev">&#10094;</button>
            <button class="lightbox-nav lightbox-next">&#10095;</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    let currentImageIndex = 0;
    const images = Array.from(galleryImages);
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(img);
        });
    });
    
    function openLightbox(img) {
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        caption.textContent = img.alt || 'TSHIDI\'S KITCHEN Image';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Lightbox navigation
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openLightbox(images[currentImageIndex]);
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openLightbox(images[currentImageIndex]);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

// 3. Search Functionality
function initSearchFunctionality() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="site-search" placeholder="Search products, menu items..." aria-label="Search">
        <button id="search-button" aria-label="Submit search"><i class="fas fa-search"></i></button>
        <div id="search-results" class="search-results"></div>
    `;
    
    // Insert search in navigation
    const nav = document.querySelector('nav');
    if (nav) {
        nav.appendChild(searchContainer);
    }
    
    const searchInput = document.getElementById('site-search');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    // Search functionality
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }
        
        // Search through content (simplified - in real implementation, you'd search through your actual content)
        const results = searchContent(query);
        
        displaySearchResults(results, query);
    }
    
    function searchContent(query) {
        // This would search through your actual content
        // For demonstration, we'll use a simple approach
        const searchableElements = document.querySelectorAll('h1, h2, h3, p, .product-card, .menu-item');
        const results = [];
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                results.push({
                    element: element,
                    text: element.textContent,
                    type: element.tagName.toLowerCase()
                });
            }
        });
        
        return results.slice(0, 10); // Limit to 10 results
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `<p>No results found for "${query}"</p>`;
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${getElementLink(result.element)}">
                        <h4>${highlightText(result.text, query)}</h4>
                        <p>${result.type === 'h1' ? 'Page' : 'Section'}</p>
                    </a>
                </div>
            `).join('');
        }
        
        searchResults.classList.add('active');
    }
    
    function getElementLink(element) {
        // Get the closest section or article and find its ID for linking
        const section = element.closest('section, article');
        if (section && section.id) {
            return `${window.location.pathname}#${section.id}`;
        }
        return window.location.pathname;
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // Event listeners
    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// 4. Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        showFormSuccess(form);
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Clear previous errors
    alert(field);
    
    // Required field validation
    if (field.hasAttribute('required') && value === '') {
        alert(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            alert(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        if (!phoneRegex.test(value)) {
            alert(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function getFieldLabel(field) {
    const label = field.labels && field.labels[0];
    return label ? label.textContent.replace('*', '').trim() : 'This field';
}

function showFormSuccess(form) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Thank You!</h3>
        <p>Your message has been sent successfully. We'll get back to you soon.</p>
    `;
    successMessage.setAttribute('role', 'alert');
    
    // Insert before form
    form.parentNode.insertBefore(successMessage, form);
    form.style.display = 'none';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth' });
}

// 5. Dynamic Content
function initDynamicContent() {
    // Update featured products dynamically
    updateFeaturedProducts();
    
    // Add real-time clock
    addRealTimeClock();
    
    // Update special offers
    updateSpecialOffers();
}

function updateFeaturedProducts() {
    // This could fetch from an API in a real implementation
    const featuredContainer = document.querySelector('.featured-products .product-grid');
    if (!featuredContainer) return;
    
    // Simulate dynamic content update
    setInterval(() => {
        const products = featuredContainer.querySelectorAll('.product-card');
        if (products.length > 1) {
            const firstProduct = products[0];
            featuredContainer.appendChild(firstProduct);
        }
    }, 10000); // Rotate every 10 seconds
}

function addRealTimeClock() {
    const clockContainer = document.createElement('div');
    clockContainer.className = 'real-time-clock';
    clockContainer.innerHTML = `
        <span class="clock-label">Current Time:</span>
        <span class="clock-time"></span>
    `;
    
    // Add to header or a suitable location
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(clockContainer);
    }
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-ZA', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        const clockElement = document.querySelector('.clock-time');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

function updateSpecialOffers() {
    // This could fetch from an API
    const offers = [
        "Today's Special: Buy 2 sauces get 1 free!",
        "Weekend Deal: 20% off all main courses",
        "New: Try our seasonal Marula special"
    ];
    
    const offerElement = document.createElement('div');
    offerElement.className = 'special-offer';
    offerElement.setAttribute('aria-live', 'polite');
    
    // Add to a suitable location, e.g., after hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.parentNode.insertBefore(offerElement, hero.nextSibling);
    }
    
    let currentOffer = 0;
    
    function rotateOffers() {
        offerElement.innerHTML = `
            <div class="offer-content">
                <i class="fas fa-tag"></i>
                <span>${offers[currentOffer]}</span>
            </div>
        `;
        
        currentOffer = (currentOffer + 1) % offers.length;
    }
    
    rotateOffers();
    setInterval(rotateOffers, 8000); // Change every 8 seconds
}

// 6. Google Maps Integration
function initGoogleMap() {
    const mapContainers = document.querySelectorAll('.map-container');
    
    mapContainers.forEach(container => {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined') {
            console.warn('Google Maps API not loaded');
            return;
        }
        
        const mapElement = container.querySelector('iframe');
        if (!mapElement) return;
        
        // Replace static iframe with interactive map
        const interactiveMap = document.createElement('div');
        interactiveMap.className = 'interactive-map';
        interactiveMap.style.height = '450px';
        
        mapElement.replaceWith(interactiveMap);
        
        // Initialize map
        const map = new google.maps.Map(interactiveMap, {
            center: { lat: -23.8965, lng: 29.4486 }, // Polokwane coordinates
            zoom: 15,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#f5f5f5" }]
                }
            ]
        });
        
        // Add marker
        const marker = new google.maps.Marker({
            position: { lat: -23.8965, lng: 29.4486 },
            map: map,
            title: "TSHIDI'S KITCHEN",
            icon: {
                url: '../assets/map-marker.png',
                scaledSize: new google.maps.Size(40, 40)
            }
        });
        
        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>TSHIDI'S KITCHEN</h3>
                    <p>123 Flavour Street, Polokwane</p>
                    <p>Limpopo, South Africa</p>
                    <a href="./contact.html" class="map-directions">Get Directions</a>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });
}

// Utility function to load Google Maps API
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Export functions for global access
window.initGoogleMap = initGoogleMap;