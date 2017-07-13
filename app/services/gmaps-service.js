
angular.module('gmaps.services', []).factory('gmapsService', function($q, $http){

    return {
        plotAddress: function(address) {
            $http({
                mathod: 'GET',
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address
                    + '&key=AIzaSyA-cq1BDG40iEVQG3Bm6rCc5X2yMSvlYPc'
            }).then(function successCallback(response){
                //console.log(response.data.results[0].geometry.location);
                putCircle(response.data.results[0].geometry.location);
            }, function errorCallback(response){

            });
        }
    }
});