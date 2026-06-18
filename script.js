const API_KEY = "9256af08e32f21a7199c1436f67f3b34";

const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");

const card = document.querySelector(".weather-card");
const loading = document.querySelector(".loading");
const error = document.querySelector(".error");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const desc = document.getElementById("description");
const icon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");

// SEARCH
button.addEventListener("click", getWeather);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});

async function getWeather() {
  const city = input.value.trim();
  if (!city) return;

  try {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    card.classList.add("hidden");

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== 200) throw new Error("City not found");

    cityName.textContent = `📍 ${data.name}`;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    desc.textContent = data.weather[0].description;

    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    humidity.textContent = `💧 ${data.main.humidity}%`;

    card.classList.remove("hidden");

  } catch (err) {
    error.textContent = err.message;
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}