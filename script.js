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
            // Make loading more smooth and realistic
            progress += Math.random() * 1.5;
            
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
                
                if (progress < 25) {
                    loadingText.textContent = 'Loading images...';
                } else if (progress < 50) {
                    loadingText.textContent = 'Preparing your experience...';
                } else if (progress < 75) {
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
            
            // Add Instagram container instead of copyright text
            const instagramContainer = document.createElement('div');
            instagramContainer.classList.add('instagram-container');
            
            // Create QR code element
            const qrCode = document.createElement('div');
            qrCode.classList.add('instagram-qr');
            // Use a data URI for the QR code or link to an image
            qrCode.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.instagram.com/the.photographers3" alt="Instagram QR Code">`;
            
            // Create text container
            const textContainer = document.createElement('div');
            textContainer.classList.add('instagram-text');
            textContainer.innerHTML = `
                <div class="instagram-title">Follow Us On Instagram</div>
                <div class="instagram-handle"><i class="fab fa-instagram"></i>@the.photographers3</div>
                <div class="instagram-tagline">Discover more stunning photography and follow our creative journey</div>
                <div class="instagram-support">Please support our work by following and sharing!</div>
                <div class="instagram-cta">Scan QR code or tap to visit</div>
            `;
            
            // Add elements to Instagram container
            instagramContainer.appendChild(qrCode);
            instagramContainer.appendChild(textContainer);
            
            // Make the Instagram container clickable
            instagramContainer.addEventListener('click', function() {
                window.open('https://www.instagram.com/the.photographers3', '_blank');
            });
            
            // Add location marker
            const locationMarker = document.createElement('div');
            locationMarker.classList.add('location-marker');
            const img = slide.querySelector('img');
            const imgAlt = img ? img.alt : '';
            const location = locationData[imgAlt] || 'Uppsala';
            locationMarker.innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + location;
            
            // Add elements to overlay
            imageOverlay.appendChild(instagramContainer);
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
            versionEl.textContent = 'Version 1.3.7';
        }
        
        // Log initialization
        console.log('Gallery initialized with ' + totalSlides + ' slides');
        
        // Remove any control buttons that might exist
        removeControls();
        
        // Add error handling for images
        addImageErrorHandling();
    }    
    function addImageErrorHandling() {
        // Add error handling for all images
        const allImages = document.querySelectorAll('.slide img');
        allImages.forEach(img => {
            img.onerror = function() {
                console.log('Error loading image: ' + img.src);
                // Replace with a fallback image or add a class for styling
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiPkltYWdlIGNvdWxkIG5vdCBiZSBsb2FkZWQ8L3RleHQ+PC9zdmc+';
                img.classList.add('image-error');
            };
        });
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
        
        // Add keyboard navigation for development/testing
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                goToSlide(currentIndex - 1);
            } else if (e.key === 'r') {
                window.location.reload();
            }
        });
        
        // Handle window resize for better responsiveness
        window.addEventListener('resize', function() {
            // Adjust any necessary elements based on new window size
            console.log('Window resized, adjusting layout');
        });
        
        // Handle visibility change to pause/resume slideshow when tab is inactive
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Page is hidden, pause slideshow to save resources
                clearInterval(slideshowInterval);
                clearInterval(progressInterval);
            } else {
                // Page is visible again, resume slideshow
                startSlideshow();
            }
        });
        
        // Add touch support for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            // Detect swipe direction and navigate accordingly
            const swipeThreshold = 50; // Minimum distance for a swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next slide
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous slide
                goToSlide(currentIndex - 1);
            }
        }
        
        // Function to handle any broken images
        function checkBrokenImages() {
            const allImages = document.querySelectorAll('.slide img');
            allImages.forEach(img => {
                // Check if image is already loaded
                if (img.complete) {
                    if (img.naturalWidth === 0) {
                        // Image failed to load
                        handleBrokenImage(img);
                    }
                } else {
                    // Image is not yet loaded, add event listeners
                    img.addEventListener('load', function() {
                        // Image loaded successfully
                    }, false);
                    
                    img.addEventListener('error', function() {
                        // Image failed to load
                        handleBrokenImage(img);
                    }, false);
                }
            });
        }
        
        function handleBrokenImage(img) {
            console.log('Handling broken image: ' + img.src);
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiPkltYWdlIGNvdWxkIG5vdCBiZSBsb2FkZWQ8L3RleHQ+PC9zdmc+';
            img.classList.add('image-error');
        }
        
        // Check for broken images after a short delay
        setTimeout(checkBrokenImages, 2000);
        
        // Performance optimization: reduce animations when battery is low
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                if (battery.level < 0.15 && !battery.charging) {
                    // Battery is low, reduce animations
                    document.documentElement.classList.add('low-battery-mode');
                    console.log('Low battery detected, reducing animations');
                }
                
                // Listen for battery level changes
                battery.addEventListener('levelchange', function() {
                    if (battery.level < 0.15 && !battery.charging) {
                        document.documentElement.classList.add('low-battery-mode');
                    } else {
                        document.documentElement.classList.remove('low-battery-mode');
                    }
                });
            });
        }
        
        // Log any errors to console for debugging
        window.onerror = function(message, source, lineno, colno, error) {
            console.error('Error occurred: ', message, 'at', source, lineno, colno);
            return true; // Prevents default error handling
        };
    });    
