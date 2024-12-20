function GetRandomInt(min = 1, max = 100) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

// les pokemons qui ont déjà été cherché
function get_pokemon_saw() {
    let lespokemons = JSON.parse(localStorage.getItem('my_pokemons_list'));
    return (lespokemons != null) ? lespokemons : {};
}
function set_pokemon_saw(jsonValue) {
    localStorage.setItem('my_pokemons_list', JSON.stringify(jsonValue));
}

// les pokemons avec les markers
function get_pokemon_markers() {
    let lespokemons = JSON.parse(localStorage.getItem('pokemon_markers'));
    return (lespokemons != null) ? lespokemons : [];
}
function set_pokemon_markers(jsonValue) {
    localStorage.setItem('pokemon_markers', JSON.stringify(jsonValue));
}

// Options
function getIfUseCache() {
    return (localStorage.getItem('cache') == "true");
}

function setIfUseCache(value) {
    return localStorage.setItem('cache', value);
}

function getDataStored() {
    return JSON.parse(localStorage.getItem('dataStored'));
}

async function saveAPIdata() {
    let APIdata = await getPokemonFromApi();
    localStorage.setItem('dataStored', JSON.stringify(APIdata));
    console.log('données sauvegardées avec succès');
}

function getMyPokemon() {
    let data = localStorage.getItem('mypokemon');
    return data == null ? [] : JSON.parse(data);
}
function setMyPokemon(value) {
    localStorage.setItem('mypokemon', JSON.stringify(value));
}