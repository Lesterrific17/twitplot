
export default ['$scope', 'TwitterService', function($scope, TwitterService) {

    $scope.locations = [];
    $scope.tweets = [];
    $scope.tweetCount = 100;

    $scope.searchParameters = [
        { entry: '#microsoft', type: 'hashtag' },
        { entry: '#surface', type: 'hashtag' }
    ];

    $scope.locationSettings = [
        { name: 'Twitter Geolocations', state: 'off', value: false },
        { name: 'Associated Locations', state: 'on', value: true },
        { name: 'User Locations', state: 'off', value: false }
    ];

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
            { exp: /^#/, type: 'hashtag' },
            { exp: /^@/, type: 'mention'},
            { exp: /^(from:)/, type: 'creator'},
            { exp: /^.*/, type: 'generic'}
        ];

        for (let i = 0; i < paramParsers.length; i++) {
            if (paramParsers[i].exp.test($scope.inputParameter)) {
                $scope.searchParameters.push({ entry: $scope.inputParameter, type: paramParsers[i].type });
                break;
            }
        }
        $scope.inputParameter = '';

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

    const consolidateLocations = () => {

    };

    /*  retrieves tweets relevant to the query string
     *  using Twitter's Search API   */
    const getTweets = () => {

        TwitterService.searchTweets(getQueryString(), $scope.tweetCount).then(function(data) {
            $scope.tweets = data.statuses;
            console.log($scope.tweets.length);
        }, function() {
            /*  put error msg here */
        });

    };

    /*  the start-up code of Main Controller */
    const activate = () => {

        TwitterService.initialize();

        if (TwitterService.isReady()) {
            $scope.connectedTwitter = true;
            getTweets();
        }
        else{
            TwitterService.connectTwitter().then(function() {
                if (TwitterService.isReady()) {
                    $scope.connectedTwitter = true;
                    getTweets();
                } else {
                    /*  inform the user twitter connection failed  */
                }
            });
        }

    };

    /*  runs the start-up code of MainController */
    activate();

}];