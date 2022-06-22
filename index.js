console.log("Let's Catch a Pokemon!")
console.dir(document)
let pokeball = document.getElementById('pokeball')
const centerStage = document.getElementById('center-stage')

const getMon = async () => {
  const pokemonCaught = []
  const pokemonURL = 'https://pokeapi.co/api/v2/pokemon'
  const typesURL = 'https://pokeapi.co/api/v2/type/'
  
  // Get the count of the pokemon API Resource
  let limit = '?limit=1' // setting limit to 1 mins data return of default 20
  let response = await axios.get(pokemonURL + limit)
  // Sets the pokemon count and changes the limit to request all pokemon
  let count = response.data.count
  limit = `?limit=${count}`

  // Get all pokemon data
  response = await axios.get(pokemonURL + limit)
  const pokemonData = response.data.results
  
  // Catch a random pokemon
  let randomIndex = Math.floor(Math.random() * (count - 1))
  let randomPokemon = pokemonData[randomIndex]
  response = await axios.get(randomPokemon.url)
  
  
  // Adding first pokemon to the pokemonCaught[]
  pokemonCaught.push(response.data)
  
  // Determine types of the first pokemon to catch 5 more of the same types
  let pokemonTypes = []
  for (let type of pokemonCaught[0].types) {
    pokemonTypes.push(type.type.name)
  }

  // Get all pokemon of the same type as the first
  const pokemonPool = []
  for (let type of pokemonTypes) {
    response = await axios.get(typesURL + type)
    pokemonPool.push(...response.data.pokemon)
  }

  // Catch 5 random pokemon from the pokemonPool (*same type as first pokemon)
  for (let i = 0; i < 5; i++) {
    randomIndex = Math.floor(Math.random() * (pokemonPool.length))
    randomPokemon = pokemonPool[randomIndex].pokemon
    response = await axios.get(randomPokemon.url)
    pokemonCaught.push(response.data)
  }

  console.log(pokemonCaught)

  // Setup for each pokemon info
  // Display info for each pokemon
  centerStage.innerHTML = '<div class="title-text">Here are the Pokemon that you caught!</div>'
  centerStage.innerHTML += '<div class="card-columns"></div>'

  for (let pokemon of pokemonCaught) {
    let pokemonName = pokemon.name
  .slice(0, 1).toUpperCase() + pokemon.name.slice(1)

    let pokemonTypes = []
    for (let type of pokemon.types) {
      pokemonTypes.push(type.type.name)
    }
    let pokemonSpriteURL = pokemon.sprites.front_default
    
    let htmlCard = `<div class="card" style="width: 18rem;">
    <img src="${pokemonSpriteURL}" class="card-img-top pokemon-img" alt="Pokemon Image">
    <div class="card-body" style="height: 100px;">
      <p class="card-title card-text">${pokemonName}</p>
      <p class="card-text card-subtext">(types: ${pokemonTypes.join(', ')})</p>
    </div>
  </div>`
  centerStage.querySelector('.card-columns').innerHTML += htmlCard
  }

  centerStage.innerHTML += `<p>
  <input type="image" id="pokeball" alt="pokeball" src="assets/pokeball.png" width="96px" height="96px">
</p>`

  pokeball = document.getElementById('pokeball')
  pokeball.addEventListener('click', getMon)
}

pokeball.addEventListener('click', getMon)