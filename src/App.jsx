import { useEffect, useState } from 'react'
import connectServer from './Connection'
import Weather from './WeatherConnection'

const DisplayAll = (props) => {

  return(
    <>
      <p>{props.name}</p><button onClick={() =>props.onChoose(props.country)}>Show</button>
    </>
  )
}
const DisplayOne = ({country, onChoose}) => {
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    setLoading(true)
    const [lat, lng] = country.capitalInfo?.latlng || country.latlng

    Weather.getWeather(lat, lng)
    .then(response => {
      setWeather(response.data) 
      setLoading(false)})
    .catch(() => {
      setWeather(null)
      setLoading(false)}
    )}
    ,[country])

  return(
    <div>
      <h1>{country.name.common}</h1>
      {onChoose&& 
        (<button onClick={() => onChoose(country)}>Hide</button>)
    }
      <p>
        Capital: {country.capital}
      </p>
      <p>
        Region: {country.region}
      </p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language, index) =>{
          return <li key={index}>{language}</li>
        })}
      </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`}></img>

      {loading ? (<p>Loading weather...</p>) :
      weather ?(
        <>
       <h2>Weather in {country.capital[0]}</h2>
        <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
        <img alt='weather-img' src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
        <p>{weather.weather[0].main}</p>
        <p>Wind: {weather.wind.speed} m/s</p>
        </>):<p>Weather data not available</p>}
        
    </div>
  )
}

const Statistics = ({filteredCountries, selectedCountries, onChoose}) => {
  if(selectedCountries != null){
     
    return <DisplayOne key={selectedCountries.cca3} country={selectedCountries} onChoose={onChoose}/>
        
  }
  else if(filteredCountries.length>1 && filteredCountries.length<=10){
    return(
      <div>
        {filteredCountries.map(c => { 
          return <DisplayAll key={c.cca3} name={c.name.common} onChoose={onChoose} country={c}/>
        })}
      </div>
    )
  }
  else if(filteredCountries.length>10){
    return(
      <h1>Enter Country Names</h1>
    )
  }
  else{
    return(
    <div>
      {filteredCountries.map(c => { 
          return <DisplayOne key={c.cca3} country={c}/>
        })}
    </div>
    )
  }
 
  
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountries, setSelectedCountries] = useState(null)

  useEffect(() => {connectServer.getAll()
    .then(response => { 
      setAllCountries(response.data)
    })}, [])
  const characterChange = (data) => {
    setSearchText(data.target.value)
    selectedCountries ? setSelectedCountries(null) : null
    
  }
  const onChoose = (c) =>{
    setSelectedCountries(selectedCountries === null ? c : null)
  }

  const filteredCountries = (allCountries.filter(p => {return p.name.common.toLowerCase().includes(searchText.toLowerCase())}))


  return(
    <div>
      <form>
        Find Countries <input type="text" name="" id="" onChange={characterChange}/>
      </form>
      <Statistics filteredCountries={filteredCountries} selectedCountries={selectedCountries} onChoose={onChoose}/>
    </div>
  )
}

export default App
