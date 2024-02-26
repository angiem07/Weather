var apiKey = "9ded15d0219a086a6583c983e729b4d0";

var searchField = document.querySelector("#searchField");
var searchBar = document.querySelector("#searchBar");
var newSearchCity;
var searchedCities = [];
var storedSearchedCities;

var cities = document.getElementsByClassName("searchedCity");
var city1 = document.querySelector("#city1");
var city2 = document.querySelector("#city2");
var city3 = document.querySelector("#city3");
var city4 = document.querySelector("#city4");
var city5 = document.querySelector("#city5");


var currentCity = document.querySelector("#currentCity");
var currentDate = document.querySelector("#currentDate");
var currentIcon = document.querySelector("#currentIcon");
var currentTemperature = document.querySelector("#currentTemperature");
var currentHumidity = document.querySelector("#currentHumidity");
var currentWind = document.querySelector("#currentWind");
var currentLat;
var currentLon;
var currentUVIndex = document.querySelector("#currentUVIndex");

var day1 = document.querySelector("#day1");
var day1Icon = document.querySelector("#day1Icon");
var day1Temp = document.querySelector("#day1Temp");
var day1Humidity = document.querySelector("#day1Humidity");

var day2 = document.querySelector("#day2");
var day2Icon = document.querySelector("#day2Icon");
var day2Temp = document.querySelector("#day2Temp");
var day2Humidity = document.querySelector("#day2Humidity");

var day3 = document.querySelector("#day3");
var day3Icon = document.querySelector("#day3Icon");
var day3Temp = document.querySelector("#day3Temp");
var day3Humidity = document.querySelector("#day3Humidity");

var day4 = document.querySelector("#day4");
var day4Icon = document.querySelector("#day4Icon");
var day4Temp = document.querySelector("#day4Temp");
var day4Humidity = document.querySelector("#day4Humidity");

var day5 = document.querySelector("#day5");
var day5Icon = document.querySelector("#day5Icon");
var day5Temp = document.querySelector("#day5Temp");
var day5Humidity = document.querySelector("#day5Humidity");

// Handles city search submit
searchField.addEventListener("submit", function(event) {
    event.preventDefault();

    // Standardizes searched strings; e.g. "bOsTOn" = "Boston"
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    newSearchCity = searchBar.value.trim().toLowerCase().capitalize();
    newSearch();
});

// Clears out search bar placeholder text on click
searchBar.addEventListener("click", function() {
    searchBar.placeholder = "";
});

// Clicking on a previously searched city recalls that search
for (let i = 0; i < cities.length; i++) {
    cities[i].addEventListener("click", function(event) {
        newSearchCity = event.target.innerHTML;
        newSearch();
    })
}

function newSearch() {
    var checkSearchURL = `https://api.openweathermap.org/data/2.5/weather?q=${newSearchCity}&units=imperial&appid=${apiKey}`;

    fetch(checkSearchURL)
        .then(response => response.json())
        .then(function (data) {
            // If search is a valid city name
            if (data.cod === 200) {
                // Save searched city if it's not already
                if (searchedCities.includes(newSearchCity) === false) {
                    searchedCities.push(newSearchCity);

                    // Limit saved searches to 8
                    if (searchedCities.length > 8) {
                        searchedCities.shift();
                    }
                }

                searchBar.value = "";
                searchBar.placeholder = "";

                storeSearchedCities();
                updateSearchedCities();
            }
            // If search is not a valid city name
            else {
                searchBar.value = "";
                searchBar.placeholder = "Please enter a valid city";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            searchBar.placeholder = "Failed to fetch weather data. Please try again.";
        });
}

// Saves searched cities to local storage
function storeSearchedCities() {
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
}

function updateSearchedCities() {
    // Recalls searched cities from local storage
    storedSearchedCities = JSON.parse(localStorage.getItem("searchedCities"));

    // If there are saved searches...
    if (storedSearchedCities !== null) {
        searchedCities = storedSearchedCities;

        // Populate search history aside and change cursor on hover
        for (let i = 0; i < cities.length; i++) {
            if (i < searchedCities.length) {
                cities[i].innerHTML = searchedCities[i];
                cities[i].classList.add("hoverPointer");
            } else {
                cities[i].innerHTML = "";
                cities[i].classList.remove("hoverPointer");
            }
        }

        var currentWeatherURL;
        // Use the currently searched city for the API call
        if (newSearchCity !== undefined) {
            currentCity.innerHTML = newSearchCity;
            currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${newSearchCity}&units=imperial&appid=${apiKey}`;
        }
        // Else, if updateSearchedCities is called on page load, use the most recently searched city
        else {
            currentCity.innerHTML = searchedCities[searchedCities.length - 1];
            currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCities[searchedCities.length - 1]}&units=imperial&appid=${apiKey}`;
        }

        // Main API call for current weather
        fetch(currentWeatherURL)
            .then(response => response.json())
            .then(function (data) {
                // Populate current weather fields
                const currentDateObj = new Date(data.dt * 1000);
                currentDate.innerHTML = currentDateObj.toLocaleDateString();
                currentIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                currentTemperature.innerHTML = data.main.temp;
                currentHumidity.innerHTML = data.main.humidity;
                currentWind.innerHTML = data.wind.speed;
                currentLat = data.coord.lat;
                currentLon = data.coord.lon;

                // Fetch 5-day forecast data
                const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity.innerHTML}&units=imperial&appid=${apiKey}`;

                fetch(forecastURL)
                    .then(response => response.json())
                    .then(function (forecastData) {
                        // Populate 5-day forecast fields
                        const dailyForecasts = forecastData.list.filter(entry => entry.dt_txt.includes("12:00:00"));
                        for (let i = 0; i < 5; i++) {
                            const forecast = dailyForecasts[i];
                            const date = new Date(forecast.dt * 1000);
                            const dayElement = document.getElementById(`day${i + 1}`);
                            const iconElement = document.getElementById(`day${i + 1}Icon`);
                            const tempElement = document.getElementById(`day${i + 1}Temp`);
                            const humidityElement = document.getElementById(`day${i + 1}Humidity`);

                            dayElement.innerHTML = date.toLocaleDateString();
                            iconElement.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
                            tempElement.innerHTML = forecast.main.temp;
                            humidityElement.innerHTML = forecast.main.humidity;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching forecast data:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
}


// Renders previously saved searches on page load
updateSearchedCities();
