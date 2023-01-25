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

$("#search-button").on("click", function(e) {
    e.preventDefault();
    var cityName = $("#search-input").val().trim();
    cityList.push(cityName);
    localStorage.setItem('cityList', JSON.stringify(cityList));
    renderBtn();
});

renderBtn();
