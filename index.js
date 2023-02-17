// fields
var txtLat = document.getElementById("txtLatitude");
var txtLon = document.getElementById("txtLongitude");

// reset
var lnkReset = document.getElementById("lnkReset");

// get radios
var radioModes = document.getElementsByName("radioModes[]");

// get mode by browser
var lnkGetPositionByBrowser = document.getElementById(
  "lnkGetPositionbyBrowser"
);

// message container
var containerMessage = document.getElementById("messages");

// setup mapbox
var defaultCoord = [40, -74.5];
var map = L.map("map");
var marker = new L.Marker(new L.LatLng(defaultCoord[0], defaultCoord[1]), {
  draggable: true,
});

// just for the proper copyright that Leaflet indicates
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function mapBoxSetup() {
  // initial centering
  map.setView(defaultCoord, 9);
  // adding a marker
  marker.setLatLng(defaultCoord).addTo(map);
}

function coordinatesSetup(coordinate) {
  // update textfields
  txtLat.value = coordinate[0]; // latitude
  txtLon.value = coordinate[1]; // longitude
}

// Events
function makeReset(evt) {
  coordinatesSetup(defaultCoord);
  marker.setLatLng(defaultCoord);
  map.setView(defaultCoord, 9);
  evt.preventDefault();
}

function onMarkerDragEnd() {
  var lngLat = marker.getLatLng();
  coordinatesSetup([lngLat.lat, lngLat.lng]);
}

function makeChangeMode() {
  txtLat.readOnly = this.id == "drag" ? true : false;
  txtLon.readOnly = this.id == "drag" ? true : false;

  if (!txtLat.readOnly || !txtLon.readOnly) {
    marker.dragging.disable();
    return;
  }

  marker.dragging.enable();
}

function makeUpdatePositionByTextEditing() {
  if (this.readOnly) {
    return;
  }
  var coordinate = [txtLat.value, txtLon.value];
  map.setView(coordinate);
  marker.setLatLng(coordinate);
}

function makeUpdatePositionByBrowser(evt) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var coords = position.coords;
      var latitude = coords.latitude;
      var longitude = coords.longitude;
      var coord = [latitude, longitude];
      coordinatesSetup(coord);
      marker.setLatLng(coord);
      map.setView(coord);
    },
    function () {
      showMessage("Please enable your geolocation feature");
    }
  );
  evt.preventDefault();
}

function showMessage(text, timeout) {
  var validTimeout = timeout || 4;
  var childElement = document.createElement("div");
  childElement.className = "message";
  childElement.innerHTML = ["<p>", text, "</p>"].join(" ");
  containerMessage.appendChild(childElement);
  var timer = setTimeout(() => {
    childElement.className += " slideup";
    childElement.remove();
  }, 1000 * validTimeout);
}

window.onload = function () {
  mapBoxSetup();
  coordinatesSetup(defaultCoord);
  marker.on("dragend", onMarkerDragEnd);

  // for reset
  lnkReset.addEventListener("click", makeReset);

  // switching modes
  radioModes[0].checked = true;
  radioModes.forEach(function (radio) {
    radio.addEventListener("click", makeChangeMode);
  });

  // for geolocation by browser
  lnkGetPositionByBrowser.style.display = "none";
  if ("geolocation" in navigator) {
    lnkGetPositionByBrowser.style.display = "inline-block";
    lnkGetPositionByBrowser.addEventListener(
      "click",
      makeUpdatePositionByBrowser
    );
  }

  // adding events for inputs
  txtLat.addEventListener("keyup", makeUpdatePositionByTextEditing);
  txtLon.addEventListener("keyup", makeUpdatePositionByTextEditing);
};
