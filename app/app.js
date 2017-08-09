import 'babel-polyfill';
import angular from 'angular';
import 'angular-sanitize';
import 'angular-animate';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

import './oauth';
import './styles/twitplot.css';

import MainController from './controllers/main';
import TwitterService from './services/twitter';
import GmapsService from './services/gmaps';
import TweetService from './services/tweet';
import toggleSettingDirective from './directives/toggleSetting';
import toggleDirective from './directives/toggle';
import scrollableDirective from './directives/scrollable';

window.jQuery = $;
window.$ = $;

var app = angular.module('Twitplot', ['ngSanitize', 'ngAnimate'])
    .controller('MainController', MainController)
    .factory('TwitterService', TwitterService)
    .factory('GmapsService', GmapsService)
    .factory('TweetService', TweetService)
    .directive('toggleSetting', toggleSettingDirective)
    .directive('toggle', toggleDirective)
    .directive('scrollable', scrollableDirective);

window.initMap = function() {

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: { lat: 12.3157, lng: 123.8854 },
        mapTypeId: 'roadmap',
        scrollwheel: true,
        zoom: 7
    });
    window.map = map;

};
