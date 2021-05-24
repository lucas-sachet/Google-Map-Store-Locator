// const { mainModule } = require("node:process");

var map;
var infoWindow;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0354446, lng: -118.2411814 },
    zoom: 14,
  });
  infoWindow = new google.maps.InfoWindow();
  createMarker();
}

const onEnter = (e) => {
  if(e.key == "Enter") {
    getStores();
  }
}

const getStores = () => {
  const zipCode = document.getElementById('zip-code').value;
  if(!zipCode) {
    return;
  }
  const API_URL = 'http://localhost:3000/api/stores';
  const FULL_URL = `${API_URL}?zip_code=${zipCode}`
  fetch(FULL_URL)
  .then((response) => {
    if(response.status == 200) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  }).then((data) => {
    clearLocations();
    searchLocationsNear(data);
    setStoresList(data);
    setOnClickListener()
  })
}

const clearLocations = () => {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

const setOnClickListener = () => {
  let storeElements = document.querySelectorAll('.store-container');

  storeElements.forEach((elem, index) => {
    elem.addEventListener('click', () => {
      google.maps.event.trigger(markers[index + 1], 'click')
    })  
  })
}

const setStoresList = (stores) => {
  let storesHtml = '';
  stores.forEach((store, index) => {
    storesHtml += `
      <div class="store-container">
        <div class="store-container-background">
            <div class="store-info-container">
                <div class="store-address">
                    <span>${store.addressLines[0]}</span>
                    <span>${store.addressLines[1]}</span>
                </div>
                <div class="store-phone-number">
                    <span>${store.phoneNumber}</span>
                </div>
            </div>
            <div class="store-number-container">
                <div class="store-number">
                    ${index + 1}
                </div>
            </div>
        </div>
      </div>
    `
  })

  document.querySelector('.stores-list').innerHTML = storesHtml;
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

  markers.push(marker);
}
