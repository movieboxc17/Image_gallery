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

        // Update forecast with emojis
        const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
        
        dailyForecasts.forEach((day, index) => {
            const dayElement = document.getElementById(`day${index + 1}`);
            const date = new Date(day.dt * 1000);
            const weatherIcon = weatherIcons[day.weather[0].icon] || '🌡️';
            
            // Format date using Swedish locale
            dayElement.querySelector('.day-name').textContent = date.toLocaleDateString('sv-SE', {weekday: 'short'});
            dayElement.querySelector('.temp').textContent = `${weatherIcon} ${Math.round(day.main.temp)}°C`;
        });

    } catch (error) {
        console.log('Weather update failed, retrying in 5 minutes');
        setTimeout(updateWeather, 300000); // Retry after 5 minutes
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

// Popup functionality
const popup = document.querySelector('.popup');
const showPopup = () => {
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 25000);
};

// Initialize and set intervals
updateWeather();
updateActiveState();
setInterval(nextSlide, 6000);
setInterval(updateWeather, 1800000);
setInterval(showPopup, 90000);
