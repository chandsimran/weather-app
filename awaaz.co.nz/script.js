// =========================
// WEATHER APP SCRIPT
// =========================

// 🔑 Get your API key from: https://openweathermap.org/api
const API_KEY = "YOUR_API_KEY_HERE";

// =========================
// DOM ELEMENTS
// =========================

const searchInput = document.querySelector(".search-section input");
const searchButton = document.querySelector(".search-section button");

const weatherCard = document.querySelector(".weather-card");
const loading = document.querySelector(".loading");
const errorBox = document.querySelector(".error");

const cityName = document.querySelector(".weather-card h2");
const temperature = document.querySelector(".weather-card h3");
const description = document.querySelector(".weather-card p");
const weatherIcon = document.querySelector(".weather-card img");

// =========================
// INIT (load last city)
// =========================

window.addEventListener("load", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        getWeather(lastCity);
    }
});

// =========================
// EVENT LISTENERS
// =========================

searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = searchInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// =========================
// MAIN FUNCTION
// =========================

async function getWeather(city) {
    try {
        showLoading();
        hideError();

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        updateUI(data);

        // Save last city
        localStorage.setItem("lastCity", city);

    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// =========================
// UPDATE UI
// =========================

function updateUI(data) {
    const name = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    cityName.textContent = name;
    temperature.textContent = `${temp}°C`;
    description.textContent = desc.toUpperCase();

    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherCard.classList.remove("hidden");
}

// =========================
// LOADING
// =========================

function showLoading() {
    loading.classList.remove("hidden");
    weatherCard.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

// =========================
// ERROR
// =========================

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
    weatherCard.classList.add("hidden");
}

function hideError() {
    errorBox.classList.add("hidden");
}