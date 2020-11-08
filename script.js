//Container divs from index.html
const $daysDiv = $('.days');
const $citiesDiv = $('.cities');

//Function to render API info for current weather
const renderCurrentWeather = () => {
    //Reset inner html for the current section
    $('.current').html("<div class='current-row'><div class='content'></div><div class='icon'></div></div>")

    //AJAX call using user input
    let $locationInput = $('#search-bar').val();
    const settings = {
        url: `https://api.openweathermap.org/data/2.5/weather?q=${$locationInput}&appid=59c9f9d794fad5805a3ff6749acde141
        `,
        method: 'GET'
    };

    $.ajax(settings).done(response => {
        //Variables created using JSON data
        let cityName = response.name;
        let currentTemp = response.main.temp;
        let currentHumidity = response.main.humidity;
        let cloudCover = response.weather[0].main;
        let weatherIcon = response.weather[0].icon;
        let currentWind = response.wind.speed;

        //Header with city's name
        let $currentHeader = $(`<h1 class="current-header">${cityName}:</h1>`);
        $('.current').prepend($currentHeader);

        //Weather info
        let $currentWeather = $(`<p>Cloud Cover: ${cloudCover}</p><p>Current Temp: ${currentTemp}</p><p>Humidity: ${currentHumidity}</p><p>Wind Speed: ${currentWind} mph</p>`);
        $('.content').prepend($currentWeather);

        //Cloud cover icon
        $('.icon').html(`<img src='http://openweathermap.org/img/wn/${weatherIcon}.png'/>`)
    });
};

$('.search-button').on('click', () => {
    renderCurrentWeather();
});