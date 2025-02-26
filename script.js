const API_KEY = '0eb89182faff50f9ad2aad5df4b7f5b5';
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

async function updateWeather() {
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

        document.getElementById('current-icon').src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`;
        document.getElementById('current-temp').textContent = `${Math.round(currentData.main.temp)}°C`;

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

const updateActiveState = () => {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });
};

const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateActiveState();
};

const popup = document.querySelector('.popup');
const showPopup = () => {
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 25000);
};

updateWeather();
updateActiveState();
setInterval(nextSlide, 6000);
setInterval(updateWeather, 1800000);
setInterval(showPopup, 90000);
setTimeout(() => {
    location.reload();
}, 900000);
