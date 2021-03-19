// const { mainModule } = require("node:process");

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0354446, lng: -118.2411814 },
    zoom: 14,
    // styles: 
    // [
    //     {
    //         "featureType": "all",
    //         "elementType": "labels.text.fill",
    //         "stylers": [
    //             {
    //                 "saturation": 36
    //             },
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 40
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "all",
    //         "elementType": "labels.text.stroke",
    //         "stylers": [
    //             {
    //                 "visibility": "on"
    //             },
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 16
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "all",
    //         "elementType": "labels.icon",
    //         "stylers": [
    //             {
    //                 "visibility": "off"
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "administrative",
    //         "elementType": "geometry.fill",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 20
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "administrative",
    //         "elementType": "geometry.stroke",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 17
    //             },
    //             {
    //                 "weight": 1.2
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "landscape",
    //         "elementType": "geometry",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 20
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "poi",
    //         "elementType": "geometry",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 21
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "road.highway",
    //         "elementType": "geometry.fill",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 17
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "road.highway",
    //         "elementType": "geometry.stroke",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 29
    //             },
    //             {
    //                 "weight": 0.2
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "road.arterial",
    //         "elementType": "geometry",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 18
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "road.local",
    //         "elementType": "geometry",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 16
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "transit",
    //         "elementType": "geometry",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 19
    //             }
    //         ]
    //     },
    //     {
    //         "featureType": "water",
    //         "elementType": "geometry",
    //         "stylers": [
    //             {
    //                 "color": "#000000"
    //             },
    //             {
    //                 "lightness": 17
    //             }
    //         ]
    //     }
    // ],
  });
  getStores();
  createMarker();
}

const getStores = () => {
  const API_URL = 'http://localhost:3000/api/stores';
  fetch(API_URL)
  .then((response) => {
    if(response.status == 200) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  }).then((data) => {
    searchLocationsNear(data);
  })
}

const searchLocationsNear = (stores) => {
  let bounds = new google.maps.LatLngBounds();
  stores.forEach((store, index) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[1],
      store.location.coordinates[0]);
    let name = store.storeName;
    let adress = store.adressLines[0];
    bounds.extend(latlng);
    createMarker(latlng, name, adress);
  });
  map.fitBounds(bounds);
}

const createMarker = (latlng, name, adress) => {
  var marker = new google.maps.Marker({
    position: latlng,
    map: map
})
}
