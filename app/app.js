import angular from 'angular';
import 'angular-sanitize';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';

import './oauth';
import './styles/twitplot.css';

import MainController from './controllers/main';
import TwitterService from './services/twitter';
import GmapsService from './services/gmaps';

window.jQuery = $;
window.$ = $;

var app = angular.module('Twitplot', ['ngSanitize'])
    .controller('MainController', MainController)
    .factory('TwitterService', TwitterService);

window.initMap = function() {

    const map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: 12.3157, lng: 123.8854},
        mapTypeId: 'roadmap',
        scrollwheel: false,
        zoom: 7
    });
    app.factory('GmapsService', GmapsService);

};

$(document).ready(function(){
    $('.modern-toggle').click(function(){
        if($(this).hasClass('on')){
            $(this).removeClass('on').addClass('off');
        }
        else if($(this).hasClass('off')){
            $(this).removeClass('off').addClass('on');
        }
    });
});
