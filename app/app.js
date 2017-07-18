import angular from 'angular';
import 'angular-sanitize';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

import './oauth';
import './styles/twitplot.css';

import MainController from './controllers/main';
import TwitterService from './services/twitter';

window.jQuery = $;
window.$ = $;

var app = angular.module('Twitplot', ['ngSanitize'])
    .controller('MainController', MainController)
    .factory('TwitterService', TwitterService);
app.mapReady = false;

window.initMap = function() {

    const map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: 12.3157, lng: 123.8854},
        mapTypeId: 'terrain',
        scrollwheel: false,
        zoom: 6
    });

    const MapUtilityService = MapUtilityServiceFactory(map);
    app.factory("MapUtilityService", MapUtilityService);
    app.mapReady = true;
}

const MapUtilityServiceFactory = map => () => ({
    putCircle: location => {
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
});
