import React, { useState, useEffect, useContext, FunctionComponent } from 'react'
import pet, { ANIMALS, Animal } from '@frontendmasters/pet'
import { connect } from 'react-redux'

import useDropDown from './useDropDown'
import Results from './Results'
import changeTheme from './actionCreators/changeTheme'
import changeLocation from './actionCreators/changeLocation'

const SearchParams = ({
  location,
  theme,
  setLocation,
  setTheme,
}) => {
  console.log(location)
  const [breeds, setBreeds] = useState([])
  const [animal, AnimalDropDown] = useDropDown('Animal','dog', ANIMALS)
  const [breed, BreedDropDown, setBreed] = useDropDown('Breed','', breeds)
  const [pets, setPets] = useState([])

  const requestPets = async () => {
    const { animals } = await pet.animals({
      location,
      breed,
      type: animal,
    })

    setPets(animals || [])
  }

  useEffect(() => {
    setBreeds([])
    setBreed('')

    pet.breeds(animal).then(({ breeds }) => {
      const breed = breeds.map(({ name }) => name)
      setBreeds(breed)
    }, console.error)
  }, [animal, setBreeds, setBreed])

  return (
    <div className="search-params">
      <form onSubmit={(e) => {
        e.preventDefault()
        requestPets()
      }}>
        <label htmlFor="location">
          location
          <input 
            id="location"
            value={location}
            placeholder="location"
            onChange={e => 
              setLocation(e.target.value)
            }
          />
        </label>
        <AnimalDropDown/>
        <BreedDropDown/>
        <label htmlFor='theme'>
          Theme
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            onBlur={e => setTheme(e.target.value)}>
              <option value='peru'>Peru</option>
              <option value='darkblue'>DarkBlue</option>
              <option value='chartreuse'>Chartreuse</option>
          </select>
        </label>
        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets}/>
    </div>
  )
}

const mapStateToProps = ({ theme, location }) => ({
  theme,
  location,
})

const mapDispatchToProps = dispatch => ({
  setLocation: location => dispatch(changeLocation(location)),
  setTheme: theme => dispatch(changeTheme(theme)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchParams)