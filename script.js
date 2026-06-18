const API_KEY = "9256af08e32f21a7199c1436f67f3b34";

const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");

const card = document.querySelector(".weather-card");
const loading = document.querySelector(".loading");
const error = document.querySelector(".error");

const city = document.getElementById("cityName");
const temp = document.getElementById("temp");
const desc = document.getElementById("description");
const icon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");

button.addEventListener("click", fetchWeather);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchWeather();
});

async function fetchWeather() {
  const cityValue = input.value.trim();

  if (!cityValue) {
    showError("Please enter a city name");
    return;
  }

  try {
    // UI states
    loading.classList.remove("hidden");
    card.classList.add("hidden");
    error.classList.add("hidden");

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityValue
      )}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    // FIX: proper API error handling
    if (!res.ok) {
      throw new Error(data.message || "City not found");
    }

    // Update UI
    city.textContent = `📍 ${data.name}`;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    desc.textContent = data.weather[0].description;

    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.alt = data.weather[0].description;

    humidity.textContent = `💧 ${data.main.humidity}%`;

    card.classList.remove("hidden");

  } catch (err) {
    showError(err.message);
  } finally {
    loading.classList.add("hidden");
  }
}

// helper function (cleaner code)
function showError(message) {
  error.textContent = message;
  error.classList.remove("hidden");
  card.classList.add("hidden");
}