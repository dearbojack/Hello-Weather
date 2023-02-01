// api docs // how to call API

// weather : 
// https://api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
// geoname decode
// var xhr = $.get("https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&limit=5&appid=95d15e0dac6e9067bba1f640b9fb69f0");
// xhr.done(function(data) { console.log("success got data", data); });

// ! how to get icon
// How to get icon URL
// For code 500 - light rain icon = "10d". See below a full list of codes
// URL is http://openweathermap.org/img/wn/10d@2x.png

var cityList = [];

function renderBtn() {

    $("#history").empty();

    var savedCityList = JSON.parse(localStorage.getItem("cityList"));
    console.log(savedCityList);

    if(savedCityList) {
        for (let i = 0; i < savedCityList.length; i++) {
            var button = $("<button>").text(savedCityList[i]).addClass("btn city-button col-lg col-md col-sm px-auto");
            $("#history").append(button);
        }
    } else {
        console.log("No saved search.");
    }

}

// eventlistener on Search Btn to save search history
$("#search-button").on("click", function(e) {
    e.preventDefault();
    var cityName = $("#search-input").val().trim();

    // 1 create the buttons
    // if not empty, check if duplicate
    // if not duplicate, render btn
    if(cityName) {
        if(!cityList.includes(cityName)) {
            // if new city name, push it
            cityList.push(cityName);
            localStorage.setItem('cityList', JSON.stringify(cityList));
            renderBtn();
        } else {
            // if duplicate, do nothing
            console.log("city existed");
            alert("city name existed");
        }

        // duplicate or not, call func to get today weather & 5 day Forcast
        renderTodayWeather(cityName);

    } else {
        // if input empty, do nothing
        console.log("no input");
        alert("please input somthing");
    }
    
    // 2 fetch the weather

});

renderBtn();


const apiKey = "95d15e0dac6e9067bba1f640b9fb69f0";
// function to get the weather
function renderTodayWeather(city) {
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    $("#today").innerHtml = "";
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response) {

        if(response.cod === 200) {
            var icon = response.weather[0].icon ;
            var wind = response.wind.speed ;
            var temp = (response.main.temp - 273.15).toFixed(2)  ;
            var humidity = response.main.humidity ;

            let iconUrl = "http://openweathermap.org/img/wn/" + icon +"@2x.png";

            let cityTitle = city.toUpperCase();
            let cityEl = $("<h3>").text(`${cityTitle}`);
            let windEl = $("<p>").text(`Wind: ${wind} m/s`);
            let weatherIcon = $("<img>").attr("src", iconUrl);
            let tempEl = $("<p>").text(`Temperature: ${temp} ℃`);
            let humidityEl =  $("<p>").text(`Humidity: ${humidity} %`);

            weatherIcon.attr("id", "weatherIcon");
            $("#today").append(cityEl, weatherIcon, tempEl, windEl, humidityEl);

        } else {
            console.log("api error");
        }

    });
}

function getLatLon(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}` ;

    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response) {

        if(response) {

            console.log(url);

            console.log(response[0].lat);
            console.log(response[0].lon);

        } else {
            console.log(url);
            console.log("api error");
        }

        return [response[0].lat, response[0].lon];
    });
}

renderTodayWeather("beijing");
getLatLon("beijing");

// TODO func render5Forecast()
// func to call api to get 5 day forcast
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// docs: https://openweathermap.org/forecast5
// need to handle the date format with moment.js?