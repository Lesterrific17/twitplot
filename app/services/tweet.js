export default [
    'GmapsService', GmapsService =>
        ({
            makeAppTweets: rawTweets => {

                const minimizeTweet = rawTweet =>
                    ({
                        user: {
                            profile_image_url: rawTweet.user.profile_image_url,
                            name: rawTweet.user.name,
                            screen_name: rawTweet.user.screen_name
                        },
                        text: rawTweet.text,
                        entities: {
                            hashtags: rawTweet.entities.hashtags
                        },
                        display: true
                    })

                const makeTweetMarker = (minTweet, geocodingResult) => {
                    angular.extend(minTweet.location, {
                        address: geocodingResult.formatted_address,
                        marker: GmapsService.createMarker(map, geocodingResult.geometry.location.lat, geocodingResult.geometry.location.lng),
                        lat: geocodingResult.geometry.location.lat,
                        lng: geocodingResult.geometry.location.lng
                    });
                };

                return new Promise((resolve, reject) => {

                    let promises = [];
                    let appTweets = [];

                    rawTweets.forEach(rawTweet => {

                        if (rawTweet.geo || rawTweet.place) {

                            let minTweet = minimizeTweet(rawTweet);

                            if (rawTweet.geo) {
                                promises.push(GmapsService.reverseGeocode(rawTweet.geo.coordinates));
                                minTweet.location = {type: 0};
                            }
                            else {
                                promises.push(GmapsService.geocode(rawTweet.place.full_name));
                                minTweet.location = {type: 1};
                            }
                            appTweets.push(minTweet);

                        }

                    });

                    Promise.all(promises)
                        .then(geocodingResults => {
                            geocodingResults.forEach((result, i) => {
                                makeTweetMarker(appTweets[i], result);
                                appTweets[i].id = i
                            });
                            resolve(appTweets);
                        })
                        .catch(reject)

                });

            }

        })
]
