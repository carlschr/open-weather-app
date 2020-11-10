//Container divs from index.html
const $daysDiv = $('.days');
const $citiesDiv = $('.cities');

const renderStoredCities = () => {
    //Reset cities div html
    $citiesDiv.html('');

    //Loop through stored cities and create buttons
    let cityArray = JSON.parse(localStorage.getItem('cities'));
    if (cityArray) {
        for (let i = 0; cityArray.length < 6 ? i < cityArray.length : i < 5; i++) {
            let $newButton = $(`<button class="city">${cityArray[i]}</button>`);
            $citiesDiv.append($newButton);
            $newButton.on('click', (event) => {
                let $storedLocation = $(event.currentTarget).text();
                renderCurrentWeather($storedLocation);
            });
        };
    };
};

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

    $.ajax(settings).done(async response => {
        //Variables created using JSON data
        let cityName = response.name;
        let currentTemp = response.main.temp;
        let currentHumidity = response.main.humidity;
        let cloudCover = response.weather[0].main;
        let weatherIcon = response.weather[0].icon;
        let currentWind = response.wind.speed;
        //Grabs uv index from another API call using await keyword
        let uvJSON = await $.ajax({url: `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=59c9f9d794fad5805a3ff6749acde141`, method: 'GET'});
        console.log(uvJSON);
        let uvIndex = uvJSON.value;

        //Header with city's name
        let today = new Date(Date.now());
        let $currentHeader = $(`<h1 class="current-header">${cityName} (${today.getMonth() + 1}/${today.getDate() + 1}/${today.getFullYear()})</h1>`);
        $('.current').prepend($currentHeader);

        //Weather info
        let $currentWeather = $(`<p>Cloud Cover: ${cloudCover}</p><p>Current Temp: ${currentTemp} &#176;F</p><p>Humidity: ${currentHumidity} %</p><p>Wind Speed: ${currentWind} mph</p><button class='uv'>UV: ${uvIndex}</button>`);
        $('.content').prepend($currentWeather);

        //Cloud cover icon
        $('.icon').html(`<img src='http://openweathermap.org/img/wn/${weatherIcon}.png'/>`);

        //Returns a color based on the uv index
        const uvCheck = index => {
            let color = (index < 3) ? 'green; color: white' : 
            (index < 6) ? 'yellow; color: black' :
            (index < 8) ? 'orange; color: black' :
            (index < 11) ? 'red; color: white' : 'purple; color: white';
            return color;
        };

        //Sets appropriate bg color for uv button;
        $('.uv').attr('style', `background-color: ${uvCheck(uvIndex)};`);

        //Calls renderFiveDay with latitude and longitude
        renderFiveDay(response.coord.lat, response.coord.lon);
    });
};

//Function to render five-day forecast
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
            let humidity = daysArray[i].humidity;
            let cloud = daysArray[i].weather[0].main;
            let weatherIcon = daysArray[i].weather[0].icon;

            //New day div containing response data variables
            let $dayDiv = $(`<div class='day'><p>${date}</p><img src='http://openweathermap.org/img/wn/${weatherIcon}.png'/><p>${cloud}</p><p>Max: ${maxTemp} &#176;F</p><p>Min: ${minTemp} &#176;F</p><p>Humidity: ${humidity} %</div>`);
            $daysDiv.append($dayDiv);
        };
    });
};

//Function for storing city locally
const storeCity = city => {
    //Retrieves previously stored cities
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    //If the storage was empty then an array is created with the first searched city
    if (storedCities) {
        //If the city is already in storage it is not pushed
        if (!storedCities.includes(city)) {
            storedCities.push(city);
        };
    } else {
        storedCities = [city];
    };
    //The stored array is updated
    localStorage.setItem('cities', JSON.stringify(storedCities));
};

//Click listener for input
$('.search-button').on('click', () => {
    let $locationInput = $('#search-bar').val();
    renderCurrentWeather($locationInput);
    storeCity($locationInput);
    renderStoredCities();
});

//Initial render
renderStoredCities();
renderCurrentWeather(localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities'))[JSON.parse(localStorage.getItem('cities')).length - 1] : 'Atlanta');