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

    // Initial fetch with default location - Barrie
    fetchWeatherData('Barrie');
});

// Fetches weather data from OpenWeatherMap API
function fetchWeatherData(location) {
    const apiKey = '21e088e470fa39c061ffe9653eb15e7b';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    url += isCelsius ? '&units=metric' : '&units=imperial';

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
