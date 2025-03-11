document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgressBar = document.querySelector('.loading-progress-bar');
    const loadingText = document.querySelector('.loading-text');
    
    // Initialize gallery elements
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.querySelector('.progress-bar');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    
    // Slideshow variables
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideshowInterval;
    let progressInterval;
    const slideInterval = 8000; // 8 seconds per slide
    const refreshInterval = 15 * 60 * 1000; // 15 minutes for page refresh
    
    // Location data for slides
    // Update these lines in your locationData object in script.js:
const locationData = {
    'Alsike Får1': 'Alsike',
    'Alsike Får2': 'Alsike',
    'Alsike Får3': 'Alsike',
    'Alsike Får4': 'Alsike',
    'Alsike Får5': 'Alsike',
    'Alsike Får6': 'Alsike',
    'Alsike Får7': 'Alsike',
    'Alsike Får8': 'Alsike',
    'Alsike Häst1': 'Alsike',
    'Alsike Häst2': 'Alsike',
    'Alsike Häst3': 'Alsike',
    'Alsike Häst4': 'Alsike',
    'Alsike El': 'Alsike',
    'Alsike, Skola': 'Alsike',
    'Alsike, Skola logo': 'Alsike',
    'USA Water1': 'USA',
    'USA Water2': 'USA',
    'USA Clock': 'USA',
    'USA Gold': 'USA',
    'USA Gold 2': 'USA',
    'Uppsala': 'Uppsala',
    'Kreta Bil': 'Kreta',
    'Kreta Hav': 'Kreta',
    'Kreta Hav2': 'Kreta',
};
    
    // Set total slides count
    totalSlidesEl.textContent = totalSlides;
    
    // Activate the first slide to ensure it's visible
    slides[0].classList.add('active');
    
    // Simulate loading progress
    simulateLoading();
    
    function simulateLoading() {
        let progress = 0;
        let loadingInterval = setInterval(() => {
            progress += Math.random() * 2;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                loadingProgressBar.style.width = '100%';
                loadingText.textContent = 'Ready!';
                
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        initializeGallery();
                    }, 800);
                }, 500);
            } else {
                loadingProgressBar.style.width = progress + '%';
                
                if (progress < 30) {
                    loadingText.textContent = 'Loading images...';
                } else if (progress < 60) {
                    loadingText.textContent = 'Preparing your experience...';
                } else if (progress < 90) {
                    loadingText.textContent = 'Almost ready...';
                } else {
                    loadingText.textContent = 'Finalizing...';
                }
            }
        }, 100);
    }
    
    function initializeGallery() {
        // Add overlay to each slide
        slides.forEach(slide => {
            // Create image overlay container
            const imageOverlay = document.createElement('div');
            imageOverlay.classList.add('image-overlay');
            
            // Add copyright text
            const copyrightText = document.createElement('div');
            copyrightText.classList.add('copyright-text');
            copyrightText.textContent = 'ThePhotographers 2025';
            
            // Add location marker
            const locationMarker = document.createElement('div');
            locationMarker.classList.add('location-marker');
            const img = slide.querySelector('img');
            const imgAlt = img ? img.alt : '';
            const location = locationData[imgAlt] || 'Uppsala';
            locationMarker.innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + location;
            
            // Add elements to overlay
            imageOverlay.appendChild(copyrightText);
            imageOverlay.appendChild(locationMarker);
            
            // Add overlay to slide
            slide.appendChild(imageOverlay);
        });
        
        // Initialize first slide
        updateSlideCounter();
        
        // Preload next few images for smoother transitions
        preloadImages();
        
        // Start slideshow
        startSlideshow();
        
        // Set page refresh timer
        setTimeout(() => {
            window.location.reload();
        }, refreshInterval);
        
        // Add version number to footer
        const versionEl = document.querySelector('.version');
        if (versionEl) {
            versionEl.textContent = 'Version 1.3.6';
        }
        
        // Log initialization
        console.log('Gallery initialized with ' + totalSlides + ' slides');
        
        // Remove any control buttons that might exist
        removeControls();
    }
    
    function removeControls() {
        // Remove all control buttons
        const controlsToRemove = [
            '.prev-btn', '.next-btn', '.zoom-in-btn', '.zoom-out-btn',
            '.zoom-reset-btn', '.fullscreen-btn', '.indicator-container',
            '.play-pause-btn', '.share-btn', '.controls'
        ];
        
        controlsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        });
    }
    
    // Navigation functions
    function goToSlide(index) {
        // Reset any running intervals
        clearInterval(slideshowInterval);
        clearInterval(progressInterval);
        progressBar.style.width = '0%';
        
        // Remove active class from current slide
        slides[currentIndex].classList.remove('active');
        
        // Update current index
        currentIndex = index;
        
        // Handle looping
        if (currentIndex < 0) currentIndex = totalSlides - 1;
        if (currentIndex >= totalSlides) currentIndex = 0;
        
        // Activate new slide
        slides[currentIndex].classList.add('active');
        
        // Update slide counter
        updateSlideCounter();
        
        // Preload next images
        preloadImages();
        
        // Restart slideshow
        startSlideshow();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function startSlideshow() {
        // Clear any existing intervals first
        clearInterval(slideshowInterval);
        clearInterval(progressInterval);
        
        // Reset progress bar
        let progress = 0;
        progressBar.style.width = '0%';
        
        // Start progress bar animation
        progressInterval = setInterval(() => {
            progress += 100 / (slideInterval / 100);
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
        }, 100);
        
        // Set interval for slide change
        slideshowInterval = setInterval(() => {
            nextSlide();
        }, slideInterval);
    }
    
    function updateSlideCounter() {
        currentSlideEl.textContent = currentIndex + 1;
    }
    
    function preloadImages() {
        // Preload next 3 images
        for (let i = 1; i <= 3; i++) {
            const nextIndex = (currentIndex + i) % totalSlides;
            const img = slides[nextIndex].querySelector('img');
            
            if (img && img.getAttribute('loading') === 'lazy') {
                img.setAttribute('loading', 'eager');
                
                const preloader = new Image();
                preloader.src = img.src;
            }
        }
    }
    
    // Ensure slideshow starts even if there are issues
    setTimeout(() => {
        if (!slideshowInterval) {
            console.log('Starting slideshow via fallback');
            startSlideshow();
        }
    }, 1500);
});
