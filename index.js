// fields
var txtLat = document.getElementById("txtLatitude");
var txtLon = document.getElementById("txtLongitude");

// reset 
var lnkReset = document.getElementById("lnkReset"); 

// get radios
var radioModes = document.getElementsByName("radioModes[]");

// setup mapbox
var defaultCoord = [40, -74.50];
L.mapbox.accessToken = "pk.eyJ1IjoiYW5kcnUyNTUiLCJhIjoiY2pwdzR0ZGRiMHlvOTQ4bnR2OG9lbTNhNSJ9.isi3uGKrTkISJMlnS2T1bw";
var map = L.mapbox.map("map", "mapbox.streets");
var marker = new L.Marker( new L.LatLng(defaultCoord[0], defaultCoord[1]), {
    draggable: true
});

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
function doReset(evt) {
    coordinatesSetup(defaultCoord);
    marker.setLatLng(defaultCoord);
    map.setView(defaultCoord);
    evt.preventDefault();
}

function onMarkerDragEnd() {
    var lngLat = marker.getLatLng();
    coordinatesSetup([lngLat.lat, lngLat.lng]);
}

function doChangeMode() {
    txtLat.readOnly = (this.id == "drag") ? true : false;
    txtLon.readOnly = (this.id == "drag") ? true : false;

    if (!txtLat.readOnly || !txtLon.readOnly) {
        marker.dragging.disable();
        return;
    }

    marker.dragging.enable();
}

function doUpdatePositionByTextEditing() {
    if (this.readOnly) {
        return;
    }
    var coordinate = [txtLat.value, txtLon.value];
    map.setView(coordinate);
    marker.setLatLng(coordinate);
}

window.onload = function() {
    mapBoxSetup();
    coordinatesSetup(defaultCoord);
    marker.on("dragend", onMarkerDragEnd);

    // for reset
    lnkReset.addEventListener("click", doReset);

    // switching modes
    radioModes[0].checked = true;
    radioModes.forEach(function(radio){
        radio.addEventListener("click", doChangeMode);
    });

    // adding events for inputs
    txtLat.addEventListener("keyup", doUpdatePositionByTextEditing);
    txtLon.addEventListener("keyup", doUpdatePositionByTextEditing);
};