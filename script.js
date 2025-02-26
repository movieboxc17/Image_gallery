const API_KEY = '0eb89182faff50f9ad2aad5df4b7f5b5';
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

// Weather Functions
async function getWeatherData() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather-data');
    currentWeatherDiv.innerHTML = `
        <div class="forecast-card">
            <div>
                <h3>${data.name}</h3>
                <p>${Math.round(data.main.temp)}°C</p>
                <p>${data.weather[0].description}</p>
            </div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
        </div>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast-data');
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
    
    forecastDiv.innerHTML = dailyForecasts.map(day => `
        <div class="forecast-card">
            <div>
                <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
                <p>${Math.round(day.main.temp)}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon">
        </div>
    `).join('');
}

// Slideshow Functions
const updateActiveState = () => {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });
};

const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateActiveState();
};

// Initialize
getWeatherData();
updateActiveState();
setInterval(nextSlide, 6000);
setInterval(getWeatherData, 1800000);

// Popup handling
const popup = document.querySelector('.popup');
const showPopup = () => {
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 25000);
};

setInterval(showPopup, 90000);
setTimeout(() => {
    location.reload();
}, 900000);
