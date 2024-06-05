import { useState } from 'react';
import { Helmet } from 'react-helmet';

import './App.css';

const apiKey = 'd54835f40ebd329e31a2908cba52bbcc';

function App() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const searchPressed = () => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=metric&appid=${apiKey}`;

    fetch(weatherUrl)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          setWeather(data);
          setError('');
        } else {
          setError(data.message);
          setWeather({});
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data.');
        setWeather({});
      });

    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
        if (data.cod === "200") {
          const dailyForecast = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
          setForecast(dailyForecast);
        } else {
          setError(data.message);
          setForecast([]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data.');
        setForecast([]);
      });
  };

  return (
    <>
      <Helmet>
        <title>{search ? `Weather in ${search} - Check Today's Weather` : 'Weather App'}</title>
        <meta name="description" content={search ? `today weather of ${search}. weakly weather ${search}. weather ${search}` : 'Get the latest weather updates. Check today\'s weather in your city.'} />
      </Helmet>
      <div className="App">
        <h1>Weather App</h1>
        <input 
          type="text" 
          placeholder="Enter City/Town"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchPressed}>Search</button>
        {error && <p className="error">{error}</p>}
        {weather.main ? (
          <>
            <p><strong>{weather.name}</strong></p>
            <p>Temperature: {weather.main.temp} °C</p>
            <p>Weather: {weather.weather[0].description}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </>
        ) : (
          <p>Enter a city to get the weather information.</p>
        )}
        {forecast.length > 0 && (
          <>
            <h2>6-Day Forecast</h2>
            <div className="forecast">
              {forecast.slice(0, 6).map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                  <p>Temp: {day.main.temp} °C</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
