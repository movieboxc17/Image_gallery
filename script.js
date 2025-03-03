const API_KEY = '0eb89182faff50f9ad2aad5df4b7f5b5';
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

// Pre-configured location for Alsike, Knivsta, Sweden
const LOCATION = {
    lat: 59.7833,
    lon: 17.8333,
    timezone: 'Europe/Stockholm'
};

// Custom weather icons using text/emoji for better TV compatibility
const weatherIcons = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain
    '10n': '🌧️',
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '🌨️', // snow
    '13n': '🌨️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
};

// Image metadata for captions
const imageMetadata = [
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Aslike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Umeå", caption: "", coords: "" },
    { location: "Uppsala", caption: "", coords: "" },
    { location: "Uppsala", caption: "", coords: "" },
    { location: "Umeå", caption: "", coords: "" },
    { location: "Åre", caption: "", coords: "" },
    { location: "USA, minnesota", caption: "", coords: "" },
    { location: "USA, minnesota", caption: "", coords: "" },
    { location: "USA, minnesota", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "USA, minnesota", caption: "", coords: "" },
    { location: "USA, minnesota", caption: "", coords: "" },
    { location: "Uppsala", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Alsike", caption: "", coords: "" },
    { location: "Kreat", caption: "", coords: "" },
    { location: "Kreat", caption: "", coords: "" },
    { location: "Kreat", caption: "", coords: "" }
];

// Weather update function
async function updateWeather() {
    try {
        // Using pre-configured coordinates
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LOCATION.lat}&lon=${LOCATION.lon}&appid=${API_KEY}&units=metric`);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LOCATION.lat}&lon=${LOCATION.lon}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();

        // Update current weather with emoji
        const currentWeatherIcon = weatherIcons[currentData.weather[0].icon] || '🌡️';
        document.getElementById('current-temp').textContent = `${currentWeatherIcon} ${Math.round(currentData.main.temp)}°C`;
        document.getElementById('current-temp').setAttribute('title', currentData.weather[0].description);

        // Update forecast with emojis
        const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
        
        dailyForecasts.forEach((day, index) => {
            const dayElement = document.getElementById(`day${index + 1}`);
            const date = new Date(day.dt * 1000);
            const weatherIcon = weatherIcons[day.weather[0].icon] || '🌡️';
            
            // Format date using Swedish locale
            dayElement.querySelector('.day-name').textContent = date.toLocaleDateString('sv-SE', {weekday: 'short'});
            dayElement.querySelector('.temp').textContent = `${weatherIcon} ${Math.round(day.main.temp)}°C`;
            dayElement.setAttribute('title', day.weather[0].description);
        });

    } catch (error) {
        console.log('Weather update failed, retrying in 5 minutes');
        setTimeout(updateWeather, 300000); // Retry after 5 minutes
    }
}

// Enhanced slideshow with animations
function initSlideshow() {
    // Add progress dots
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        progressContainer.appendChild(dot);
    });
    
    document.querySelector('.slideshow-container').appendChild(progressContainer);
    
    // Add navigation arrows with pulsing effect
    const prevArrow = document.createElement('div');
    prevArrow.className = 'nav-arrow prev-arrow';
    prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevArrow.addEventListener('click', prevSlide);
    
    const nextArrow = document.createElement('div');
    nextArrow.className = 'nav-arrow next-arrow';
    nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextArrow.addEventListener('click', nextSlide);
    
    document.querySelector('.slideshow-container').appendChild(prevArrow);
    document.querySelector('.slideshow-container').appendChild(nextArrow);
    
    // Add location badges and captions
    slides.forEach((slide, i) => {
        // Only apply to as many slides as we have metadata for
        if (i < imageMetadata.length) {
            const locationBadge = document.createElement('div');
            locationBadge.className = 'location-badge';
            locationBadge.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${imageMetadata[i].location}`;
            
            const caption = document.createElement('div');
            caption.className = 'slide-caption';
            caption.innerHTML = `<p>${imageMetadata[i].caption}</p><small>${imageMetadata[i].coords}</small>`;
            
            const photoCredit = document.createElement('div');
            photoCredit.className = 'photo-credit';
            photoCredit.textContent = '© ThePhotographers';
            
            slide.appendChild(locationBadge);
            slide.appendChild(caption);
            slide.appendChild(photoCredit);
        }
    });
    
    // Add image zoom functionality
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        img.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    });
}

// Slide navigation functions
const updateActiveState = () => {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });
    
    // Update progress dots
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
};

const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateActiveState();
    updateBackgroundGradient();
};

const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateActiveState();
    updateBackgroundGradient();
};

const goToSlide = (index) => {
    currentIndex = index;
    updateActiveState();
    updateBackgroundGradient();
};

// Dynamic background based on current image
const updateBackgroundGradient = () => {
    document.body.style.transition = 'background 1.5s ease';
    
    // Different gradient for each group of images
    const colorSchemes = [
        'linear-gradient(135deg, #0f1746, #120f2d, #000)',
        'linear-gradient(135deg, #1a472a, #0d1321, #000)',
        'linear-gradient(135deg, #5c2e2e, #2b2118, #000)',
        'linear-gradient(135deg, #2c3e50, #1e3c72, #000)'
    ];
    
    document.body.style.background = colorSchemes[currentIndex % colorSchemes.length];
    document.body.style.backgroundSize = '400% 400%';
};

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === ' ') {
        // Space bar toggles zoom on current image
        const currentImg = slides[currentIndex].querySelector('img');
        currentImg.classList.toggle('zoomed');
    }
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slideshow-container').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.slideshow-container').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

const handleSwipe = () => {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
        nextSlide();
    } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
    }
};

// Initialize and set intervals
document.addEventListener('DOMContentLoaded', function() {
    updateWeather();
    initSlideshow();
    updateActiveState();
    updateBackgroundGradient();
    detectImageOrientation(); // Add this line
    
    setInterval(nextSlide, 8000);
    setInterval(updateWeather, 1800000);

    // Enhance image quality after loading
    setTimeout(() => {
        document.querySelectorAll('.slide img').forEach(img => {
            // Load higher quality version of the same image
            const src = img.src;
            img.style.transition = 'filter 0.5s ease';
            img.style.filter = 'blur(5px)';
            
            // Create a new high-res image
            const highResImg = new Image();
            // If you have different URLs for high-res versions, use those instead
            highResImg.src = src;
            
            highResImg.onload = function() {
                img.src = highResImg.src;
                img.style.filter = 'blur(0)';
            };
        });
    }, 1000); // Wait for initial load
});

// Detect image orientation and apply appropriate classes
function detectImageOrientation() {
    const slideImages = document.querySelectorAll('.slide img');
    
    slideImages.forEach(img => {
        // Wrap image in container if not already
        if (!img.parentElement.classList.contains('slide-image-container')) {
            const container = document.createElement('div');
            container.className = 'slide-image-container';
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);
        }
        
        // Check orientation once image is loaded
        if (img.complete) {
            checkOrientation(img);
        } else {
            img.onload = function() {
                checkOrientation(img);
            };
        }
    });
    
    function checkOrientation(img) {
        // If image is taller than it is wide
        if (img.naturalHeight > img.naturalWidth) {
            img.closest('.slide').classList.add('portrait');
        } else {
            img.closest('.slide').classList.remove('portrait');
        }
    }
}
