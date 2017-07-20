
export default ['$scope', '$q', 'TwitterService', function($scope, $q, TwitterService) {

    $scope.locations = [];
    $scope.tweets = [];
    $scope.queries = [];
    $scope.tweetCount = 100;

    /*  retrieves tweets relevant to the query string
        using Twitter's Search API   */
    $scope.getTweets = () => {
        TwitterService.searchTweets(getQueryString(), $scope.tweetCount).then(function(data){
            $scope.tweets = data.statuses;
            console.log($scope.tweets.length);
        }, function(){

        });
    };

    $scope.validateSearchParam = () => {
        var tests = [
            { exp: /^#/, type: 'hashtag' },
            { exp: /^@/, type: 'mention'},
            { exp: /^(from:)/, type: 'creator'},
            { exp: /^.*/, type: 'generic'}
        ];
        for(var i = 0; i < tests.length; i++){
            if(tests[i].exp.test($scope.paramInput)){
                addSearchEntry($scope.paramInput, tests[i].type);
                break;
            }
        }
        $scope.paramInput = '';
    };

    const addSearchEntry = (entry, type) => {
        $('.search-entry').last().after(`<div class="search-entry ${type}-search">${entry}</div>`);
    };

    const getQueryString = () => {
        for(var i = 0; i < this.queries.length; i++){
        }
    };

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

                }
            });
        }
        if($scope.connectedTwitter) {
            //$scope.getTweets();
        }

    };

    activate();

}];