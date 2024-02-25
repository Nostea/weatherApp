//api key: 058e347c5ed2dc4fd47b36140ebba8aa
const appID = "058e347c5ed2dc4fd47b36140ebba8aa";
//get all inputs

// assign all outputs
const locationOutput = document.querySelector(".location-output");
const localTimeOutput = document.querySelector(".local-time");
const temperatureOutput = document.querySelector(".temp-celsius");
const airPressureOutput = document.querySelector(".air-pressure");
const weatherDescriptionOutput = document.querySelector(".weather-description");
const humidityOutput = document.querySelector(".humidity");
const windspeedOutput = document.querySelector(".windspeed");
const sunsetOutput = document.querySelector(".sundown");
const sunriseOutput = document.querySelector(".sunrise");
const geoCoordsOutput = document.querySelector(".geo-coords");
const weatherImgOutput = document.querySelector(".weather-img-container");
const minMaxTempOutput = document.querySelector(".minMaxTemp");
const tempUnits = "metric";

const getWeather = () => {
  const locationInputValue = document.querySelector("#location").value;
  /*
  let uppCaseTrans = () => {
    return locationInputText.charAt(0).toUpperCase() + locationInputText.slice(1);
  }; //end uppCaseTrans
  let locationInputTextUpperCase = uppCaseTrans();
*/

  // start geolocation
  const apiGeocoding = `https://api.openweathermap.org/geo/1.0/direct?q=${locationInputValue}&limit=5&appid=${appID}`;
  fetch(apiGeocoding)
    .then((responseGeo) => responseGeo.json())
    .then((geoData) => {
      console.log(geoData);

      let lat = geoData[0].lat;
      let lon = geoData[0].lon;

      //start weather

      const apiWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${tempUnits}&appid=${appID}`;
      fetch(apiWeatherCurrent)
        .then((responseWeather) => responseWeather.json())
        .then((weatherData) => {
          //! Ab Zeile 43 bis 72 in eine funktion packen. Das gleiche für die anderen fetches auch (Code strukturierung)
          console.log(weatherData);

          const timezone = weatherData.timezone;

          const temp = weatherData.main.temp; // siehe tempUnits, C° ist eingestellt
          // const tempC = Math.round(temp - 273.15); //conversion
          const humidity = weatherData.main.humidity;
          const airpressure = weatherData.main.pressure;
          const windspeed = weatherData.wind.speed;

          const sunriseDate = new Date(weatherData.sys.sunrise * 1000);
          const sunriseUtc = new Date(sunriseDate.toUTCString().slice(0, -4));
          const sunriseMilSec = new Date(sunriseUtc.getTime() + timezone * 1000);

          const sunsetDate = new Date(weatherData.sys.sunset * 1000);
          const sunsetUtc = new Date(sunsetDate.toUTCString().slice(0, -4));
          const sunsetMilSec = new Date(sunsetUtc.getTime() + timezone * 1000);

          const sunriseTime = sunriseMilSec.toLocaleTimeString();
          const sunsetTime = sunsetMilSec.toLocaleTimeString();

          const weatherIcon = weatherData.weather[0].icon;
          const weatherDescription = weatherData.weather[0].description;
          const minMaxTempText = Math.round(weatherData.main.temp_min) + "°C | " + Math.round(weatherData.main.temp_max) + "°C";

          const localDate = new Date();
          const localUtcDate = new Date(localDate.toUTCString().slice(0, -4));
          const timeUTCconversion = new Date(localUtcDate.getTime() + timezone * 1000);

          const backgroundImgContainer = document.querySelector("header");
          if (timeUTCconversion >= sunsetMilSec || timeUTCconversion <= sunriseMilSec) {
            backgroundImgContainer.style.backgroundImage = "url('/assets/img/weather/sky-night.jpeg')";
          } else {
            backgroundImgContainer.style.backgroundImage = "url('/assets/img/weather/day.jpeg')";
          }
          localTimeOutput.innerHTML = timeUTCconversion.toLocaleTimeString().slice(0, 5);

          locationOutput.innerHTML = `${locationInputValue}`;
          weatherImgOutput.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDescription}">`;
          temperatureOutput.innerHTML = `<span>${Math.round(temp)}°</span>`;
          weatherDescriptionOutput.innerHTML = `${weatherDescription}`;
          humidityOutput.innerHTML = `${humidity}%`;
          airPressureOutput.innerHTML = `Air Pressure: ${airpressure}mbar`;
          windspeedOutput.innerHTML = `${Math.round(windspeed)}km/h`;
          sunriseOutput.innerHTML = `${sunriseTime.slice(0, 5)}`;
          sunsetOutput.innerHTML = `${sunsetTime.slice(0, 5)}`;
          minMaxTempOutput.innerHTML = minMaxTempText;

          //humidityOutput.innerHTML = `${}`;
        }); // end weather

      const apiFiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appID}&units=${tempUnits}`;

      fetch(apiFiveDayForecast)
        .then((responseFiveDayForecast) => responseFiveDayForecast.json())
        .then((forecastData) => {
          const timestamp = "12:00:00";
          const checkTimestamp = (timeItem) => timeItem.dt_txt.includes(timestamp); // Step 2

          const filteredData = forecastData.list.filter(checkTimestamp); // Step 1
          console.log(filteredData);
          //! TODO: Den Forecast zu Ende bauen :)

          const dayOneInput = document.querySelector("#day1");
          const dayOneDate = new Date(filteredData[0].dt * 1000);
          const dayTwoInput = document.querySelector("#day2");
          const dayTwoDate = new Date(filteredData[1].dt * 1000);
          const dayThreeInput = document.querySelector("#day3");
          const dayThreeDate = new Date(filteredData[2].dt * 1000);
          const dayFourInput = document.querySelector("#day4");
          const dayFourDate = new Date(filteredData[3].dt * 1000);
          const dayFiveInput = document.querySelector("#day5");
          const dayFiveDate = new Date(filteredData[4].dt * 1000);

          const dayOneTempOutput = document.querySelector("#temp-five-day-forecast-1");
          const dayTwoTempOutput = document.querySelector("#temp-five-day-forecast-2");
          const dayThreeTempOutput = document.querySelector("#temp-five-day-forecast-3");
          const dayFourTempOutput = document.querySelector("#temp-five-day-forecast-4");
          const dayFiveTempOutput = document.querySelector("#temp-five-day-forecast-5");

          dayOneTempOutput.innerHTML = Math.round(filteredData[0].main.temp) + "°";
          dayTwoTempOutput.innerHTML = Math.round(filteredData[1].main.temp) + "°";
          dayThreeTempOutput.innerHTML = Math.round(filteredData[2].main.temp) + "°";
          dayFourTempOutput.innerHTML = Math.round(filteredData[3].main.temp) + "°";
          dayFiveTempOutput.innerHTML = Math.round(filteredData[4].main.temp) + "°";

          const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

          dayOneInput.innerHTML = weekday[dayOneDate.getDay()].slice(0, 3);
          dayTwoInput.innerHTML = weekday[dayTwoDate.getDay()].slice(0, 3);
          dayThreeInput.innerHTML = weekday[dayThreeDate.getDay()].slice(0, 3);
          dayFourInput.innerHTML = weekday[dayFourDate.getDay()].slice(0, 3);
          dayFiveInput.innerHTML = weekday[dayFiveDate.getDay()].slice(0, 3);
        }); // end fiveDay forecast
    }); // end geo location paranthesis
}; //end getWeather()

getWeather();
