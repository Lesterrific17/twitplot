
export default function($scope, $timeout, TwitterService, GmapsService, TweetService) {

    $scope.tweets = [];
    $scope.tweetCount = 50;

    $scope.searchParameters = [];

    $scope.locationSettings = [
        { name: 'Twitter Geolocations', state: true, },
        { name: 'Associated Locations', state: true, }
    ];

    $scope.refreshButton = { text: 'Refresh Tweets' };

    $scope.loadingTweets = false;
    $scope.loadingLocations = false;

    $scope.showMapFlash = false;
    $scope.mapFlashText = 'Zoom Level: 6x';

    /*  deletes a search parameter given its index in the parameters array  */
    $scope.deleteSearchParam = value => {
        $scope.searchParameters.splice(value, 1);
    };

    /*  parses the input search param, checks duplicates, categorizes it, and prompts the user
     *  for a search refresh. */
    $scope.validateSearchParam = () => {

        if( paramAlreadyExists($scope.inputParameter) || $scope.inputParameter.length === 0 ) {
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
            $scope.tweets = [];
            $scope.loadingTweets = true;
            getTweets();
        }

    };

    /*  watches for an changes in the location settings to refresh the app's data   */
    $scope.$watch('locationSettings', function(){
        $scope.tweets.forEach(function (tweet, index) {
            if($scope.locationSettings[tweet.location.type].state === true){
                tweet.location.marker.setMap(map);
            }
            else{
                tweet.location.marker.setMap(null);
            }
        });
    }, true);

    $scope.$watch('loadingTweets', function() {
        tweetsPreloadSequence($scope.loadingTweets);
    });

    /*  centers and zooms the map on a location */
    $scope.focusTweetMarker = tweetId => {
        GmapsService.setMapCenter(map, $scope.tweets[tweetId].location.marker, $scope.tweets[tweetId].location.address);
        $scope.tweets[tweetId].location.marker.icon.strokeColor = 'seagreen';
    };

    /*  TO BE IMPLEMENTED IN UI: Displays any error messages (string) to the user   */
    const displayErrorMessage = errorMessage => {
        console.log(errorMessage);
    };

    /*  manipulates the visuals for when the "refresh tweets" button is hit
    *   and after the tweets have been fetched from Twitter
    *   accepts a boolean flag for "on" or "off" */
    const tweetsPreloadSequence = loadingTweets => {

        if(loadingTweets){
            $scope.refreshButton.text = 'Refreshing...';
            $('#twitplot-data').scrollTop(0);
        }
        else{
            $scope.refreshButton.text = 'Refresh Tweets';
        }

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

    const highlightTweetMarker = tweetId => {

    };

    const addMarkerEventListeners = appTweets => {
        appTweets.forEach(tweet => {
            tweet.location.marker.addListener('click', () => {
                $timeout(() => {
                    $scope.tweetFilter = { id: tweet.id };
                    //$scope.viewLocation(tweet.location.marker, tweet.location.address);
                    $scope.focusTweetMarker(tweet.id);
                });
            });
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
