/**
 * Weather Dashboard Application
 * Author: K G ASHAN CHAMINDU
 * Student ID: ITBNM-2313-0009
 * 
 * This application fetches and displays weather data from OpenWeatherMap API
 */

// ============================================
// CONFIGURATION
// ============================================

// OpenWeatherMap API Configuration
// Get your FREE API key from: https://openweathermap.org/api
const API_KEY = '76b9488f77bc2217af8036c4f2960444'; // OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    currentWeather: document.getElementById('currentWeather'),
    forecastSection: document.getElementById('forecastSection'),
    forecastContainer: document.getElementById('forecastContainer'),
    // Current weather elements
    cityName: document.getElementById('cityName'),
    countryCode: document.getElementById('countryCode'),
    dateTime: document.getElementById('dateTime'),
    temperature: document.getElementById('temperature'),
    description: document.getElementById('description'),
    weatherIcon: document.getElementById('weatherIcon'),
    windSpeed: document.getElementById('windSpeed'),
    humidity: document.getElementById('humidity'),
    feelsLike: document.getElementById('feelsLike'),
    visibility: document.getElementById('visibility'),
    // Quick city buttons
    quickCityBtns: document.querySelectorAll('.quick-city')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date to readable string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format day name from timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Day name
 */
function getDayName(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format date for forecast cards
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date (e.g., "Jan 15")
 */
function formatShortDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get weather icon URL
 * @param {string} iconCode - Weather icon code from API
 * @returns {string} Icon URL
 */
function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

/**
 * Round temperature to nearest integer
 * @param {number} temp - Temperature value
 * @returns {number} Rounded temperature
 */
function roundTemp(temp) {
    return Math.round(temp);
}

// ============================================
// UI FUNCTIONS
// ============================================

/**
 * Show loading state
 */
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.currentWeather.classList.add('hidden');
    elements.forecastSection.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
}

/**
 * Hide loading state
 */
function hideLoading() {
    elements.loading.classList.add('hidden');
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    elements.errorMessage.classList.remove('hidden');
    elements.errorText.textContent = message;
    elements.currentWeather.classList.add('hidden');
    elements.forecastSection.classList.add('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorMessage.classList.add('hidden');
}

/**
 * Display current weather data
 * @param {Object} data - Weather data from API
 */
function displayCurrentWeather(data) {
    elements.cityName.textContent = data.name;
    elements.countryCode.textContent = data.sys.country;
    elements.dateTime.textContent = formatDate(data.dt);
    elements.temperature.textContent = roundTemp(data.main.temp);
    elements.description.textContent = data.weather[0].description;
    elements.weatherIcon.src = getWeatherIconUrl(data.weather[0].icon);
    elements.weatherIcon.alt = data.weather[0].description;
    elements.windSpeed.textContent = `${data.wind.speed} m/s`;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.feelsLike.textContent = `${roundTemp(data.main.feels_like)}°C`;
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    elements.currentWeather.classList.remove('hidden');
}

/**
 * Display 5-day forecast
 * @param {Object} data - Forecast data from API
 */
function displayForecast(data) {
    // Get daily forecasts (API returns 3-hour intervals, we want one per day)
    const dailyForecasts = {};

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();

        // Only keep mid-day forecast for each day (around 12:00)
        const hour = new Date(item.dt * 1000).getHours();

        if (!dailyForecasts[date] || (hour >= 11 && hour <= 14)) {
            dailyForecasts[date] = item;
        }
    });

    // Get next 5 days (skip today)
    const forecasts = Object.values(dailyForecasts).slice(1, 6);

    elements.forecastContainer.innerHTML = forecasts.map(forecast => `
        <div class="forecast-card">
            <div class="forecast-day">${getDayName(forecast.dt)}</div>
            <div class="forecast-date">${formatShortDate(forecast.dt)}</div>
            <img 
                src="${getWeatherIconUrl(forecast.weather[0].icon)}" 
                alt="${forecast.weather[0].description}"
                class="forecast-icon"
            >
            <div class="forecast-temp">
                <span class="temp-high">${roundTemp(forecast.main.temp_max)}°</span>
                <span class="temp-low">${roundTemp(forecast.main.temp_min)}°</span>
            </div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        </div>
    `).join('');

    elements.forecastSection.classList.remove('hidden');
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch current weather data for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
async function fetchCurrentWeather(city) {
    const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
            throw new Error('Failed to fetch weather data. Please try again later.');
        }
    }

    return response.json();
}

/**
 * Fetch 5-day forecast data for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} Forecast data
 */
async function fetchForecast(city) {
    const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch forecast data.');
    }

    return response.json();
}

/**
 * Main function to get weather for a city
 * @param {string} city - City name
 */
async function getWeather(city) {
    if (!city.trim()) {
        showError('Please enter a city name.');
        return;
    }

    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please add your OpenWeatherMap API key in scripts/app.js');
        return;
    }

    showLoading();
    hideError();

    try {
        // Fetch both current weather and forecast in parallel
        const [currentData, forecastData] = await Promise.all([
            fetchCurrentWeather(city),
            fetchForecast(city)
        ]);

        hideLoading();
        displayCurrentWeather(currentData);
        displayForecast(forecastData);

        // Save last searched city
        localStorage.setItem('lastCity', city);

    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Weather fetch error:', error);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Search button click
elements.searchBtn.addEventListener('click', () => {
    const city = elements.cityInput.value;
    getWeather(city);
});

// Enter key press in input
elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = elements.cityInput.value;
        getWeather(city);
    }
});

// Quick city buttons
elements.quickCityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const city = btn.dataset.city;
        elements.cityInput.value = city;
        getWeather(city);
    });
});

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 */
function init() {
    // Load last searched city or default to Colombo
    const lastCity = localStorage.getItem('lastCity') || 'Colombo';
    elements.cityInput.value = lastCity;

    // Check for API key
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('⚠️ API Key Required: Please get a free API key from openweathermap.org and add it to scripts/app.js');
    } else {
        // Try to fetch weather, fallback to demo if API not activated yet
        getWeatherWithFallback(lastCity);
    }
}

/**
 * Get weather with fallback to demo data if API fails
 */
async function getWeatherWithFallback(city) {
    showLoading();
    hideError();

    try {
        const [currentData, forecastData] = await Promise.all([
            fetchCurrentWeather(city),
            fetchForecast(city)
        ]);

        hideLoading();
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        localStorage.setItem('lastCity', city);

    } catch (error) {
        console.log('API Error (key may need activation):', error.message);
        hideLoading();

        // Show demo data with a notice
        loadDemoData();

        // Show notice that demo mode is active
        const notice = document.createElement('div');
        notice.className = 'demo-notice';
        notice.innerHTML = '⏳ <strong>Demo Mode:</strong> API key needs 1-2 hours to activate. Showing demo data.';
        notice.style.cssText = 'background: rgba(102, 126, 234, 0.2); border: 1px solid #667eea; border-radius: 12px; padding: 1rem; text-align: center; margin-bottom: 1rem; color: #fff;';

        const existingNotice = document.querySelector('.demo-notice');
        if (!existingNotice) {
            elements.currentWeather.parentNode.insertBefore(notice, elements.currentWeather);
        }
    }
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// ============================================
// DEMO MODE (For testing without API key)
// ============================================

/**
 * Demo data for testing the UI without an API key
 * Uncomment the function call at the bottom to use demo mode
 */
function loadDemoData() {
    const demoCurrentWeather = {
        name: "Colombo",
        sys: { country: "LK" },
        dt: Date.now() / 1000,
        main: {
            temp: 28,
            feels_like: 32,
            humidity: 78,
            temp_min: 26,
            temp_max: 30
        },
        weather: [{
            description: "scattered clouds",
            icon: "03d"
        }],
        wind: { speed: 3.5 },
        visibility: 10000
    };

    const demoForecast = {
        list: [
            { dt: Date.now() / 1000 + 86400 * 1, main: { temp: 29, temp_min: 26, temp_max: 31 }, weather: [{ description: "sunny", icon: "01d" }] },
            { dt: Date.now() / 1000 + 86400 * 2, main: { temp: 27, temp_min: 25, temp_max: 29 }, weather: [{ description: "light rain", icon: "10d" }] },
            { dt: Date.now() / 1000 + 86400 * 3, main: { temp: 28, temp_min: 26, temp_max: 30 }, weather: [{ description: "cloudy", icon: "04d" }] },
            { dt: Date.now() / 1000 + 86400 * 4, main: { temp: 30, temp_min: 27, temp_max: 32 }, weather: [{ description: "sunny", icon: "01d" }] },
            { dt: Date.now() / 1000 + 86400 * 5, main: { temp: 29, temp_min: 26, temp_max: 31 }, weather: [{ description: "partly cloudy", icon: "02d" }] }
        ]
    };

    displayCurrentWeather(demoCurrentWeather);
    displayForecast(demoForecast);
}

// Uncomment the line below to test with demo data (no API key needed):
// loadDemoData();