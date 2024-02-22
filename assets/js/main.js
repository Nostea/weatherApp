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
      const tempUnits = "metric";
      const apiWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${tempUnits}&appid=${appID}`;
      fetch(apiWeatherCurrent)
        .then((responseWeather) => responseWeather.json())
        .then((weatherData) => {
          //! Ab Zeile 43 bis 72 in eine funktion packen. Das gleiche für die anderen fetches auch (Code strukturierung)
          console.log(weatherData);

          const temp = weatherData.main.temp; // siehe tempUnits, C° ist eingestellt
          // const tempC = Math.round(temp - 273.15); //conversion
          const humidity = weatherData.main.humidity;
          const airpressure = weatherData.main.pressure;
          const windspeed = weatherData.wind.speed;
          const sunriseMilSec = new Date(weatherData.sys.sunrise * 1000);
          const sunsetMilSec = new Date(weatherData.sys.sunset * 1000);

          //TODO eine funktion für die korrekte Zeitformatierung für sunrise und sunset machen
          const sunriseTime = sunriseMilSec.toLocaleTimeString();
          const sunsetTime = `${sunsetMilSec.getHours()}:${sunsetMilSec.getMinutes()}`;

          const weatherIcon = weatherData.weather[0].icon;
          const weatherDescription = weatherData.weather[0].description;

          locationOutput.innerHTML = `${locationInputValue}`;
          weatherImgOutput.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDescription}">`;
          temperatureOutput.innerHTML = `<span>${Math.round(temp)}</span>°C`;
          weatherDescriptionOutput.innerHTML = `${weatherDescription}`;
          humidityOutput.innerHTML = `Humidity: ${humidity}%`;
          airPressureOutput.innerHTML = `Air Pressure: ${airpressure}mbar`;
          windspeedOutput.innerHTML = `Windspeed: ${windspeed}`;
          sunriseOutput.innerHTML = `Sunrise: ${sunriseTime}`;
          sunsetOutput.innerHTML = `Sunset: ${sunsetTime}`;

          //humidityOutput.innerHTML = `${}`;
        }); // end weather

      const apiFiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appID}`;

      fetch(apiFiveDayForecast)
        .then((responseFiveDayForecast) => responseFiveDayForecast.json())
        .then((forecastData) => {
          console.log(forecastData);
          const timestamp = "12:00:00";
          const checkTimestamp = (timeItem) => timeItem.dt_txt.includes(timestamp);

          const filteredData = forecastData.list.filter(checkTimestamp); // Step 1
          console.log(filteredData);
          //! TODO: Den Forecast zu Ende bauen :)
        }); // end fiveDay forecast
    }); // end geo location paranthesis
}; //end getWeather()

getWeather();
