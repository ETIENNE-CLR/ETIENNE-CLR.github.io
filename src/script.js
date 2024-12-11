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
        const markerInstance = L.marker(marker.coords, { icon })
            .addTo(map);

        markerInstance.on('click', function () {
            // Génère un ID unique pour le modal
            const uniqueId = `modal-${Math.random().toString(36).substring(2, 9)}`;

            // Crée l'élément modal et l'ajoute au DOM
            const myModal = document.createElement('div');
            document.body.appendChild(myModal);
            myModal.innerHTML = `
            <div class="modal fade" id="${uniqueId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Un ${marker.nom} sauvage apparait !</h1>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex flex-column justify-content-center">
                                <img src="${marker.icon.iconUrl}" alt="${marker.nom}  sauvage">
                                <img src="img/pokeball.jpg" class="poke-catch mx-auto" alt="pokemon">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            // Initialisation du modal Bootstrap
            const modalElement = document.getElementById(uniqueId);
            const modal = new bootstrap.Modal(modalElement);
            modal.show();

            const pokeBallImage = modalElement.querySelector('.poke-catch');
            pokeBallImage.addEventListener('click', () => {
                const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
                if (bootstrapModal) {
                    alert(`${marker.nom} sauvage a été attrapé !`);
                    let data = getMyPokemon();
                    let date = new Date();
                    data[data.length] = {
                        "name": marker.nom
                    };
                    setMyPokemon(data);
                    const index = markers.indexOf(marker);
                    if (index !== -1) {
                        markers.splice(index, 1);
                        set_pokemon_markers(markers);
                    }
                    bootstrapModal.hide();
                }
            });

            // Optionnel : Supprimer le modal du DOM une fois qu'il est fermé
            modalElement.addEventListener('hidden.bs.modal', function () {
                modalElement.remove();
            });
            markerInstance.remove();
        });
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
