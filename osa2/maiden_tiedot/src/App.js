import React, { useState, useEffect } from 'react'
import axios from 'axios'


function App() {
  const [ countries, setCountries ] = useState([])
  const [ weather, setWeather ] = useState('')
  const [ query, setQuery ] = useState('http://api.weatherstack.com/current?access_key=aa966d430b5c81a952369511ab9ff8cd&query=Helsinki&units=m')
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() => {
      console.log('effect')
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(response => {
          console.log('promise fulfilled')
          setCountries(response.data)
        })
  }, [])

  useEffect(() => {
      console.log('weather effect')
      axios
        .get(query)
        .then(response => {
          setWeather(response.data)
          console.log('response.data', response.data)
        })
  }, [query])

  console.log('render', countries.length, 'countries', countries)
  console.log('render', weather.length, 'weather ', weather)

  const makeQuery = (props) => {
    console.log('makeQuery ', props)
    const city = '&query='+ props
    const address = 'http://api.weatherstack.com/current?access_key=aa966d430b5c81a952369511ab9ff8cd'
    const units = '&units=m'

    const sum = (address + city + units)
    console.log(sum)
    setQuery(sum)
  }

  const showCountry = (props) => {
    console.log('showCountry ',props)
    const country = props

    makeQuery(country.capital)

    const list = (props) => {
      console.log('list: ', props[0]);
      return(
        props.map((value) =>
          <li key={value.name}> {value.name} </li>
        )
      )
    }

    return (
      <div>
        <h1>{country.name}</h1>
        capital: {country.capital}
        <br />
        population: {country.population}
        <br />
        <br />
        languages:
        <ul>
          {list(country.languages)}
        </ul>
        <img src={country.flag} height="80" width="120" />
        <h1>Weather in {country.capital}</h1>
        temperature: {weather.current.temperature}
        <br />
        <img src={weather.current.weather_icons[0]} height="120" width="120" />
        <br />
        wind: {weather.current.wind_speed} direction {weather.current.wind_dir}
      </div>
    )
  }


  const Country = (props) => {
    console.log('Country ',props)
    return (
        <div>{props.name} <button onClick={() => setNewFilter(props.name)} >show</button><br /></div>
    )
  }

  const Countries = () => {
    const countriesToShow = countries.filter(country => country.name.toLowerCase().startsWith(newFilter.toLowerCase()) === true)

    const rows = () =>  countriesToShow.map(country =>
      <Country
        key={country.name}
        name={country.name}
        country={country}
      />
    )

      if(countriesToShow.length === 1) {
        return(showCountry(countriesToShow[0]) )
      } else if (countriesToShow.length < 11) {
        return (
          <div>
            {rows()}
          </div>
        )
      } else {
        return (<p>Too many matches, specify another filter</p>)
      }

    }

    const handleFilterChange = (event) => {
      console.log('filter: ',event.target.value)
      setNewFilter(event.target.value)
    }

    return (
      <div>
        find countries <input
                          value={newFilter}
                          onChange={handleFilterChange}/>
        <Countries />
      </div>
    )
}

export default App;
