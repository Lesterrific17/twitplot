export default ['$q', '$http', 'MapUtilityService', function($q, $http, MapUtilityService) {

    return {
        plotAddress: function(address) {
            if(!address) {
                console.log('no value for address paramter.');
                return;
            }
            $http({
                mathod: 'GET',
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address
                + '&key=AIzaSyA-cq1BDG40iEVQG3Bm6rCc5X2yMSvlYPc'
            }).then(function successCallback(response){
                //console.log(response.data.results[0].geometry.location);
                try{
                    MapUtilityService.putCircle(response.data.results[0].geometry.location);
                }
                catch(e){
                    //unable to geocode address
                    console.log(e);
                }

            }, function errorCallback(response){

            });
        }
    }
}]