import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ searchedCountry }) => {

  const [temp, setTemp] = useState(0)
  const [wind, setWind] = useState(0)
  const [icon, setIcon] = useState('01d')

  const capital = searchedCountry.capital
  const apiKey = process.env.REACT_APP_API_KEY
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`

  useEffect(() => {
    axios.get(apiURL).then(response => {
      setTemp(response.data.main.temp)
      setWind(response.data.wind.speed)
      setIcon('http://openweathermap.org/img/wn/'+response.data.weather[0].icon+'@2x.png')
    })
  }, [])

  let languages = []

  for (const lang in searchedCountry.languages) {
    languages.push(searchedCountry.languages[lang])
  }


  return (
    <>
      <h1>{searchedCountry.name.common}</h1>
      <p>capital {searchedCountry.capital}</p>
      <p>area {searchedCountry.area}</p>

      <h2>languages:</h2>
      <ul>
        {languages.map(language => {
          return <li key={language}>{language}</li>
        })}
      </ul>
      
      <p>{searchedCountry.flag}</p>

      <h3>Weather in {searchedCountry.capital}</h3>
      <p>temp {((temp - 273.15) * (9/5) + 32).toFixed(2)} F</p>
      <img src={icon} alt="weather_icon"/>
      <p>wind {wind} m/s</p>
    </>
  )
}

export default Country