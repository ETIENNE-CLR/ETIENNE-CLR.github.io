// Constantes
const URL_API = 'https://tyradex.app/api/v1/pokemon';
const NB_KM_RANGE = 20;
const earthRadius = 6371;

// Au chargement de la page
let lesPokemon;
document.addEventListener('DOMContentLoaded', async function () {
    lesPokemon = await getPokemonFromApi();
    lesPokemon.shift();
    loadPokemon(lesPokemon);
});

async function getPokemonFromApi() {
    try {
        const response = await fetch(URL_API);
        if (!response.ok) {
            throw new Error(`Erreur de chargement du fichier JSON: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function loadPokemon(pokemonJson) {
    const container = document.getElementById('cont-pokemon');
    pokemonJson.forEach(pokemon => {
        // Créer la carte
        const card = document.createElement('div');
        card.classList.add('card', 'm-3', 'poke-card');
        container.appendChild(card);

        // Créer le titre
        const h5_title = document.createElement('h5');
        h5_title.classList.add('card-title', 'text-center');
        h5_title.innerText = `#${String(pokemon.pokedex_id).padStart(2, '0')} ${pokemon.name.fr}`;
        card.appendChild(h5_title);

        // Créer l'image
        const img_pokemon = document.createElement('img');
        img_pokemon.classList.add('card-img-top');
        img_pokemon.src = pokemon.sprites.regular;
        card.appendChild(img_pokemon);

        // Corps de la carte
        const div_cart_body = document.createElement('div');
        div_cart_body.classList.add('card-body');
        card.appendChild(div_cart_body);

        // Catégorie du pokemon
        const p_category = document.createElement('p');
        div_cart_body.appendChild(p_category);
        const span_categorie = document.createElement('span');
        span_categorie.classList.add('badge', 'text-bg-success');
        span_categorie.innerText = pokemon.category;
        p_category.appendChild(span_categorie);

        // Génération du pokemon
        const p_gene = document.createElement('p');
        div_cart_body.appendChild(p_gene);
        const span_gene = document.createElement('span');
        span_gene.classList.add('badge', 'text-bg-secondary');
        span_gene.innerText = 'GEN ' + pokemon.generation;
        p_gene.appendChild(span_gene);

        // Trouver le pokémon
        let myList = get_pokemon_saw();
        const btn_trouverPokemon = document.createElement('button');
        btn_trouverPokemon.className = 'btn btn-primary';
        btn_trouverPokemon.style.fontSize = '13px';
        btn_trouverPokemon.innerText = 'Trouver le pokémon';
        div_cart_body.appendChild(btn_trouverPokemon);
        if (myList[pokemon.name.fr] == true) {
            btn_trouverPokemon.className = 'btn btn-secondary';
        }
        btn_trouverPokemon.addEventListener('click', function () {
            myList = get_pokemon_saw();
            if (myList[pokemon.name.fr] !== true) {
                // Pas déjà vue
                const FRACTION = 10;
                // Facteur de rareté (plus petit = plus rare)
                let ipt_range = document.getElementById('rarity');
                const RARITY_FACTOR = (ipt_range.value / 100);

                let range = GetRandomInt(0, NB_KM_RANGE * FRACTION);
                let found = Math.random() < RARITY_FACTOR;

                // Générer un nombre
                let nbInRange = found ? GetRandomInt(1, range) : 0;
                let message = nbInRange > 0
                    ? `${nbInRange} ${pokemon.name.fr} trouvé dans un rayon de ${NB_KM_RANGE} km !`
                    : 'Pas de Pokémon trouvé.';
                btn_trouverPokemon.className = 'btn btn-secondary';
                myList[pokemon.name.fr] = true;
                set_pokemon_saw(myList);
                alert(message);
            } else {
                // Déjà vue
                alert('Vous avez déjà cherché ce pokemon !');
            }
        });

        // Afficher le pokémon sur la map
        const btn_pokemonInMap = document.createElement('button');
        btn_pokemonInMap.className = 'btn btn-info';
        btn_pokemonInMap.style.fontSize = '13px';
        btn_pokemonInMap.innerText = 'Sur la carte';
        div_cart_body.appendChild(btn_pokemonInMap);
        btn_pokemonInMap.addEventListener('click', function () {
            put_in_map(pokemon);
        });
    });
}

function generateRandomCoords() {
    // Constantes
    const coords = [];
    const userCoordsString = localStorage.getItem('userCoordonate');
    const NB_COORD = 10;

    // Convertir la chaîne en un objet
    const [lat, lon] = userCoordsString.split(',').map(Number);
    const userCoords = { lat, lon };

    for (let i = 0; i < NB_COORD; i++) {
        // Générer un angle aléatoire (direction)
        const angle = Math.random() * 2 * Math.PI;

        // Générer une distance aléatoire dans le rayon spécifié
        const distance = Math.random() * NB_KM_RANGE;

        // Convertir la distance en latitude et longitude
        const deltaLat = (distance / earthRadius) * (180 / Math.PI);
        const deltaLon = (distance / earthRadius) * (180 / Math.PI) / Math.cos(userCoords.lat * Math.PI / 180);
        const newLat = userCoords.lat + deltaLat * Math.sin(angle);
        const newLon = userCoords.lon + deltaLon * Math.cos(angle);
        coords.push({ lat: newLat, lon: newLon });
    }
    return coords;
};

function put_in_map(pokemonParam = undefined) {
    // Générer les coordonnées aléatoires
    let coord = generateRandomCoords();
    let markers = [];
    coord.forEach(acoord => {
        let pokeAlea = (pokemonParam == undefined) ?
            lesPokemon[GetRandomInt(0, lesPokemon.length - 1)] :
            pokemonParam;

        const ICON_SIZE = 110;
        let newData = {
            "nom": pokeAlea.name.fr,
            "coords": [
                acoord.lat,
                acoord.lon
            ],
            "icon": {
                iconUrl: pokeAlea.sprites.regular,
                iconSize: [ICON_SIZE, ICON_SIZE]
            }
        };
        markers.push(newData);
    });
    set_pokemon_markers(markers);
    window.location = 'index.html';
}