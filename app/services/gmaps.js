
export default ['$http', function($http){

    let gmapsApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    let apiKey = 'AIzaSyA-cq1BDG40iEVQG3Bm6rCc5X2yMSvlYPc';

    return{

        /*  puts a marker on a map corresponding to the given coordinate */
        createMarker: (map, lat, lng) => {

            return new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                icon: {
                    path: 'M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
                    scale: 2,
                    strokeColor: 'indianred',
                    strokeWeight: 40,
                    strokeOpacity: 0.7
                },
                map: map
            });

        },

        /*  zooms in dead center to a location on a map */
        setMapCenter: (map, marker, address) => {

            let infoWindow = new google.maps.InfoWindow({
                content: `<h3>${ address }</h3>`
            });
            setTimeout(function () { infoWindow.close(); }, 5000)

            map.setZoom(14);
            map.panTo(marker.position);
            infoWindow.open(map, marker);

        },

        /*  returns the coordinates (lat, long) of the place using the Google Maps
        *   JavaScript API  */
        geocode: (address) => {
            return new Promise((resolve, reject) => {
              $http({
                  method: 'GET',
                  url: `${ gmapsApiUrl }?address=` + encodeURIComponent(address) + `&key=${ apiKey }`
              })
              .then(response => {
                  resolve(response.data.results[0]);
              })
              .catch(reject);
            });
        },

        /*  return the name of a place given the coordinates using the Google Maps
        *  JavaScript API   */
        reverseGeocode: (coordinates) => {
          let [lat, lng] = coordinates;
          return new Promise((resolve, reject) => {
            $http({
                method: 'GET',
                url: `${ gmapsApiUrl }?latlng=${ lat }, ${ lng }&key=${ apiKey }`
            })
            .then(response => {
                resolve(response.data.results[0]);
            })
            .catch(reject);
          });
        },

        /*  */
        deEmphasizeMarker: marker => {
            marker.icon.strokeOpacity = 0.2;
        },



    }

}];
