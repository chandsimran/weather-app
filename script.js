const API_KEY = "9256af08e32f21a7199c1436f67f3b34"

const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");

const weatherCard = document.querySelector(".weather-card");
const loading = document.querySelector(".loading");
const errorBox = document.querySelector(".error");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const icon = document.getElementById("weatherIcon");

button.addEventListener("click", getWeather);

async function getWeather() {
    const city = input.value.trim();

    if (!city) return;

    // Reset UI
    weatherCard.classList.add("hidden");
    errorBox.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("City not found");
        }

        const data = await res.json();

        // Update UI
        cityName.textContent = data.name;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description;

        icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherCard.classList.remove("hidden");

    } catch (error) {
        errorBox.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}