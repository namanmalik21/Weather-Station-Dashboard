import React, { useState } from 'react';
import axios from 'axios';
import throttle from 'lodash/throttle';


function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;

  const throttledSearchLocation = throttle((event) => {
    if (event.key === 'Enter') {
      setError(null); 
      setData({}); 
      setIsLoading(true);
  
      axios.get(url)
        .then((response) => {
          if (response.status === 200) {
            setData(response.data);
            console.log(response.data);
          } else {
            setError('Oops! Something went wrong');
          }
        })
        .catch((error) => {
          if (error.response) {
            setError('Oops! No Result Found');
            console.error(error.response);
          } else {
            setError('Oops! An error occurred');
            console.error(error);
          }
        })
        .finally(() => {
          setIsLoading(false); // Reset isLoading after the request is complete
        });

      setLocation('');
    }
  },1000); // Throttle to 1 call per second

  return (
    <div className="app">
      <div className='search'>
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={throttledSearchLocation}
          placeholder='Enter location'
          type="text"
        />
      </div>
      <div className='container'>
        <div className='top'>
        {error && <div className="error-message">{error}</div>} 
        {isLoading ? <p>Loading...</p> : null} 
          <div className='location'>
            <p>{data.name}</p>
          </div>
          <div className='temp'>
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className='description'>
            {data.weather ? <p className='bold'>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className='bottom'>
            <div className='feels'>
              {data.main ? <p>Feels like: {data.main.feels_like.toFixed()}°C</p> : null}
            </div>
            <div className='humidity'>
              {data.main ? <p>Humidity: {data.main.humidity}%</p> : null}
            </div>
            <div className='wind'>
              {data.wind ? <p>Wind: {data.wind.speed}MPH</p> : null}
            </div>
          </div>
        )}
       
        
      </div>
    </div>
  );
}

export default App;