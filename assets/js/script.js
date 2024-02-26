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
var city6 = document.querySelector("#city6");
var city7 = document.querySelector("#city7");
var city8 = document.querySelector("#city8");

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
for(let i = 0; i < cities.length; i++) {
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
        city1.innerHTML = searchedCities[searchedCities.length - 1];
        city1.classList.add("hoverPointer");
        if (searchedCities.length - 2 >= 0) {
            city2.innerHTML = searchedCities[searchedCities.length - 2];
            city2.classList.add("hoverPointer");
        }
        if (searchedCities.length - 3 >= 0) {
            city3.innerHTML = searchedCities[searchedCities.length - 3];
            city3.classList.add("hoverPointer");
        }
        if (searchedCities.length - 4 >= 0) {
            city4.innerHTML = searchedCities[searchedCities.length - 4];
            city4.classList.add("hoverPointer");
        }
        if (searchedCities.length - 5 >= 0) {
            city5.innerHTML = searchedCities[searchedCities.length - 5];
            city5.classList.add("hoverPointer");
        }
        if (searchedCities.length - 6 >= 0) {
            city6.innerHTML = searchedCities[searchedCities.length - 6];
            city6.classList.add("hoverPointer");
        }
        if (searchedCities.length - 7 >= 0) {
            city7.innerHTML = searchedCities[searchedCities.length - 7];
            city7.classList.add("hoverPointer");
        }
        if (searchedCities.length - 8 >= 0) {
            city8.innerHTML = searchedCities[searchedCities.length - 8];
            city8.classList.add("hoverPointer");
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

        // Main API call
        fetch(currentWeatherURL)
            .then(response => response.json())
            .then(function (data) {
                // Populate weatherToday fields
                const fetchedCurrentDate = new Date(data.dt*1000);
                currentDate.innerHTML = fetchedCurrentDate.toLocaleDateString();
                currentIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                currentTemperature.innerHTML = data.main.temp;
                currentHumidity.innerHTML = data.main.humidity;
                currentWind.innerHTML = data.wind.speed;
                currentLat = data.coord.lat;
                currentLon = data.coord.lon;

        
                        // Populate weatherForecast fields
                const fetchedDay1Date = new Date(data.daily[1].dt*1000);
                day1.innerHTML = fetchedDay1Date.toLocaleDateString();
                day1Icon.src = `https://openweathermap.org/img/w/${data.daily[1].weather[0].icon}.png`;
                day1Temp.innerHTML = data.daily[1].temp.day;
                day1Humidity.innerHTML = data.daily[1].humidity;

                const fetchedDay2Date = new Date(data.daily[2].dt*1000);
                day2.innerHTML = fetchedDay2Date.toLocaleDateString();
                day2Icon.src = `https://openweathermap.org/img/w/${data.daily[2].weather[0].icon}.png`;
                day2Temp.innerHTML = data.daily[2].temp.day;
                day2Humidity.innerHTML = data.daily[2].humidity;

                const fetchedDay3Date = new Date(data.daily[3].dt*1000);
                day3.innerHTML = fetchedDay3Date.toLocaleDateString();
                day3Icon.src = `https://openweathermap.org/img/w/${data.daily[3].weather[0].icon}.png`;
                day3Temp.innerHTML = data.daily[3].temp.day;
                day3Humidity.innerHTML = data.daily[3].humidity;
                        
                const fetchedDay4Date = new Date(data.daily[4].dt*1000);
                day4.innerHTML = fetchedDay4Date.toLocaleDateString();
                day4Icon.src = `https://openweathermap.org/img/w/${data.daily[4].weather[0].icon}.png`;
                day4Temp.innerHTML = data.daily[4].temp.day;
                day4Humidity.innerHTML = data.daily[4].humidity;

                const fetchedDay5Date = new Date(data.daily[5].dt*1000);
                day5.innerHTML = fetchedDay5Date.toLocaleDateString();
                day5Icon.src = `https://openweathermap.org/img/w/${data.daily[5].weather[0].icon}.png`;
                day5Temp.innerHTML = data.daily[5].temp.day;
                day5Humidity.innerHTML = data.daily[5].humidity;
                });
            };
    }

// Renders previously saved searches on page load
updateSearchedCities();