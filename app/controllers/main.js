
export default function($scope, $timeout, TwitterService, GmapsService, TweetService) {

    const MARKER_SIZE_SCALE_FACTOR = 0.2;

    $scope.tweets = [];
    $scope.tweetCount = 150;
    $scope.searchParameters = [];

    $scope.scrollFuncs = [
        { name: 'Map Zoom' },
        { name: 'Marker Size' }
    ];

    $scope.locationSettings = [
        { name: 'Twitter Geolocations', state: true, },
        { name: 'Associated Locations', state: true, }
    ];

    $scope.loadingTweets = false;
    $scope.loadingLocations = false;
    $scope.isViewingTweet = false;
    $scope.showMapFlash = false;
    $scope.mapFlashText = '';
    $scope.scrollWheelValue = 0;
    $scope.scrollFuncSelected = 0;

    var scrollWheelPrevValue = 0;
    var hasInitScrollWatch = false;

    $scope.$watch('locationSettings', () => {

        $scope.backToResults();
        initTweetLocationDisablers();
        /*$scope.tweets.forEach(function (tweet, index) {
         if($scope.locationSettings[tweet.location.type].state === true){
         tweet.location.marker.setMap(map);
         }
         else{
         tweet.location.marker.setMap(null);
         }
         });
         */

    }, true);

    $scope.$watch('loadingTweets', () => {
        $('#twitplot-data').scrollTop(0);
    });

    $scope.$watch('scrollWheelValue', () => {
        // map zooming is selected
        if($scope.scrollFuncSelected === 0 && hasInitScrollWatch){
            adjustMapZoom();
        }
        // marker scaling is selected
        else if($scope.scrollFuncSelected === 1 && hasInitScrollWatch && $scope.tweets.length > 0){
            adjustMarkerSize(($scope.scrollWheelValue - scrollWheelPrevValue) * MARKER_SIZE_SCALE_FACTOR);
        }
        hasInitScrollWatch = true;
        scrollWheelPrevValue = $scope.scrollWheelValue;

    }, true);

    $scope.$watch('scrollFuncSelected', () => {

        switch ($scope.scrollFuncSelected) {
            case 0: {
                if( window.map ) {
                    setMapZoomingOnScroll(true);
                }
                break;
            }
            case 1: {
                setMapZoomingOnScroll(false);
                if( $scope.tweets.length > 0 ){
                    mapCtrlFlash(`Marker Scale: ${ getCurrentMarkerScale() }x`);
                }
                break;
            }
        }

    });

    /*  deletes a search parameter given its index in the parameters array  */
    $scope.deleteSearchParam = value => {
        $scope.searchParameters.splice(value, 1);
    };

    /*  parses the input search param, checks duplicates, categorizes it, and prompts the user
     *  for a search refresh. */
    $scope.validateSearchParam = () => {

        if( paramAlreadyExists($scope.inputParameter) || $scope.inputParameter.length === 0 || $scope.searchParameters.length === 10) {
            $scope.inputParameter = '';
            return;
        }

        let paramParsers = [
            { regex: /^#/,          type: 'hashtag' },
            { regex: /^@/,          type: 'mention'},
            { regex: /^(from:)/,    type: 'creator'},
            { regex: /^.*/,         type: 'generic'}
        ];

        for (let i = 0; i < paramParsers.length; i++) {
            if (paramParsers[i].regex.test($scope.inputParameter)) {
                $scope.searchParameters.push({ entry: $scope.inputParameter, type: paramParsers[i].type });
                break;
            }
        }
        $scope.inputParameter = '';

    };

    /*  refreshes the list of tweets using the current search parameters */
    $scope.refreshTweets = () => {

        if($scope.searchParameters.length > 0) {
            $scope.loadingTweets = true;
            clearData();
            getTweets();
        }

    };

    /*  returns the user to the list of tweets after viewing a tweet */
    $scope.backToResults = () => {
        $scope.isViewingTweet = false;
        $scope.tweetFilter = {};
        restoreMarkers();
    };

    /*  sets the value of the $scope.scrollFuncSelected to the funcIndex param */
    $scope.setScrollFunc = funcIndex => {
        $scope.scrollFuncSelected = funcIndex;
    };

    /*  centers and zooms the map on a location */
    $scope.focusTweetMarker = tweetId => {

        restoreMarkers();
        $scope.tweetFilter = { id: tweetId };
        $scope.isViewingTweet = true;

        GmapsService.setMapCenter(map, $scope.tweets[tweetId].location.marker, $scope.tweets[tweetId].location.address);
        $scope.tweets.forEach((tweet, i) => {
            if(i !== tweetId){
                $scope.tweets[i].location.marker.getIcon().strokeOpacity = 0.2;
            }
            else{
                $scope.tweets[i].location.marker.getIcon().strokeOpacity = 0.9;
            }
            if($scope.locationSettings[tweet.location.type].state)
                $scope.tweets[i].location.marker.setMap(map);
        });

    };

    /*  enables / disables zooming of map via scrollwheel */
    const setMapZoomingOnScroll = flag => {
        if (map) {
            map.setOptions({ scrollwheel: flag });
        }
    };

    /*  lets Google Maps API handle the zooming of map ; just display the zoom info*/
    const adjustMapZoom = () => {

    };

    /*  adjusts the rendered size of the tweet markers on the map */
    const adjustMarkerSize = scaleAdd => {

        $scope.tweets.forEach((tweet) => {
            tweet.location.marker.getIcon().scale += scaleAdd;
            tweet.location.marker.getIcon().strokeWeight = Math.abs(tweet.location.marker.getIcon().scale) * 40;
        });
        refreshMarkers();
        mapCtrlFlash(`Marker Scale: ${ $scope.tweets[0].location.marker.getIcon().scale.toFixed(2) }x`);

    };

    /*  returns the current scale size of the tweet markers */
    const getCurrentMarkerScale = () => {
        return $scope.tweets[0].location.marker.getIcon().scale.toFixed(2);
    };

    /*  flashes the big font tooltip overlay on the map with a specified text */
    const mapCtrlFlash = text => {

        $scope.mapFlashText =  text;
        $scope.showMapFlash = true;
        setTimeout(() => {
            $scope.showMapFlash = false;
        }, 2000);

    };

    /*  restores the original opacity of the markers (visible and not visible) */
    const restoreMarkers = () => {
        $scope.tweets.forEach((tweet, i) => {
            $scope.tweets[i].location.marker.getIcon().strokeOpacity = 0.8;
        });
        refreshMarkers();
    };

    /*  calls the method setMap() on each tweet markers (visibility is dependent on location settings)  */
    const refreshMarkers = () => {
        $scope.tweets.forEach((tweet) => {
            if($scope.locationSettings[tweet.location.type].state)
                tweet.location.marker.setMap(map);
        });
    };

    /*  removes all the markers (visible and not visible) and clears the tweets array  */
    const clearData = () => {
        $scope.tweets.forEach((tweet, i) => {
            $scope.tweets[i].location.marker.setMap(null);
        });
        $scope.tweets = [];
    };

    /*  TO BE IMPLEMENTED IN UI: Displays any error messages (string) to the user   */
    const displayErrorMessage = errorMessage => {
        console.log(errorMessage);
    };

    /*  checks if the input search parameter already exists in the list  */
    const paramAlreadyExists = param => {

        for (let i = 0; i < $scope.searchParameters.length; i++) {
            if ($scope.searchParameters[i].entry === param) return true;
        }
        return false;

    };

    /*  returns the URL-encoded query string to be sent to Twitter's
     *  Search API */
    const getQueryString = () => {

        let concatParams = '';
        for (let i = 0; i < $scope.searchParameters.length; i++) {
            concatParams = concatParams + $scope.searchParameters[i].entry;
            if (i + 1 !== $scope.searchParameters.length) {
                concatParams = concatParams + ' ';
            }
        }
        return encodeURIComponent(concatParams);

    };

    /*  adds event handlers to the tweet markers on the map  */
    const addMarkerEventListeners = appTweets => {
        appTweets.forEach(tweet => {
            tweet.location.marker.addListener('click', () => {
                $timeout(() => {
                    $scope.focusTweetMarker(tweet.id);
                });
            });
        });
    };

    /*  sets the 'display' property of each tweet according to the location settings. */
    const initTweetLocationDisablers = () => {
        $scope.tweets.forEach((tweet, i) => {
            $scope.tweets[i].display = $scope.locationSettings[tweet.location.type].state;
            if($scope.locationSettings[tweet.location.type].state){
                tweet.location.marker.setMap(map);
            }
            else{
                tweet.location.marker.setMap(null);
            }
        });
    };

    /*  Retrieves any location-related data from each tweets and validates/processes them through
    *   the Google Maps Geocoding APIs */
    const processTweets = rawTweets => {

        $scope.loadingLocations = true;

        TweetService.makeAppTweets(rawTweets)
            .then(appTweets => {
                $timeout(() => {
                    $scope.tweets = appTweets;
                    addMarkerEventListeners($scope.tweets);
                    initTweetLocationDisablers();
                });
            })
            .then(() => {
                $scope.loadingLocations = false;
                $scope.loadingTweets = false;
            })
            .catch(() => {
                // todo
            })

    };

    /*  retrieves tweets relevant to the query string
     *  using Twitter's Search API   */
    const getTweets = () => {

        TwitterService.searchTweets(getQueryString(), $scope.tweetCount).then(function(data) {
            processTweets(data.statuses);
        }, function() {
            /*  put error msg here */
            displayErrorMessage('Tweet search was not successful.');
        });

    };

    /*  the start-up code of Main Controller */
    const activate = () => {

        TwitterService.initialize();

        if (TwitterService.isReady()) {
            $scope.connectedTwitter = true;
        }
        else{
            TwitterService.connectTwitter().then(function() {
                if (TwitterService.isReady()) {
                    $scope.connectedTwitter = true;
                } else {
                    /*  inform the user twitter connection failed  */
                }
            });
        }

    };

    /*  runs the start-up code of MainController */
    activate();

};
