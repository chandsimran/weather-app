const API_KEY = "9256af08e32f21a7199c1436f67f3b34";

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
searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        getWeather();

    }

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

    try{

        const response = await fetch(

        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        );

        if(!response.ok){

            throw new Error("City not found");

        }

        const data = await response.json();

        displayWeather(data);

        localStorage.setItem("lastCity", city);

    }

    catch{

        error.classList.remove("hidden");

    }

    finally{

        loading.classList.add("hidden");

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

    weatherCard.classList.remove("hidden");

}
window.onload = function(){

    const lastCity = localStorage.getItem("lastCity");

    if(lastCity){

        cityInput.value = lastCity;

        getWeather();

    }

}
