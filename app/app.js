import angular from 'angular';
import 'angular-sanitize';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

import './oauth';
import './styles/twitplot.css';

import GmapsService from './services/gmaps';
import TwitterService from './services/twitter';
import TwitterController from './controllers/twitter';

window.jQuery = $;
window.$ = $;

window.initMap = () => {
    const map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: { lat: 12.3157, lng: 123.8854 },
        mapTypeId: 'terrain',
        scrollwheel: false,
        zoom: 6
    });

    const MapUtilityService = MapUtilityServiceFactory(map);

    angular.module('twitplot', ['ngSanitize'])
        .factory('MapUtilityService', MapUtilityService)
        .factory('TwitterService', TwitterService)
        .factory('GmapsService', GmapsService)
        .controller('TwitterController', TwitterController);

    angular.bootstrap(document, ['twitplot']);

};

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