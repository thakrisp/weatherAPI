"use strict";

$("#locationButton").click(function () {
  event.preventDefault();
  let cityInput = $("#cityInput").val();
  $("#results").removeAttr("hidden");

  if (cityInput !== "") {
    getWeather(cityInput);
  } else {
    $("#results").html(
      '<div class="alert alert-danger" role="alert">Nothing to see here</div>'
    );
  }
});

function getWeather(cityID) {
  //var key = "your key here";
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityID +
      "&appid=" +
      key
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      apiResponse(data);
      //console.log(data);
    })
    .catch(function (error) {
      console.error(error);
      // catch any errors
      $("#results").html(
        `<div class="alert alert-danger" role="alert" style="color:black !important">
        Cant find city. Please try again.
        </div>`
      );
    });
}

//checking the temp mode
const CELSIUS_MODE = 1;
const FAHRENHEIT_MODE = 2;
const KELVIN_MODE = 3;

//checking the wind speed mode.
const MILES_MODE = 4;
const METERS_MODE = 5;

//
function apiResponse(d) {
  var data = {
    temp: d.main.temp,
    windspeed: d.wind.speed,
    desc: d.weather[0].description,
    cityName: d.name,
  };

  var tempmode = $("#celciusRadio").is(":checked")
    ? CELSIUS_MODE
    : $("#fahrenheitRadio").is(":checked")
    ? FAHRENHEIT_MODE
    : KELVIN_MODE;

  var speedMode = $("#MPHRadio").is(":checked") ? MILES_MODE : METERS_MODE;

  var tempInfo =
    tempmode === CELSIUS_MODE
      ? celcius(data.temp)
      : tempmode === FAHRENHEIT_MODE
      ? farhenheit(data.temp)
      : kelvin(data.temp);

  var speedInfo =
    speedMode === MILES_MODE ? mph(data.windspeed) : metersps(data.windspeed);

  data = Object.assign(data, tempInfo, speedInfo);

  data.descriptionImageval = descriptionImage(data.desc);

  message(data);
}

function celcius(temp) {
  return { deg: "C", temp: Math.round(temp - 273.15) };
}

function kelvin(temp) {
  return { deg: "K", temp: temp };
}

function farhenheit(temp) {
  return { deg: "F", temp: Math.round((temp - 273.15) * (9 / 5) + 32) };
}

function mph(speed) {
  return {
    speedUnit: "MPH",
    windspeed: (Math.round(parseFloat(speed)) * 2.237).toFixed(1),
  };
}

function metersps(speed) {
  return { speedUnit: "m/s", windspeed: speed };
}

//get the weather description from extractWeatherDescription() and return and image to represent that description.
function descriptionImage(d) {
  return d === "sunny" || d === "clear" || d === "clear sky"
    ? '<i class="fas fa-sun fa-4x  "></i>'
    : d === "cloudy"
    ? '<i class="fa fa-cloud fa-4x" aria-hidden="true"></i>'
    : '<i class="fas fa-snowflake fa-4x"></i>';
}

function message(data) {
  $("#results").html(
    `<div class="alert alert-success" role="alert" style="color:black !important"> ${data.descriptionImageval} <br>
    The weather in <strong>${data.cityName}</strong> is <br>
    It is <strong> ${data.desc} </strong> outside <br> 
    The current temp outside is <strong> ${data.temp} &deg; ${data.deg}! </strong><br>
    The wind speed is <strong>${data.windspeed} ${data.speedUnit} </strong>.</div>`
  );
}
