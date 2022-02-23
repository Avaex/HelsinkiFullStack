const SearchBar = ({ handleSearch }) => {
  return (
    <>
      find countries <input onChange={handleSearch}/>
    </>
  )
}

export default SearchBar