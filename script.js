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

let offset = 0;
const limit = 50;

function loadPokemons() {
  const pokedexUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  fetch(pokedexUrl)
    .then(response => response.json())
    .then(data => {
      const pokemonsList = data.results;
      const detailPromises = pokemonsList.map(poke =>
        fetch(poke.url).then(response => response.json())
      );
      return Promise.all(detailPromises);
    })
    .then(pokemonDetails => {
      pokemonDetails.sort((a, b) => a.id - b.id);
      const pokedex = document.querySelector(".pokedex");

      pokemonDetails.forEach(details => {
        const nom = details.name;
        const picture = details.sprites.other.home.front_default;
        const id = details.id;
        const type = details.types[0].type.name;
        const typeClass = typeClasses[type] || "type-default";

        pokedex.innerHTML += `
          <div class="pokemon-card ${typeClass}">
            <h1>#${id} ${nom}</h1>
            <img src="${picture}" alt="${nom}">
            <p><br>${type}</p>
          </div>
        `;
      });

      offset += limit; // mise à jour pour la prochaine page
    });
}

// Charger les premiers 15 Pokémon au chargement de la page
loadPokemons();

// Attacher l’événement au bouton
document.getElementById("loadMoreBtn").addEventListener("click", loadPokemons);

const loadMoreBtn = document.getElementById("loadMoreBtn");

loadMoreBtn.addEventListener("click", () => {
  loadMoreBtn.classList.add("spin");
  loadPokemons();
  setTimeout(() => loadMoreBtn.classList.remove("spin"), 500);
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchInput = document.getElementById("searchInput").value.trim();
  if (!searchInput) return;

  const searchUrl = `https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase()}`;

  fetch(searchUrl)
    .then(response => {
      if (!response.ok) throw new Error("Pokémon non trouvé");
      return response.json();
    })
    .then(details => {
      const nom = details.name;
      const picture = details.sprites.other.home.front_default;
      const id = details.id;
      const type = details.types[0].type.name;
      const typeClass = typeClasses[type] || "type-default";

      const pokedex = document.querySelector(".pokedex");
      pokedex.innerHTML = `
        <div class="pokemon-card ${typeClass}">
          <h1>#${id} ${nom}</h1>
          <img src="${picture}" alt="${nom}">
          <p><br>${type}</p>
        </div>
      `;
    })
    .catch(error => {
      document.querySelector(".pokedex").innerHTML = `<p style="text-align:center;">Aucun Pokémon trouvé avec cet ID.</p>`;
    });
});

