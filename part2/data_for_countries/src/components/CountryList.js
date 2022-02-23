
const CountryList = ({ searchedCountries, handleCountryButton }) => {

  const getNames = () => {
    const countries = []

    searchedCountries.filter(country => {
      return countries.push(country.name.common)
    })

    return countries
  }

  return (
    <>
      <div>
        {searchedCountries.length > 10 ? (searchedCountries.length === 250 ? '' : 'Too many matched, specify another filter') 
          : 
          getNames().map(result => {
          return (
            <div key={result}>
              <p>{result}</p><button onClick={() => {
                searchedCountries.forEach(country => {
                  if (country.name.common.localeCompare(result) === 0) {
                    handleCountryButton(true, country)
                  }
                })
              }}>show</button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default CountryList