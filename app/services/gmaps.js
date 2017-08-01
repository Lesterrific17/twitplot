
export default ['$http', function($http){

    let gmapsApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    let apiKey = 'AIzaSyA-cq1BDG40iEVQG3Bm6rCc5X2yMSvlYPc';
    let markers = [];

    return{

        /*  returns the coordinates (lat, long) of the place using the Google Maps
        *   JavaScript API  */
        geocode: address => {

            $http({
                method: 'GET',
                url: `${ gmapsApiUrl }?address=` + encodeURIComponent(address) + `&key=${ apiKey }`
            }).then(function success(response){
                console.log(response.data);
            });

        },

        /*  return the name of a place given the coordinates using the Google Maps
        *  JavaScript API   */
        reverseGeocode: (lat, lng) => {

            $http({
                method: 'GET',
                url: `${ gmapsApiUrl }?latlng=${ lat }, ${ lng }&key=${ apiKey }`
            })
            .then(function success(response){
                if(response.data.results.length > 0){
                    return response.data.results[0];
                }
            });

        },

        /*  puts a marker on a map corresponding to the given coordinate */
        plot: (map, lat, lng) => {

            markers.push(new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: { lat: lat, lng: lng },
                radius: 50000/map.zoom
            }));

        },

        clearMarkers: () => {
            markers = [];
        }

    }

}];