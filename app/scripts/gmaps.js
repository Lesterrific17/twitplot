
var map;

function initMap(){

    map = new google.maps.Map(document.getElementById('map-canvas'), {
       center: { lat: 12.3157, lng: 123.8854 },
        mapTypeId: 'terrain',
        scrollwheel: false,
        zoom: 6
    });
}

function putCircle(location){
    var cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: { lat: location.lat, lng: location.lng },
        radius: 50000/map.zoom
    });
}