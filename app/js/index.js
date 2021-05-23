// const { mainModule } = require("node:process");

var map;
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0354446, lng: -118.2411814 },
    zoom: 14,
  });
  infoWindow = new google.maps.InfoWindow();
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
    let address = store.addressLines[0];
    let openStatusText = store.openStatusText;
    let phone = store.phoneNumber;
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, phone, index + 1);
  });
  map.fitBounds(bounds);
}

const createMarker = (latlng, name, address, openStatusText, phone, storeNumber) => {
  let html = `
    <div class="store-info-window">
      <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-open-status">
        ${openStatusText}
      </div>
      <div class="store-info-address">
        <div class="icon">
        <i class="fas fa-map-marker-alt"></i>
        </div>
        <span>
          ${address}
        </span>
      </div>
      <div class="store-info-phone">
      <div class="icon">
        <i class="fas fa-phone-square-alt"></i>
      </div>
        <span>
          <a href="tel:${phone}" /> ${phone}
        </span>
      </div>
    </div>
  `
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    label: `${storeNumber}`
  })

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html)
    infoWindow.open(map, marker)
  })
}
