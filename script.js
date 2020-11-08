//Container divs from index.html
const $daysDiv = $('.days');
const $citiesDiv = $('.cities');

//Function to render API info for current weather
const renderCurrentWeather = location => {
    //Reset inner html for the current section
    $('.current').html("<div class='current-row'><div class='content'></div><div class='icon'></div></div>")

    //AJAX call using user input
    const settings = {
        url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=59c9f9d794fad5805a3ff6749acde141
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
        let $currentWeather = $(`<p>Cloud Cover: ${cloudCover}</p><p>Current Temp: ${currentTemp} &#176;F</p><p>Humidity: ${currentHumidity} %</p><p>Wind Speed: ${currentWind} mph</p>`);
        $('.content').prepend($currentWeather);

        //Cloud cover icon
        $('.icon').html(`<img src='http://openweathermap.org/img/wn/${weatherIcon}.png'/>`)

        //Calls renderFiveDay with latitude and longitude
        renderFiveDay(response.coord.lat, response.coord.lon);
    });
};

const renderFiveDay = (lat, lon) => {
    //Reset html for five day div
    $daysDiv.html('');

    const settings = {
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=59c9f9d794fad5805a3ff6749acde141`,
        method: 'GET'
    };

    $.ajax(settings).done(response => {
        console.log(response);
        let daysArray = response.daily;
        //Initializes a new date as today
        let dateUTC = new Date(Date.now());

        //Loops through the dataset and grabs the data from each day
        for (let i = 0; i < 5; i++) {
            //Increments the date by one day
            dateUTC.setDate(dateUTC.getDate() + 1);
            //String of month/day
            let date = `${dateUTC.getMonth() + 1}/${dateUTC.getDate() + 1}`;
            console.log(date);

            //Variables taken from response data
            let maxTemp = daysArray[i].temp.max;
            let minTemp = daysArray[i].temp.min;
            let cloud = daysArray[i].weather[0].main;
            let weatherIcon = daysArray[i].weather[0].icon;

            //New day div containing response data variables
            let $dayDiv = $(`<div class='day'><p>${date}</p><img src='http://openweathermap.org/img/wn/${weatherIcon}.png'/><p>${cloud}</p><p>${maxTemp} &#176;F</p><p>${minTemp} &#176;F</p></div>`);
            $daysDiv.append($dayDiv);
        };
    });
}

$('.search-button').on('click', () => {
    let $locationInput = $('#search-bar').val();
    renderCurrentWeather($locationInput);
});