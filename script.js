const typeClasses = {
  normal: "type-normal",
  fire: "type-fire",
  water: "type-water",
  electric: "type-electric",
  grass: "type-grass",
  ice: "type-ice",
  fighting: "type-fighting",
  poison: "type-poison",
  ground: "type-ground",
  flying: "type-flying",
  psychic: "type-psychic",
  bug: "type-bug",
  rock: "type-rock",
  ghost: "type-ghost",
  dragon: "type-dragon",
  dark: "type-dark",
  steel: "type-steel",
  fairy: "type-fairy"
};

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?limit=15&offset=0";

fetch(pokedexUrl)
  .then((response) => response.json())
  .then((data) => {
    const pokemonsList = data.results;

    const detailPromises = pokemonsList.map(poke =>
      fetch(poke.url).then(response => response.json())
    );

    return Promise.all(detailPromises);
  })
  .then((pokemonDetails) => {
    pokemonDetails.sort((a, b) => a.id - b.id);

    pokemonDetails.forEach((details) => {
      const nom = details.name;
      const picture = details.sprites.other.home.front_default;
      const id = details.id;
      const type = details.types[0].type.name;
      const typeClass = typeClasses[type] || "type-default";

      document.querySelector(".pokedex").innerHTML += `
        <div class="pokemon-card ${typeClass}">
          <h1>#${id} ${nom}</h1>
          <img src="${picture}" alt="${nom}">
          <p><br>${type}</p>
        </div>
      `;
    });
  });
