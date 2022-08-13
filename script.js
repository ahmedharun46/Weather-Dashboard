var APIKey = "29f3c58f144182999550f4a430669b7d"
var city = "";
var currentDate = "";
var tempF = "";
var humidityValue = "";
var windSpeed = "";
var minTempK = "";
var maxTempK = "";
var minTempF = "";
var maxTempF = "";
var dayhumidity = "";
var currentWeatherIconCode = "";
var currentWeatherIconUrl = "";
var iconcode = "";
var iconurl = "";
var country = "";

var listOfSearchedCities = [];

var getSearchedCities = JSON.parse(localStorage.getItem("searched-cities"));
if (getSearchedCities!== null) {
  getSearchedCities.forEach(function(city) {city.toUpperCase();});
  listOfSearchedCities = getSearchedCitiesFromLS;  
}

$(document).ready(function(){
    displayCities(listOfSearchedCities);
    if (getSearchedCities !== null) {
      var lastCity = listOfSearchedCities[0];
      searchCity(lastCity);
    }
});