var APIKey = "29f3c58f144182999550f4a430669b7d"
let listOfSearchedCities = [];
let searchedCities = JSON.parse(localStorage.getItem("searched-cities"));
// if there are searched cities, uppercase each searched city for cleanliness

searchedCities && searchedCities.forEach((city) => city.toUpperCase());
listOfSearchedCities = searchedCities;

$(document).ready(() => {
    if (searchedCities) {
        const lastCity = listOfSearchedCities[0];
        searchCity(lastCity);
    }
});

$("#search-btn").on("click", () => {
    event.preventDefault();
    clearDisplayedWeatherInfo()
    let cityName = $("input").val().toUpperCase().trim();
    $("#search-input").val("");
    searchCity(cityName);

    if (cityName && listOfSearchedCities[0] !== cityName) {
        listOfSearchedCities.unshift(cityName);
        localStorage.setItem("searched-cities", JSON.stringify(listOfSearchedCities));

        $("#searched-cities-list").prepend(`<a href="#" class="list-group-item" style="list-style-type: none; color: black;">
    <li>${cityName}</li>
    </a>`);
    }
});

$(document).on("click", ".list-group-item", (e) => {
    clearDisplayedWeatherInfo();
    searchCity(e.target.innerText);
});

function displayCurrentWeather(city, date, temp, humidity, windSpeed, weatherIconUrl) {
    const cardDiv = $("<div class='container border bg-light'>");
    const weatherImage = $("<img>").attr('src', weatherIconUrl);
    const cardHeader = $("<h4>").text(`${city} ${date.toString()}`);
    cardHeader.append(weatherImage);
    const temperatureEl = $("<p>").text(`Temperature: ${temp} ºF`);
    const humidityEl = $("<p>").text(`Humidity: ${humidity} %`);
    const windSpeedEl = $("<p>").text(`Wind Speed: ${windSpeed} MPH`);
    cardDiv.append(cardHeader);
    cardDiv.append(temperatureEl);
    cardDiv.append(humidityEl);
    cardDiv.append(windSpeedEl);
    $("#current-weather-conditions").append(cardDiv);
}

//for loop for 5 day forecast
function displayFiveDayForecast(forecast) {
    for (let i=3; i < forecast.length; i+=8) {
        const currentDay = forecast[i]
        const date = moment.unix(currentDay.dt).format("l");
        const temp = currentDay.main.temp
        const windSpeed = currentDay.wind.speed
        const humidity = currentDay.main.humidity
        const iconUrl = `https://openweathermap.org/img/w/${currentDay.weather[0].icon}.png`
        const cardEl = $("<div class='card'>").addClass("pl-1 bg-primary text-light");
        const cardBlockDiv = $("<div>").attr("class", "card-block");
        const cardTitleDiv = $("<div>").attr("class", "card-block");
        const cardTextDiv = $("<div>").attr("class", "card-text");
        const imgEl = $("<img>").attr("src", iconUrl);
        const cardTitleHeader = $("<h6>").text(date).addClass("pt-2");
        const tempEl = $("<p>").text(`Temp: ${temp} ºF"`).css("font-size", "0.60rem");
        const windSpeedEl = $("<p>").text(`Wind: ${windSpeed} MPH"`).css("font-size", "0.60rem");
        const humidityEl = $("<p>").text(`Humidity: ${humidity} %`).css("font-size", "0.60rem");

        cardTextDiv.append(imgEl);
        cardTextDiv.append(tempEl);
        cardTextDiv.append(windSpeedEl);
        cardTextDiv.append(humidityEl);
        cardTitleDiv.append(cardTitleHeader);
        cardBlockDiv.append(cardTitleDiv);
        cardBlockDiv.append(cardTextDiv);
        cardEl.append(cardBlockDiv);
        $(".card-deck").append(cardEl);
    }
}

// To clear html of current searched city data to make way for next searched city data
function clearDisplayedWeatherInfo() {
    $("#current-weather-conditions").empty();
    $("#card-deck-title").remove();
    $(".card-deck").empty();
}

function searchCity(cityName) {
   // run the AJAX call to the OpenWeatherAPI
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=imperial`,
        method: "GET"
    })

        // store all of the retrieved data inside of an object called "response"
        .then((response) => {
            searchedCity = response.name.trim();
            currentDate = moment.unix(response.dt).format("l");
            currentTemp = response.main.temp;
            currentHumidity = response.main.humidity;
            currentWindSpeed = response.wind.speed;
            currentWeatherIconUrl = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`;
            displayCurrentWeather(searchedCity, currentDate, currentTemp, currentHumidity, currentWindSpeed, currentWeatherIconUrl)

            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=imperial`,
                method: "GET"
            })
                .then((response) => {
                    $("#five-day-forecast-title").css("display", "block");
                    const fiveDayForecast = response.list;
                    displayFiveDayForecast(fiveDayForecast)
                
                });
        });
  
}