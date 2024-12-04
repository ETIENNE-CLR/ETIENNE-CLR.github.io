// Constantes
const URL_JSON = 'src/markers.json';
const ICON_MARKER_SIZE = 32;

const USER_ICON = L.icon({
    iconUrl: 'img/user.svg',
    iconSize: [ICON_MARKER_SIZE, ICON_MARKER_SIZE]
});

// Les markers
let allMarkers;

// Au chargement de la page
document.addEventListener('DOMContentLoaded', async function () {
    // Init
    allMarkers = get_pokemon_markers();
    const map = initCarte();
    putMarkers(map, allMarkers);
    putUser(map);
});

function initCarte() {
    const map = L.map('map').setView([46.2044, 6.1432], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Carte : © OpenStreetMap'
    }).addTo(map);
    return map;
}

function putMarkers(map, markers) {
    markers.forEach(marker => {
        const icon = L.icon(marker.icon);

        L.marker(marker.coords, { icon })
            .addTo(map)
            .bindPopup(`<b>${marker.nom}</b>`);
    });
}

function putUser(map) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            L.marker(userCoords, { icon: USER_ICON })
            .addTo(map)
            .bindPopup("Vous êtes ici")
            .openPopup();
            map.setView(userCoords, 13);
            localStorage.setItem('userCoordonate', userCoords);
        });
    } else {
        alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
}
