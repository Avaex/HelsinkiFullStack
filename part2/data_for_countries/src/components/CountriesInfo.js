import CountryList from './CountryList'
import Country from './Country'

const CountriesInfo = ({ searchedCountries, clickedCountryButton, clickedCountry, handleCountryButton }) => {
  return (
    searchedCountries.length === 1 ?
    <>
      <Country searchedCountry={searchedCountries[0]} />
    </>
    :
    <>
      <CountryList searchedCountries={searchedCountries} handleCountryButton={handleCountryButton} />
      {clickedCountryButton ? <Country searchedCountry={clickedCountry} /> : ''}
    </>
  )
}

export default CountriesInfo