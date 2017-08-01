
export default ['$scope', 'TwitterService', 'GmapsService', function($scope, TwitterService, GmapsService) {

    $scope.locations = [];
    $scope.tweets = [];
    $scope.tweetCount = 50;

    $scope.searchParameters = [];

    $scope.locationSettings = [
        { name: 'Twitter Geolocations', state: true },
        { name: 'Associated Locations', state: true },
        { name: 'User Locations',       state: true }
    ];

    $scope.refreshButton = { text: 'Refresh Tweets' };

    $scope.loadingTweets = false;
    $scope.loadingLocations = false;

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
            tweetsPreloadSequence(true);
            getTweets();
        }

    };

    /*  manipulates the visuals for when the "refresh tweets" button is hit
    *   and after the tweets have been fetched from Twitter
    *   accepts a boolean flag for "on" or "off" */
    const tweetsPreloadSequence = flag => {

        if(flag){
            $scope.refreshButton.text = 'Refreshing...';
            $scope.loadingTweets = true;
            $('#twitplot-data').scrollTop(0);
        }
        else{
            $scope.refreshButton.text = 'Refresh Tweets';
            $scope.loadingTweets = false;
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

    const consolidateTweetLocations = tweets => {
        $scope.tweets = tweets;
        $scope.loadingLocations = true;
        for(let i = 0; i < $scope.tweets.length; i++){

            let tweet;

            if($scope.tweets[i].geo !== null && $scope.locationSettings[0].state) {
                let rgeocode = GmapsService.reverseGeocode($scope.tweets[i].geo.coordinates[0], $scope.tweets[i].geo.coordinates[1]);
                tweet = { tweet: $scope.tweets[i], location: {
                    formatted_address: rgeocode.formatted_address,
                    lat: rgeocode.geometry.location.lat,
                    lng: rgeocode.geometry.location.lng
                } };
                console.log(tweet);
                //GmapsService.plot(window.map, ...$scope.tweets[i].geo.coordinates);
            }
            else if($scope.tweets[i].place !== null && $scope.locationSettings[1].state) {

            }
            else if($scope.tweets[i].user.location !== null && $scope.locationSettings[2].state) {
                //console.log($scope.tweets[i].user.location);
            }
        }
        $scope.loadingLocations = false;

    };

    $scope.$watch('locationSettings', function(){
        $scope.refreshTweets();
    }, true);

    /*  retrieves tweets relevant to the query string
     *  using Twitter's Search API   */
    const getTweets = () => {

        TwitterService.searchTweets(getQueryString(), $scope.tweetCount).then(function(data) {
            tweetsPreloadSequence(false);
            consolidateTweetLocations(data.statuses);
        }, function() {
            /*  put error msg here */
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

}];
