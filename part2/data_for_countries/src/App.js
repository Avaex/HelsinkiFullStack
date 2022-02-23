import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import CountriesInfo from './components/CountriesInfo'
import axios from 'axios'

const App = () => {

  const [countries, setCountries] = useState([])
  const [searchedCountries, setSearchedCountries] = useState([])
  const [clickedCountryButton, setClickedCountryButton] = useState(false)
  const [clickedCountry, setClickedCountry] = useState()

  useEffect(() => {
    console.log('countries useEffect executing')

    axios.get('https://restcountries.com/v3.1/all').then(response => {
      console.log('restCountries promise fulfilled')
      setCountries(response.data)
    })
  }, [])

  const handleSearch = (event) => {
    console.log(event.target.value)

    let searched = countries.filter(country => {
      return country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setSearchedCountries(searched)
    setClickedCountryButton(false)
    setClickedCountry()
  }

  const handleCountryButton = (countryBool, country) => {
    setClickedCountryButton(countryBool)
    setClickedCountry(country)
  }

  return (
    <>
      <SearchBar handleSearch={handleSearch}/>
      <CountriesInfo searchedCountries={searchedCountries} clickedCountryButton={clickedCountryButton} 
        clickedCountry={clickedCountry} handleCountryButton={handleCountryButton} />
    </>
  );
}

export default App;
