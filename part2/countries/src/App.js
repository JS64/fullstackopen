import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Button = ({ name, onClick, text }) => (
  <button name={name} onClick={onClick}>
    {text}
  </button>
)

const Weather = ({ city }) => {
  const [ weather, setWeather ] = useState([])

  useEffect(() => {
    const weatherstackToken = process.env.REACT_APP_WEATHERSTACK_API_KEY
    const weatherstackEndpoint = `http://api.weatherstack.com/current?access_key=${weatherstackToken}&query=${city}`
    axios
      .get(weatherstackEndpoint)
      .then(response => {
        setWeather(response.data.current)
      })
  }, [city, setWeather])
  
  return (
    <>
      <h2>Weather in {city}</h2>
      <p>
        <b>Temperature: </b> {weather.temperature} Celcius
      </p>
      <img src={weather.weather_icons} alt={weather.weather_descriptions} height="100" />
      <p>
        <b>Wind: </b> {weather.wind_speed} km/h direction {weather.wind_dir}
      </p>
    </>
  )
}

const Country = ({ country }) => (
  <>
    <h1>{country.name}</h1>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <h2>Languages Spoken</h2>
    <ul>
      {country.languages.map(language =>
        <li key={language.name}>{language.name}</li>
      )}
    </ul>
    <img src={country.flag} alt={country.name} height="100" />
    <Weather city={country.capital} />
  </>
)

const Search = ({ search, handleSearch }) => (
  <p>
    Find country: <input value={search} onChange={handleSearch} />
  </p>
)

const Results =  ({ countries, handleShow }) => {
  if (countries.length > 10) {
    return (
      <p>Too many matching countries.  Please refine your search.</p>
    )
  } else if (countries.length > 1) {
    return (
      <>
        {countries.map(country =>
        <p key={country.name}>
          {country.name} <Button name={country.name} text="Show" onClick={handleShow} />
        </p>
      )}
      </>
    )
  } else if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  } else
  return (
    <p>No countries match your search.</p>
  )
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ search, setSearch ] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleShow = (event) => {
    setSearch(event.target.name)
  }

  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase()))
 
  return (
    <div>
      <Search search={search} handleSearch={handleSearch} />
      <Results countries={filteredCountries} handleShow={handleShow} />
    </div>
  )
}

export default App