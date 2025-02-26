const API_KEY = '0eb89182faff50f9ad2aad5df4b7f5b5';
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

// Weather functionality
async function updateWeather() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Fetch current weather
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const currentData = await currentResponse.json();

        // Fetch forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();

        // Update current weather display
        document.getElementById('current-icon').src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`;
        document.getElementById('current-temp').textContent = `${Math.round(currentData.main.temp)}°C`;

        // Update forecast display
        const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
        
        dailyForecasts.forEach((day, index) => {
            const dayElement = document.getElementById(`day${index + 1}`);
            const date = new Date(day.dt * 1000);
            dayElement.querySelector('.day-name').textContent = date.toLocaleDateString('en-US', {weekday: 'short'});
            dayElement.querySelector('img').src = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            dayElement.querySelector('.temp').textContent = `${Math.round(day.main.temp)}°C`;
        });
    } catch (error) {
        console.log('Weather data unavailable');
    }
}

// Slideshow functionality
const updateActiveState = () => {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });
};

const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateActiveState();
};

// Touch functionality for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

const handleSwipe = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - previous slide
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        } else {
            // Swipe left - next slide
            currentIndex = (currentIndex + 1) % slides.length;
        }
        updateActiveState();
    }
};

// Popup functionality
const popup = document.querySelector('.popup');
const overlay = document.querySelector('.overlay');

const showPopup = () => {
    popup.classList.add('show');
    overlay.style.display = 'block';
    setTimeout(() => {
        popup.classList.remove('show');
        overlay.style.display = 'none';
    }, 25000);
};

// Initialize all functionalities
updateWeather();
updateActiveState();

// Set intervals for recurring actions
setInterval(nextSlide, 6000);
setInterval(updateWeather, 1800000);
setInterval(showPopup, 90000);

// Page refresh timer
setTimeout(() => {
    location.reload();
}, 900000);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % slides.length;
        updateActiveState();
    } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateActiveState();
    }
});
