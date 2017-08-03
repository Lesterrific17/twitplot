export default function(GmapsService) {

  this.makeTweets = rawTweets => {
    return new Promise((resolve, reject) => {
      let promises = [];
      let tweets = [];

      rawTweets.forEach(rawTweet => {
        if (rawTweet.geo || rawTweet.place) {
          let tweet = {
              user:{
                  profile_image_url: rawTweet.user.profile_image_url,
                  name: rawTweet.user.name,
                  screen_name: rawTweet.user.screen_name
              },
              text: rawTweet.text,
              entities: {
                  hashtags: rawTweet.entities.hashtags
              }
          };

          if (rawTweet.geo) {
            promises.push(GmapsService.reverseGeocode(rawTweet.geo.coordinates));
            tweet.location = { type: 0 };
          }
          else {
            promises.push(GmapsService.geocode(rawTweet.place.full_name));
            tweet.location = { type: 1 };
          }

          tweets.push(tweet);
        }
      });

      Promise.all(promises)
        .then(values => {
          values.forEach((val, i) => {
            let marker = GmapsService.createMarker(map, val.geometry.location.lat, val.geometry.location.lng);
            angular.extend(tweets[i].location, {
              address: val.formatted_address,
              marker: marker,
              lat: val.geometry.location.lat,
              lng: val.geometry.location.lng
            });
            tweets[i].id = i;
          });
          resolve(tweets);
        })
        .catch(reject);
    });
  }

}
