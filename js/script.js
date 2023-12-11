let isCelsius = true; // To track the current temperature unit

document.addEventListener('DOMContentLoaded', function () {
    const locationInput = document.getElementById('location-input');
    const searchButton = document.getElementById('search-button');
    const unitToggleButton = document.getElementById('unit-toggle');

    // Fetch weather data when 'Get Weather' button is clicked
    searchButton.addEventListener('click', function () {
        const location = document.getElementById('location-input').value;
        fetchWeatherData(location);
    });

    // Enable fetching weather data on pressing 'Enter'
    locationInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            fetchWeatherData(locationInput.value);
        }
    });

    // Toggle temperature unit between Celsius and Fahrenheit
    unitToggleButton.addEventListener('click', function () {
        isCelsius = !isCelsius;
        unitToggleButton.textContent = isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius";
        const location = document.getElementById('location').textContent.split(": ")[1];
        if (location) {
            fetchWeatherData(location);
        }
    });

    // Use geolocation if available or default to 'Barrie'
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
            fetchWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
        }, () => {
            console.log("Using default location: Barrie");
            fetchWeatherData('Barrie');
        });
    } else {
        console.log("Geolocation is not supported by this browser. Using default location: Barrie");
        fetchWeatherData('Barrie');
    }
}

// Function to fetch weather data by coordinates
function fetchWeatherDataByCoords(lat, lon) {
    const apiKey = '21e088e470fa39c061ffe9653eb15e7b';
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
    fetchAndDisplayWeatherData(weatherUrl);

    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
    fetchForecastData(forecastUrl);

    let airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
    fetchAirPollutionData(airPollutionUrl);
}

/* Function to check cache - MIGHT UPDATE LATER
to store the weather data locally to decrease the no. of API calls

function checkCache(city) {
    let weatherData = localStorage.getItem(city);
    if (weatherData) {
        let data = JSON.parse(weatherData);
        if (new Date() - new Date(data.timestamp) < 3600000) {
            return data;
        }
    }
    return null;
}*/

// Fetches weather data from OpenWeatherMap API
function fetchWeatherData(city) {
    const apiKey = '21e088e470fa39c061ffe9653eb15e7b';
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
    fetchAndDisplayWeatherData(weatherUrl);

    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
    fetchForecastData(forecastUrl);

    getCoordinates(city).then(({ lat, lon }) => {
        let airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
        fetchAirPollutionData(airPollutionUrl);
    }).catch(error => {
        console.error(error);
    });

}

function getCoordinates(city) {
    const apiKey = '21e088e470fa39c061ffe9653eb15e7b';
    return new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    resolve({ lat: data[0].lat, lon: data[0].lon });
                } else {
                    reject('City not found');
                }
            })
            .catch(error => reject(error));
    });
}

function fetchAndDisplayWeatherData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to retrieve weather data');
        });
}

// Display the fetched weather data
function displayWeatherData(data) {
    document.getElementById('student-info').textContent = 'Manas Sardana - 200542367';
    document.getElementById('location').textContent = `Location: ${data.name}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp.toFixed(1)} ${isCelsius ? '°C' : '°F'}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
}

function fetchForecastData(url) {
    console.log("Fetching Forecast Data from URL:", url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecastData(data);
        })
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayForecastData(forecastData) {
    let forecastDisplay = document.getElementById('forecast'); // Replace with your actual forecast display element ID
    let dailyForecasts = {};
    let counter = 0;

    forecastData.list.forEach(item => {
        if (counter < 3) {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    temps: [],
                    descriptions: new Set(),
                };
                counter++;
            }
            dailyForecasts[date].temps.push(item.main.temp);
            dailyForecasts[date].descriptions.add(item.weather[0].main);
        }
    });

    let forecastHtml = "";
    Object.keys(dailyForecasts).forEach(date => {
        let dayData = dailyForecasts[date];
        let avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
        let descriptions = Array.from(dayData.descriptions).join(', ');

        forecastHtml += `<div class="forecast-item">
                            <div class="forecast-date">${date}</div>
                            <div class="forecast-temp">Avg Temp: ${avgTemp.toFixed(1)} ${isCelsius ? '°C' : '°F'}</div>
                            <div class="forecast-desc">${descriptions}</div>
                         </div>`;
    });

    forecastDisplay.innerHTML = forecastHtml;
}


function fetchAirPollutionData(url) {
    console.log("URL being called: ", url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayAirPollutionData(data);
        })
        .catch(error => console.error('Error fetching air pollution data:', error));
}


function displayAirPollutionData(airPollutionData) {
    let airPollutionDisplay = document.getElementById('air-pollution');
    let aqi = airPollutionData.list[0].main.aqi; // Air Quality Index

    let aqiDescription;
    switch(aqi) {
        case 1: aqiDescription = 'Good'; break;
        case 2: aqiDescription = 'Fair'; break;
        case 3: aqiDescription = 'Moderate'; break;
        case 4: aqiDescription = 'Poor'; break;
        case 5: aqiDescription = 'Very Poor'; break;
        default: aqiDescription = 'Unknown';
    }

    airPollutionDisplay.innerHTML = `<div class="air-pollution-index">Air Quality Index: ${aqi} (${aqiDescription})</div>`;
}