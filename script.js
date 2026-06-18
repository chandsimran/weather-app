const API_KEY = "9256af08e32f21a7199c1436f67f3b34";

// DOM
const searchInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchBtn");

const weatherCard = document.querySelector(".weather-card");
const loading = document.querySelector(".loading");
const errorBox = document.querySelector(".error");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temp");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

// Load last searched city
window.addEventListener("load", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
  }
});

// Button click
searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) getWeather(city);
});

// Press Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) getWeather(city);
  }
});

// Main function
async function getWeather(city) {
  try {
    // Show loading
    loading.classList.remove("hidden");
    errorBox.classList.add("hidden");
    weatherCard.classList.add("hidden");

    // ✅ FIXED URL (removed broken <a> tag)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    // Handle error
    if (data.cod !== 200) {
      throw new Error("❌ City not found");
    }

    // Update UI
    cityName.textContent = `📍 ${data.name}`;
    temperature.textContent = `🌡 ${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description.toUpperCase();

    // ✅ FIXED ICON URL (removed <a> tag)
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Show card
    weatherCard.classList.remove("hidden");

    // Save city
    localStorage.setItem("lastCity", city);

  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}