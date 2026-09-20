const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");
const weatherIcon = document.getElementById("weatherIcon");
const searchForm = document.getElementById("searchForm");
const forecastSection = document.getElementById("forecastSection");
const forecastGrid = document.getElementById("forecastGrid");
const themeToggle = document.getElementById("themeToggle");

searchForm.addEventListener("submit", function(event){

    event.preventDefault();

    getWeather();

});

async function getWeather(){

    const city = cityInput.value.trim();

    if(city === ""){

        alert("Please enter a city.");

        return;

    }

    loading.classList.remove("hidden");
    error.classList.add("hidden");
    weatherCard.classList.add("hidden");
    forecastSection.classList.add("hidden");

    cityInput.disabled = true;
    searchBtn.disabled = true;

    try{

        const [currentRes, forecastRes] = await Promise.all([
            fetch(`/api/weather?city=${encodeURIComponent(city)}`),
            fetch(`/api/weather?city=${encodeURIComponent(city)}&type=forecast`)
        ]);

        if(!currentRes.ok || !forecastRes.ok){

            throw new Error("City not found");

        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        displayWeather(currentData);
        displayForecast(forecastData);

        localStorage.setItem("lastCity", city);

    }

    catch{

        error.classList.remove("hidden");

    }

    finally{

        loading.classList.add("hidden");
        cityInput.disabled = false;
        searchBtn.disabled = false;

    }

}
function displayWeather(data){

    cityName.textContent = data.name;

    temperature.textContent = `${Math.round(data.main.temp)}°C`;

    description.textContent = data.weather[0].description;

    humidity.textContent = data.main.humidity + "%";

    wind.textContent = data.wind.speed + " km/h";

    feelsLike.textContent = Math.round(data.main.feels_like) + "°C";

    visibility.textContent = (data.visibility / 1000) + " km";

    weatherIcon.src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    weatherIcon.alt = data.weather[0].description;

    weatherCard.classList.remove("hidden");

}

function displayForecast(data) {
    forecastGrid.innerHTML = "";

    const dailyForecasts = [];
    const seenDates = new Set();

    for (const item of data.list) {
        const date = item.dt_txt.split(" ")[0];
        const time = item.dt_txt.split(" ")[1];

        if (!seenDates.has(date) && time === "12:00:00") {
            dailyForecasts.push(item);
            seenDates.add(date);
        }
    }

    if (dailyForecasts.length < 5) {
        for (const item of data.list) {
            const date = item.dt_txt.split(" ")[0];
            if (!seenDates.has(date)) {
                dailyForecasts.push(item);
                seenDates.add(date);
            }
            if (dailyForecasts.length === 5) break;
        }
    }

    dailyForecasts.sort((a, b) => new Date(a.dt_txt) - new Date(b.dt_txt));
    const finalForecasts = dailyForecasts.slice(0, 5);

    for (const item of finalForecasts) {
        const dateObj = new Date(item.dt_txt);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const dateString = dateObj.toLocaleDateString(undefined, options);

        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].description;
        const iconSrc = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        const card = document.createElement("article");
        card.className = "forecast-card";

        card.innerHTML = `
            <div class="date">${dateString}</div>
            <img src="${iconSrc}" alt="${desc}">
            <div class="desc">${desc}</div>
            <div class="temp">${temp}°C</div>
        `;

        forecastGrid.appendChild(card);
    }

    forecastSection.classList.remove("hidden");
}
document.addEventListener("DOMContentLoaded", function(){

    const lastCity = localStorage.getItem("lastCity");

    if(lastCity){

        cityInput.value = lastCity;

        getWeather();

    }

    // ---- Theme initialisation ----
    // Default to dark; restore saved preference if it exists.
    const savedTheme = localStorage.getItem("theme") || "dark";

    if(savedTheme === "light"){
        document.body.classList.add("light");
        themeToggle.textContent = "☀️";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }

    // ---- Theme toggle handler ----
    themeToggle.addEventListener("click", function(){

        const isLight = document.body.classList.toggle("light");

        if(isLight){
            themeToggle.textContent = "☀️";
            themeToggle.setAttribute("aria-label", "Switch to dark mode");
            localStorage.setItem("theme", "light");
        } else {
            themeToggle.textContent = "🌙";
            themeToggle.setAttribute("aria-label", "Switch to light mode");
            localStorage.setItem("theme", "dark");
        }

    });

});
