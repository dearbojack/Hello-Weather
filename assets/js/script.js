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
            var button = $("<button>").text(savedCityList[i]).addClass("btn col-lg col-md col-sm px-auto");
            button.attr("id", "city-button");
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
        render5Forecast(cityName);

    } else {
        // if input empty, do nothing
        console.log("no input");
        alert("please input somthing");
    }
    
    // 2 fetch the weather

});
// create buttons from local storage if any
renderBtn();


const apiKey = "95d15e0dac6e9067bba1f640b9fb69f0";
// function to get the weather
function renderTodayWeather(city) {
    // build the query url
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    // clear existing content in #today
    $("#today").empty();
    // fetch new weather content
    $.ajax({
        url: url,
        method: "GET"
    }).then(function(response) {

        if(response.cod === 200) {
            // get data from api call
            var icon = response.weather[0].icon ;
            var wind = response.wind.speed ;
            var temp = (response.main.temp - 273.15).toFixed(2)  ;
            var humidity = response.main.humidity ;

            // url to the weather icon
            let iconUrl = "http://openweathermap.org/img/wn/" + icon +"@2x.png";

            // create elements
            let cityTitle = city.toUpperCase();
            let cityEl = $("<h3>").text(`${cityTitle}`);
            let windEl = $("<p>").text(`Wind: ${wind} m/s`);
            let weatherIcon = $("<img>").attr("src", iconUrl);
            let tempEl = $("<p>").text(`Temperature: ${temp} ℃`);
            let humidityEl =  $("<p>").text(`Humidity: ${humidity} %`);
            
            // put icon to heading
            weatherIcon.attr("id", "weatherIcon");
            cityEl.append(weatherIcon);

            // populate #today
            $("#today").append(cityEl, tempEl, windEl, humidityEl);

        } else {
            console.log("api error");
        }

    });
}

function render5Forecast(city) {

    // api call to get city geo location
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}` ;

    $.ajax({
        url: geoUrl,
        method: "GET"
    }).then(function(response) {

        if(response) {

            console.log(geoUrl);

            console.log(response[0].lat);
            console.log(response[0].lon);

            lat = response[0].lat;
            lon = response[0].lon;

            // 5 day api query url
            let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}`;

            // if get geoLocation, api call to get 5 day forcast
            $.ajax({
                url: url,
                method: "GET"
            }).then(function(r) {

                for (let i = 0; i < r.list.length; i++) {
                    let date = r.list[i].dt_txt;
                    let tValue = (r.list[i].main.temp - 273.15).toFixed(2);
                    let hValue = r.list[i].main.humidity;
                    let wValue = r.list[i].wind.speed;
                    let iconCode = r.list[i].weather[0].icon;
                    let iconUrl = "http://openweathermap.org/img/wn/" + iconCode +"@2x.png";

                    var cardContainer = $("<div>").addClass("row mt-3 mx-1");
                    cardContainer.attr("id", "card-container");

                    var cardCol = $("<div>").addClass("card col-2 px-auto mx-auto");
                    var cardBody = $("<div>").addClass("card-body");

                    dateEl = $("<h5>").text(convertDate(date));
                    tEl = $("<p>").text(`Temperature: ${tValue} ℃`);
                    imgEl = $("<img>").attr("src", iconUrl);
                    hEl = $("<p>").text(`Humidity: ${hValue} %`);
                    wEl = $("<p>").text(`Wind: ${wValue} m/s`);

                    cardCol.append(dateEl, imgEl, tEl, wEl, hEl);
                    cardBody.append(cardCol);
                    $("#forcast").append(cardBody);
                    
                    console.log(`5day url: ${url}`);
                    console.log(r);
                    console.log(date);
                    console.log(tValue);
                    console.log(hValue);
                    console.log(wValue);
                    console.log($("#forcast"));
                }
                var forcastHeading = $("<h4>").text("5 Day Forcast:");
                $("#forcast").prepend(forcastHeading);
            });

        } else {
            console.log(url);
            console.log("api error");
        }

    });
}

// render default weather for london
renderTodayWeather("london");

// render 5 day weather for city
render5Forecast("london");

// TODO func render5Forecast()
// need to handle the date format with moment.js?

function convertDate(date) {
    let momentDate = moment(date);
    return momentDate.format("DD/MM/YYYY");
}