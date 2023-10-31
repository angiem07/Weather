document.addEventListener("DOMContentLoaded", function() {
    var storageAvailable = typeof(Storage) !== "undefined";
    var apiKey = "9ded15d0219a086a6583c983e729b4d0";

    var searchField = document.querySelector("#searchField");
    var searchBar = document.querySelector("#searchBox");
    var newSearchCity;
    var searchedCities = [];
    var storedSearchedCities;

    var cities = document.querySelector(".searched-cities");
    var currentCity = document.querySelector("#currentCity");
    var currentDate = document.querySelector("#currentDate");
    var currentIcon = document.querySelector("#currentIcon");
    var currentTemperature = document.querySelector("#currentTemperature");
    var currentHumidity = document.querySelector("#currentHumidity");
    var currentWind = document.querySelector("#currentWind");
    var currentLat;
    var currentLon;
    var currentUVIndex = document.querySelector("#currentUVIndex");
    var dateContainer = document.querySelector(".date-container");

    // Handles city search submit
    searchField.addEventListener("submit", function(event) {
        event.preventDefault();
        newSearchCity = searchBar.value.trim();
        if (newSearchCity) {
            newSearchCity = newSearchCity.charAt(0).toUpperCase() + newSearchCity.slice(1).toLowerCase();
            newSearch();
        }
    });

    // Clears out search bar placeholder text on click
    searchBar.addEventListener("click", function() {
        searchBar.placeholder = "";
    });

    // Clicking on a previously searched city recalls that search
    cities.addEventListener("click", function(event) {
        newSearchCity = event.target.innerHTML;
        newSearch();
    });

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
            cities.innerHTML = "";
            searchedCities.forEach(function(city) {
                var cityElement = document.createElement("div");
                cityElement.classList.add("searched-city");
                cityElement.innerText = city;
                cityElement.classList.add("hoverPointer");
                cities.appendChild(cityElement);
            });

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
                    const fetchedCurrentDate = new Date(data.dt * 1000);
                    currentDate.innerHTML = fetchedCurrentDate.toLocaleDateString();
                    currentIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                    currentTemperature.innerHTML = data.main.temp;
                    currentHumidity.innerHTML = data.main.humidity;
                    currentWind.innerHTML = data.wind.speed;
                    currentLat = data.coord.lat;
                    currentLon = data.coord.lon;

                    // Current UVI, 5-day forecast require a different API call using the first call's retrieved lat/lon
                    var currentUVIndexAndForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}&lon=${currentLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

                    fetch(currentUVIndexAndForecastURL)
                        .then(response => response.json())
                        .then(function (data) {
                            // // Populate weatherToday UVI
                            // currentUVIndex.innerHTML = data.current.uvi;
                            // // Change UVI color depending on severity (low, moderate, high)
                            // if (data.current.uvi <= 2) {
                            //     currentUVIndex.style.backgroundColor = "green";
                            // }
                            // else if (data.current.uvi <= 7) {
                            //     currentUVIndex.style.backgroundColor = "orange";
                            // }
                            // else if (data.current.uvi >= 8) {
                            //     currentUVIndex.style.backgroundColor = "red";
                            // }

                            // Populate weatherForecast fields
                            dateContainer.innerHTML = "";
                            for (let i = 1; i <= 5; i++) {
                                const dayElement = document.querySelector(`#day${i}`);
                                dayElement.querySelector("h4").textContent = new Date(data.daily[i].dt * 1000).toLocaleDateString();
                                dayElement.querySelector("img").src = `https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
                                dayElement.querySelector("#day" + i + "Temp").textContent = data.daily[i].temp.day;
                                dayElement.querySelector("#day" + i + "Humidity").textContent = data.daily[i].humidity;
                            }
                        });
                });
        }
    }

    // Renders previously saved searches on page load
    updateSearchedCities();

});